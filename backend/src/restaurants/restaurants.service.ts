import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { resolveTranslation } from '../common/locale.util';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findBySlug(slug: string, locale: string) {
    let restaurant: any = null;
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
    } catch (err) {
      try {
        restaurant = await this.prisma.restaurant.findUnique({
          where: { slug },
          include: {
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
      } catch (innerErr) {
        throw new NotFoundException(`Restaurant with slug "${slug}" not found`);
      }
    }

    if (!restaurant || !restaurant.isActive) {
      throw new NotFoundException(`Restaurant with slug "${slug}" not found`);
    }

    const supportedLocales = Array.isArray(restaurant.supportedLocales)
      ? (restaurant.supportedLocales as string[])
      : ['tr', 'en', 'ar'];
    const defaultLocale = restaurant.defaultLocale || 'tr';

    const publicBase = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
    const formatUrl = (url: string | null) => {
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
      settings: restaurant.settings || null,
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
      categories: (restaurant.categories || []).map((category: any) => ({
        id: category.id,
        name: resolveTranslation(
          category.name,
          locale,
          supportedLocales,
          defaultLocale,
        ),
        photoUrl: formatUrl(category.photoUrl),
        sortOrder: category.sortOrder,
        products: (category.products || [])
          .filter((product: any) => product.isAvailable)
          .map((product: any) => ({
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
