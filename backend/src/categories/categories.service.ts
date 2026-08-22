import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private async getRestaurantOrFail(slug: string) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { slug } });
    if (!restaurant) throw new NotFoundException(`Restaurant "${slug}" not found`);
    return restaurant;
  }

  private assertOwnership(restaurantId: string, adminRestaurantId: string) {
    if (restaurantId !== adminRestaurantId) {
      throw new ForbiddenException('You do not have permission to access this restaurant');
    }
  }

  async findAll(slug: string, adminRestaurantId: string) {
    const restaurant = await this.getRestaurantOrFail(slug);
    this.assertOwnership(restaurant.id, adminRestaurantId);
    return this.prisma.category.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { sortOrder: 'asc' },
      include: { products: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async findOne(slug: string, id: string, adminRestaurantId: string) {
    const restaurant = await this.getRestaurantOrFail(slug);
    this.assertOwnership(restaurant.id, adminRestaurantId);
    const category = await this.prisma.category.findFirst({
      where: { id, restaurantId: restaurant.id },
      include: { products: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!category) throw new NotFoundException(`Category "${id}" not found`);
    return category;
  }

  async create(slug: string, adminRestaurantId: string, dto: CreateCategoryDto) {
    const restaurant = await this.getRestaurantOrFail(slug);
    this.assertOwnership(restaurant.id, adminRestaurantId);
    return this.prisma.category.create({
      data: {
        restaurantId: restaurant.id,
        name: dto.name,
        photoUrl: dto.photoUrl,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async update(slug: string, id: string, adminRestaurantId: string, dto: UpdateCategoryDto) {
    const restaurant = await this.getRestaurantOrFail(slug);
    this.assertOwnership(restaurant.id, adminRestaurantId);
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

  async remove(slug: string, id: string, adminRestaurantId: string) {
    const restaurant = await this.getRestaurantOrFail(slug);
    this.assertOwnership(restaurant.id, adminRestaurantId);
    const existing = await this.prisma.category.findFirst({
      where: { id, restaurantId: restaurant.id },
    });
    if (!existing) throw new NotFoundException(`Category "${id}" not found`);
    await this.prisma.category.delete({ where: { id } });
    return { deleted: true, id };
  }
}
