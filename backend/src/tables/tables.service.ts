import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  private async verifyLocation(locationId: string, restaurantId: string) {
    const location = await this.prisma.location.findFirst({
      where: { id: locationId, restaurantId, isActive: true },
    });
    if (!location) {
      throw new NotFoundException('Location not found or does not belong to you');
    }
  }

  async findAll(locationId: string, restaurantId: string) {
    await this.verifyLocation(locationId, restaurantId);
    return this.prisma.table.findMany({
      where: { locationId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async create(locationId: string, restaurantId: string, dto: CreateTableDto) {
    await this.verifyLocation(locationId, restaurantId);
    return this.prisma.table.create({
      data: {
        ...dto,
        locationId,
        restaurantId,
      },
    });
  }

  async update(id: string, locationId: string, restaurantId: string, dto: UpdateTableDto) {
    await this.verifyLocation(locationId, restaurantId);
    const table = await this.prisma.table.findFirst({
      where: { id, locationId, restaurantId, isActive: true },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    return this.prisma.table.update({
      where: { id },
      data: {
        ...dto,
        locationId,
        restaurantId,
      },
    });
  }

  async remove(id: string, locationId: string, restaurantId: string) {
    await this.verifyLocation(locationId, restaurantId);
    const table = await this.prisma.table.findFirst({
      where: { id, locationId, restaurantId, isActive: true },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    return this.prisma.table.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
