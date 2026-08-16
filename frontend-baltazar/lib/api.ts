import type { Restaurant } from '@/types/menu';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SLUG = process.env.NEXT_PUBLIC_RESTAURANT_SLUG || '';

if (!SLUG) {
  console.warn('[api] NEXT_PUBLIC_RESTAURANT_SLUG is not set.');
}

export async function fetchRestaurant(locale: string): Promise<Restaurant> {
  const res = await fetch(
    `${API_URL}/restaurants/${SLUG}?locale=${encodeURIComponent(locale)}`,
    {
      cache: 'no-store',
      headers: {
        'bypass-tunnel-reminder': 'true',
      },
    },
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch restaurant "${SLUG}" (${res.status})`);
  }
  return res.json() as Promise<Restaurant>;
}
