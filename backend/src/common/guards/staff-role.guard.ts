import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { STAFF_ROLES_KEY } from '../decorators/require-staff-role.decorator';
import { StaffRole } from '../staff-role.enum';

/**
 * Enforces @RequireStaffRole() on a route. Routes with no decorator pass
 * through untouched (used for GET endpoints, which stay open to every
 * staff role - OWNER, EDITOR and VIEWER can all read).
 */
@Injectable()
export class StaffRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<StaffRole[]>(STAFF_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new UnauthorizedException('Authentication required');

    // Older tokens/rows minted before staffRole existed default to OWNER
    // (matches the Prisma column default), so nothing needed backfilling.
    const staffRole = (user.staffRole ?? StaffRole.OWNER) as StaffRole;
    if (!required.includes(staffRole)) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }
    return true;
  }
}
