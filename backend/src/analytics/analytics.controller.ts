import { Controller, Get, Post, Body, Headers, Req, UseGuards, Param, ForbiddenException } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('analytics/view')
  async recordView(
    @Body('restaurantSlug') restaurantSlug: string,
    @Req() req: Request,
    @Headers('user-agent') userAgent: string,
    @Headers('x-forwarded-for') xForwardedFor: string,
  ) {
    const ip = xForwardedFor ? (Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor.split(',')[0]) : req.ip;
    return this.analyticsService.recordView(restaurantSlug, ip || '0.0.0.0', userAgent);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/analytics/:slug')
  async getStats(@Param('slug') slug: string, @Req() req: any) {
    if (req.user.restaurantSlug !== slug) {
      throw new ForbiddenException('You can only access analytics for your own restaurant');
    }
    return this.analyticsService.getStats(req.user.restaurantId);
  }
}
