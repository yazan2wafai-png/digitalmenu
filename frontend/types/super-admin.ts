import type { MultilingualText } from './admin';

export interface RestaurantPermissions {
  canViewOrders: boolean;
  canTrackTables: boolean;
  canManageMenu: boolean;
  canManageStaff: boolean;
}

export interface TenantRestaurantItem {
  id: string;
  slug: string;
  name: MultilingualText;
  themeColor: string;
  supportedLocales: string[];
  defaultLocale: string;
  isActive: boolean;
  createdAt: string;
  categoryCount: number;
  productCount: number;
  viewCount: number;
  permissions?: RestaurantPermissions;
}

export interface SuperAdminDailyView {
  date: string;
  count: number;
}

export interface SuperAdminAnalyticsResponse {
  slug: string;
  totalViews: number;
  dailyViews: SuperAdminDailyView[];
}

