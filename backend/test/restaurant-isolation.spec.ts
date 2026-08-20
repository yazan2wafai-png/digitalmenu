import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../src/categories/categories.service';
import { ProductsService } from '../src/products/products.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('Restaurant Isolation Tests', () => {
  let categoriesService: CategoriesService;
  let productsService: ProductsService;
  let prismaService: any;

  const mockRestaurantA = {
    id: 'rest-uuid-a',
    slug: 'baltazar',
    name: 'Baltazar Burger',
  };

  const mockRestaurantB = {
    id: 'rest-uuid-b',
    slug: 'other-restaurant',
    name: 'Other Restaurant',
  };

  const mockCategoryA = {
    id: 'cat-uuid-a',
    name: 'Burgers',
    restaurantId: 'rest-uuid-a',
    sortOrder: 1,
    products: [],
  };

  const mockCategoryB = {
    id: 'cat-uuid-b',
    name: 'Pizzas',
    restaurantId: 'rest-uuid-b',
    sortOrder: 1,
    products: [],
  };

  const mockProductA = {
    id: 'prod-uuid-a',
    name: 'Classic Burger',
    categoryId: 'cat-uuid-a',
    price: 220,
    sortOrder: 1,
  };

  beforeEach(async () => {
    const mockPrisma = {
      restaurant: {
        findUnique: jest.fn(),
      },
      category: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      product: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    productsService = module.get<ProductsService>(ProductsService);
    prismaService = module.get(PrismaService);
  });

  describe('CategoriesService Isolation', () => {
    it('should throw ForbiddenException on findAll when admin JWT restaurantId does not match slug owner', async () => {
      prismaService.restaurant.findUnique.mockResolvedValue(mockRestaurantA);

      await expect(
        categoriesService.findAll('baltazar', 'different-admin-rest-id'),
      ).rejects.toThrow(ForbiddenException);

      expect(prismaService.restaurant.findUnique).toHaveBeenCalledWith({
        where: { slug: 'baltazar' },
      });
      expect(prismaService.category.findMany).not.toHaveBeenCalled();
    });

    it('should allow findAll when admin JWT restaurantId matches slug owner', async () => {
      prismaService.restaurant.findUnique.mockResolvedValue(mockRestaurantA);
      prismaService.category.findMany.mockResolvedValue([mockCategoryA]);

      const result = await categoriesService.findAll('baltazar', mockRestaurantA.id);

      expect(result).toEqual([mockCategoryA]);
      expect(prismaService.category.findMany).toHaveBeenCalledWith({
        where: { restaurantId: mockRestaurantA.id },
        orderBy: { sortOrder: 'asc' },
        include: { products: { orderBy: { sortOrder: 'asc' } } },
      });
    });

    it('should throw NotFoundException on findAll when restaurant slug does not exist', async () => {
      prismaService.restaurant.findUnique.mockResolvedValue(null);

      await expect(
        categoriesService.findAll('nonexistent', mockRestaurantA.id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException on findOne when admin JWT restaurantId does not match slug owner', async () => {
      prismaService.restaurant.findUnique.mockResolvedValue(mockRestaurantA);

      await expect(
        categoriesService.findOne('baltazar', 'cat-uuid-a', 'unauthorized-rest-id'),
      ).rejects.toThrow(ForbiddenException);

      expect(prismaService.category.findFirst).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException on create when admin JWT restaurantId does not match slug owner', async () => {
      prismaService.restaurant.findUnique.mockResolvedValue(mockRestaurantA);

      await expect(
        categoriesService.create('baltazar', 'unauthorized-rest-id', { name: 'Drinks' }),
      ).rejects.toThrow(ForbiddenException);

      expect(prismaService.category.create).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException on update when admin JWT restaurantId does not match slug owner', async () => {
      prismaService.restaurant.findUnique.mockResolvedValue(mockRestaurantA);

      await expect(
        categoriesService.update('baltazar', 'cat-uuid-a', 'unauthorized-rest-id', { name: 'New Name' }),
      ).rejects.toThrow(ForbiddenException);

      expect(prismaService.category.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException on remove when admin JWT restaurantId does not match slug owner', async () => {
      prismaService.restaurant.findUnique.mockResolvedValue(mockRestaurantA);

      await expect(
        categoriesService.remove('baltazar', 'cat-uuid-a', 'unauthorized-rest-id'),
      ).rejects.toThrow(ForbiddenException);

      expect(prismaService.category.delete).not.toHaveBeenCalled();
    });
  });

  describe('ProductsService Isolation', () => {
    it('should throw ForbiddenException on findAll when categoryId belongs to a different restaurant', async () => {
      // Category belongs to Restaurant A (mockCategoryA.restaurantId = 'rest-uuid-a')
      // But Admin JWT has Restaurant B ('rest-uuid-b')
      prismaService.category.findUnique.mockResolvedValue(mockCategoryA);

      await expect(
        productsService.findAll(mockCategoryA.id, mockRestaurantB.id),
      ).rejects.toThrow(ForbiddenException);

      expect(prismaService.category.findUnique).toHaveBeenCalledWith({
        where: { id: mockCategoryA.id },
      });
      expect(prismaService.product.findMany).not.toHaveBeenCalled();
    });

    it('should allow findAll when admin JWT restaurantId owns the category', async () => {
      prismaService.category.findUnique.mockResolvedValue(mockCategoryA);
      prismaService.product.findMany.mockResolvedValue([mockProductA]);

      const result = await productsService.findAll(mockCategoryA.id, mockRestaurantA.id);

      expect(result).toEqual([mockProductA]);
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: { categoryId: mockCategoryA.id },
        orderBy: { sortOrder: 'asc' },
      });
    });

    it('should throw NotFoundException on findAll when categoryId does not exist', async () => {
      prismaService.category.findUnique.mockResolvedValue(null);

      await expect(
        productsService.findAll('nonexistent-cat', mockRestaurantA.id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException on findOne when categoryId belongs to different restaurant', async () => {
      prismaService.category.findUnique.mockResolvedValue(mockCategoryA);

      await expect(
        productsService.findOne(mockCategoryA.id, 'prod-uuid-a', mockRestaurantB.id),
      ).rejects.toThrow(ForbiddenException);

      expect(prismaService.product.findFirst).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException on create when categoryId belongs to different restaurant', async () => {
      prismaService.category.findUnique.mockResolvedValue(mockCategoryA);

      await expect(
        productsService.create(mockCategoryA.id, mockRestaurantB.id, {
          name: 'Cheeseburger',
          price: 240,
        }),
      ).rejects.toThrow(ForbiddenException);

      expect(prismaService.product.create).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException on update when categoryId belongs to different restaurant', async () => {
      prismaService.category.findUnique.mockResolvedValue(mockCategoryA);

      await expect(
        productsService.update(mockCategoryA.id, 'prod-uuid-a', mockRestaurantB.id, {
          name: 'Updated Name',
        }),
      ).rejects.toThrow(ForbiddenException);

      expect(prismaService.product.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException on remove when categoryId belongs to different restaurant', async () => {
      prismaService.category.findUnique.mockResolvedValue(mockCategoryA);

      await expect(
        productsService.remove(mockCategoryA.id, 'prod-uuid-a', mockRestaurantB.id),
      ).rejects.toThrow(ForbiddenException);

      expect(prismaService.product.delete).not.toHaveBeenCalled();
    });
  });
});
