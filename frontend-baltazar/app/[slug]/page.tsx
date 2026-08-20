'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { fetchRestaurant } from '@/lib/api';
import type { Restaurant } from '@/types/menu';
import { Hero } from '@/components/Hero';
import { CategoryGrid } from '@/components/CategoryGrid';
import { SplashScreen } from '@/components/SplashScreen';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'tr';

export default function HomePage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'baltazar';

  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Splash is shown until the user swipes/clicks it away
  const [showSplash, setShowSplash] = useState(true);

  const load = useCallback(async (loc: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchRestaurant(slug, loc);
      setRestaurant(data);
      if (loc === DEFAULT_LOCALE && data.defaultLocale && data.defaultLocale !== loc) {
        setLocale(data.defaultLocale);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { load(locale); }, [locale, load]);

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
  };

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
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Locale-switch loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
          />
        </div>
      )}

      {/* ── Splash screen — sits above everything, dismissed by swipe or click ── */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            restaurant={restaurant}
            onDismiss={() => setShowSplash(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Hero rises into view as splash leaves ── */}
      <motion.div
        initial={{ y: 60, opacity: 0, filter: 'blur(12px)' }}
        animate={
          showSplash
            ? { y: 60, opacity: 0, filter: 'blur(12px)' }
            : { y: 0, opacity: 1, filter: 'blur(0px)' }
        }
        transition={{ type: 'spring', damping: 26, stiffness: 180, delay: 0.1 }}
      >
        <Hero
          restaurant={restaurant}
          locale={locale}
          onLocaleChange={handleLocaleChange}
          isRTL={isRTL}
        />

        <CategoryGrid
          categories={restaurant.categories}
          themeColor={restaurant.themeColor}
          locale={locale}
        />
      </motion.div>
    </div>
  );
}
