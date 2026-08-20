import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get(':slug')
  async findBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale: string = 'tr',
  ) {
    try {
      return await this.restaurantsService.findBySlug(slug, locale);
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      return {
        error: true,
        message: err?.message || 'Unknown error',
        stack: err?.stack || null,
        raw: String(err),
      };
    }
  }
}
