'use client';

import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  PanInfo,
} from 'framer-motion';
import type { Restaurant } from '@/types/menu';
import { LogoPlaceholder, getRestaurantType } from './LogoPlaceholder';

// Curated high-res fallback background images per theme
const COFFEE_FALLBACK =
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80';
const BURGER_FALLBACK =
  'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&auto=format&fit=crop&q=80';
const GENERAL_FALLBACK =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80';

// ── Per-word stagger animation ──────────────────────────────────────────────
function AnimatedWords({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <motion.span
      className="inline-block"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.35,
          },
        },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block me-[0.26em] origin-bottom"
          variants={{
            hidden: {
              y: 60,
              opacity: 0,
              rotateX: -60,
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
                mass: 0.85,
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
  onDismiss: () => void;
}

export function SplashScreen({ restaurant, onDismiss }: Props) {
  const theme = restaurant.themeColor || '#C0392B';
  const type = getRestaurantType(restaurant.slug, restaurant.name, theme);

  // ── Drag & Swipe tracking ──────────────────────────────────────────────────
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, -140], [1, 0]);
  const bgScale = useTransform(y, [0, -140], [1, 0.94]);

  const hasDismissed = useRef(false);
  const hasDragged = useRef(false);

  function dismiss() {
    if (hasDismissed.current) return;
    hasDismissed.current = true;
    animate(y, -window.innerHeight, {
      type: 'spring',
      damping: 28,
      stiffness: 240,
      onComplete: onDismiss,
    });
  }

  function handleDragStart() {
    hasDragged.current = true;
  }

  function handlePanEnd(_: PointerEvent, info: PanInfo) {
    if (info.offset.y < -50 || info.velocity.y < -250) {
      dismiss();
    } else {
      animate(y, 0, { type: 'spring', damping: 28, stiffness: 300 });
    }
    setTimeout(() => {
      hasDragged.current = false;
    }, 50);
  }

  function handleClick() {
    if (hasDragged.current) return;
    dismiss();
  }

  // ── Determine Dynamic Full-Bleed Background Image ──────────────────────────
  const curatedFallback =
    type === 'coffee'
      ? COFFEE_FALLBACK
      : type === 'burger'
      ? BURGER_FALLBACK
      : GENERAL_FALLBACK;

  const firstCategoryPhoto = restaurant.categories?.find((c) => !!c.photoUrl)?.photoUrl;
  const bgImageUrl = firstCategoryPhoto || curatedFallback;

  // ── Determine Tagline / Subtitle ───────────────────────────────────────────
  const isTurkish = restaurant.locale === 'tr' || restaurant.defaultLocale === 'tr';
  const tagline =
    type === 'coffee'
      ? isTurkish
        ? 'Nitelikli Kahve & Taze Fırın Lezzetleri'
        : 'Specialty Coffee & Artisan Roastery'
      : type === 'burger'
      ? isTurkish
        ? 'Gurme Burger & El Yapımı Özel Soslar'
        : 'Gourmet Burgers & Craft Kitchen'
      : isTurkish
      ? 'Seçkin Menü & Özel Lezzetler'
      : 'Artisan Dining & Culinary Delights';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none touch-none bg-neutral-950"
      style={{ y, opacity }}
      drag="y"
      dragConstraints={{ top: -window.innerHeight, bottom: 0 }}
      dragElastic={{ top: 0.35, bottom: 0.04 }}
      onDragStart={handleDragStart}
      onPanEnd={handlePanEnd}
      onClick={handleClick}
    >
      {/* ── Ken Burns Slow Zoom Background Image Layer ───────────────────────── */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url(${bgImageUrl})`,
          scale: bgScale,
        }}
        initial={{ scale: 1 }}
        animate={{
          scale: [1, 1.1],
          x: [0, 8, 0],
          y: [0, -6, 0],
        }}
        transition={{
          duration: 10,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      {/* ── Dynamic Gradient Theme Overlay ───────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg, rgba(0, 0, 0, 0.72) 0%, rgba(8, 8, 8, 0.45) 45%, rgba(0, 0, 0, 0.92) 100%),
            radial-gradient(ellipse 85% 75% at 50% 45%, ${theme}55 0%, ${theme}22 50%, rgba(0, 0, 0, 0.85) 100%)
          `,
          scale: bgScale,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      {/* ── Subtle Noise Grain Texture ────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* ── Center Hero Branding Content ─────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-8 text-center max-w-lg">
        {/* Logo / Badge with spring entrance */}
        <motion.div
          initial={{ scale: 0.25, opacity: 0, filter: 'blur(16px)', y: 20 }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ type: 'spring', damping: 14, stiffness: 140, delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <LogoPlaceholder restaurant={restaurant} size="xl" />
        </motion.div>

        {/* Restaurant Name with word-by-word 3D stagger entrance */}
        <h1
          className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none overflow-visible drop-shadow-2xl"
          style={{ perspective: '1000px' }}
        >
          <AnimatedWords text={restaurant.name} />
        </h1>

        {/* Dynamic Tagline */}
        <motion.p
          className="text-sm sm:text-base text-white/75 font-medium tracking-wide drop-shadow-md"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {tagline}
        </motion.p>

        {/* Glowing theme accent line */}
        <motion.div
          className="h-[3px] rounded-full mt-1"
          style={{
            backgroundColor: theme,
            boxShadow: `0 0 16px ${theme}, 0 0 32px ${theme}80`,
          }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 64, opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* ── Animated Swipe Up / Click Prompt ─────────────────────────────────── */}
      <motion.div
        className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3 z-10 pointer-events-none"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Animated Chevrons */}
        <div className="flex flex-col items-center gap-0.5">
          <motion.svg
            width="28"
            height="16"
            viewBox="0 0 32 18"
            fill="none"
            animate={{ y: [0, -7, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut', delay: 0 }}
          >
            <path
              d="M2 16L16 3L30 16"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.9"
            />
          </motion.svg>
          <motion.svg
            width="28"
            height="16"
            viewBox="0 0 32 18"
            fill="none"
            animate={{ y: [0, -7, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut', delay: 0.18 }}
          >
            <path
              d="M2 16L16 3L30 16"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.4"
            />
          </motion.svg>
        </div>

        {/* Prompt Badge */}
        <div
          className="px-4 py-1.5 rounded-full border border-white/15 bg-black/40 backdrop-blur-md text-white/80 text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase shadow-lg flex items-center gap-1.5"
          style={{ boxShadow: `0 0 24px ${theme}30` }}
        >
          <span>↑</span>
          <span>Swipe or Tap to View Menu</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
