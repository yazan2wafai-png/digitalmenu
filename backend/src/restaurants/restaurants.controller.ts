import { Controller, Get, Param, Query } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  /**
   * GET /restaurants/:slug?locale=en
   * Public endpoint — no auth required.
   * Returns the full restaurant menu with translated strings for the requested locale.
   * Locale falls back to restaurant.defaultLocale if not supported.
   */
  @Get(':slug')
  findBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale: string = 'tr',
  ) {
    return this.restaurantsService.findBySlug(slug, locale);
  }
}
