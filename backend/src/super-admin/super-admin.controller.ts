import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ForbiddenException, Req } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import type {
  SuperAdminLoginResponse,
  CreateRestaurantResponse,
  DeleteRestaurantResponse,
  RestaurantSummaryItem,
  RestaurantViewsResponse,
  UpdateRestaurantPermissionsResponse,
  ResetAdminPasswordResponse,
  ImpersonateRestaurantResponse,
} from './super-admin.service';
import { SuperAdminLoginDto } from './dto/super-admin-login.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantPermissionsDto } from './dto/update-restaurant-permissions.dto';
import type { StaffMember } from '../staff/staff.service';
import { CreateStaffDto } from '../staff/dto/create-staff.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';
import type { AuthenticatedRequest } from '../auth/strategies/jwt.strategy';
import { AdminRole } from '../common/roles.enum';

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
  login(@Body() dto: SuperAdminLoginDto): Promise<SuperAdminLoginResponse> {
    return this.superAdminService.login(dto);
  }

  /**
   * POST /super-admin/restaurants
   * Protected: Create a new Restaurant and its initial AdminUser
   */
  @Post('restaurants')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  createRestaurant(@Body() dto: CreateRestaurantDto): Promise<CreateRestaurantResponse> {
    return this.superAdminService.createRestaurant(dto);
  }

  /**
   * DELETE /super-admin/restaurants/:slug
   * Protected: Delete a Restaurant by slug (cascading all child entities)
   */
  @Delete('restaurants/:slug')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  deleteRestaurant(@Param('slug') slug: string): Promise<DeleteRestaurantResponse> {
    return this.superAdminService.deleteRestaurant(slug);
  }

  /**
   * GET /super-admin/restaurants
   * Protected: List all restaurants with counts
   */
  @Get('restaurants')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  findAllRestaurants(): Promise<RestaurantSummaryItem[]> {
    return this.superAdminService.findAllRestaurants();
  }

  /**
   * GET /super-admin/restaurants/:slug/views
   * Protected: Get 30-day page view analytics for a restaurant
   */
  @Get('restaurants/:slug/views')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  getRestaurantViews(@Param('slug') slug: string): Promise<RestaurantViewsResponse> {
    return this.superAdminService.getRestaurantViews(slug);
  }

  /**
   * PATCH /super-admin/restaurants/:slug/permissions
   * Protected: Update restaurant feature toggles/permissions
   */
  @Patch('restaurants/:slug/permissions')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  updateRestaurantPermissions(
    @Param('slug') slug: string,
    @Body() dto: UpdateRestaurantPermissionsDto,
  ): Promise<UpdateRestaurantPermissionsResponse> {
    return this.superAdminService.updateRestaurantPermissions(slug, dto);
  }

  /**
   * GET /super-admin/restaurants/:slug/permissions
   * Protected (JWT only, no SuperAdminGuard): a SUPER_ADMIN can read any
   * restaurant's permissions; a RESTAURANT_ADMIN can only read their own -
   * this is how the tenant admin panel finds out what's been restricted
   * for it. Previously this GET route didn't exist at all, so every tenant
   * admin page's permissions fetch silently 404'd and fell back to
   * "everything allowed" - RBAC toggles saved fine but were never enforced
   * on the tenant side.
   */
  @Get('restaurants/:slug/permissions')
  @UseGuards(JwtAuthGuard)
  getRestaurantPermissions(
    @Param('slug') slug: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<UpdateRestaurantPermissionsResponse> {
    const isSuperAdmin = req.user.role === AdminRole.SUPER_ADMIN || req.user.role === 'SUPER_ADMIN';
    if (!isSuperAdmin && req.user.restaurantSlug !== slug) {
      throw new ForbiddenException('You do not have permission to view this restaurant');
    }
    return this.superAdminService.getRestaurantPermissions(slug);
  }

  /**
   * POST /super-admin/restaurants/:slug/reset-password
   * Protected: SuperAdmin only. Generates and stores a new random password
   * for the restaurant's admin account and returns it once in plaintext -
   * there is no way to recover the existing password since it's only ever
   * stored as a bcrypt hash.
   */
  @Post('restaurants/:slug/reset-password')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  resetAdminPassword(@Param('slug') slug: string): Promise<ResetAdminPasswordResponse> {
    return this.superAdminService.resetAdminPassword(slug);
  }

  /**
   * GET /super-admin/restaurants/:slug/staff
   * Protected: list every staff/admin account for a restaurant.
   */
  @Get('restaurants/:slug/staff')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  listRestaurantStaff(@Param('slug') slug: string): Promise<StaffMember[]> {
    return this.superAdminService.listRestaurantStaff(slug);
  }

  /**
   * POST /super-admin/restaurants/:slug/staff
   * Protected: create a staff account for any restaurant - unlimited per
   * restaurant, bypasses that tenant's own canManageStaff toggle.
   */
  @Post('restaurants/:slug/staff')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  createRestaurantStaff(
    @Param('slug') slug: string,
    @Body() dto: CreateStaffDto,
  ): Promise<StaffMember> {
    return this.superAdminService.createRestaurantStaff(slug, dto);
  }

  /**
   * DELETE /super-admin/restaurants/:slug/staff/:id
   * Protected: remove a staff account from any restaurant (owner protected).
   */
  @Delete('restaurants/:slug/staff/:id')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  deleteRestaurantStaff(
    @Param('slug') slug: string,
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    return this.superAdminService.deleteRestaurantStaff(slug, id);
  }

  /**
   * POST /super-admin/restaurants/:slug/impersonate
   * Protected: SuperAdmin only. Issues a short-lived tenant-admin token for
   * the given restaurant, so super-admin can act through the exact same
   * endpoints/UI a real tenant admin uses ("login as this restaurant")
   * instead of needing a parallel super-admin-only route for every single
   * tenant-scoped feature (orders, categories, products, tables, settings...).
   */
  @Post('restaurants/:slug/impersonate')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  impersonateRestaurant(@Param('slug') slug: string): Promise<ImpersonateRestaurantResponse> {
    return this.superAdminService.impersonateRestaurant(slug);
  }
}
