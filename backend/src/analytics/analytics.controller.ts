import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Req,
  UseGuards,
  Param,
  ForbiddenException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AnalyticsService } from './analytics.service';
import type { RecordViewResponse, AnalyticsStatsResponse } from './analytics.service';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/strategies/jwt.strategy';
import { AdminRole } from '../common/roles.enum';

@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('analytics/view')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async recordView(
    @Body('restaurantSlug') restaurantSlug: string,
    @Body('tableId') tableId: string,
    @Req() req: Request,
    @Headers('user-agent') userAgent: string,
    @Headers('x-forwarded-for') xForwardedFor: string,
  ): Promise<RecordViewResponse> {
    const ip = xForwardedFor
      ? Array.isArray(xForwardedFor)
        ? xForwardedFor[0]
        : xForwardedFor.split(',')[0]
      : req.ip;
    return this.analyticsService.recordView(
      restaurantSlug,
      ip ?? '0.0.0.0',
      userAgent,
      tableId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(['admin/analytics/:slug', 'admin/restaurants/:slug/analytics'])
  async getStats(
    @Param('slug') slug: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<AnalyticsStatsResponse> {
    const isSuperAdmin =
      req.user.role === AdminRole.SUPER_ADMIN || req.user.role === 'SUPER_ADMIN';
    if (!isSuperAdmin && req.user.restaurantSlug !== slug) {
      throw new ForbiddenException(
        'You can only access analytics for your own restaurant',
      );
    }
    // Super admins can always view analytics for oversight, even if a tenant's own toggle is off
    return this.analyticsService.getStatsBySlug(slug, isSuperAdmin);
  }
}
