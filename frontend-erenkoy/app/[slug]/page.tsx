'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { fetchRestaurant } from '@/lib/api';
import type { Restaurant } from '@/types/menu';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CategoryBar } from '@/components/CategoryBar';
import { CategoryGrid } from '@/components/CategoryGrid';
import { SplashScreen } from '@/components/SplashScreen';
import { motion, AnimatePresence } from 'framer-motion';
import MenuTracker from '@/components/MenuTracker';
import { TableBanner } from '@/components/TableBanner';

const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'tr';

export default function HomePage() {
  const params = useParams();
  const slug = (params?.slug as string) || process.env.NEXT_PUBLIC_RESTAURANT_SLUG || 'kahve-erenkoy';
  const tableId = params?.tableId as string | undefined;

  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSplash, setShowSplash] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');

  const load = useCallback(async (loc: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchRestaurant(slug, loc);
      setRestaurant(data);
      if (loc === DEFAULT_LOCALE && data.defaultLocale && data.defaultLocale !== loc) {
        setLocale(data.defaultLocale);
      }
      if (data.categories?.length > 0 && !activeCategoryId) {
        setActiveCategoryId(data.categories[0].id);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  }, [slug, activeCategoryId]);

  useEffect(() => { load(locale); }, [locale, load]);

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
  };

  const scrollToCategory = (id: string) => {
    setActiveCategoryId(id);
    const element = document.getElementById(`category-${id}`);
    if (element) {
      const yOffset = -140; 
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Setup scroll spy
  useEffect(() => {
    if (!restaurant) return;
    const handleScroll = () => {
      const categoryElements = restaurant.categories.map(c => document.getElementById(`category-${c.id}`));
      let currentActiveId = '';
      let minDistance = Infinity;

      categoryElements.forEach(el => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top - 150); // Target scroll distance from top
        if (distance < minDistance && rect.top < window.innerHeight / 2) {
          minDistance = distance;
          currentActiveId = el.id.replace('category-', '');
        }
      });

      if (currentActiveId && currentActiveId !== activeCategoryId) {
        setActiveCategoryId(currentActiveId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [restaurant, activeCategoryId]);

  const isRTL = locale === 'ar';

  if (loading && !restaurant) {
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white/50 text-sm p-8 text-center">
        <div>
          <p className="text-2xl mb-3">⚠️</p>
          <p>{error}</p>
          <p className="text-xs mt-2 text-white/30">Is the backend running on port 3001?</p>
        </div>
      </div>
    );
  }

  if (!restaurant) return null;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="bg-neutral-950 min-h-screen">
      <MenuTracker slug={slug} tableId={tableId} />
      
      {/* Sticky Header */}
      <Header
        restaurant={restaurant}
        locale={locale}
        onLocaleChange={handleLocaleChange}
        isRTL={isRTL}
      />

      {loading && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
          />
        </div>
      )}

      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            restaurant={restaurant}
            onDismiss={() => setShowSplash(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 60, opacity: 0, filter: 'blur(12px)' }}
        animate={
          showSplash
            ? { y: 60, opacity: 0, filter: 'blur(12px)' }
            : { y: 0, opacity: 1, filter: 'blur(0px)' }
        }
        transition={{ type: 'spring', damping: 26, stiffness: 180, delay: 0.1 }}
      >
        <Hero restaurant={restaurant} isRTL={isRTL} />

        <CategoryBar 
          categories={restaurant.categories} 
          activeCategoryId={activeCategoryId} 
          themeColor={restaurant.themeColor || '#C0392B'}
          onSelectCategory={scrollToCategory} 
        />

        <CategoryGrid
          categories={restaurant.categories}
          themeColor={restaurant.themeColor}
          locale={locale}
        />
      </motion.div>

      <footer className="py-8 px-4 text-center border-t border-white/5">
        <p className="text-[11px] text-white/30 font-medium tracking-wide">
          ⚡ Powered by{' '}
          <a
            href="https://nfcmyplace.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 font-semibold"
          >
            NFCMyPlace
          </a>
        </p>
      </footer>
    </div>
  );
}
