import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SuperAdminLoginDto } from './dto/super-admin-login.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantPermissionsDto } from './dto/update-restaurant-permissions.dto';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { AdminRole } from '../common/roles.enum';
import type { Prisma, Restaurant, RestaurantSettings } from '@prisma/client';

export interface RestaurantPermissions {
  canViewOrders: boolean;
  canTrackTables: boolean;
  canManageMenu: boolean;
  canManageStaff: boolean;
  canViewAnalytics: boolean;
}

export interface SuperAdminLoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface CreateRestaurantResponse {
  restaurant: Restaurant & { settings: RestaurantSettings };
  adminUser: {
    id: string;
    email: string;
    role: string;
    restaurantId: string | null;
    createdAt: Date;
  };
}

export interface DeleteRestaurantResponse {
  success: boolean;
  message: string;
}

export interface RestaurantSummaryItem {
  id: string;
  slug: string;
  name: Prisma.JsonValue;
  themeColor: string;
  supportedLocales: string[];
  defaultLocale: string;
  isActive: boolean;
  createdAt: Date;
  categoryCount: number;
  productCount: number;
  viewCount: number;
  permissions: RestaurantPermissions;
}

export interface UpdateRestaurantPermissionsResponse {
  slug: string;
  permissions: RestaurantPermissions;
}

export interface ResetAdminPasswordResponse {
  slug: string;
  email: string;
  newPassword: string;
}

export interface DailyViewCount {
  date: string;
  count: number;
}

export interface RestaurantViewsResponse {
  slug: string;
  totalViews: number;
  dailyViews: DailyViewCount[];
}

