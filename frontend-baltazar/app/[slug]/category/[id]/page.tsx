'use client';
import { useState, useEffect, use } from 'react';
import { fetchRestaurant } from '@/lib/api';
import type { Restaurant, Category, Product } from '@/types/menu';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ProductDetailModal } from '@/components/ProductDetailModal';

const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'tr';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digitalmenu-backend-production.up.railway.app';

import { ProductCard } from '@/components/ProductCard';

export default function CategoryPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = use(params);
  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') || DEFAULT_LOCALE;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchRestaurant(slug, locale);
        setRestaurant(data);
        const cat = data.categories.find((c) => c.id === id) ?? null;
        setCategory(cat);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, id, locale]);

  const isRTL = locale === 'ar';
  const themeColor = restaurant?.themeColor || '#C0392B';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <motion.div
          className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
        />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white/50 text-sm">
        <div className="text-center">
          <p>{error || 'Category not found'}</p>
          <Link href={`/?locale=${locale}`} className="mt-4 inline-block text-xs underline">
            ← Back to menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-neutral-950 text-white">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-neutral-950/80 border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/?locale=${locale}`}
            className="text-white/60 hover:text-white transition-colors text-sm font-medium flex items-center gap-1.5"
          >
            <span>{isRTL ? '→' : '←'}</span>
            <span>{restaurant?.name}</span>
          </Link>
          <span className="text-white/20">/</span>
          <span className="font-bold text-white text-sm">{category.name}</span>
        </div>
      </header>

      {/* Main product grid */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <motion.h1
            className="text-3xl sm:text-4xl font-black text-white tracking-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {category.name}
            <span className="text-white/30 text-base font-normal ms-3">
              ({category.products.length} item{category.products.length !== 1 ? 's' : ''})
            </span>
          </motion.h1>
        </div>

        {category.products.length === 0 ? (
          <p className="text-white/40 text-sm">No products in this category yet.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
            initial="hidden"
            animate="visible"
          >
            {category.products.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                themeColor={themeColor}
                onSelect={(p) => setSelectedProduct(p)}
                categoryName={category.name}
              />
            ))}
          </motion.div>
        )}
      </main>

      {/* Zoom-in shared-element detail view modal */}
      <ProductDetailModal
        product={selectedProduct}
        themeColor={themeColor}
        isRTL={isRTL}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

