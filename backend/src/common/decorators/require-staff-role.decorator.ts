import { SetMetadata } from '@nestjs/common';
import { StaffRole } from '../staff-role.enum';

export const STAFF_ROLES_KEY = 'staffRoles';

/**
 * Restricts a route to one or more StaffRole levels. Must be combined with
 * StaffRoleGuard (which reads this metadata) alongside JwtAuthGuard - the
 * decorator alone does nothing. A SUPER_ADMIN token never reaches these
 * checks directly since it has no restaurantId; its only path to a
 * tenant-scoped route is an impersonation token, which always carries
 * staffRole: OWNER.
 */
export const RequireStaffRole = (...roles: StaffRole[]) => SetMetadata(STAFF_ROLES_KEY, roles);
