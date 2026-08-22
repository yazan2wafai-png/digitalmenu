import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminLoginDto } from './dto/super-admin-login.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';

@Controller('super-admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  /**
   * POST /super-admin/auth/login
   * Public login for SUPER_ADMIN role
   */
  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  login(@Body() dto: SuperAdminLoginDto) {
    return this.superAdminService.login(dto);
  }

  /**
   * POST /super-admin/restaurants
   * Protected: Create a new Restaurant and its initial AdminUser
   */
  @Post('restaurants')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  createRestaurant(@Body() dto: CreateRestaurantDto) {
    return this.superAdminService.createRestaurant(dto);
  }

  /**
   * DELETE /super-admin/restaurants/:slug
   * Protected: Delete a Restaurant by slug (cascading all child entities)
   */
  @Delete('restaurants/:slug')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  deleteRestaurant(@Param('slug') slug: string) {
    return this.superAdminService.deleteRestaurant(slug);
  }

  /**
   * GET /super-admin/restaurants
   * Protected: List all restaurants with counts
   */
  @Get('restaurants')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  findAllRestaurants() {
    return this.superAdminService.findAllRestaurants();
  }

  /**
   * GET /super-admin/restaurants/:slug/views
   * Protected: Get 30-day page view analytics for a restaurant
   */
  @Get('restaurants/:slug/views')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  getRestaurantViews(@Param('slug') slug: string) {
    return this.superAdminService.getRestaurantViews(slug);
  }
}
