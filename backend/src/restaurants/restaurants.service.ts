import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { resolveTranslation } from '../common/locale.util';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findBySlug(slug: string, locale: string) {
    try {
      const restaurant = await this.prisma.restaurant.findUnique({
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

      if (!restaurant) {
        throw new NotFoundException(`Restaurant with slug "${slug}" not found`);
      }

    const effectiveLocale = restaurant.supportedLocales.includes(locale)
      ? locale
      : restaurant.defaultLocale;

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
      name: resolveTranslation(
        restaurant.name,
        locale,
        restaurant.supportedLocales,
        restaurant.defaultLocale,
      ),
      themeColor: restaurant.themeColor,
      logoUrl: formatUrl(restaurant.logoUrl),
      defaultLocale: restaurant.defaultLocale,
      supportedLocales: restaurant.supportedLocales,
      locale: effectiveLocale,
      categories: restaurant.categories.map((cat) => ({
        id: cat.id,
        name: resolveTranslation(
          cat.name,
          locale,
          restaurant.supportedLocales,
          restaurant.defaultLocale,
        ),
        sortOrder: cat.sortOrder,
        photoUrl: formatUrl(cat.photoUrl),
        products: cat.products.map((prod) => ({
          id: prod.id,
          name: resolveTranslation(
            prod.name,
            locale,
            restaurant.supportedLocales,
            restaurant.defaultLocale,
          ),
          description: prod.description
            ? resolveTranslation(
                prod.description,
                locale,
                restaurant.supportedLocales,
                restaurant.defaultLocale,
              )
            : null,
          price: prod.price.toString(),
          photoUrl: formatUrl(prod.photoUrl),
          sortOrder: prod.sortOrder,
        })),
      })),
    };
    } catch (err) {
      console.error('❌ Error in findBySlug:', err);
      if (err instanceof NotFoundException) throw err;
      throw new Error(`Database/Query error: ${(err as Error).message}`);
    }
  }
}
