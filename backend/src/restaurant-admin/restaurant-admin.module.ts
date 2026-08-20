import { Module } from '@nestjs/common';
import { RestaurantAdminService } from './restaurant-admin.service';
import { RestaurantAdminController } from './restaurant-admin.controller';

@Module({
  controllers: [RestaurantAdminController],
  providers: [RestaurantAdminService],
})
export class RestaurantAdminModule {}
