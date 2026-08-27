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
import * as bcrypt from 'bcryptjs';
import { AdminRole } from '../common/roles.enum';
import type { Prisma, Restaurant, RestaurantSettings } from '@prisma/client';

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
   * List All Restaurants with Counts
   */
  async findAllRestaurants(): Promise<RestaurantSummaryItem[]> {
    const restaurants = await this.prisma.restaurant.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
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
      };
    });
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
}
