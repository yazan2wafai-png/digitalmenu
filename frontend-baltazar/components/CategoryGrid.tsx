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
    <section className="px-4 sm:px-6 py-12 pb-24 max-w-5xl mx-auto">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4"
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {categories.map((cat) => (
          <div key={cat.id} id={`category-${cat.id}`} className="scroll-mt-[160px]">
            <CategoryCard
              category={cat}
              themeColor={themeColor}
              locale={locale}
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
