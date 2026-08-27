import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import type { Category, Product } from '@prisma/client';

export interface DeleteProductResponse {
  deleted: boolean;
  id: string;
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getCategoryOrFail(categoryId: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new NotFoundException(`Category "${categoryId}" not found`);
    return category;
  }

  private assertOwnership(categoryRestaurantId: string, adminRestaurantId: string): void {
    if (categoryRestaurantId !== adminRestaurantId) {
      throw new ForbiddenException('You do not have permission to access this category');
    }
  }

  async findAll(categoryId: string, adminRestaurantId: string): Promise<Product[]> {
    const category = await this.getCategoryOrFail(categoryId);
    this.assertOwnership(category.restaurantId, adminRestaurantId);
    return this.prisma.product.findMany({
      where: { categoryId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(categoryId: string, id: string, adminRestaurantId: string): Promise<Product> {
    const category = await this.getCategoryOrFail(categoryId);
    this.assertOwnership(category.restaurantId, adminRestaurantId);
    const product = await this.prisma.product.findFirst({ where: { id, categoryId } });
    if (!product) throw new NotFoundException(`Product "${id}" not found`);
    return product;
  }

  async create(categoryId: string, adminRestaurantId: string, dto: CreateProductDto): Promise<Product> {
    const category = await this.getCategoryOrFail(categoryId);
    this.assertOwnership(category.restaurantId, adminRestaurantId);
    return this.prisma.product.create({
      data: {
        categoryId,
        name: dto.name,
        description: dto.description ?? undefined,
        price: dto.price,
        photoUrl: dto.photoUrl,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async update(categoryId: string, id: string, adminRestaurantId: string, dto: UpdateProductDto): Promise<Product> {
    const category = await this.getCategoryOrFail(categoryId);
    this.assertOwnership(category.restaurantId, adminRestaurantId);
    const existing = await this.prisma.product.findFirst({ where: { id, categoryId } });
    if (!existing) throw new NotFoundException(`Product "${id}" not found`);
    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.photoUrl !== undefined && { photoUrl: dto.photoUrl }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
      },
    });
  }

  async remove(categoryId: string, id: string, adminRestaurantId: string): Promise<DeleteProductResponse> {
    const category = await this.getCategoryOrFail(categoryId);
    this.assertOwnership(category.restaurantId, adminRestaurantId);
    const existing = await this.prisma.product.findFirst({ where: { id, categoryId } });
    if (!existing) throw new NotFoundException(`Product "${id}" not found`);
    await this.prisma.product.delete({ where: { id } });
    return { deleted: true, id };
  }
}
