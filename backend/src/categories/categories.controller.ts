import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Request, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

/**
 * Admin CRUD for categories, scoped to a restaurant by slug.
 * All routes protected by JWT. Ownership verified inside CategoriesService.
 */
@UseGuards(JwtAuthGuard)
@Controller('admin/restaurants/:slug/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(@Param('slug') slug: string, @Request() req: any) {
    return this.categoriesService.findAll(slug, req.user.restaurantId);
  }

  @Get(':id')
  findOne(
    @Param('slug') slug: string,
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.categoriesService.findOne(slug, id, req.user.restaurantId);
  }

  @Post()
  create(
    @Param('slug') slug: string,
    @Body() dto: CreateCategoryDto,
    @Request() req: any,
  ) {
    return this.categoriesService.create(slug, req.user.restaurantId, dto);
  }

  @Patch(':id')
  update(
    @Param('slug') slug: string,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @Request() req: any,
  ) {
    return this.categoriesService.update(slug, id, req.user.restaurantId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('slug') slug: string,
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.categoriesService.remove(slug, id, req.user.restaurantId);
  }
}
