/**
 * Shape of a "live venue demo" entry.
 *
 * This type used to be exported from app/page.tsx. The landing page was
 * rewritten and no longer exports it, so it lives here instead - both
 * RestaurantShowcase and StickerSection still consume it.
 */
export interface LiveDemoItem {
  slug: string;
  name: string;
  description: string;
  image: string;
  url: string;
  tag: string;
  badgeColor: string;
  buttonText: string;
  highlights: string[];
}