import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Request, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StaffRoleGuard } from '../common/guards/staff-role.guard';
import { RequireStaffRole } from '../common/decorators/require-staff-role.decorator';
import { StaffRole } from '../common/staff-role.enum';
import { CategoriesService } from './categories.service';
import type { CategoryWithProducts, DeleteCategoryResponse } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { AuthenticatedRequest } from '../auth/strategies/jwt.strategy';
import type { Category } from '@prisma/client';

/**
 * Admin CRUD for categories, scoped to a restaurant by slug.
 * All routes protected by JWT. Ownership verified inside CategoriesService.
 */
@UseGuards(JwtAuthGuard)
@Controller('admin/restaurants/:slug/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(
    @Param('slug') slug: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<CategoryWithProducts[]> {
    return this.categoriesService.findAll(slug, req.user.restaurantId ?? '', req.user.role);
  }

  @Get(':id')
  findOne(
    @Param('slug') slug: string,
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<CategoryWithProducts> {
    return this.categoriesService.findOne(slug, id, req.user.restaurantId ?? '', req.user.role);
  }

  @Post()
  @UseGuards(StaffRoleGuard)
  @RequireStaffRole(StaffRole.OWNER, StaffRole.EDITOR)
  create(
    @Param('slug') slug: string,
    @Body() dto: CreateCategoryDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<Category> {
    return this.categoriesService.create(slug, req.user.restaurantId ?? '', dto, req.user.role);
  }

  @Patch(':id')
  @UseGuards(StaffRoleGuard)
  @RequireStaffRole(StaffRole.OWNER, StaffRole.EDITOR)
  update(
    @Param('slug') slug: string,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<Category> {
    return this.categoriesService.update(slug, id, req.user.restaurantId ?? '', dto, req.user.role);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(StaffRoleGuard)
  @RequireStaffRole(StaffRole.OWNER, StaffRole.EDITOR)
  remove(
    @Param('slug') slug: string,
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<DeleteCategoryResponse> {
    return this.categoriesService.remove(slug, id, req.user.restaurantId ?? '', req.user.role);
  }
}
