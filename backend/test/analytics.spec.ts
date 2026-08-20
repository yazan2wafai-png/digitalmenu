import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from '../src/analytics/analytics.service';
import { AnalyticsController } from '../src/analytics/analytics.controller';
import { PrismaService } from '../src/prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';

describe('Analytics Tests', () => {
  let analyticsService: AnalyticsService;
  let analyticsController: AnalyticsController;
  let prismaService: any;

  const mockRestaurant = {
    id: 'rest-uuid-baltazar',
    slug: 'baltazar',
    name: 'Baltazar Burger',
    isActive: true,
  };

  beforeEach(async () => {
    const mockPrisma = {
      restaurant: {
        findUnique: jest.fn(),
      },
      menuView: {
        create: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        AnalyticsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    analyticsService = module.get<AnalyticsService>(AnalyticsService);
    analyticsController = module.get<AnalyticsController>(AnalyticsController);
    prismaService = module.get(PrismaService);
  });

  describe('AnalyticsService.recordView', () => {
    it('should create MenuView with correct restaurantId, hashed IP, and user agent', async () => {
      prismaService.restaurant.findUnique.mockResolvedValue(mockRestaurant);
      prismaService.menuView.create.mockResolvedValue({ id: 'view-uuid-1' });

      const rawIp = '198.51.100.42';
      const expectedIpHash = crypto
        .createHash('sha256')
        .update(rawIp)
        .digest('hex')
        .substring(0, 16);
      const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)';

      const result = await analyticsService.recordView('baltazar', rawIp, userAgent);

      expect(result).toEqual({ recorded: true });
      expect(prismaService.restaurant.findUnique).toHaveBeenCalledWith({
        where: { slug: 'baltazar', isActive: true },
      });
      expect(prismaService.menuView.create).toHaveBeenCalledWith({
        data: {
          restaurantId: mockRestaurant.id,
          ipHash: expectedIpHash,
          userAgent,
          recordedAt: expect.any(Date),
        },
      });
    });

    it('should fallback to 0.0.0.0 and Unknown user-agent if missing', async () => {
      prismaService.restaurant.findUnique.mockResolvedValue(mockRestaurant);
      prismaService.menuView.create.mockResolvedValue({ id: 'view-uuid-2' });

      const fallbackHash = crypto
        .createHash('sha256')
        .update('0.0.0.0')
        .digest('hex')
        .substring(0, 16);

      const result = await analyticsService.recordView('baltazar', '', '');

      expect(result).toEqual({ recorded: true });
      expect(prismaService.menuView.create).toHaveBeenCalledWith({
        data: {
          restaurantId: mockRestaurant.id,
          ipHash: fallbackHash,
          userAgent: 'Unknown',
          recordedAt: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException when restaurant slug does not exist or is inactive', async () => {
      prismaService.restaurant.findUnique.mockResolvedValue(null);

      await expect(
        analyticsService.recordView('unknown-slug', '1.2.3.4', 'curl/7.68.0'),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.menuView.create).not.toHaveBeenCalled();
    });
  });

  describe('AnalyticsService.getStats', () => {
    it('should return aggregated counts for total, today, last 7 days, and last 30 days', async () => {
      // Mock count calls sequentially: total, today, last 7 days, last 30 days
      prismaService.menuView.count
        .mockResolvedValueOnce(540) // totalViews
        .mockResolvedValueOnce(42)  // todayViews
        .mockResolvedValueOnce(180) // last7DaysViews
        .mockResolvedValueOnce(450); // last30DaysViews

      const stats = await analyticsService.getStats(mockRestaurant.id);

      expect(stats).toEqual({
        totalViews: 540,
        todayViews: 42,
        last7DaysViews: 180,
        last30DaysViews: 450,
      });

      expect(prismaService.menuView.count).toHaveBeenCalledTimes(4);
      expect(prismaService.menuView.count).toHaveBeenNthCalledWith(1, {
        where: { restaurantId: mockRestaurant.id },
      });
      expect(prismaService.menuView.count).toHaveBeenNthCalledWith(2, {
        where: {
          restaurantId: mockRestaurant.id,
          recordedAt: { gte: expect.any(Date) },
        },
      });
      expect(prismaService.menuView.count).toHaveBeenNthCalledWith(3, {
        where: {
          restaurantId: mockRestaurant.id,
          recordedAt: { gte: expect.any(Date) },
        },
      });
      expect(prismaService.menuView.count).toHaveBeenNthCalledWith(4, {
        where: {
          restaurantId: mockRestaurant.id,
          recordedAt: { gte: expect.any(Date) },
        },
      });
    });
  });

  describe('AnalyticsController', () => {
    it('should record view correctly parsing x-forwarded-for IP header', async () => {
      const recordViewSpy = jest
        .spyOn(analyticsService, 'recordView')
        .mockResolvedValue({ recorded: true });

      const mockReq = { ip: '127.0.0.1' } as any;
      const res = await analyticsController.recordView(
        'baltazar',
        mockReq,
        'Mozilla/5.0',
        '203.0.113.195, 70.41.3.18',
      );

      expect(res).toEqual({ recorded: true });
      expect(recordViewSpy).toHaveBeenCalledWith(
        'baltazar',
        '203.0.113.195',
        'Mozilla/5.0',
      );
    });

    it('should allow admin to retrieve stats for their own restaurant slug', async () => {
      const expectedStats = {
        totalViews: 120,
        todayViews: 10,
        last7DaysViews: 50,
        last30DaysViews: 100,
      };
      jest.spyOn(analyticsService, 'getStats').mockResolvedValue(expectedStats);

      const mockReq = {
        user: {
          restaurantSlug: 'baltazar',
          restaurantId: 'rest-uuid-baltazar',
        },
      };

      const result = await analyticsController.getStats('baltazar', mockReq);
      expect(result).toEqual(expectedStats);
    });

    it('should throw ForbiddenException when admin tries to get stats for a different restaurant slug', async () => {
      const mockReq = {
        user: {
          restaurantSlug: 'baltazar',
          restaurantId: 'rest-uuid-baltazar',
        },
      };

      await expect(
        analyticsController.getStats('other-restaurant', mockReq),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
