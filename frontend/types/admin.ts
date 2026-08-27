export type MultilingualText = Record<string, string>;

export interface AdminProduct {
  id: string;
  name: MultilingualText;
  description: MultilingualText | null;
  price: string;
  photoUrl: string | null;
  sortOrder: number;
  categoryId: string;
}

export interface AdminCategory {
  id: string;
  name: MultilingualText;
  sortOrder: number;
  restaurantId: string;
  products: AdminProduct[];
}

export interface LocationItem {
  id: string;
  name: string;
  address?: string;
}

export interface TableItem {
  id: string;
  name: string;
  locationId: string;
}

export interface RestaurantSettings {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  currency?: string;
  timezone?: string;
  enableOrdering?: boolean;
  enableTables?: boolean;
  enableAnalytics?: boolean;
  enableMultiLanguage?: boolean;
  enableReviews?: boolean;
  enableServiceCall?: boolean;
}

export interface DailyBreakdown {
  date: string;
  views: number;
}

export interface RestaurantPermissions {
  canViewOrders: boolean;
  canTrackTables: boolean;
  canManageMenu: boolean;
  canManageStaff: boolean;
  canViewAnalytics: boolean;
}

export interface AnalyticsData {
  totalViews: number;
  todayViews: number;
  last7DaysViews: number;
  last30DaysViews: number;
  dailyBreakdown: DailyBreakdown[];
}

