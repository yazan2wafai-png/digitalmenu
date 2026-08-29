'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, ChevronRight } from 'lucide-react';
import type { LiveDemoItem } from '@/app/page';
import type { Locale } from '@/lib/translations';

interface MenuProduct {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  photoUrl?: string | null;
}

interface MenuCategory {
  id: string;
  name: string;
  photoUrl?: string | null;
  products: MenuProduct[];
}

interface RestaurantMenuResponse {
  name: string;
  themeColor?: string | null;
  logoUrl?: string | null;
  categories: MenuCategory[];
}

interface LivePreviewStrings {
  loading: string;
  error: string;
  empty: string;
  viewFullMenu: string;
  close: string;
  scrollHint: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://digitalmenu-backend-production.up.railway.app';

function formatPrice(price: number | string) {
  const n = typeof price === 'string' ? parseFloat(price) : price;
  if (Number.isNaN(n)) return String(price);
  return `${n.toLocaleString('tr-TR')} TL`;
}

export function RestaurantShowcase({
  demos,
  locale,
  t,
  heading,
  subheading,
}: {
  demos: LiveDemoItem[];
  locale: Locale;
  t: LivePreviewStrings;
  heading: string;
  subheading: string;
}) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [menu, setMenu] = useState<RestaurantMenuResponse | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  useEffect(() => {
    if (!activeSlug) return;
    let cancelled = false;
    setStatus('loading');
    setMenu(null);
    setActiveCategoryId(null);

    fetch(`${API_URL}/restaurants/${activeSlug}?locale=${locale}`)
      .then((res) => {
        if (!res.ok) throw new Error('request failed');
        return res.json();
      })
      .then((data: RestaurantMenuResponse) => {
        if (cancelled) return;
        setMenu(data);
        setActiveCategoryId(data.categories?.[0]?.id ?? null);
        setStatus('idle');
      })
      .catch(() => {
        if (cancelled) return;
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [activeSlug, locale]);

  const toggle = (slug: string) => {
    setActiveSlug((cur) => (cur === slug ? null : slug));
  };

  const activeCategory = menu?.categories?.find((cat) => cat.id === activeCategoryId) ?? null;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl sm:text-3xl font-black text-ink">{heading}</h3>
        <p className="text-xs sm:text-sm text-ink/60">{subheading}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {demos.map((demo) => {
          const isActive = activeSlug === demo.slug;

          return (
            <motion.article
              layout
              key={demo.slug}
              transition={{ layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
              className={`bg-white/70 border rounded-3xl overflow-hidden shadow-xl shadow-ink/5 backdrop-blur-xl transition-colors ${
                isActive
                  ? 'border-terracotta ring-2 ring-terracotta/30 md:col-span-3'
                  : 'border-ink/10 hover:border-terracotta/40'
              }`}
            >
              {/* Collapsed header - click toggles inline preview; corner icon links straight to the live menu */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggle(demo.slug)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') toggle(demo.slug);
                }}
                className="w-full text-left cursor-pointer group"
              >
                <div className={`relative w-full overflow-hidden ${isActive ? 'h-40' : 'h-56'}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={demo.image}
                    alt={demo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md ${demo.badgeColor}`}
                    >
                      {demo.tag}
                    </span>
                  </div>

                  <a
                    href={demo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title={demo.buttonText}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-ink/70 border border-cream/30 backdrop-blur-md flex items-center justify-center text-cream transition-all hover:bg-terracotta cursor-pointer"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <h4 className="text-xl font-black text-cream">{demo.name}</h4>
                  </div>
                </div>

                {!isActive && (
                  <div className="p-6 space-y-3">
                    <p className="text-xs sm:text-sm text-ink/60 leading-relaxed">{demo.description}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {demo.highlights.map((badge, bIdx) => (
                        <span
                          key={bIdx}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-ink/5 border border-ink/10 text-ink/70"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Expanded inline live menu preview */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 sm:p-6 space-y-4">
                      {status === 'loading' && (
                        <div className="py-10 text-center text-sm text-ink/50">{t.loading}</div>
                      )}
                      {status === 'error' && (
                        <div className="py-10 text-center text-sm text-ink/50">{t.error}</div>
                      )}
                      {status === 'idle' && menu && menu.categories?.length === 0 && (
                        <div className="py-10 text-center text-sm text-ink/50">{t.empty}</div>
                      )}

                      {status === 'idle' && menu && menu.categories?.length > 0 && (
                        <>
                          {/* Category chips - horizontal scroll */}
                          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
                            {menu.categories.map((cat) => (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => setActiveCategoryId(cat.id)}
                                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                                  activeCategoryId === cat.id
                                    ? 'bg-ink text-cream'
                                    : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
                                }`}
                              >
                                {cat.name}
                              </button>
                            ))}
                          </div>

                          {/* Products - horizontal scroll */}
                          <div className="flex items-center gap-1 text-[11px] text-ink/70 font-semibold">
                            <span>{t.scrollHint}</span>
                            <ChevronRight className="w-3 h-3" />
                          </div>
                          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-none">
                            {activeCategory?.products.map((prod) => (
                              <div
                                key={prod.id}
                                className="shrink-0 w-40 snap-start rounded-2xl bg-cream border border-ink/10 overflow-hidden"
                              >
                                <div className="w-full h-24 bg-beige/60 overflow-hidden">
                                  {prod.photoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={prod.photoUrl}
                                      alt={prod.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : null}
                                </div>
                                <div className="p-3 space-y-1">
                                  <div className="text-xs font-bold text-ink leading-snug line-clamp-2">
                                    {prod.name}
                                  </div>
                                  <div className="text-xs font-black text-terracotta">
                                    {formatPrice(prod.price)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      <div className="flex items-center justify-between gap-3 pt-2 border-t border-ink/10">
                        <button
                          type="button"
                          onClick={() => toggle(demo.slug)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-ink/50 hover:text-ink transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{t.close}</span>
                        </button>
                        <a
                          href={demo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-light text-cream font-black text-xs transition-all shadow-md shadow-terracotta/20 cursor-pointer"
                        >
                          <span>{t.viewFullMenu}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
