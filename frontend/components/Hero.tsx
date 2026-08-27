'use client';
import { motion } from 'framer-motion';
import type { Restaurant } from '@/types/menu';

function AnimatedWords({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <motion.span
      className="inline-block"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
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
  isRTL: boolean;
}

export function Hero({ restaurant, isRTL }: Props) {
  const theme = restaurant.themeColor || '#C0392B';

  // Reuse whichever category photo the splash screen picked, so the hero
  // reads as the same restaurant instead of a flat generic gradient block.
  const bgPhotoUrl = restaurant.categories?.find((c) => !!c.photoUrl)?.photoUrl;

  return (
    <section
      className="relative flex flex-col items-center justify-center pt-32 pb-16 overflow-hidden bg-neutral-950"
    >
      {bgPhotoUrl && (
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgPhotoUrl})` }}
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
      )}

      {/* Dark scrim so text stays legible over the photo, plus the brand tint */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ scale: 1.2, opacity: 0, filter: 'blur(30px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: bgPhotoUrl
            ? `linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.35) 45%, rgba(10,10,10,0.92) 100%),
               radial-gradient(ellipse 70% 55% at 50% 40%, ${theme}55 0%, transparent 75%)`
            : `linear-gradient(160deg, ${theme}28 0%, transparent 65%), 
                       radial-gradient(ellipse 70% 55% at 50% 40%, ${theme}45 0%, transparent 75%)`,
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center px-6 text-center"
        initial="hidden"
        animate="visible"
      >
        <h1
          className="text-4xl sm:text-6xl font-black tracking-tight leading-none mb-4"
          style={{ perspective: '1000px' }}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <AnimatedWords text={restaurant.name} />
        </h1>

        <motion.div
          className="h-1 rounded-full mt-4"
          style={{ backgroundColor: theme, boxShadow: `0 0 20px ${theme}` }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 84, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </section>
  );
}
