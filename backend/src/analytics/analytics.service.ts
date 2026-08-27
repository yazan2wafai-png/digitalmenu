import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

export interface RecordViewResponse {
  recorded: boolean;
}

export interface DailyAnalyticsItem {
  date: string;
  views: number;
}

export interface AnalyticsStatsResponse {
  totalViews: number;
  today: number;
  last7Days: number;
  last30Days: number;
  dailyBreakdown: DailyAnalyticsItem[];
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async recordView(
    restaurantSlug: string,
    ip: string,
    userAgent: string,
    tableId?: string,
  ): Promise<RecordViewResponse> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { slug: restaurantSlug, isActive: true },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    const effectiveIp = ip ? ip : '0.0.0.0';
    const effectiveUserAgent = userAgent ? userAgent : 'Unknown';

    const ipHash = crypto
      .createHash('sha256')
      .update(effectiveIp)
      .digest('hex')
      .substring(0, 16);

    await this.prisma.menuView.create({
      data: {
        restaurantId: restaurant.id,
        tableId,
        ipHash,
        userAgent: effectiveUserAgent,
        recordedAt: new Date(),
      },
    });

    return { recorded: true };
  }

  async getStats(restaurantId: string): Promise<AnalyticsStatsResponse> {
    const now = new Date();

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const totalViews = await this.prisma.menuView.count({
      where: { restaurantId },
    });

    const recentViews = await this.prisma.menuView.findMany({
      where: {
        restaurantId,
        recordedAt: { gte: thirtyDaysAgo },
      },
      select: {
        recordedAt: true,
      },
    });

    const breakdownMap = new Map<string, number>();
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      breakdownMap.set(dateStr, 0);
    }

    let todayViews = 0;
    let last7DaysViews = 0;
    const last30DaysViews = recentViews.length;

    for (const view of recentViews) {
      const viewDate = view.recordedAt;
      const dateStr = viewDate.toISOString().split('T')[0];

      if (breakdownMap.has(dateStr)) {
        breakdownMap.set(dateStr, (breakdownMap.get(dateStr) ?? 0) + 1);
      }

      if (viewDate >= todayStart) todayViews++;
      if (viewDate >= sevenDaysAgo) last7DaysViews++;
    }

    const dailyBreakdown = Array.from(breakdownMap.entries())
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalViews,
      today: todayViews,
      last7Days: last7DaysViews,
      last30Days: last30DaysViews,
      dailyBreakdown,
    };
  }

  async getStatsBySlug(
    slug: string,
    bypassPermissionCheck = false,
  ): Promise<AnalyticsStatsResponse> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { slug },
      include: { settings: true },
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    if (!bypassPermissionCheck && restaurant.settings?.canViewAnalytics === false) {
      throw new ForbiddenException('Analytics/Overview is disabled for this tenant');
    }
    return this.getStats(restaurant.id);
  }
}
