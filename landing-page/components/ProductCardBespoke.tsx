'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Radio,
  ArrowRight,
  Layers,
  Cpu,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import type { ProductItem, ProductColor } from '@/lib/products';
import { calculateProductPrice } from '@/lib/products';

interface ProductCardBespokeProps {
  product: ProductItem;
  onOrderClick: (product: ProductItem, initialColor?: ProductColor) => void;
  locale?: 'tr' | 'en';
}

const COLOR_NAMES: Record<ProductColor, { label: string; border: string; bg: string; dot: string }> = {
  black: {
    label: 'Mat Siyah',
    border: 'border-neutral-700 hover:border-neutral-500',
    bg: 'bg-neutral-900',
    dot: 'bg-neutral-900 border border-neutral-700',
  },
  white: {
    label: 'Parlak Beyaz',
    border: 'border-white/30 hover:border-white/80',
    bg: 'bg-neutral-100',
    dot: 'bg-white border border-neutral-300',
  },
  transparent: {
    label: 'Kristal Şeffaf',
    border: 'border-cyan-500/40 hover:border-cyan-400',
    bg: 'bg-cyan-950/40 backdrop-blur-md',
    dot: 'bg-gradient-to-tr from-cyan-400/40 to-white/40 border border-cyan-400/60',
  },
};

export function ProductCardBespoke({ product, onOrderClick, locale = 'tr' }: ProductCardBespokeProps) {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors && product.colors.length > 0 ? product.colors[0] : 'black',
  );
  const [showSpecs, setShowSpecs] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic image preview based on color
  const currentImage =
    product.images[selectedColor] ||
    product.images.default ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

  const defaultPricing = calculateProductPrice(product, 1);

  return (
    <motion.div
      className="group relative flex flex-col justify-between rounded-3xl bg-gradient-to-b from-white/[0.07] via-white/[0.03] to-black/40 border border-white/10 hover:border-white/25 backdrop-blur-xl p-6 transition-all duration-500 shadow-2xl hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)] overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient Top Glow on Hover */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-b from-purple-500/20 via-pink-500/10 to-transparent blur-3xl pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
      />

      {/* Top Header Badge & Category */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-500/10 border border-purple-500/25 text-purple-300">
            <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
            {product.categoryLabel}
          </span>

          {product.badge && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Visual Container with 3D Float */}
        <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-neutral-950/80 border border-white/10 mb-6 group/img">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover/img:scale-105"
          />

          {/* Frosted Gradient Glass Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent opacity-80" />

          {/* NFC Holographic Tap Icon */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white/90 shadow-lg">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>NFC Tap</span>
          </div>

          {/* Live Color Variant Preview Pills in Corner */}
          {product.colors && product.colors.length > 0 && (
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 p-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15">
              {product.colors.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor(color);
                    }}
                    title={COLOR_NAMES[color].label}
                    className={`w-6 h-6 rounded-full transition-all flex items-center justify-center ${
                      COLOR_NAMES[color].dot
                    } ${isSelected ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-black scale-110' : 'opacity-70 hover:opacity-100'}`}
                  />
                );
              })}
            </div>
          )}

          {/* Hardware Spec Quick Badge */}
          {product.specs.chipType && (
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono text-purple-300">
              <Cpu className="w-3 h-3 text-purple-400" />
              <span>{product.specs.chipType.split(' ')[1] || 'NTAG213'}</span>
            </div>
          )}
        </div>

        {/* Title & Tagline */}
        <h3 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-purple-200 transition-colors">
          {locale === 'tr' ? product.name : product.nameEn}
        </h3>

        <p className="text-sm text-white/60 leading-relaxed line-clamp-2 mb-4">
          {locale === 'tr' ? product.tagline : product.taglineEn}
        </p>

        {/* Feature Checkpoints */}
        <div className="space-y-2 mb-6">
          {(locale === 'tr' ? product.features : product.featuresEn).slice(0, 3).map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-white/75">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{feat}</span>
            </div>
          ))}
        </div>

        {/* Expandable Hardware Specifications (Accordion) */}
        <div className="border-t border-white/10 pt-3 mb-6">
          <button
            onClick={() => setShowSpecs(!showSpecs)}
            className="w-full flex items-center justify-between text-xs font-semibold text-white/50 hover:text-white/80 transition-colors py-1"
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              {locale === 'tr' ? 'Teknik Özellikler & Materyal' : 'Technical Specifications'}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${showSpecs ? 'rotate-180 text-purple-400' : ''}`}
            />
          </button>

          <AnimatePresence>
            {showSpecs && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden space-y-1.5 pt-2 text-[11px] text-white/60"
              >
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/40">{locale === 'tr' ? 'Materyal:' : 'Material:'}</span>
                  <span className="font-medium text-white/80 text-right">{product.specs.material}</span>
                </div>
                {product.specs.chipType && (
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">{locale === 'tr' ? 'NFC Çipi:' : 'NFC Chip:'}</span>
                    <span className="font-medium text-white/80 text-right">{product.specs.chipType}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/40">{locale === 'tr' ? 'Ebatlar:' : 'Dimensions:'}</span>
                  <span className="font-medium text-white/80 text-right">{product.specs.dimensions}</span>
                </div>
                {product.specs.finish && (
                  <div className="flex justify-between py-1">
                    <span className="text-white/40">{locale === 'tr' ? 'Yüzey / Baskı:' : 'Finish:'}</span>
                    <span className="font-medium text-white/80 text-right">{product.specs.finish}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pricing & Order CTA Footer */}
      <div className="border-t border-white/10 pt-5 mt-auto">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white tracking-tight">
                {defaultPricing.unitPrice.toLocaleString('tr-TR')} {product.currency}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-white/40 line-through">
                  {product.originalPrice} {product.currency}
                </span>
              )}
            </div>
            <span className="text-[11px] text-white/40">
              {product.isSubscription
                ? (product.billingPeriod || '/ Ay')
                : (locale === 'tr' ? '+ KDV Dahil / Başlangıç' : 'VAT Incl. / Base')}
            </span>
          </div>

          {/* Bulk Tier Hint Badge */}
          {product.bulkTiers && product.bulkTiers.length > 1 && (
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
              {locale === 'tr' ? '%35\'e varan toptan indirim' : 'Up to 35% bulk discount'}
            </span>
          )}
        </div>

        <button
          onClick={() => onOrderClick(product, selectedColor)}
          className="w-full relative group/btn flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-300 transform active:scale-[0.98]"
        >
          <span>{locale === 'tr' ? 'Özelleştir & Sipariş Ver' : 'Customize & Order'}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
