'use client';

import { useScroll } from 'framer-motion';
import { Restaurant } from '@/types/menu';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useEffect, useState } from 'react';
import { LogoPlaceholder } from './LogoPlaceholder';

interface HeaderProps {
  restaurant: Restaurant;
  locale: string;
  onLocaleChange: (locale: string) => void;
  isRTL: boolean;
}

export function Header({ restaurant, locale, onLocaleChange, isRTL }: HeaderProps) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => {
      setIsScrolled(v > 50);
    });
    return () => unsub();
  }, [scrollY]);

  return (
    <header
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-950/85 backdrop-blur-md border-b border-white/10 py-3 shadow-lg'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoPlaceholder
            restaurant={restaurant}
            size="md"
            className="transition-transform duration-200 hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
              {restaurant.name}
            </span>
            <span className="text-[10px] sm:text-xs text-white/50 uppercase tracking-widest font-medium">
              {restaurant.slug}
            </span>
          </div>
        </div>

        <LanguageSwitcher
          locales={restaurant.supportedLocales}
          current={locale}
          onChange={onLocaleChange}
        />
      </div>
    </header>
  );
}
