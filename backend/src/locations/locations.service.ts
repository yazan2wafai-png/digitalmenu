import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import type { Location } from '@prisma/client';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(restaurantId: string): Promise<Location[]> {
    return this.prisma.location.findMany({
      where: { restaurantId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(restaurantId: string, dto: CreateLocationDto): Promise<Location> {
    return this.prisma.location.create({
      data: {
        ...dto,
        restaurantId,
      },
    });
  }

  async update(id: string, restaurantId: string, dto: UpdateLocationDto): Promise<Location> {
    const location = await this.prisma.location.findFirst({
      where: { id, restaurantId, isActive: true },
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return this.prisma.location.update({
      where: { id },
      data: {
        ...dto,
        restaurantId, // Prevent modifying restaurantId
      },
    });
  }

  async remove(id: string, restaurantId: string): Promise<Location> {
    const location = await this.prisma.location.findFirst({
      where: { id, restaurantId, isActive: true },
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return this.prisma.location.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
