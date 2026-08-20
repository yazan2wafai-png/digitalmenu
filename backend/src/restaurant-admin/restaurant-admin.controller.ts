import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { RestaurantAdminService } from './restaurant-admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin/me/restaurant')
export class RestaurantAdminController {
  constructor(private readonly restaurantAdminService: RestaurantAdminService) {}

  @Get()
  getRestaurantDetails(@Req() req: any) {
    return this.restaurantAdminService.getRestaurantDetails(req.user.restaurantId);
  }

  @Patch('settings')
  updateSettings(@Req() req: any, @Body() updateData: any) {
    return this.restaurantAdminService.updateSettings(req.user.restaurantId, updateData);
  }
}
