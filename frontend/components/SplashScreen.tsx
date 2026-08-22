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

// ── Per-word stagger — each word is its own motion element ──────────────────
function AnimatedWords({ text, theme }: { text: string; theme: string }) {
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
            staggerChildren: 0.11,   // 110ms between words — clearly felt
            delayChildren: 0.45,     // starts after logo settles
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
              y: 80,
              opacity: 0,
              rotateX: -70,
              scale: 0.82,
              filter: 'blur(10px)',
            },
            visible: {
              y: 0,
              opacity: 1,
              rotateX: 0,
              scale: 1,
              filter: 'blur(0px)',
              transition: {
                type: 'spring',
                damping: 13,
                stiffness: 120,
                mass: 0.9,
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

  // ── Drag tracking ────────────────────────────────────────────────────────
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, -140], [1, 0]);
  const bgScale = useTransform(y, [0, -140], [1, 0.92]);

  const hasDismissed = useRef(false);
  // Track whether the current pointer interaction was a drag (not a tap).
  // This prevents onClick from firing dismiss() after every swipe-down release.
  const hasDragged = useRef(false);

  function dismiss() {
    if (hasDismissed.current) return;
    hasDismissed.current = true;
    animate(y, -window.innerHeight, {
      type: 'spring',
      damping: 30,
      stiffness: 240,
      onComplete: onDismiss,
    });
  }

  function handleDragStart() {
    hasDragged.current = true;
  }

  function handlePanEnd(_: PointerEvent, info: PanInfo) {
    if (info.offset.y < -60 || info.velocity.y < -300) {
      // Swiped up far/fast enough — dismiss
      dismiss();
    } else {
      // Swiped down or short swipe — snap back
      animate(y, 0, { type: 'spring', damping: 28, stiffness: 300 });
    }
    // Reset drag flag slightly after so onClick (which fires after panEnd) sees it
    setTimeout(() => { hasDragged.current = false; }, 50);
  }

  function handleClick() {
    // Only treat as a tap if no drag gesture occurred
    if (hasDragged.current) return;
    dismiss();
  }

  // ── Resolve logo URL (now always an absolute URL from DB) ────────────────
  const logoSrc = restaurant.logoUrl
    ? restaurant.logoUrl.startsWith('http')
      ? restaurant.logoUrl
      : `${process.env.NEXT_PUBLIC_API_URL}${restaurant.logoUrl}`
    : null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none touch-none"
      style={{ y, opacity }}
      drag="y"
      dragConstraints={{ top: -window.innerHeight, bottom: 0 }}
      dragElastic={{ top: 0.4, bottom: 0.04 }}
      onDragStart={handleDragStart}
      onPanEnd={handlePanEnd}
      onClick={handleClick}
    >
      {/* ── Ken Burns background: dark base + slow zoom-in scale ─────────── */}
      <motion.div
        className="absolute inset-0 bg-neutral-950"
        style={{ scale: bgScale }}
      />

      {/* Deep radial glow — themeColor bleeds in from center */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 70% at 50% 50%, ${theme}60 0%, ${theme}22 40%, transparent 70%),
            linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.8) 100%)
          `,
          scale: bgScale,
        }}
        // Ken Burns: the glow layer itself very slowly drifts/scales up
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1.0, opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Fine noise grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* ── Center content ───────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center">

        {/* Logo — scale-up from blur, with glow ring */}
        {logoSrc ? (
          <motion.div
            initial={{ scale: 0.25, opacity: 0, filter: 'blur(20px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ type: 'spring', damping: 14, stiffness: 140, delay: 0.1 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt={restaurant.name}
              className="w-28 h-28 rounded-full object-cover"
              style={{
                boxShadow: `0 0 0 3px ${theme}60, 0 0 50px ${theme}80, 0 8px 32px rgba(0,0,0,0.6)`,
              }}
              // Surface any 404 for debugging
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.outline = '2px solid red';
                console.error('[SplashScreen] Logo failed to load:', logoSrc);
              }}
            />
          </motion.div>
        ) : (
          /* Fallback monogram when no logo */
          <motion.div
            className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-black text-white"
            style={{ backgroundColor: theme, boxShadow: `0 0 50px ${theme}80` }}
            initial={{ scale: 0.25, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 14, stiffness: 140, delay: 0.1 }}
          >
            {restaurant.name.charAt(0)}
          </motion.div>
        )}

        {/* Restaurant name — word-by-word 3D stagger */}
        <h1
          className="text-5xl sm:text-6xl font-black tracking-tight text-white leading-none overflow-visible"
          style={{ perspective: '1000px' }}
        >
          <AnimatedWords text={restaurant.name} theme={theme} />
        </h1>

        {/* Glowing accent line — expands after last word lands */}
        <motion.div
          className="h-[3px] rounded-full"
          style={{ backgroundColor: theme, boxShadow: `0 0 20px ${theme}` }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 80, opacity: 1 }}
          // delay calculated so it fires right after the last word (~0.45 + 1 word * 0.11 = ~0.9s)
          transition={{ delay: 0.95, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* ── Swipe-up hint ────────────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3 z-10 pointer-events-none"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Double-chevron: each chevron bounces with a 0.15s offset for cascade feel */}
        <div className="flex flex-col items-center gap-0.5">
          <motion.svg
            width="32" height="18" viewBox="0 0 32 18" fill="none"
            animate={{ y: [0, -9, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: 0 }}
          >
            <path d="M2 16L16 3L30 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.85"/>
          </motion.svg>
          <motion.svg
            width="32" height="18" viewBox="0 0 32 18" fill="none"
            animate={{ y: [0, -9, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: 0.18 }}
          >
            <path d="M2 16L16 3L30 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.35"/>
          </motion.svg>
        </div>

        <p className="text-white/55 text-xs font-semibold tracking-[0.2em] uppercase">
          Swipe up to view menu
        </p>
      </motion.div>
    </motion.div>
  );
}
