'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/types/menu';
import { useEffect, useState } from 'react';
import { addToCart } from '@/lib/cart';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digitalmenu-backend-production.up.railway.app';

interface Props {
  product: Product | null;
  themeColor: string;
  isRTL: boolean;
  onClose: () => void;
  slug?: string;
  enableOrdering?: boolean;
}

export function ProductModal({ product, themeColor, isRTL, onClose, slug, enableOrdering }: Props) {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [product, onClose]);

  function handleAddToCart() {
    if (!product || !slug) return;
    addToCart(
      slug,
      {
        productId: product.id,
        name: product.name,
        price: Number(product.price) || 0,
        photoUrl: product.photoUrl,
      },
      qty,
    );
    onClose();
  }

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Dark backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Morphing card */}
          <motion.div
            layoutId={`product-card-${product.id}`}
            className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Top close button */}
            <button
              onClick={onClose}
              className="absolute top-4 end-4 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center border border-white/15 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Photo container with matching layoutId */}
            <motion.div
              layoutId={`product-image-${product.id}`}
              className="relative w-full h-64 sm:h-72 bg-neutral-950 shrink-0 overflow-hidden"
            >
              {product.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={
                    product.photoUrl.startsWith('/')
                      ? `${API_URL}${product.photoUrl}`
                      : product.photoUrl
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: `${themeColor}20` }}
                >
                  <span className="text-6xl">🍽️</span>
                </div>
              )}
            </motion.div>

            {/* Product detail info */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-start justify-between gap-4">
                <motion.h2
                  layoutId={`product-name-${product.id}`}
                  className="text-2xl font-bold text-white leading-tight"
                >
                  {product.name}
                </motion.h2>

                <motion.span
                  layoutId={`product-price-${product.id}`}
                  className="text-xl font-extrabold px-3 py-1 rounded-full shrink-0"
                  style={{ backgroundColor: `${themeColor}25`, color: themeColor }}
                >
                  ₺{product.price}
                </motion.span>
              </div>

              {product.description ? (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.12, duration: 0.25 }}
                  className="text-white/70 text-base leading-relaxed"
                >
                  {product.description}
                </motion.p>
              ) : (
                <p className="text-white/30 text-sm italic">No description available.</p>
              )}

              {/* Prep time & Allergens */}
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="flex items-center gap-1.5 text-xs font-medium text-white/60 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
                  <span className="text-white/80">⏱️</span> 10-15 min
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-amber-500/80 bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/20">
                  <span className="text-amber-500">⚠️</span> Contains Dairy, Nuts
                </span>
              </div>

              {/* Action bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.25 }}
                className="pt-4"
              >
                {enableOrdering && slug ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 shrink-0">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-sm font-bold hover:bg-white/20"
                      >
                        −
                      </button>
                      <span className="text-white text-sm font-bold w-4 text-center">{qty}</span>
                      <button
                        onClick={() => setQty((q) => q + 1)}
                        className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-sm font-bold hover:bg-white/20"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all"
                      style={{
                        backgroundColor: themeColor,
                        color: '#fff',
                        boxShadow: `0 4px 20px ${themeColor}40`,
                      }}
                    >
                      Sepete Ekle — ₺{(Number(product.price) * qty).toFixed(2).replace(/\.00$/, '')}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onClose}
                    className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
                    style={{
                      backgroundColor: themeColor,
                      color: '#fff',
                      boxShadow: `0 4px 20px ${themeColor}40`,
                    }}
                  >
                    Back to products
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
