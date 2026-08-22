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
