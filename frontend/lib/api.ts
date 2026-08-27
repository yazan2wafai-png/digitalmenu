import type { Restaurant } from '@/types/menu';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digitalmenu-backend-production.up.railway.app';

export async function fetchRestaurant(slug: string, locale: string): Promise<Restaurant> {
  const primaryUrl = `${API_URL}/restaurants/${slug}?locale=${encodeURIComponent(locale)}`;
  
  let res = await fetch(primaryUrl, {
    cache: 'no-store',
    headers: { 'bypass-tunnel-reminder': 'true' },
  });

  if (!res.ok && res.status === 404) {
    // Fallback URL
    const fallbackUrl = `${API_URL}/api/menu/public/${slug}?locale=${encodeURIComponent(locale)}`;
    res = await fetch(fallbackUrl, {
      cache: 'no-store',
      headers: { 'bypass-tunnel-reminder': 'true' },
    });
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch restaurant "${slug}" (${res.status})`);
  }

  return res.json() as Promise<Restaurant>;
}

export async function recordPageView(restaurantSlug: string, tableId?: string): Promise<void> {
  try {
    await fetch(`${API_URL}/analytics/pageview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurantSlug, tableId }),
      keepalive: true,
    });
  } catch (error) {
    console.warn('Failed to record page view:', error);
  }
}


export interface CreateOrderItemPayload {
  productId: string;
  quantity: number;
  notes?: string;
}

export interface CreateOrderPayload {
  tableId?: string;
  notes?: string;
  items: CreateOrderItemPayload[];
}

export interface OrderItemResponse {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  notes: string | null;
}

export interface OrderResponse {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  notes: string | null;
  tableId: string | null;
  tableName: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemResponse[];
}

export async function createOrder(slug: string, payload: CreateOrderPayload): Promise<OrderResponse> {
  const res = await fetch(`${API_URL}/restaurants/${encodeURIComponent(slug)}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Failed to place order (${res.status})`);
  }

  return res.json() as Promise<OrderResponse>;
}
