'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Restaurant } from '@/types/menu';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useEffect, useState } from 'react';

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
    const unsub = scrollY.onChange((v) => {
      setIsScrolled(v > 50);
    });
    return unsub;
  }, [scrollY]);

  const theme = restaurant.themeColor || '#C0392B';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-neutral-950/85 backdrop-blur-md border-b border-white/10 py-3 shadow-lg' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {restaurant.logoUrl && (
            <motion.div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-lg relative"
              style={{ boxShadow: `0 0 15px ${theme}40` }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute inset-0 ring-2 rounded-full z-10" style={{ borderColor: `${theme}80` }} />
              <img 
                src={restaurant.logoUrl.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${restaurant.logoUrl}` : restaurant.logoUrl} 
                alt={restaurant.name} 
                className="w-full h-full object-cover" 
              />
            </motion.div>
          )}
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">{restaurant.name}</span>
            <span className="text-[10px] sm:text-xs text-white/50 uppercase tracking-widest">{restaurant.slug}</span>
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
