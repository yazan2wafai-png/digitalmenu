import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from '../src/restaurants/restaurants.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('RestaurantsService Tests', () => {
  let service: RestaurantsService;
  let prismaService: any;

  const mockRestaurant = {
    id: 'rest-uuid-1',
    name: { tr: 'Baltazar Burger', en: 'Baltazar Burger', ar: 'بالتازار برغر' },
    slug: 'baltazar',
    themeColor: '#C0392B',
    supportedLocales: ['tr', 'en', 'ar'],
    defaultLocale: 'tr',
    isActive: true,
    categories: [
      {
        id: 'cat-1',
        name: { tr: 'Burgerler', en: 'Burgers' },
        sortOrder: 1,
        products: [
          {
            id: 'prod-1',
            name: { tr: 'Klasik Baltazar' },
            description: { tr: 'Dana eti' },
            price: 220,
            sortOrder: 1,
            isAvailable: true,
          },
        ],
      },
    ],
  };

  beforeEach(async () => {
    const mockPrisma = {
      restaurant: {
        findUnique: jest.fn(),
      },
      pageView: {
        create: jest.fn().mockResolvedValue({ id: 'page-view-1' }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    prismaService = module.get(PrismaService);
  });

  it('should find restaurant and log pageView asynchronously', async () => {
    prismaService.restaurant.findUnique.mockResolvedValue(mockRestaurant);

    const result = await service.findBySlug('baltazar', 'tr');

    expect(result.id).toBe(mockRestaurant.id);
    expect(result.slug).toBe('baltazar');
    expect(prismaService.pageView.create).toHaveBeenCalledWith({
      data: {
        restaurantId: mockRestaurant.id,
      },
    });
  });

  it('should not break findBySlug if pageView logging fails', async () => {
    prismaService.restaurant.findUnique.mockResolvedValue(mockRestaurant);
    prismaService.pageView.create.mockRejectedValue(new Error('DB connection dropped'));

    const result = await service.findBySlug('baltazar', 'tr');

    expect(result.id).toBe(mockRestaurant.id);
    expect(result.slug).toBe('baltazar');
  });

  it('should throw NotFoundException if restaurant not found', async () => {
    prismaService.restaurant.findUnique.mockResolvedValue(null);

    await expect(service.findBySlug('unknown', 'tr')).rejects.toThrow(
      NotFoundException,
    );
    expect(prismaService.pageView.create).not.toHaveBeenCalled();
  });
});
