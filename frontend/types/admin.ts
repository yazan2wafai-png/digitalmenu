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
  photoUrl?: string | null;
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

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface AdminOrderItem {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  notes: string | null;
}

export interface AdminOrder {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  notes: string | null;
  tableId: string | null;
  tableName: string | null;
  createdAt: string;
  updatedAt: string;
  items: AdminOrderItem[];
}
