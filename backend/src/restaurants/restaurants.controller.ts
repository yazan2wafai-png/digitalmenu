import { Controller, Get, Param, Query } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import type { PublicRestaurantResponse, PublicTableResponse } from './restaurants.service';

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

  /**
   * Public: resolve a table's display name from its id, so a customer-facing
   * page can show "Masa 4" instead of the raw table id in the URL/context banner.
   * Intentionally returns only { id, name } - nothing else about the table.
   */
  @Get(':slug/tables/:tableId')
  findTable(
    @Param('slug') slug: string,
    @Param('tableId') tableId: string,
  ): Promise<PublicTableResponse> {
    return this.restaurantsService.findTableForDisplay(slug, tableId);
  }
}
