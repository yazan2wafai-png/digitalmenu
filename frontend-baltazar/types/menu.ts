export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  photoUrl: string | null;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  photoUrl: string | null;
  sortOrder: number;
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
}
