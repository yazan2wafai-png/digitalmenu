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
} from 'lucide-react';
import type { ProductItem, ProductColor } from '@/lib/products';
import { calculateProductPrice } from '@/lib/products';

interface ProductCardBespokeProps {
  product: ProductItem;
  onOrderClick: (product: ProductItem, initialColor?: ProductColor) => void;
  isBundle?: boolean;
}

const COLOR_NAMES: Record<ProductColor, { label: string; border: string; bg: string; dot: string }> = {
  black: {
    label: 'Mat Siyah',
    border: 'border-neutral-600 hover:border-neutral-400',
    bg: 'bg-neutral-900',
    dot: 'bg-neutral-900 border-2 border-neutral-600',
  },
  white: {
    label: 'Parlak Beyaz',
    border: 'border-neutral-300 hover:border-white',
    bg: 'bg-neutral-100',
    dot: 'bg-white border-2 border-neutral-300',
  },
  transparent: {
    label: 'Kristal Şeffaf',
    border: 'border-cyan-400/60 hover:border-cyan-300',
    bg: 'bg-cyan-950/60',
    dot: 'bg-gradient-to-tr from-cyan-400/50 to-white/60 border-2 border-cyan-400',
  },
};

export function ProductCardBespoke({ product, onOrderClick, isBundle = false }: ProductCardBespokeProps) {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors && product.colors.length > 0 ? product.colors[0] : 'black',
  );
  const [showSpecs, setShowSpecs] = useState(false);

  const currentImage =
    product.images[selectedColor] ||
    product.images.default ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

  const defaultPricing = calculateProductPrice(product, 1);

  return (
    <motion.div
      className={`group relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 shadow-2xl overflow-hidden ${
        isBundle
          ? 'bg-[#151324] border-2 border-purple-500/60 shadow-[0_0_40px_rgba(168,85,247,0.2)] md:col-span-2 lg:col-span-3'
          : 'bg-[#11131C] border border-neutral-800 hover:border-neutral-700'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Header Badge & Category */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 border border-purple-500/40 text-purple-300">
            <Radio className="w-3 h-3 text-purple-400" />
            {product.categoryLabel}
          </span>

          {product.badge && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Visual Container */}
        <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 mb-6 group/img">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover object-center transition-transform duration-500 group-hover/img:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-70" />

          {/* NFC Holographic Tap Icon */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 border border-white/20 text-xs font-semibold text-white shadow-lg">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>NFC Tap</span>
          </div>

          {/* Color Switcher Pills */}
          {product.colors && product.colors.length > 0 && (
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 p-1.5 rounded-full bg-black/80 border border-neutral-700">
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
                    className={`w-6 h-6 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                      COLOR_NAMES[color].dot
                    } ${isSelected ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-black scale-110' : 'opacity-80 hover:opacity-100'}`}
                  />
                );
              })}
            </div>
          )}

          {/* Chip Badge */}
          {product.specs.chipType && (
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/80 border border-neutral-700 text-[11px] font-mono font-bold text-purple-300">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>{product.specs.chipType.split(' ')[1] || 'NTAG213'}</span>
            </div>
          )}
        </div>

        {/* Title & Tagline */}
        <h3 className="text-xl font-bold text-white tracking-tight mb-2">
          {product.name}
        </h3>

        <p className="text-sm text-slate-300 leading-relaxed line-clamp-2 mb-4">
          {product.tagline}
        </p>

        {/* Feature Checkpoints */}
        <div className="space-y-2 mb-6">
          {product.features.slice(0, 4).map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{feat}</span>
            </div>
          ))}
        </div>

        {/* Expandable Hardware Specifications (Accordion) */}
        <div className="border-t border-neutral-800 pt-3 mb-6">
          <button
            onClick={() => setShowSpecs(!showSpecs)}
            className="w-full flex items-center justify-between text-xs font-bold text-neutral-300 hover:text-white transition-colors py-1 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              Teknik Özellikler & Detaylar
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 text-purple-400 ${showSpecs ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {showSpecs && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden space-y-2 pt-3 text-xs"
              >
                <div className="flex justify-between py-1 border-b border-neutral-800">
                  <span className="text-neutral-400">Materyal:</span>
                  <span className="font-semibold text-white text-right">{product.specs.material}</span>
                </div>
                {product.specs.chipType && (
                  <div className="flex justify-between py-1 border-b border-neutral-800">
                    <span className="text-neutral-400">NFC Çipi:</span>
                    <span className="font-semibold text-purple-300 text-right">{product.specs.chipType}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-neutral-800">
                  <span className="text-neutral-400">Ebatlar:</span>
                  <span className="font-semibold text-white text-right">{product.specs.dimensions}</span>
                </div>
                {product.specs.finish && (
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-400">Yüzey:</span>
                    <span className="font-semibold text-white text-right">{product.specs.finish}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pricing & Order CTA Footer */}
      <div className="border-t border-neutral-800 pt-5 mt-auto">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white tracking-tight">
                {defaultPricing.unitPrice.toLocaleString('tr-TR')} {product.currency}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-neutral-400 line-through font-medium">
                  {product.originalPrice.toLocaleString('tr-TR')} {product.currency}
                </span>
              )}
            </div>
            <span className="text-xs text-neutral-400 font-medium">
              {product.isSubscription
                ? (product.billingPeriod || '/ Yıl')
                : '+ KDV Dahil'}
            </span>
          </div>

          {product.bulkTiers && product.bulkTiers.length > 1 && (
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              Toptan İndirimli
            </span>
          )}
        </div>

        <button
          onClick={() => onOrderClick(product, selectedColor)}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <span>Özelleştir & Sipariş Ver</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
