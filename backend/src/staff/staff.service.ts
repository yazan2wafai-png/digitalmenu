import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { AdminRole } from '../common/roles.enum';

export interface StaffMember {
  id: string;
  email: string;
  name: string | null;
  role: AdminRole;
  createdAt: Date;
  isOwner: boolean;
}

/**
 * Manages the extra AdminUser accounts ("staff") a restaurant can have
 * beyond the single owner account super-admin creates at provisioning.
 * AdminUser already has a nullable, many-to-one restaurantId FK, so a
 * restaurant having N accounts needed no schema change beyond adding a
 * display `name` column - "owner" is just the earliest-created AdminUser
 * row for that restaurant, determined at read time rather than a stored
 * flag, so existing single-admin restaurants never needed a data backfill.
 */
@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  async listStaff(restaurantId: string): Promise<StaffMember[]> {
    const staff = await this.prisma.adminUser.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'asc' },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    return staff.map((s, i) => ({ ...s, isOwner: i === 0 }));
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
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    return { ...staff, isOwner: false };
  }

  async deleteStaff(
    restaurantId: string,
    staffId: string,
    requesterId?: string,
  ): Promise<{ success: boolean }> {
    const all = await this.prisma.adminUser.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'asc' },
      select: { id: true },
    });

    if (all.length === 0) {
      throw new NotFoundException('No staff accounts found for this restaurant');
    }

    const target = all.find((a) => a.id === staffId);
    if (!target) {
      throw new NotFoundException('Staff account not found');
    }

    if (all[0].id === staffId) {
      throw new ForbiddenException('The primary owner account cannot be removed');
    }

    if (requesterId && requesterId === staffId) {
      throw new ForbiddenException('You cannot remove the account you are currently logged in as');
    }

    await this.prisma.adminUser.delete({ where: { id: staffId } });
    return { success: true };
  }
}
