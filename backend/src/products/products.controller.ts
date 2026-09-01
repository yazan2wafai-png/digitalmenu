import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Request, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StaffRoleGuard } from '../common/guards/staff-role.guard';
import { RequireStaffRole } from '../common/decorators/require-staff-role.decorator';
import { StaffRole } from '../common/staff-role.enum';
import { ProductsService } from './products.service';
import type { DeleteProductResponse } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import type { AuthenticatedRequest } from '../auth/strategies/jwt.strategy';
import type { Product } from '@prisma/client';

/**
 * Admin CRUD for products, scoped to a category.
 * All routes protected by JWT. Ownership verified inside ProductsService.
 */
@UseGuards(JwtAuthGuard)
@Controller('admin/categories/:categoryId/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Param('categoryId') categoryId: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<Product[]> {
    return this.productsService.findAll(categoryId, req.user.restaurantId ?? '', req.user.role);
  }

  @Get(':id')
  findOne(
    @Param('categoryId') categoryId: string,
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<Product> {
    return this.productsService.findOne(categoryId, id, req.user.restaurantId ?? '', req.user.role);
  }

  @Post()
  @UseGuards(StaffRoleGuard)
  @RequireStaffRole(StaffRole.OWNER, StaffRole.EDITOR)
  create(
    @Param('categoryId') categoryId: string,
    @Body() dto: CreateProductDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<Product> {
    return this.productsService.create(categoryId, req.user.restaurantId ?? '', dto, req.user.role);
  }

  @Patch(':id')
  @UseGuards(StaffRoleGuard)
  @RequireStaffRole(StaffRole.OWNER, StaffRole.EDITOR)
  update(
    @Param('categoryId') categoryId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<Product> {
    return this.productsService.update(categoryId, id, req.user.restaurantId ?? '', dto, req.user.role);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(StaffRoleGuard)
  @RequireStaffRole(StaffRole.OWNER, StaffRole.EDITOR)
  remove(
    @Param('categoryId') categoryId: string,
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<DeleteProductResponse> {
    return this.productsService.remove(categoryId, id, req.user.restaurantId ?? '', req.user.role);
  }
}
