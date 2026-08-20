'use client';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Category } from '@/types/menu';

interface CategoryBarProps {
  categories: Category[];
  activeCategoryId: string;
  themeColor: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryBar({ categories, activeCategoryId, themeColor, onSelectCategory }: CategoryBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the pill bar to keep the active category in view
  useEffect(() => {
    if (scrollRef.current && activeCategoryId) {
      const activeElement = scrollRef.current.querySelector(`[data-category-id="${activeCategoryId}"]`) as HTMLElement;
      if (activeElement) {
        const container = scrollRef.current;
        const scrollLeft = activeElement.offsetLeft - container.clientWidth / 2 + activeElement.clientWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeCategoryId]);

  return (
    <div className="sticky top-[72px] sm:top-[84px] z-40 bg-neutral-950/90 backdrop-blur-md border-b border-white/5 py-3 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-2 pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                data-category-id={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap snap-center transition-colors ${
                  isActive ? 'text-white' : 'text-white/60 hover:text-white/90'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 rounded-full z-0"
                    style={{ backgroundColor: themeColor }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
