import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import type { Location } from '@prisma/client';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  private async verifyCanManageLocations(restaurantId: string): Promise<void> {
    const settings = await this.prisma.restaurantSettings.findUnique({
      where: { restaurantId },
    });
    if (settings && settings.canTrackTables === false) {
      throw new ForbiddenException('Feature disabled for this tenant');
    }
  }

  async findAll(restaurantId: string): Promise<Location[]> {
    await this.verifyCanManageLocations(restaurantId);
    return this.prisma.location.findMany({
      where: { restaurantId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(restaurantId: string, dto: CreateLocationDto): Promise<Location> {
    await this.verifyCanManageLocations(restaurantId);
    return this.prisma.location.create({
      data: {
        ...dto,
        restaurantId,
      },
    });
  }

  async update(id: string, restaurantId: string, dto: UpdateLocationDto): Promise<Location> {
    await this.verifyCanManageLocations(restaurantId);
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
    await this.verifyCanManageLocations(restaurantId);
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
