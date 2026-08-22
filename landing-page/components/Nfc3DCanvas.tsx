'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Layers, ShieldCheck, Cpu, RotateCw, Eye } from 'lucide-react';
import type { Locale } from '@/lib/translations';
import { translations } from '@/lib/translations';
import type { ProductType } from './canvas/NfcHardwareScene';

// Dynamic import with SSR false to prevent hydration errors with Three.js WebGL canvas
const DynamicHardwareScene = dynamic(() => import('./canvas/NfcHardwareScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping" />
        <div className="w-full h-full rounded-full border-2 border-amber-500/80 border-t-transparent animate-spin flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 backdrop-blur-sm" />
        </div>
      </div>
      <p className="text-xs font-mono text-amber-300/70 tracking-widest uppercase animate-pulse">
        3D Donanım Motoru Yükleniyor...
      </p>
    </div>
  ),
});

interface Props {
  locale?: Locale;
}

export function Nfc3DCanvas({ locale = 'tr' }: Props) {
  const [selected, setSelected] = useState<ProductType>('stand');
  const [autoRotate, setAutoRotate] = useState(true);

  const t = translations[locale].canvas;

  const PRODUCTS: {
    id: ProductType;
    name: string;
    subtitle: string;
    tag: string;
    specs: { label: string; value: string; icon: typeof Layers }[];
  }[] = [
    {
      id: 'stand',
      name: t.standTitle,
      subtitle: t.standSubtitle,
      tag: t.tagStand,
      specs: [
        {
          label: locale === 'tr' ? 'Gövde Materyali' : 'Body Material',
          value: locale === 'tr' ? 'Doğal Masif Ceviz & 4mm Pleksi' : 'Walnut Wood & 4mm Acrylic',
          icon: Layers,
        },
        {
          label: locale === 'tr' ? 'Çip Mimarisi' : 'NFC Standard',
          value: 'NTAG213 / NTAG215 Dual-Coil',
          icon: Cpu,
        },
        {
          label: locale === 'tr' ? 'Okuma Mesafesi' : 'Scan Distance',
          value: '2 - 4 cm (Instant Tap)',
          icon: Sparkles,
        },
        {
          label: locale === 'tr' ? 'Dayanıklılık' : 'Durability',
          value: locale === 'tr' ? 'Çizilmez UV Koruyucu Yüzey' : 'Scratch-Proof UV Coated',
          icon: ShieldCheck,
        },
      ],
    },
    {
      id: 'card',
      name: t.cardTitle,
      subtitle: t.cardSubtitle,
      tag: t.tagCard,
      specs: [
        {
          label: locale === 'tr' ? 'Kaplama' : 'Finish',
          value: locale === 'tr' ? 'Mat Kadife Siyah + Altın Varak' : 'Matte Velvet + Gold Hot Foil',
          icon: Layers,
        },
        {
          label: locale === 'tr' ? 'Doğrudan Bağlantı' : 'Direct Link',
          value: 'Google Reviews 5-Star URL',
          icon: Cpu,
        },
        {
          label: locale === 'tr' ? 'Okuma Hızı' : 'Read Speed',
          value: '< 0.2 sn Tepki Süresi',
          icon: Sparkles,
        },
        {
          label: locale === 'tr' ? 'Standart Boyut' : 'Standard Size',
          value: '85.6 × 53.98 mm (ISO 7810)',
          icon: ShieldCheck,
        },
      ],
    },
    {
      id: 'sticker',
      name: t.stickerTitle,
      subtitle: t.stickerSubtitle,
      tag: t.tagSticker,
      specs: [
        {
          label: locale === 'tr' ? 'Yapışkan Katman' : 'Adhesive Layer',
          value: '3M Industrial VHB Bond',
          icon: Layers,
        },
        {
          label: locale === 'tr' ? 'Koruma Sınıfı' : 'Protection Rating',
          value: 'IP68 Su & Sıvı Geçirmez',
          icon: ShieldCheck,
        },
        {
          label: locale === 'tr' ? 'Anten Tipi' : 'Antenna Type',
          value: 'Ferrite Anti-Metal Shielding',
          icon: Cpu,
        },
        {
          label: locale === 'tr' ? 'Uygulama Alanı' : 'Best For',
          value: locale === 'tr' ? 'Metal & Ahşap Dış Mekan Masalar' : 'Metal & Wood Outdoor Tables',
          icon: Sparkles,
        },
      ],
    },
  ];

  const activeProduct = PRODUCTS.find((p) => p.id === selected) || PRODUCTS[0];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* ── HEADER TITLE ── */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{locale === 'tr' ? 'Gerçekçi 3D Donanım Stüdyosu' : 'Realistic 3D Hardware Studio'}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          {locale === 'tr' ? 'Masanız İçin Özel ' : 'Custom Crafted for Your '}
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
            {locale === 'tr' ? 'Premium Donanımlar' : 'Table Experience'}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-white/50 max-w-2xl mx-auto">
          {locale === 'tr'
            ? 'Endüstriyel kalitede işlenmiş ceviz ahşap, kristal akrilik ve altın varak NFC teknolojisi.'
            : 'Engineered walnut wood, crystal clear acrylic, and gold-foil NFC hardware ready for your venue.'}
        </p>
      </div>

      {/* ── PRODUCT SELECTOR TABS ── */}
      <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto p-1.5 bg-neutral-900/80 backdrop-blur-xl rounded-2xl border border-white/10 max-w-2xl mx-auto shadow-2xl">
        {PRODUCTS.map((prod) => {
          const isActive = prod.id === selected;
          return (
            <button
              key={prod.id}
              onClick={() => setSelected(prod.id)}
              className="relative px-5 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
              style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)' }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-product-tab"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg shadow-amber-500/25"
                  transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                />
              )}
              <span className="relative z-10">{prod.name.split(' ')[0]} {prod.name.split(' ')[1]}</span>
            </button>
          );
        })}
      </div>

      {/* ── 3D VIEWPORT CONTAINER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left / Main: 3D Interactive Canvas */}
        <div className="lg:col-span-8 relative min-h-[460px] sm:min-h-[520px] rounded-3xl border border-white/10 overflow-hidden bg-neutral-950/80 backdrop-blur-xl shadow-2xl flex flex-col justify-between p-6">
          {/* Radial Studio Ambient Glow Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/15 via-yellow-500/5 to-transparent blur-3xl pointer-events-none" />

          {/* Top Controls Bar */}
          <div className="relative z-20 flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {activeProduct.tag}
              </span>
            </div>

            {/* Auto-Rotate Switcher & Drag Hint */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                  autoRotate
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                }`}
                title={locale === 'tr' ? 'Otomatik Döndürme' : 'Auto Rotate'}
              >
                <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin-slow' : ''}`} />
                <span className="hidden sm:inline">
                  {autoRotate ? (locale === 'tr' ? 'Döndürme Açık' : 'Rotating') : (locale === 'tr' ? 'Durduruldu' : 'Paused')}
                </span>
              </button>

              <span className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/50">
                <Eye className="w-3 h-3 text-amber-400" />
                {t.dragHint}
              </span>
            </div>
          </div>

          {/* 3D WebGL Canvas Viewport */}
          <div className="relative w-full h-[360px] sm:h-[400px] my-auto cursor-grab active:cursor-grabbing">
            <DynamicHardwareScene product={selected} autoRotate={autoRotate} />
          </div>

          {/* Bottom Title Bar */}
          <div className="relative z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-4 border-t border-white/5">
            <div>
              <h3 className="text-lg font-black text-white">{activeProduct.name}</h3>
              <p className="text-xs text-white/50">{activeProduct.subtitle}</p>
            </div>
            <a
              href="#pricing"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-md shadow-amber-500/20 transition-all shrink-0"
            >
              {locale === 'tr' ? 'Bu Ürünü Seç' : 'Choose This'}
            </a>
          </div>
        </div>

        {/* Right: Technical Specs & Advantages */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          <div className="rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl p-6 shadow-2xl space-y-6">
            <h4 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              {locale === 'tr' ? 'Teknik Özellikler' : 'Hardware Specs'}
            </h4>

            <div className="space-y-4">
              {activeProduct.specs.map((spec, i) => {
                const Icon = spec.icon;
                return (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/30 transition-all flex items-start gap-3.5"
                  >
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-white/50">{spec.label}</div>
                      <div className="text-xs font-bold text-white mt-0.5">{spec.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Plug & Play Guarantee Card */}
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              {locale === 'tr' ? 'Hazır Yapılandırılmış Teslimat' : 'Pre-Configured Delivery'}
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              {locale === 'tr'
                ? 'Tüm donanımlar restoranınızın menü linki ve masa numaralarıyla eşleşmiş şekilde, anında kullanıma hazır gönderilir.'
                : 'All hardware arrives fully pre-programmed with your venue URL, branding, and designated table IDs.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nfc3DCanvas;
