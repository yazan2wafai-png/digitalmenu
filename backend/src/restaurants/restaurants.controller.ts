import { Controller, Get, Param, Query } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import type { PublicRestaurantResponse } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get(':slug')
  findBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale: string = 'tr',
  ): Promise<PublicRestaurantResponse> {
    return this.restaurantsService.findBySlug(slug, locale);
  }
}
