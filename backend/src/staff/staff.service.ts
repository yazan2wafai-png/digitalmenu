import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffRoleDto } from './dto/update-staff-role.dto';
import { AdminRole } from '../common/roles.enum';
import { StaffRole } from '../common/staff-role.enum';

export interface StaffMember {
  id: string;
  email: string;
  name: string | null;
  role: AdminRole;
  staffRole: StaffRole;
  createdAt: Date;
  /** Convenience flag for the UI: true iff staffRole === OWNER. */
  isOwner: boolean;
}

const STAFF_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  staffRole: true,
  createdAt: true,
} as const;

function toStaffMember(row: {
  id: string;
  email: string;
  name: string | null;
  role: AdminRole;
  staffRole: StaffRole;
  createdAt: Date;
}): StaffMember {
  return { ...row, isOwner: row.staffRole === StaffRole.OWNER };
}

/**
 * Manages the extra AdminUser accounts ("staff") a restaurant can have
 * beyond the single owner account super-admin creates at provisioning.
 * AdminUser already has a nullable, many-to-one restaurantId FK, so a
 * restaurant having N accounts needed no schema change beyond adding a
 * display `name` column and a `staffRole` (OWNER/EDITOR/VIEWER) column -
 * every pre-existing row defaults to OWNER via the column default, so
 * nothing needed a data backfill.
 *
 * "Owner" is now the real staffRole, not an earliest-created inference -
 * a restaurant can have more than one OWNER account, and the only rule
 * enforced here is that at least one OWNER must always remain (so a
 * restaurant can never lock itself out of its own settings/staff
 * management).
 */
@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  async listStaff(restaurantId: string): Promise<StaffMember[]> {
    const staff = await this.prisma.adminUser.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'asc' },
      select: STAFF_SELECT,
    });

    return staff.map(toStaffMember);
  }

  async createStaff(
    restaurantId: string,
    dto: CreateStaffDto,
    opts: { bypassGate?: boolean } = {},
  ): Promise<StaffMember> {
    if (!opts.bypassGate) {
      const settings = await this.prisma.restaurantSettings.findUnique({ where: { restaurantId } });
      if (settings && settings.canManageStaff === false) {
        throw new ForbiddenException('Staff management is disabled for this restaurant');
      }
    }

    const email = dto.email.toLowerCase().trim();
    const existing = await this.prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException(`An account with email "${email}" already exists`);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const staff = await this.prisma.adminUser.create({
      data: {
        restaurantId,
        email,
        passwordHash,
        name: dto.name?.trim() || null,
        role: AdminRole.RESTAURANT_ADMIN,
        // New staff default to EDITOR (day-to-day access) rather than
        // OWNER - granting ownership is a deliberate choice, not a default.
        staffRole: dto.staffRole ?? StaffRole.EDITOR,
      },
      select: STAFF_SELECT,
    });

    return toStaffMember(staff);
  }

  async updateStaffRole(
    restaurantId: string,
    staffId: string,
    dto: UpdateStaffRoleDto,
  ): Promise<StaffMember> {
    const target = await this.prisma.adminUser.findFirst({
      where: { id: staffId, restaurantId },
      select: STAFF_SELECT,
    });
    if (!target) {
      throw new NotFoundException('Staff account not found');
    }

    if (target.staffRole === StaffRole.OWNER && dto.staffRole !== StaffRole.OWNER) {
      await this.assertNotLastOwner(restaurantId, staffId);
    }

    const updated = await this.prisma.adminUser.update({
      where: { id: staffId },
      data: { staffRole: dto.staffRole },
      select: STAFF_SELECT,
    });

    return toStaffMember(updated);
  }

  async deleteStaff(
    restaurantId: string,
    staffId: string,
    requesterId?: string,
  ): Promise<{ success: boolean }> {
    const target = await this.prisma.adminUser.findFirst({
      where: { id: staffId, restaurantId },
      select: { id: true, staffRole: true },
    });
    if (!target) {
      throw new NotFoundException('Staff account not found');
    }

    if (requesterId && requesterId === staffId) {
      throw new ForbiddenException('You cannot remove the account you are currently logged in as');
    }

    if (target.staffRole === StaffRole.OWNER) {
      await this.assertNotLastOwner(restaurantId, staffId);
    }

    await this.prisma.adminUser.delete({ where: { id: staffId } });
    return { success: true };
  }

  /** Throws if removing/demoting `excludeId` would leave the restaurant with zero OWNER accounts. */
  private async assertNotLastOwner(restaurantId: string, excludeId: string): Promise<void> {
    const remainingOwners = await this.prisma.adminUser.count({
      where: { restaurantId, staffRole: StaffRole.OWNER, id: { not: excludeId } },
    });
    if (remainingOwners === 0) {
      throw new ForbiddenException('A restaurant must always have at least one owner account');
    }
  }
}
