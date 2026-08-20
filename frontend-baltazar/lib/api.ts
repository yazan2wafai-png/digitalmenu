import type { Restaurant } from '@/types/menu';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digitalmenu-backend-production.up.railway.app';

export async function fetchRestaurant(slug: string, locale: string): Promise<Restaurant> {
  const res = await fetch(
    `${API_URL}/restaurants/${slug}?locale=${encodeURIComponent(locale)}`,
    {
      cache: 'no-store',
      headers: {
        'bypass-tunnel-reminder': 'true',
      },
    },
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch restaurant "${slug}" (${res.status})`);
  }
  return res.json() as Promise<Restaurant>;
}
