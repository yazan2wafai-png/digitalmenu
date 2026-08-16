'use client';
import { motion } from 'framer-motion';
import type { Restaurant } from '@/types/menu';
import { LanguageSwitcher } from './LanguageSwitcher';

// Splits text into word spans for pronounced stagger animation
function AnimatedWords({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <motion.span
      className="inline-block"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12, // 120ms delay between words for clear rhythm
            delayChildren: 0.35,  // Starts right as logo settles
          },
        },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block me-[0.28em] origin-bottom"
          variants={{
            hidden: {
              y: 70,
              opacity: 0,
              rotateX: -65,
              scale: 0.85,
              filter: 'blur(8px)',
            },
            visible: {
              y: 0,
              opacity: 1,
              rotateX: 0,
              scale: 1,
              filter: 'blur(0px)',
              transition: {
                type: 'spring',
                damping: 14,
                stiffness: 130,
                mass: 0.8,
              },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

interface Props {
  restaurant: Restaurant;
  locale: string;
  onLocaleChange: (locale: string) => void;
  isRTL: boolean;
}

export function Hero({ restaurant, locale, onLocaleChange, isRTL }: Props) {
  const theme = restaurant.themeColor || '#C0392B';

  return (
    <section
      className="relative min-h-[100svh] flex flex-col overflow-hidden bg-neutral-950"
    >
      {/* Background gradient with scale & blur reveal */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ scale: 1.2, opacity: 0, filter: 'blur(30px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: `linear-gradient(160deg, ${theme}28 0%, transparent 65%), 
                       radial-gradient(ellipse 70% 55% at 50% 40%, ${theme}45 0%, transparent 75%)`,
        }}
      />

      {/* Top navigation bar */}
      <motion.nav
        className="relative z-10 flex items-center justify-between px-6 py-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-xs font-semibold tracking-widest text-white/40 uppercase">
          {restaurant.slug}
        </div>
        <LanguageSwitcher
          locales={restaurant.supportedLocales}
          current={locale}
          onChange={onLocaleChange}
        />
      </motion.nav>

      {/* Main hero content container */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center pb-24"
        initial="hidden"
        animate="visible"
      >
        {/* Logo — scale + drop in before text */}
        {restaurant.logoUrl && (
          <motion.div
            className="mb-8"
            variants={{
              hidden: { scale: 0.4, y: -30, opacity: 0, filter: 'blur(10px)' },
              visible: {
                scale: 1,
                y: 0,
                opacity: 1,
                filter: 'blur(0px)',
                transition: {
                  type: 'spring',
                  damping: 15,
                  stiffness: 180,
                  delay: 0.15,
                },
              },
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                restaurant.logoUrl.startsWith('/')
                  ? `${process.env.NEXT_PUBLIC_API_URL}${restaurant.logoUrl}`
                  : restaurant.logoUrl
              }
              alt={restaurant.name}
              className="w-22 h-22 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-white/15 shadow-2xl"
            />
          </motion.div>
        )}

        {/* Restaurant name — 3D word stagger */}
        <h1
          className="text-5xl sm:text-7xl font-black tracking-tight leading-none mb-4 overflow-visible"
          style={{ perspective: '1000px' }}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <AnimatedWords text={restaurant.name} />
        </h1>

        {/* Accent line — expands horizontally as text finishes */}
        <motion.div
          className="h-1 rounded-full mt-4 mb-8"
          style={{ backgroundColor: theme, boxShadow: `0 0 20px ${theme}` }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 84, opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Scroll CTA indicator */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.6, ease: 'easeOut' }}
        >
          <motion.p
            className="text-white/50 text-xs font-semibold tracking-widest uppercase flex items-center gap-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <span>↓</span> Explore Menu
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade to categories section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none" />
    </section>
  );
}

