import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/strategies/jwt.strategy';
import type { Table } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('admin/locations/:locationId/tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  findAll(
    @Param('locationId') locationId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<Table[]> {
    return this.tablesService.findAll(locationId, req.user.restaurantId ?? '');
  }

  @Post()
  create(
    @Param('locationId') locationId: string,
    @Req() req: AuthenticatedRequest,
    @Body() createTableDto: CreateTableDto,
  ): Promise<Table> {
    return this.tablesService.create(locationId, req.user.restaurantId ?? '', createTableDto);
  }

  @Patch(':id')
  update(
    @Param('locationId') locationId: string,
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() updateTableDto: UpdateTableDto,
  ): Promise<Table> {
    return this.tablesService.update(id, locationId, req.user.restaurantId ?? '', updateTableDto);
  }

  @Delete(':id')
  remove(
    @Param('locationId') locationId: string,
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<Table> {
    return this.tablesService.remove(id, locationId, req.user.restaurantId ?? '');
  }
}
