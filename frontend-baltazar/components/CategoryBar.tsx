'use client';
import { motion } from 'framer-motion';
import type { Category } from '@/types/menu';

interface Props {
  categories: Category[];
  activeCategoryId?: string;
  onSelectCategory: (categoryId: string) => void;
  themeColor: string;
}

export function CategoryBar({
  categories,
  activeCategoryId,
  onSelectCategory,
  themeColor,
}: Props) {
  return (
    <div className="sticky top-0 z-30 bg-neutral-950/85 backdrop-blur-md border-b border-white/10 py-3 px-4">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory max-w-5xl mx-auto px-2">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="relative px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap snap-start shrink-0 transition-colors"
              style={{
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-category-pill"
                  className="absolute inset-0 rounded-full shadow-lg"
                  style={{ backgroundColor: themeColor }}
                  transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                />
              )}
              <span className="relative z-10">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
