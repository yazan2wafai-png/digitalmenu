import { Test, TestingModule } from '@nestjs/testing';
import { SuperAdminService } from '../src/super-admin/super-admin.service';
import { SuperAdminController } from '../src/super-admin/super-admin.controller';
import { SuperAdminGuard } from '../src/super-admin/guards/super-admin.guard';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('SuperAdmin Tests', () => {
  let superAdminService: SuperAdminService;
  let superAdminController: SuperAdminController;
  let prismaService: any;
  let jwtService: any;

  const mockSuperAdminUser = {
    id: 'super-admin-uuid-1',
    email: 'superadmin@nfcmyplace.com',
    passwordHash: '',
    role: 'SUPER_ADMIN',
    restaurantId: null,
  };

  const mockRestaurant = {
    id: 'rest-uuid-1',
    name: { tr: 'Test Burger', en: 'Test Burger', ar: 'تست برغر' },
    slug: 'test-burger',
    themeColor: '#FF5733',
    supportedLocales: ['tr', 'en', 'ar'],
    defaultLocale: 'tr',
    isActive: true,
    createdAt: new Date('2026-08-01T00:00:00Z'),
  };

  beforeAll(async () => {
    mockSuperAdminUser.passwordHash = await bcrypt.hash('SuperAdmin123!', 10);
  });

  beforeEach(async () => {
    const mockPrisma = {
      adminUser: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      restaurant: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      restaurantSettings: {
        create: jest.fn(),
      },
      pageView: {
        count: jest.fn(),
        findMany: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback(mockPrisma)),
    };

    const mockJwt = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperAdminController],
      providers: [
        SuperAdminService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: JwtService,
          useValue: mockJwt,
        },
      ],
    }).compile();

    superAdminService = module.get<SuperAdminService>(SuperAdminService);
    superAdminController = module.get<SuperAdminController>(SuperAdminController);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  describe('SuperAdminGuard', () => {
    const guard = new SuperAdminGuard();

    it('should throw UnauthorizedException if no user on request', () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({ user: null }),
        }),
      } as any;

      expect(() => guard.canActivate(mockContext)).toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException if user is RESTAURANT_ADMIN', () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({ user: { role: 'RESTAURANT_ADMIN' } }),
        }),
      } as any;

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });

    it('should allow access if user is SUPER_ADMIN', () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({ user: { role: 'SUPER_ADMIN' } }),
        }),
      } as any;

      expect(guard.canActivate(mockContext)).toBe(true);
    });
  });

  describe('SuperAdminService.login', () => {
    it('should successfully log in SuperAdmin and return token & user info', async () => {
      prismaService.adminUser.findUnique.mockResolvedValue(mockSuperAdminUser);

      const result = await superAdminService.login({
        email: 'superadmin@nfcmyplace.com',
        password: 'SuperAdmin123!',
      });

      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        user: {
          id: mockSuperAdminUser.id,
          email: mockSuperAdminUser.email,
          role: 'SUPER_ADMIN',
        },
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockSuperAdminUser.id,
        email: mockSuperAdminUser.email,
        restaurantId: null,
        restaurantSlug: null,
        role: 'SUPER_ADMIN',
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      prismaService.adminUser.findUnique.mockResolvedValue(null);

      await expect(
        superAdminService.login({
          email: 'unknown@nfcmyplace.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user role is not SUPER_ADMIN', async () => {
      prismaService.adminUser.findUnique.mockResolvedValue({
        ...mockSuperAdminUser,
        role: 'RESTAURANT_ADMIN',
      });

      await expect(
        superAdminService.login({
          email: 'superadmin@nfcmyplace.com',
          password: 'SuperAdmin123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      prismaService.adminUser.findUnique.mockResolvedValue(mockSuperAdminUser);

      await expect(
        superAdminService.login({
          email: 'superadmin@nfcmyplace.com',
          password: 'WrongPassword!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('SuperAdminService.createRestaurant', () => {
    const createDto = {
      name: { tr: 'Test Burger', en: 'Test Burger', ar: 'تست برغر' },
      slug: 'test-burger',
      themeColor: '#FF5733',
      supportedLocales: ['tr', 'en', 'ar'],
      defaultLocale: 'tr',
      adminEmail: 'admin@testburger.com',
      adminPassword: 'password123',
    };

    it('should throw ConflictException if restaurant slug already exists', async () => {
      prismaService.restaurant.findUnique.mockResolvedValue(mockRestaurant);

      await expect(superAdminService.createRestaurant(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if admin email already exists', async () => {
      prismaService.restaurant.findUnique.mockResolvedValue(null);
      prismaService.adminUser.findUnique.mockResolvedValue({ id: 'existing-admin' });

      await expect(superAdminService.createRestaurant(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should create restaurant, settings, and admin user in transaction', async () => {
      prismaService.restaurant.findUnique.mockResolvedValue(null);
      prismaService.adminUser.findUnique.mockResolvedValue(null);

      const createdRest = {
        id: 'new-rest-id',
        ...createDto,
        isActive: true,
      };
      const createdSettings = {
        id: 'settings-id',
        restaurantId: 'new-rest-id',
      };
      const createdAdmin = {
        id: 'admin-id',
        email: createDto.adminEmail,
        role: 'RESTAURANT_ADMIN',
        restaurantId: 'new-rest-id',
        createdAt: new Date(),
      };

      prismaService.restaurant.create.mockResolvedValue(createdRest);
      prismaService.restaurantSettings.create.mockResolvedValue(createdSettings);
      prismaService.adminUser.create.mockResolvedValue(createdAdmin);

      const result = await superAdminService.createRestaurant(createDto);

      expect(prismaService.$transaction).toHaveBeenCalled();
      expect(prismaService.restaurant.create).toHaveBeenCalledWith({
        data: {
          name: createDto.name,
          slug: 'test-burger',
          themeColor: '#FF5733',
          supportedLocales: ['tr', 'en', 'ar'],
          defaultLocale: 'tr',
          isActive: true,
        },
      });
      expect(prismaService.restaurantSettings.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          restaurantId: 'new-rest-id',
        }),
      });
      expect(prismaService.adminUser.create).toHaveBeenCalledWith({
        data: {
          restaurantId: 'new-rest-id',
          email: 'admin@testburger.com',
          passwordHash: expect.any(String),
          role: 'RESTAURANT_ADMIN',
        },
      });

      expect(result.restaurant).toBeDefined();
      expect(result.adminUser).toEqual({
        id: createdAdmin.id,
        email: createdAdmin.email,
        role: createdAdmin.role,
        restaurantId: createdAdmin.restaurantId,
        createdAt: createdAdmin.createdAt,
      });
    });
  });

  describe('SuperAdminService.deleteRestaurant', () => {
    it('should throw NotFoundException if restaurant does not exist', async () => {
      prismaService.restaurant.findUnique.mockResolvedValue(null);

      await expect(
        superAdminService.deleteRestaurant('nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should delete restaurant and return confirmation', async () => {
      prismaService.restaurant.findUnique.mockResolvedValue(mockRestaurant);
      prismaService.restaurant.delete.mockResolvedValue(mockRestaurant);

      const result = await superAdminService.deleteRestaurant('test-burger');

      expect(prismaService.restaurant.delete).toHaveBeenCalledWith({
        where: { id: mockRestaurant.id },
      });
      expect(result).toEqual({
        success: true,
        message: "Restaurant 'test-burger' deleted successfully",
      });
    });
  });

  describe('SuperAdminService.findAllRestaurants', () => {
    it('should return all restaurants with counts', async () => {
      const mockRestaurantsFromDb = [
        {
          ...mockRestaurant,
          _count: {
            categories: 4,
            pageViews: 120,
          },
          categories: [
            { _count: { products: 5 } },
            { _count: { products: 3 } },
          ],
        },
      ];

      prismaService.restaurant.findMany.mockResolvedValue(mockRestaurantsFromDb);

      const result = await superAdminService.findAllRestaurants();

      expect(result).toEqual([
        {
          id: mockRestaurant.id,
          slug: mockRestaurant.slug,
          name: mockRestaurant.name,
          themeColor: mockRestaurant.themeColor,
          supportedLocales: mockRestaurant.supportedLocales,
          defaultLocale: mockRestaurant.defaultLocale,
          isActive: mockRestaurant.isActive,
          createdAt: mockRestaurant.createdAt,
          categoryCount: 4,
          productCount: 8,
          viewCount: 120,
        },
      ]);
    });
  });

  describe('SuperAdminService.getRestaurantViews', () => {
    it('should throw NotFoundException if restaurant does not exist', async () => {
      prismaService.restaurant.findUnique.mockResolvedValue(null);

      await expect(
        superAdminService.getRestaurantViews('nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return total views and 30-day breakdown', async () => {
      prismaService.restaurant.findUnique.mockResolvedValue(mockRestaurant);
      prismaService.pageView.count.mockResolvedValue(42);

      const now = new Date();
      const mockPageViews = [
        { timestamp: now },
        { timestamp: now },
        { timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
      ];
      prismaService.pageView.findMany.mockResolvedValue(mockPageViews);

      const result = await superAdminService.getRestaurantViews('test-burger');

      expect(result.slug).toBe('test-burger');
      expect(result.totalViews).toBe(42);
      expect(result.dailyViews).toBeDefined();
      expect(result.dailyViews.length).toBe(30);

      const todayStr = now.toISOString().split('T')[0];
      const todayEntry = result.dailyViews.find((d: any) => d.date === todayStr);
      expect(todayEntry?.count).toBe(2);
    });
  });

  describe('SuperAdminController', () => {
    it('should route login to service', async () => {
      const loginSpy = jest.spyOn(superAdminService, 'login').mockResolvedValue({
        accessToken: 'token',
        user: { id: '1', email: 'test@admin.com', role: 'SUPER_ADMIN' },
      });

      const res = await superAdminController.login({
        email: 'test@admin.com',
        password: 'password',
      });
      expect(res).toEqual({
        accessToken: 'token',
        user: { id: '1', email: 'test@admin.com', role: 'SUPER_ADMIN' },
      });
      expect(loginSpy).toHaveBeenCalledWith({
        email: 'test@admin.com',
        password: 'password',
      });
    });

    it('should route createRestaurant to service', async () => {
      const createDto = {
        name: { tr: 'Test' },
        slug: 'test',
        adminEmail: 'test@test.com',
        adminPassword: 'password123',
      };
      const createSpy = jest
        .spyOn(superAdminService, 'createRestaurant')
        .mockResolvedValue({ restaurant: {} as any, adminUser: {} as any });

      await superAdminController.createRestaurant(createDto);
      expect(createSpy).toHaveBeenCalledWith(createDto);
    });

    it('should route deleteRestaurant to service', async () => {
      const deleteSpy = jest
        .spyOn(superAdminService, 'deleteRestaurant')
        .mockResolvedValue({ success: true, message: 'Deleted' });

      const res = await superAdminController.deleteRestaurant('test');
      expect(res).toEqual({ success: true, message: 'Deleted' });
      expect(deleteSpy).toHaveBeenCalledWith('test');
    });

    it('should route findAllRestaurants to service', async () => {
      const findAllSpy = jest
        .spyOn(superAdminService, 'findAllRestaurants')
        .mockResolvedValue([]);

      const res = await superAdminController.findAllRestaurants();
      expect(res).toEqual([]);
      expect(findAllSpy).toHaveBeenCalled();
    });

    it('should route getRestaurantViews to service', async () => {
      const viewsSpy = jest
        .spyOn(superAdminService, 'getRestaurantViews')
        .mockResolvedValue({ slug: 'test', totalViews: 0, dailyViews: [] });

      const res = await superAdminController.getRestaurantViews('test');
      expect(res).toEqual({ slug: 'test', totalViews: 0, dailyViews: [] });
      expect(viewsSpy).toHaveBeenCalledWith('test');
    });
  });
});
