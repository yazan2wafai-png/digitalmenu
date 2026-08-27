import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { Category, Product, Restaurant } from '@prisma/client';

export type CategoryWithProducts = Category & { products: Product[] };

export interface DeleteCategoryResponse {
  deleted: boolean;
  id: string;
}

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private async getRestaurantOrFail(slug: string): Promise<Restaurant> {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { slug } });
    if (!restaurant) throw new NotFoundException(`Restaurant "${slug}" not found`);
    return restaurant;
  }

  private assertOwnership(restaurantId: string, adminRestaurantId: string): void {
    if (restaurantId !== adminRestaurantId) {
      throw new ForbiddenException('You do not have permission to access this restaurant');
    }
  }

  private async checkMenuPermission(restaurantId: string): Promise<void> {
    const settings = await this.prisma.restaurantSettings.findUnique({
      where: { restaurantId },
    });
    if (settings && settings.canManageMenu === false) {
      throw new ForbiddenException('Feature disabled for this tenant');
    }
  }

  async findAll(slug: string, adminRestaurantId: string): Promise<CategoryWithProducts[]> {
    const restaurant = await this.getRestaurantOrFail(slug);
    this.assertOwnership(restaurant.id, adminRestaurantId);
    await this.checkMenuPermission(restaurant.id);
    return this.prisma.category.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { sortOrder: 'asc' },
      include: { products: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async findOne(slug: string, id: string, adminRestaurantId: string): Promise<CategoryWithProducts> {
    const restaurant = await this.getRestaurantOrFail(slug);
    this.assertOwnership(restaurant.id, adminRestaurantId);
    await this.checkMenuPermission(restaurant.id);
    const category = await this.prisma.category.findFirst({
      where: { id, restaurantId: restaurant.id },
      include: { products: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!category) throw new NotFoundException(`Category "${id}" not found`);
    return category;
  }

  async create(slug: string, adminRestaurantId: string, dto: CreateCategoryDto): Promise<Category> {
    const restaurant = await this.getRestaurantOrFail(slug);
    this.assertOwnership(restaurant.id, adminRestaurantId);
    await this.checkMenuPermission(restaurant.id);
    return this.prisma.category.create({
      data: {
        restaurantId: restaurant.id,
        name: dto.name,
        photoUrl: dto.photoUrl,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async update(slug: string, id: string, adminRestaurantId: string, dto: UpdateCategoryDto): Promise<Category> {
    const restaurant = await this.getRestaurantOrFail(slug);
    this.assertOwnership(restaurant.id, adminRestaurantId);
    await this.checkMenuPermission(restaurant.id);
    const existing = await this.prisma.category.findFirst({
      where: { id, restaurantId: restaurant.id },
    });
    if (!existing) throw new NotFoundException(`Category "${id}" not found`);
    return this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.photoUrl !== undefined && { photoUrl: dto.photoUrl }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
      },
    });
  }

  async remove(slug: string, id: string, adminRestaurantId: string): Promise<DeleteCategoryResponse> {
    const restaurant = await this.getRestaurantOrFail(slug);
    this.assertOwnership(restaurant.id, adminRestaurantId);
    await this.checkMenuPermission(restaurant.id);
    const existing = await this.prisma.category.findFirst({
      where: { id, restaurantId: restaurant.id },
    });
    if (!existing) throw new NotFoundException(`Category "${id}" not found`);
    await this.prisma.category.delete({ where: { id } });
    return { deleted: true, id };
  }
}
