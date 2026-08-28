import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import type { StaffMember } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/strategies/jwt.strategy';

/**
 * Self-service staff management for a tenant admin: create/list/remove
 * additional AdminUser accounts for their OWN restaurant only, scoped via
 * req.user.restaurantId from the JWT (never a URL param a caller could
 * substitute). Super-admin's cross-tenant equivalent lives under
 * /super-admin/restaurants/:slug/staff and shares this same StaffService.
 */
@UseGuards(JwtAuthGuard)
@Controller('admin/me/staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  list(@Req() req: AuthenticatedRequest): Promise<StaffMember[]> {
    if (!req.user.restaurantId) throw new ForbiddenException('No restaurant context');
    return this.staffService.listStaff(req.user.restaurantId);
  }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateStaffDto): Promise<StaffMember> {
    if (!req.user.restaurantId) throw new ForbiddenException('No restaurant context');
    return this.staffService.createStaff(req.user.restaurantId, dto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string): Promise<{ success: boolean }> {
    if (!req.user.restaurantId) throw new ForbiddenException('No restaurant context');
    return this.staffService.deleteStaff(req.user.restaurantId, id, req.user.id);
  }
}
