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
    const res = await fetch(`https://digitalmenu-backend-production.up.railway.app/restaurants/${slug}?locale=en`);
    if (!res.ok) {
      return { title: 'Restaurant Not Found - Digital Menu' };
    }
    const restaurant = await res.json();
    return {
      title: `${restaurant.name} | Digital Menu`,
      description: restaurant.description || `Digital menu for ${restaurant.name}`,
      openGraph: {
        title: `${restaurant.name} | Digital Menu`,
        description: restaurant.description || `Digital menu for ${restaurant.name}`,
        images: restaurant.logo ? [restaurant.logo] : [],
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

export default async function Layout({ params, children }: Props) {
  const { slug } = await params;
  
  let restaurant = null;
  try {
    const res = await fetch(`https://digitalmenu-backend-production.up.railway.app/restaurants/${slug}?locale=en`);
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
        "image": restaurant.logo,
        "url": `https://digitalmenu-backend-production.up.railway.app/restaurants/${slug}`,
        "menu": `https://digitalmenu-backend-production.up.railway.app/restaurants/${slug}`
      },
      {
        "@type": "Menu",
        "hasMenuSection": restaurant.categories?.map((c: any) => ({
          "@type": "MenuSection",
          "name": c.name?.en || c.name?.tr || c.name,
          "hasMenuItem": c.products?.map((p: any) => ({
            "@type": "MenuItem",
            "name": p.name?.en || p.name?.tr || p.name,
            "description": p.description?.en || p.description?.tr || p.description,
            "offers": {
              "@type": "Offer",
              "price": p.price,
              "priceCurrency": restaurant.currency || "TRY"
            }
          }))
        }))
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
