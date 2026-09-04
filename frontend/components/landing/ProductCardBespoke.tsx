'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle2, Radio, ArrowRight, Layers, ChevronDown, Sparkles } from 'lucide-react';
import type { ProductItem, ProductColor } from '@/lib/products';
import { calculateProductPrice } from '@/lib/products';

const COLOR_META: Record<ProductColor, { label: string; swatch: string }> = {
  black: { label: 'Mat Siyah', swatch: '#1A1A1A' },
  white: { label: 'Parlak Beyaz', swatch: '#F0EDE8' },
  transparent: {
    label: 'Şeffaf Pleksi',
    swatch: 'linear-gradient(135deg, rgba(200,230,250,0.6), rgba(255,255,255,0.4))',
  },
};

interface Props {
  product: ProductItem;
  onOrderClick: (p: ProductItem, c?: ProductColor) => void;
  isBundle?: boolean;
}

export function ProductCardBespoke({ product, onOrderClick, isBundle = false }: Props) {
  const [color, setColor] = useState<ProductColor>(product.colors?.[0] ?? 'black');
  const [specsOpen, setSpecsOpen] = useState(false);

  const img = product.images[color] ?? product.images.default;
  const { unitPrice, discountPercentage } = calculateProductPrice(product, 1);

  const gold = '#C9A86C';
  const goldDim = 'rgba(201,168,108,0.6)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55 }}
      className={`group relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 ${
        isBundle ? 'md:col-span-2 lg:col-span-3' : ''
      }`}
      style={{
        background: isBundle
          ? 'linear-gradient(135deg, rgba(30,22,10,0.96) 0%, rgba(22,16,6,0.98) 100%)'
          : 'rgba(18,14,8,0.85)',
        border: isBundle ? '1px solid rgba(201,168,108,0.4)' : '1px solid rgba(201,168,108,0.12)',
        boxShadow: isBundle
          ? '0 0 60px rgba(180,130,40,0.12), 0 20px 60px rgba(0,0,0,0.6)'
          : '0 8px 40px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(24px)',
      }}
      whileHover={{ y: -4 }}
    >
      {/* Top subtle highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,108,0.7), transparent)' }}
      />

      {/* ── Product Image ── */}
      <div className="relative h-56 overflow-hidden bg-neutral-950">
        <Image
          src={img ?? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(13,11,6,0.96) 0%, rgba(13,11,6,0.3) 50%, transparent 100%)',
          }}
        />

        {/* Category badge */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: 'rgba(13,10,5,0.88)', border: '1px solid rgba(201,168,108,0.35)', color: gold }}
        >
          <Radio className="w-3 h-3" style={{ color: gold }} />
          {product.categoryLabel}
        </div>

        {/* NFC Chip Badge */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold"
          style={{ background: 'rgba(13,10,5,0.88)', border: '1px solid rgba(201,168,108,0.2)', color: goldDim }}
        >
          <Zap className="w-3 h-3" style={{ color: gold }} />
          {product.specs.chipType?.split(' ')[1] ?? 'NFC'}
        </div>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div
            className="absolute bottom-3 left-3 flex items-center gap-2 p-1.5 rounded-full"
            style={{ background: 'rgba(13,10,5,0.88)', border: '1px solid rgba(201,168,108,0.25)' }}
          >
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(c);
                }}
                title={COLOR_META[c].label}
                className="w-5 h-5 rounded-full transition-all cursor-pointer"
                style={{
                  background: COLOR_META[c].swatch,
                  outline: color === c ? `2px solid ${gold}` : 'none',
                  outlineOffset: '2px',
                  transform: color === c ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-6 sm:p-7 gap-4">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {product.badge && (
            <span
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold"
              style={{
                background: 'rgba(201,168,108,0.12)',
                border: '1px solid rgba(201,168,108,0.35)',
                color: gold,
              }}
            >
              <Sparkles className="w-3 h-3" /> {product.badge}
            </span>
          )}
          {isBundle && (
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold"
              style={{
                background: 'rgba(201,168,108,0.08)',
                border: '1px solid rgba(201,168,108,0.2)',
                color: goldDim,
              }}
            >
              Hepsi Bir Arada Çözüm
            </span>
          )}
        </div>

        {/* Title & Tagline */}
        <div>
          <h3
            className="text-xl sm:text-2xl font-black tracking-tight mb-1.5 transition-colors group-hover:text-[#E2C99A]"
            style={{ color: '#F0E6D3', lineHeight: 1.2 }}
          >
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed line-clamp-2" style={{ color: 'rgba(180,152,104,0.75)' }}>
            {product.tagline}
          </p>
        </div>

        {/* Features list */}
        <div className="space-y-2">
          {product.features.slice(0, isBundle ? 5 : 3).map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(215,195,160,0.9)' }}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: '#C9A86C' }} />
              <span className="leading-snug">{f}</span>
            </div>
          ))}
        </div>

        {/* Technical specs accordion */}
        <div style={{ borderTop: '1px solid rgba(201,168,108,0.1)' }} className="pt-3">
          <button
            onClick={() => setSpecsOpen(!specsOpen)}
            className="w-full flex items-center justify-between text-xs font-bold cursor-pointer transition-colors hover:text-[#C9A86C]"
            style={{ color: 'rgba(180,152,104,0.7)' }}
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" style={{ color: gold }} />
              Teknik Özellikler
            </span>
            <ChevronDown
              className="w-4 h-4 transition-transform"
              style={{ transform: specsOpen ? 'rotate(180deg)' : 'none', color: gold }}
            />
          </button>

          <AnimatePresence>
            {specsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden pt-3 space-y-2 text-xs"
              >
                {[
                  ['Materyal', product.specs.material],
                  ...(product.specs.chipType ? [['NFC Çipi', product.specs.chipType]] : []),
                  ['Ebatlar', product.specs.dimensions],
                  ...(product.specs.finish ? [['Yüzey İşlemi', product.specs.finish]] : []),
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between py-1"
                    style={{ borderBottom: '1px solid rgba(201,168,108,0.08)' }}
                  >
                    <span style={{ color: 'rgba(180,152,104,0.55)' }}>{k}</span>
                    <span className="font-semibold text-right max-w-[55%]" style={{ color: '#D4BC96' }}>
                      {v}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pricing and CTA */}
        <div className="mt-auto pt-4" style={{ borderTop: '1px solid rgba(201,168,108,0.1)' }}>
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black" style={{ color: '#F0E6D3' }}>
                  {unitPrice.toLocaleString('tr-TR')} {product.currency}
                </span>
                {product.originalPrice && (
                  <span className="text-sm line-through" style={{ color: 'rgba(180,152,104,0.45)' }}>
                    {product.originalPrice.toLocaleString('tr-TR')} {product.currency}
                  </span>
                )}
              </div>
              <span className="text-xs" style={{ color: 'rgba(180,152,104,0.55)' }}>
                {product.isSubscription ? product.billingPeriod ?? '/ Yıl' : 'KDV Dahil'}
              </span>
            </div>
            {product.bulkTiers && product.bulkTiers.length > 1 && (
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-lg"
                style={{
                  background: 'rgba(201,168,108,0.1)',
                  border: '1px solid rgba(201,168,108,0.25)',
                  color: gold,
                }}
              >
                Toptan İndirimli
              </span>
            )}
          </div>

          <button
            onClick={() => onOrderClick(product, color)}
            className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group/btn"
            style={{
              background: isBundle
                ? 'linear-gradient(135deg, #C9A86C 0%, #8A5C2A 100%)'
                : 'linear-gradient(135deg, rgba(201,168,108,0.2) 0%, rgba(201,168,108,0.08) 100%)',
              border: '1px solid rgba(201,168,108,0.4)',
              color: isBundle ? '#0D0B08' : '#C9A86C',
              boxShadow: isBundle ? '0 8px 28px rgba(180,130,40,0.35)' : 'none',
            }}
          >
            Özelleştir & Sipariş Ver
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
