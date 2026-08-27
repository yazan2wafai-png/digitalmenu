import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { resolveTranslation } from '../common/locale.util';
import type { Prisma, RestaurantSettings } from '@prisma/client';

export interface FormattedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  photoUrl: string | null;
  sortOrder: number;
}

export interface FormattedCategory {
  id: string;
  name: string;
  photoUrl: string | null;
  sortOrder: number;
  products: FormattedProduct[];
}

export interface RestaurantFeatureFlags {
  enableOrdering: boolean;
  enableTables: boolean;
  enableAnalytics: boolean;
  enableMultiLanguage: boolean;
  enableReviews: boolean;
  enableServiceCall: boolean;
}

export interface PublicRestaurantResponse {
  id: string;
  slug: string;
  settings: RestaurantSettings | null;
  featureFlags: RestaurantFeatureFlags;
  name: string;
  themeColor: string;
  logoUrl: string | null;
  supportedLocales: string[];
  defaultLocale: string;
  categories: FormattedCategory[];
}

type RestaurantWithMenu = Prisma.RestaurantGetPayload<{
  include: {
    settings: true;
    categories: {
      include: {
        products: true;
      };
    };
  };
}>;

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findBySlug(slug: string, locale: string): Promise<PublicRestaurantResponse> {
    let restaurant: RestaurantWithMenu | null = null;
    try {
      restaurant = await this.prisma.restaurant.findUnique({
        where: { slug },
        include: {
          settings: true,
          categories: {
            orderBy: { sortOrder: 'asc' },
            include: {
              products: {
                orderBy: { sortOrder: 'asc' },
              },
            },
          },
        },
      });
    } catch {
      throw new NotFoundException(`Restaurant with slug "${slug}" not found`);
    }

    if (!restaurant || !restaurant.isActive) {
      throw new NotFoundException(`Restaurant with slug "${slug}" not found`);
    }

    // Record page view asynchronously without blocking response
    this.prisma.pageView
      .create({
        data: {
          restaurantId: restaurant.id,
        },
      })
      .catch((err: unknown) => {
        // Non-blocking catch
        const errMsg = err instanceof Error ? err.message : String(err);
        console.warn(`Failed to log page view for restaurant ${restaurant?.id}:`, errMsg);
      });

    const supportedLocales = Array.isArray(restaurant.supportedLocales)
      ? restaurant.supportedLocales
      : ['tr', 'en', 'ar'];
    const defaultLocale = restaurant.defaultLocale ?? 'tr';

    const publicBase = (process.env.PUBLIC_URL ?? '').replace(/\/$/, '');
    const formatUrl = (url: string | null): string | null => {
      if (!url) return null;
      if (url.startsWith('http://localhost:3001')) {
        return publicBase ? url.replace('http://localhost:3001', publicBase) : url;
      }
      if (url.startsWith('/') && publicBase) {
        return `${publicBase}${url}`;
      }
      return url;
    };

    return {
      id: restaurant.id,
      slug: restaurant.slug,
      settings: restaurant.settings ?? null,
      featureFlags: {
        enableOrdering: restaurant.settings?.enableOrdering ?? true,
        enableTables: restaurant.settings?.enableTables ?? true,
        enableAnalytics: restaurant.settings?.enableAnalytics ?? true,
        enableMultiLanguage: restaurant.settings?.enableMultiLanguage ?? true,
        enableReviews: restaurant.settings?.enableReviews ?? false,
        enableServiceCall: restaurant.settings?.enableServiceCall ?? false,
      },
      name: resolveTranslation(
        restaurant.name,
        locale,
        supportedLocales,
        defaultLocale,
      ),
      themeColor: restaurant.themeColor,
      logoUrl: formatUrl(restaurant.logoUrl),
      supportedLocales: restaurant.supportedLocales,
      defaultLocale: restaurant.defaultLocale,
      categories: (restaurant.categories ?? []).map((category) => ({
        id: category.id,
        name: resolveTranslation(
          category.name,
          locale,
          supportedLocales,
          defaultLocale,
        ),
        photoUrl: formatUrl(category.photoUrl),
        sortOrder: category.sortOrder,
        products: (category.products ?? [])
          .filter((product) => product.isAvailable)
          .map((product) => ({
            id: product.id,
            name: resolveTranslation(
              product.name,
              locale,
              supportedLocales,
              defaultLocale,
            ),
            description: resolveTranslation(
              product.description,
              locale,
              supportedLocales,
              defaultLocale,
            ),
            price: Number(product.price) || 0,
            photoUrl: formatUrl(product.photoUrl),
            sortOrder: product.sortOrder,
          })),
      })),
    };
  }
}
