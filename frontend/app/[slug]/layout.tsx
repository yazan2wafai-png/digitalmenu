import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

type Props = {
  params: Promise<{ slug: string }>;
  children: ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://digitalmenu-backend-production.up.railway.app';
    const res = await fetch(`${apiUrl}/restaurants/${slug}?locale=en`);
    if (!res.ok) {
      return { title: 'Restaurant Not Found - Digital Menu' };
    }
    const restaurant = await res.json();
    // A tenant admin can override these from Settings & SEO; fall back to
    // sensible defaults built from the restaurant's own name when unset.
    const seoSettings = restaurant.settings ?? {};
    const title = seoSettings.metaTitle || `${restaurant.name} | Digital Menu`;
    const description =
      seoSettings.metaDescription || restaurant.description || `Digital menu for ${restaurant.name}`;
    const keywords: string[] | undefined = seoSettings.keywords
      ? seoSettings.keywords.split(',').map((k: string) => k.trim()).filter(Boolean)
      : undefined;
    return {
      title,
      description,
      keywords,
      icons: restaurant.logoUrl ? { icon: restaurant.logoUrl, shortcut: restaurant.logoUrl, apple: restaurant.logoUrl } : undefined,
      openGraph: {
        title,
        description,
        images: restaurant.logoUrl ? [restaurant.logoUrl] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
      }
    };
  } catch (error) {
    return { title: 'Digital Menu' };
  }
}

interface SchemaProduct {
  id?: string;
  name?: string | Record<string, string>;
  description?: string | Record<string, string> | null;
  price?: string;
}

interface SchemaCategory {
  id?: string;
  name?: string | Record<string, string>;
  products?: SchemaProduct[];
}

function getLocalizedText(val?: string | Record<string, string> | null): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return val.en ?? val.tr ?? Object.values(val)[0] ?? '';
}

export default async function Layout({ params, children }: Props) {
  const { slug } = await params;
  
  let restaurant = null;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://digitalmenu-backend-production.up.railway.app';
    const res = await fetch(`${apiUrl}/restaurants/${slug}?locale=en`);
    if (res.ok) {
      restaurant = await res.json();
    }
  } catch (e) {
    console.error(e);
  }

  if (!restaurant) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Restaurant",
        "name": restaurant.name,
        "image": restaurant.logo ?? restaurant.logoUrl ?? undefined,
        "url": `https://digitalmenu-backend-production.up.railway.app/restaurants/${slug}`,
        "menu": `https://digitalmenu-backend-production.up.railway.app/restaurants/${slug}`
      },
      {
        "@type": "Menu",
        "hasMenuSection": restaurant.categories?.map((c: SchemaCategory) => ({
          "@type": "MenuSection",
          "name": getLocalizedText(c.name),
          "hasMenuItem": c.products?.map((p: SchemaProduct) => ({
            "@type": "MenuItem",
            "name": getLocalizedText(p.name),
            "description": getLocalizedText(p.description),
            "offers": {
              "@type": "Offer",
              "price": p.price ?? '0',
              "priceCurrency": restaurant.currency ?? "TRY"
            }
          })) ?? []
        })) ?? []
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
