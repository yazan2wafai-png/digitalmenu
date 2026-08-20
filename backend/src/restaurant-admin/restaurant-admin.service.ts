import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantAdminService {
  constructor(private prisma: PrismaService) {}

  async getRestaurantDetails(restaurantId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        settings: true,
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  async updateSettings(restaurantId: string, data: any) {
    const updateData = {
      ...(data.orderingEnabled !== undefined && { orderingEnabled: data.orderingEnabled }),
      ...(data.dineInEnabled !== undefined && { dineInEnabled: data.dineInEnabled }),
      ...(data.takeawayEnabled !== undefined && { takeawayEnabled: data.takeawayEnabled }),
      ...(data.estimatedPrepMinutes !== undefined && { estimatedPrepMinutes: data.estimatedPrepMinutes }),
      ...(data.currency !== undefined && { currency: data.currency }),
      ...(data.timezone !== undefined && { timezone: data.timezone }),
      ...(data.enableOrdering !== undefined && { enableOrdering: data.enableOrdering }),
      ...(data.enableTables !== undefined && { enableTables: data.enableTables }),
      ...(data.enableAnalytics !== undefined && { enableAnalytics: data.enableAnalytics }),
      ...(data.enableMultiLanguage !== undefined && { enableMultiLanguage: data.enableMultiLanguage }),
      ...(data.enableReviews !== undefined && { enableReviews: data.enableReviews }),
      ...(data.enableServiceCall !== undefined && { enableServiceCall: data.enableServiceCall }),
    };

    // Upsert settings since they might not exist yet
    return this.prisma.restaurantSettings.upsert({
      where: { restaurantId },
      update: {
        ...updateData,
        restaurantId, // Prevent modifying restaurantId
      },
      create: {
        ...updateData,
        restaurantId,
      },
    });
  }
}
