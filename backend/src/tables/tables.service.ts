import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import type { Table } from '@prisma/client';

@Injectable()
export class TablesService {
  constructor(private readonly prisma: PrismaService) {}

  private async verifyLocation(locationId: string, restaurantId: string): Promise<void> {
    const settings = await this.prisma.restaurantSettings.findUnique({
      where: { restaurantId },
    });
    if (settings && settings.enableTables === false) {
      throw new ForbiddenException('Table management feature is disabled for this restaurant');
    }

    const location = await this.prisma.location.findFirst({
      where: { id: locationId, restaurantId, isActive: true },
    });
    if (!location) {
      throw new NotFoundException('Location not found or does not belong to you');
    }
  }

  async findAll(locationId: string, restaurantId: string): Promise<Table[]> {
    await this.verifyLocation(locationId, restaurantId);
    return this.prisma.table.findMany({
      where: { locationId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async create(locationId: string, restaurantId: string, dto: CreateTableDto): Promise<Table> {
    await this.verifyLocation(locationId, restaurantId);
    return this.prisma.table.create({
      data: {
        name: dto.name,
        qrIdentifier: dto.qrIdentifier,
        nfcIdentifier: dto.nfcIdentifier,
        isActive: dto.isActive ?? true,
        locationId,
        restaurantId,
      },
    });
  }

  async update(id: string, locationId: string, restaurantId: string, dto: UpdateTableDto): Promise<Table> {
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
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.qrIdentifier !== undefined && { qrIdentifier: dto.qrIdentifier }),
        ...(dto.nfcIdentifier !== undefined && { nfcIdentifier: dto.nfcIdentifier }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        locationId,
        restaurantId,
      },
    });
  }

  async remove(id: string, locationId: string, restaurantId: string): Promise<Table> {
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
