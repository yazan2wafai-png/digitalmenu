'use client';
import { motion } from 'framer-motion';
import type { Category } from '@/types/menu';
import Link from 'next/link';

const cardVariants = {
  hidden: { y: 60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, damping: 24, stiffness: 160 },
  },
};

interface Props {
  category: Category;
  themeColor: string;
  locale: string;
}

export function CategoryCard({ category, themeColor, locale }: Props) {
  const hasPhoto = Boolean(category.photoUrl);

  return (
    <motion.div variants={cardVariants}>
      <Link href={`/category/${category.id}?locale=${locale}`} className="block">
        <motion.article
          className="relative overflow-hidden rounded-2xl border border-white/10 cursor-pointer h-44 flex flex-col justify-between"
          style={
            hasPhoto
              ? { background: '#111' }
              : { background: 'rgba(255,255,255,0.05)' }
          }
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', damping: 20, stiffness: 280 }}
        >
          {/* ── Full-bleed background photo (when photoUrl is set) ── */}
          {hasPhoto && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.photoUrl!}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ zIndex: 0 }}
              />
              {/* Gradient overlay: dark bottom + themeColor tint at bottom */}
              <div
                className="absolute inset-0"
                style={{
                  zIndex: 1,
                  background: `linear-gradient(
                    to bottom,
                    rgba(0,0,0,0.15) 0%,
                    rgba(0,0,0,0.55) 55%,
                    ${themeColor}CC 100%
                  )`,
                }}
              />
            </>
          )}

          {/* ── Fallback: top accent bar (no-photo mode) ── */}
          {!hasPhoto && (
            <div
              className="absolute top-0 start-0 end-0 h-1 rounded-t-2xl"
              style={{ backgroundColor: themeColor }}
            />
          )}

          {/* ── Sort order badge ── */}
          <span
            className="relative self-start text-xs font-bold px-2 py-0.5 rounded-full m-3"
            style={{
              zIndex: 2,
              backgroundColor: hasPhoto ? 'rgba(0,0,0,0.45)' : `${themeColor}25`,
              color: hasPhoto ? '#fff' : themeColor,
            }}
          >
            0{category.sortOrder}
          </span>

          {/* ── Category name + product count ── */}
          <div className="relative p-4 pt-0" style={{ zIndex: 2 }}>
            <h2 className="text-xl font-bold text-white leading-snug drop-shadow-md">
              {category.name}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: hasPhoto ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.4)' }}>
              {category.products.length} item{category.products.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* ── Hover glow ── */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none"
            style={{
              zIndex: 3,
              background: `radial-gradient(circle at 50% 100%, ${themeColor}30, transparent 70%)`,
            }}
            whileHover={{ opacity: 1 }}
          />
        </motion.article>
      </Link>
    </motion.div>
  );
}
