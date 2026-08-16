'use client';
import { motion } from 'framer-motion';
import type { Category } from '@/types/menu';
import { CategoryCard } from './CategoryCard';

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09 },
  },
};

interface Props {
  categories: Category[];
  themeColor: string;
  locale: string;
}

export function CategoryGrid({ categories, themeColor, locale }: Props) {
  return (
    <section className="px-6 pb-24 max-w-5xl mx-auto">
      <motion.h2
        className="text-sm font-semibold tracking-widest text-white/30 uppercase mb-8"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        Menu
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4"
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            themeColor={themeColor}
            locale={locale}
          />
        ))}
      </motion.div>
    </section>
  );
}