@Injectable()
export class SuperAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * SuperAdmin Login
   */
  async login(dto: SuperAdminLoginDto): Promise<SuperAdminLoginResponse> {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: dto.email },
    });

    if (!admin || admin.role !== AdminRole.SUPER_ADMIN) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      restaurantId: null,
      restaurantSlug: null,
      role: admin.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  /**
   * Create Restaurant & First Admin User
   */
  async createRestaurant(dto: CreateRestaurantDto): Promise<CreateRestaurantResponse> {
    const slug = dto.slug.toLowerCase().trim();
    const adminEmail = dto.adminEmail.toLowerCase().trim();

    const existingRestaurant = await this.prisma.restaurant.findUnique({
      where: { slug },
    });
    if (existingRestaurant) {
      throw new ConflictException(`Restaurant with slug '${slug}' already exists`);
    }

    const existingAdmin = await this.prisma.adminUser.findUnique({
      where: { email: adminEmail },
    });
    if (existingAdmin) {
      throw new ConflictException(`Admin user with email '${adminEmail}' already exists`);
    }

    const passwordHash = await bcrypt.hash(dto.adminPassword, 10);

    return this.prisma.$transaction(async (tx) => {
      const restaurant = await tx.restaurant.create({
        data: {
          name: dto.name,
          slug,
          themeColor: dto.themeColor ?? '#E63946',
          supportedLocales:
            dto.supportedLocales && dto.supportedLocales.length > 0
              ? dto.supportedLocales
              : ['tr', 'en', 'ar'],
          defaultLocale: dto.defaultLocale ?? 'tr',
          isActive: true,
        },
      });

      const settings = await tx.restaurantSettings.create({
        data: {
          restaurantId: restaurant.id,
          orderingEnabled: false,
          dineInEnabled: false,
          takeawayEnabled: false,
          estimatedPrepMinutes: 15,
          currency: 'TRY',
          timezone: 'Europe/Istanbul',
          enableOrdering: true,
          enableTables: true,
          enableAnalytics: true,
          enableMultiLanguage: true,
          enableReviews: false,
          enableServiceCall: false,
          canViewOrders: true,
          canTrackTables: true,
          canManageMenu: true,
          canManageStaff: true,
          canViewAnalytics: true,
        },
      });

      const adminUser = await tx.adminUser.create({
        data: {
          restaurantId: restaurant.id,
          email: adminEmail,
          passwordHash,
          role: AdminRole.RESTAURANT_ADMIN,
        },
      });

      return {
        restaurant: {
          ...restaurant,
          settings,
        },
        adminUser: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
          restaurantId: adminUser.restaurantId,
          createdAt: adminUser.createdAt,
        },
      };
    });
  }

  /**
   * Delete Restaurant by Slug (Cascades all child records)
   */
  async deleteRestaurant(slug: string): Promise<DeleteRestaurantResponse> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { slug },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with slug "${slug}" not found`);
    }

    await this.prisma.restaurant.delete({
      where: { id: restaurant.id },
    });

    return {
      success: true,
      message: `Restaurant '${slug}' deleted successfully`,
    };
  }

  /**
   * List All Restaurants with Counts and RBAC Permissions
   */
  async findAllRestaurants(): Promise<RestaurantSummaryItem[]> {
    const restaurants = await this.prisma.restaurant.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        settings: true,
        _count: {
          select: {
            categories: true,
            pageViews: true,
          },
        },
        categories: {
          select: {
            _count: {
              select: {
                products: true,
              },
            },
          },
        },
      },
    });

    return restaurants.map((r) => {
      const productCount = r.categories.reduce(
        (sum, cat) => sum + (cat._count?.products ?? 0),
        0,
      );

      return {
        id: r.id,
        slug: r.slug,
        name: r.name,
        themeColor: r.themeColor,
        supportedLocales: r.supportedLocales,
        defaultLocale: r.defaultLocale,
        isActive: r.isActive,
        createdAt: r.createdAt,
        categoryCount: r._count.categories,
        productCount,
        viewCount: r._count.pageViews,
        permissions: {
          canViewOrders: r.settings?.canViewOrders ?? true,
          canTrackTables: r.settings?.canTrackTables ?? true,
          canManageMenu: r.settings?.canManageMenu ?? true,
          canManageStaff: r.settings?.canManageStaff ?? true,
          canViewAnalytics: r.settings?.canViewAnalytics ?? true,
        },
      };
    });
  }

  /**
   * Update Restaurant RBAC Feature Permissions by Slug
   */
  async updateRestaurantPermissions(
    slug: string,
    dto: UpdateRestaurantPermissionsDto,
  ): Promise<UpdateRestaurantPermissionsResponse> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { slug },
      include: { settings: true },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with slug "${slug}" not found`);
    }

    const updateData = {
      ...(dto.canViewOrders !== undefined && { canViewOrders: dto.canViewOrders }),
      ...(dto.canTrackTables !== undefined && { canTrackTables: dto.canTrackTables }),
      ...(dto.canManageMenu !== undefined && { canManageMenu: dto.canManageMenu }),
      ...(dto.canManageStaff !== undefined && { canManageStaff: dto.canManageStaff }),
      ...(dto.canViewAnalytics !== undefined && { canViewAnalytics: dto.canViewAnalytics }),
    };

    const settings = await this.prisma.restaurantSettings.upsert({
      where: { restaurantId: restaurant.id },
      update: updateData,
      create: {
        restaurantId: restaurant.id,
        ...updateData,
      },
    });

    return {
      slug: restaurant.slug,
      permissions: {
        canViewOrders: settings.canViewOrders,
        canTrackTables: settings.canTrackTables,
        canManageMenu: settings.canManageMenu,
        canManageStaff: settings.canManageStaff,
        canViewAnalytics: settings.canViewAnalytics,
      },
    };
  }

  /**
   * Get Restaurant PageView Stats (Total & 30-day breakdown)
   */
  async getRestaurantViews(slug: string): Promise<RestaurantViewsResponse> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { slug },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with slug "${slug}" not found`);
    }

    const totalViews = await this.prisma.pageView.count({
      where: { restaurantId: restaurant.id },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const pageViews = await this.prisma.pageView.findMany({
      where: {
        restaurantId: restaurant.id,
        timestamp: { gte: thirtyDaysAgo },
      },
      select: {
        timestamp: true,
      },
    });

    const dailyMap = new Map<string, number>();
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dailyMap.set(dateStr, 0);
    }

    for (const pv of pageViews) {
      const dateStr = pv.timestamp.toISOString().split('T')[0];
      if (dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, (dailyMap.get(dateStr) ?? 0) + 1);
      }
    }

    const dailyViews = Array.from(dailyMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    return {
      slug: restaurant.slug,
      totalViews,
      dailyViews,
    };
  }

  /**
   * Read RBAC permissions for a restaurant. Callable by SUPER_ADMIN for any
   * restaurant, or by a RESTAURANT_ADMIN for their own restaurant only -
   * the controller enforces that ownership check before calling this.
   */
  async getRestaurantPermissions(slug: string): Promise<UpdateRestaurantPermissionsResponse> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { slug },
      include: { settings: true },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with slug "${slug}" not found`);
    }

    return {
      slug: restaurant.slug,
      permissions: {
        canViewOrders: restaurant.settings?.canViewOrders ?? true,
        canTrackTables: restaurant.settings?.canTrackTables ?? true,
        canManageMenu: restaurant.settings?.canManageMenu ?? true,
        canManageStaff: restaurant.settings?.canManageStaff ?? true,
        canViewAnalytics: restaurant.settings?.canViewAnalytics ?? true,
      },
    };
  }

  /**
   * Generate a fresh random password for a restaurant's admin account and
   * store its hash. Passwords are bcrypt-hashed at rest and there is no way
   * to recover the original - this is the only way to hand a tenant owner
   * working credentials again short of asking them to reset it themselves.
   * Returns the new plaintext password once; the caller must show/copy it
   * immediately, it is never retrievable again after this response.
   */
  async resetAdminPassword(slug: string): Promise<ResetAdminPasswordResponse> {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { slug } });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with slug "${slug}" not found`);
    }

    const adminUser = await this.prisma.adminUser.findFirst({
      where: { restaurantId: restaurant.id },
      orderBy: { createdAt: 'asc' },
    });
    if (!adminUser) {
      throw new NotFoundException(`No admin user found for restaurant "${slug}"`);
    }

    const newPassword = this.generateReadablePassword();
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.prisma.adminUser.update({
      where: { id: adminUser.id },
      data: { passwordHash },
    });

    return {
      slug: restaurant.slug,
      email: adminUser.email,
      newPassword,
    };
  }

  /** Readable random password: avoids visually ambiguous characters (0/O, 1/l/I). */
  private generateReadablePassword(length = 10): string {
    const charset = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
    const bytes = randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[bytes[i] % charset.length];
    }
    return result;
  }
}
