'use client';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Product } from '@/types/menu';
import { addToCart } from '@/lib/cart';
import { resolveImageUrl } from '@/lib/image-url';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digitalmenu-backend-production.up.railway.app';

interface ProductCardProps {
  product: Product;
  themeColor: string;
  onSelect: (product: Product) => void;
  categoryName?: string;
  slug?: string;
  enableOrdering?: boolean;
}

export function ProductCard({ product, themeColor, onSelect, categoryName, slug, enableOrdering }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);
  const resolvedPhoto = resolveImageUrl(product.photoUrl);

  function handleQuickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    if (!slug) return;
    addToCart(slug, {
      productId: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      photoUrl: product.photoUrl,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  }
  // Determine badges deterministically
  const badges = useMemo(() => {
    const list: string[] = [];
    const nameLower = (product.name ?? '').toLowerCase();
    const catLower = (categoryName ?? '').toLowerCase();

    if (
      catLower.includes('coffee') ||
      nameLower.includes('coffee') ||
      nameLower.includes('kahve') ||
      nameLower.includes('latte') ||
      nameLower.includes('espresso')
    ) {
      list.push('Specialty Coffee');
    }
    if (
      nameLower.includes('cake') ||
      nameLower.includes('kek') ||
      nameLower.includes('pasta') ||
      nameLower.includes('cookie') ||
      nameLower.includes('kurabiye') ||
      nameLower.includes('croissant') ||
      nameLower.includes('kruvasan')
    ) {
      list.push('Freshly Baked');
    }
    if (nameLower.includes('special') || nameLower.includes('chef') || nameLower.includes('şef')) {
      list.push("Chef's Choice");
    }
    if (nameLower.includes('spice') || nameLower.includes('baharat')) {
      list.push('Bursting Flavour');
    }
    return list;
  }, [product.name, categoryName]);

  return (
    <motion.article
      layoutId={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
      variants={{
        hidden: { y: 30, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { type: 'spring', damping: 24, stiffness: 160 },
        },
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', damping: 20, stiffness: 260 }}
    >
      <div>
        <motion.div
          layoutId={`product-image-${product.id}`}
          className="relative w-full h-48 bg-neutral-950 overflow-hidden"
        >
          {resolvedPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolvedPhoto}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: `${themeColor}18` }}
            >
              <span className="text-4xl">🍽️</span>
            </div>
          )}
          {badges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-2 pointer-events-none">
              {badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2 py-1 rounded-md border border-white/20 shadow-sm"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        <div className="p-4">
          <motion.h3
            layoutId={`product-name-${product.id}`}
            className="font-bold text-white text-base leading-snug group-hover:text-white/90 transition-colors"
          >
            {product.name}
          </motion.h3>
          {product.description && (
            <p className="text-white/50 text-sm mt-1.5 leading-relaxed line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 pt-1 flex items-center justify-between">
        <motion.div
          layoutId={`product-price-${product.id}`}
          className="text-lg font-extrabold"
          style={{ color: themeColor }}
        >
          ₺{Number(product.price).toFixed(2).replace(/\.00$/, '')}
        </motion.div>
        {enableOrdering && slug ? (
          <button
            onClick={handleQuickAdd}
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all shrink-0"
            style={{
              backgroundColor: justAdded ? themeColor : `${themeColor}22`,
              color: justAdded ? '#fff' : themeColor,
            }}
            aria-label="Add to order"
          >
            {justAdded ? '✓' : '+'}
          </button>
        ) : (
          <span className="text-xs text-white/40 group-hover:text-white/70 transition-colors font-medium">
            View Details
          </span>
        )}
      </div>
    </motion.article>
  );
}
