import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { resolveTranslation } from '../common/locale.util';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findBySlug(slug: string, locale: string) {
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

    const publicBase = process.env.PUBLIC_URL || 'https://5cb1d4ec34fa76.lhr.life';
    const formatUrl = (url: string | null) => {
      if (!url) return null;
      if (url.startsWith('http://localhost:3001')) {
        return url.replace('http://localhost:3001', publicBase);
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
  }
}
