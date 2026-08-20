import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async recordView(restaurantSlug: string, ip: string, userAgent: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { slug: restaurantSlug, isActive: true },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    const ipHash = crypto.createHash('sha256').update(ip || '0.0.0.0').digest('hex').substring(0, 16);

    await this.prisma.menuView.create({
      data: {
        restaurantId: restaurant.id,
        ipHash,
        userAgent: userAgent || 'Unknown',
        recordedAt: new Date(),
      },
    });

    return { recorded: true };
  }

  async getStats(restaurantId: string) {
    const now = new Date();
    
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const [totalViews, todayViews, last7DaysViews, last30DaysViews] = await Promise.all([
      this.prisma.menuView.count({ where: { restaurantId } }),
      this.prisma.menuView.count({ where: { restaurantId, recordedAt: { gte: today } } }),
      this.prisma.menuView.count({ where: { restaurantId, recordedAt: { gte: sevenDaysAgo } } }),
      this.prisma.menuView.count({ where: { restaurantId, recordedAt: { gte: thirtyDaysAgo } } }),
    ]);

    return {
      totalViews,
      todayViews,
      last7DaysViews,
      last30DaysViews,
    };
  }
}
