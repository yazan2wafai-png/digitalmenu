import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import type { StaffMember } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffRoleDto } from './dto/update-staff-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StaffRoleGuard } from '../common/guards/staff-role.guard';
import { RequireStaffRole } from '../common/decorators/require-staff-role.decorator';
import { StaffRole } from '../common/staff-role.enum';
import type { AuthenticatedRequest } from '../auth/strategies/jwt.strategy';

/**
 * Self-service staff management for a tenant admin: create/list/remove
 * additional AdminUser accounts for their OWN restaurant only, scoped via
 * req.user.restaurantId from the JWT (never a URL param a caller could
 * substitute). Super-admin's cross-tenant equivalent lives under
 * /super-admin/restaurants/:slug/staff and shares this same StaffService.
 *
 * Every route here is OWNER-only: staff accounts are sensitive (they grant
 * login credentials to the restaurant), so EDITOR/VIEWER accounts can't
 * even list who else has access, let alone create or remove accounts.
 */
@UseGuards(JwtAuthGuard, StaffRoleGuard)
@RequireStaffRole(StaffRole.OWNER)
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

  @Patch(':id/role')
  updateRole(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateStaffRoleDto,
  ): Promise<StaffMember> {
    if (!req.user.restaurantId) throw new ForbiddenException('No restaurant context');
    return this.staffService.updateStaffRole(req.user.restaurantId, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string): Promise<{ success: boolean }> {
    if (!req.user.restaurantId) throw new ForbiddenException('No restaurant context');
    return this.staffService.deleteStaff(req.user.restaurantId, id, req.user.id);
  }
}
