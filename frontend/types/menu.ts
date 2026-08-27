export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  photoUrl: string | null;
  sortOrder: number;
  categoryId?: string;
}

export interface Category {
  id: string;
  name: string;
  photoUrl: string | null;
  sortOrder: number;
  restaurantId?: string;
  products: Product[];
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  themeColor: string;
  logoUrl: string | null;
  defaultLocale: string;
  supportedLocales: string[];
  locale: string;
  categories: Category[];
  currency?: string;
  description?: string | null;
  logo?: string | null;
}
