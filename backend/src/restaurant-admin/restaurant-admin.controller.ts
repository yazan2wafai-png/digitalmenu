import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { RestaurantAdminService } from './restaurant-admin.service';
import type { RestaurantWithSettings } from './restaurant-admin.service';
import { UpdateRestaurantSettingsDto } from './dto/update-restaurant-settings.dto';
import { UpdateRestaurantProfileDto } from './dto/update-restaurant-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StaffRoleGuard } from '../common/guards/staff-role.guard';
import { RequireStaffRole } from '../common/decorators/require-staff-role.decorator';
import { StaffRole } from '../common/staff-role.enum';
import type { AuthenticatedRequest } from '../auth/strategies/jwt.strategy';
import type { Restaurant, RestaurantSettings } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('admin/me/restaurant')
export class RestaurantAdminController {
  constructor(private readonly restaurantAdminService: RestaurantAdminService) {}

  @Get()
  getRestaurantDetails(@Req() req: AuthenticatedRequest): Promise<RestaurantWithSettings> {
    return this.restaurantAdminService.getRestaurantDetails(req.user.restaurantId ?? '');
  }

  @Patch('settings')
  @UseGuards(StaffRoleGuard)
  @RequireStaffRole(StaffRole.OWNER)
  updateSettings(
    @Req() req: AuthenticatedRequest,
    @Body() updateData: UpdateRestaurantSettingsDto,
  ): Promise<RestaurantSettings> {
    return this.restaurantAdminService.updateSettings(req.user.restaurantId ?? '', updateData);
  }

  /**
   * PATCH /admin/me/restaurant/profile
   * Lets a tenant admin update their own restaurant's name, logo, and
   * theme color - the branding fields super admin sets at creation time
   * but that were otherwise never editable afterward.
   */
  @Patch('profile')
  @UseGuards(StaffRoleGuard)
  @RequireStaffRole(StaffRole.OWNER)
  updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateData: UpdateRestaurantProfileDto,
  ): Promise<Restaurant> {
    return this.restaurantAdminService.updateProfile(req.user.restaurantId ?? '', updateData);
  }
}
