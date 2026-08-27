import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { RestaurantAdminService } from './restaurant-admin.service';
import type { RestaurantWithSettings } from './restaurant-admin.service';
import { UpdateRestaurantSettingsDto } from './dto/update-restaurant-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/strategies/jwt.strategy';
import type { RestaurantSettings } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('admin/me/restaurant')
export class RestaurantAdminController {
  constructor(private readonly restaurantAdminService: RestaurantAdminService) {}

  @Get()
  getRestaurantDetails(@Req() req: AuthenticatedRequest): Promise<RestaurantWithSettings> {
    return this.restaurantAdminService.getRestaurantDetails(req.user.restaurantId ?? '');
  }

  @Patch('settings')
  updateSettings(
    @Req() req: AuthenticatedRequest,
    @Body() updateData: UpdateRestaurantSettingsDto,
  ): Promise<RestaurantSettings> {
    return this.restaurantAdminService.updateSettings(req.user.restaurantId ?? '', updateData);
  }
}
