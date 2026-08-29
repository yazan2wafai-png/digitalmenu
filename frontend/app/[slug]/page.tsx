'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { fetchRestaurant } from '@/lib/api';
import { setActiveTableId } from '@/lib/cart';
import type { Restaurant } from '@/types/menu';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CategoryBar } from '@/components/CategoryBar';
import { CategoryGrid } from '@/components/CategoryGrid';
import { SplashScreen } from '@/components/SplashScreen';
import { motion, AnimatePresence } from 'framer-motion';
import MenuTracker from '@/components/MenuTracker';
import { TableBanner } from '@/components/TableBanner';
import { CartFab } from '@/components/CartFab';

const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'tr';

export default function HomePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || '';
  // Resolved synchronously (no sessionStorage race): either the /t/[tableId]
  // route param, or a ?tableId= query override. This is the only source of
  // table context ordering may use - the plain /[slug] link has neither and
  // stays browse-only by design.
  const tableId = (params?.tableId as string | undefined) || searchParams.get('tableId') || undefined;

  useEffect(() => {
    if (tableId) setActiveTableId(tableId);
  }, [tableId]);

  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSplash, setShowSplash] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');

  const load = useCallback(async (loc: string) => {
    if (!slug) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await fetchRestaurant(slug, loc);
      setRestaurant(data);
      if (loc === DEFAULT_LOCALE && data.defaultLocale && data.defaultLocale !== loc) {
        setLocale(data.defaultLocale);
      }
      // Functional form on purpose: reading activeCategoryId directly here
      // would put it in this callback's deps, and since the scroll-spy
      // effect below updates activeCategoryId on every scroll tick, that
      // recreated `load` on every scroll too - which re-ran the effect
      // that calls load() and flashed the full-page loading spinner while
      // just scrolling. Keeping `load` stable (only depends on slug) fixes it.
      if (data.categories?.length > 0) {
        setActiveCategoryId((prev) => prev || data.categories[0].id);
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

  const scrollToCategory = (id: string) => {
    setActiveCategoryId(id);
    const element = document.getElementById(`category-${id}`);
    if (element) {
      const yOffset = -140; 
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Setup scroll spy. Reads/writes activeCategoryId through a ref instead
  // of the effect's own deps - keeping activeCategoryId out of this effect's
  // dependency array means the scroll listener is attached once per
  // restaurant load instead of being torn down and re-attached on every
  // single scroll tick that crosses a category boundary (which was also
  // jank-prone and part of the "scrolling looks bad" complaint).
  const activeCategoryIdRef = useRef(activeCategoryId);
  useEffect(() => {
    activeCategoryIdRef.current = activeCategoryId;
  }, [activeCategoryId]);

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

      if (currentActiveId && currentActiveId !== activeCategoryIdRef.current) {
        setActiveCategoryId(currentActiveId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [restaurant]);

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

  const theme = restaurant.themeColor || '#C0392B';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="bg-neutral-950 min-h-screen relative">
      {/* Subtle persistent brand-color wash so each tenant's menu feels distinct
          while scrolling, not just in the hero */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${theme}14 0%, transparent 60%)`,
        }}
      />
      <div className="relative z-10">
      <MenuTracker slug={slug} tableId={tableId} />
      
      {/* Sticky Header */}
      <Header
        restaurant={restaurant}
        locale={locale}
        onLocaleChange={handleLocaleChange}
        isRTL={isRTL}
      />

      <TableBanner slug={slug} tableId={tableId} themeColor={restaurant.themeColor} />

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

      <CartFab
        slug={slug}
        themeColor={theme}
        isRTL={isRTL}
        tableId={tableId}
        enabled={(restaurant.featureFlags?.enableOrdering ?? true) && !!tableId}
        estimatedPrepMinutes={restaurant.settings?.estimatedPrepMinutes}
      />
      </div>
    </div>
  );
}
