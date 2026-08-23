'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Layers,
  ShieldCheck,
  Cpu,
  RotateCw,
  Eye,
  Sliders,
  Check,
  Star,
  QrCode,
  Smartphone,
  ExternalLink,
  ArrowUpRight,
  Palette,
  Tag,
  CircleDot,
  Hexagon,
  Award,
} from 'lucide-react';
import type { Locale } from '@/lib/translations';
import { translations } from '@/lib/translations';
import type { ProductType } from './canvas/NfcHardwareScene';
import type { StandMaterialType } from './canvas/LStand3DModel';

// Dynamic SSR-safe import for Three.js WebGL canvas
const DynamicStand3D = dynamic(() => import('./Stand3D'), {
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
        3D L-Stand Motoru Yükleniyor...
      </p>
    </div>
  ),
});

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
        3D Donanım Yükleniyor...
      </p>
    </div>
  ),
});

interface Props {
  locale?: Locale;
}

export function NFCShowcase({ locale = 'tr' }: Props) {
  // Product Selector
  const [selectedProduct, setSelectedProduct] = useState<ProductType>('stand');

  // L-Stand Customizer State
  const [whiteMode, setWhiteMode] = useState<boolean>(true); // Default to Glossy Frost White as in reference image
  const [branding, setBranding] = useState<boolean>(true);
  const [logoText, setLogoText] = useState<string>('Baltazar');
  const [businessName, setBusinessName] = useState<string>('Gourmet Burger & Bistro');
  const [qrText, setQrText] = useState<string>('baltazar.nfcmyplace.com');
  const [showStars, setShowStars] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Sticker (Table Puck) Customizer State
  const [stickerPattern, setStickerPattern] = useState<1 | 2 | 3>(3);
  const [stickerVenueName, setStickerVenueName] = useState<string>('Baltazar Bistro');
  const [stickerTableNumber, setStickerTableNumber] = useState<string>('Masa #12');
  const [stickerPreviewMode, setStickerPreviewMode] = useState<'3d' | 'walnut'>('walnut');

  const t = translations[locale].canvas;

  const PRODUCTS: {
    id: ProductType;
    name: string;
    subtitle: string;
    tag: string;
    unitPrice: string;
    specs: { label: string; value: string; icon: typeof Layers }[];
  }[] = [
    {
      id: 'stand',
      name: t.standTitle,
      subtitle: t.standSubtitle,
      tag: t.tagStand,
      unitPrice: '₺1.750 TL / adet',
      specs: [
        {
          label: locale === 'tr' ? 'Gövde & Eğim Açısı' : 'Body & Tilt Angle',
          value: locale === 'tr' ? '75° Ergonomik Eğimli Monolitik Akrilik' : '75° Ergonomic Monolithic Acrylic Face',
          icon: Layers,
        },
        {
          label: locale === 'tr' ? 'Baskı & Decal Düzeni' : 'Decal Layout & Badges',
          value: locale === 'tr' ? 'Google G + 5 Altın Yıldız + Özel Logo & İsim Rozetleri' : 'Google G + 5 Gold Stars + Custom Pills',
          icon: Award,
        },
        {
          label: locale === 'tr' ? 'NFC & QR Hibrit Donanımı' : 'NFC & QR Hardware',
          value: 'NTAG213 Dual-Coil + Yüksek Kontrast QR Matrix',
          icon: Cpu,
        },
        {
          label: locale === 'tr' ? 'Okuma Hızı & Mesafe' : 'Read Speed & Range',
          value: '< 0.2s Anında Temassız (2 - 4 cm)',
          icon: Sparkles,
        },
      ],
    },
    {
      id: 'sticker',
      name: t.stickerTitle,
      subtitle: t.stickerSubtitle,
      tag: t.tagSticker,
      unitPrice: '₺175 TL / adet',
      specs: [
        {
          label: locale === 'tr' ? 'Desen Seçenekleri' : 'Pattern Variants',
          value: locale === 'tr' ? '3 Özel Lazer Desen (Altın Halka, Geometrik, Masa No)' : '3 Laser Patterns (Gold Rim, Geometric, Table No)',
          icon: Palette,
        },
        {
          label: locale === 'tr' ? 'Yapışkan & Koruma' : 'Adhesive & Rating',
          value: '3M Endüstriyel VHB Bond • IP68 Su Geçirmez Reçine',
          icon: ShieldCheck,
        },
        {
          label: locale === 'tr' ? 'Masa Uyumu' : 'Table Compatibility',
          value: locale === 'tr' ? 'Koyu Masif Ceviz, Mermer, Metal & Cam Masalar' : 'Dark Walnut Wood, Marble, Metal & Glass',
          icon: Layers,
        },
        {
          label: locale === 'tr' ? 'Kalınlık & Çap' : 'Dimensions',
          value: 'Ø 60mm & Ø 70mm • 2.0mm Ultra İnce Pleksi',
          icon: Sparkles,
        },
      ],
    },
    {
      id: 'card',
      name: t.cardTitle,
      subtitle: t.cardSubtitle,
      tag: t.tagCard,
      unitPrice: '₺350 TL / adet',
      specs: [
        {
          label: locale === 'tr' ? 'Kaplama & Varak' : 'Finish & Foil',
          value: locale === 'tr' ? 'Mat Kadife Siyah PVC + Sıcak Altın Varak' : 'Matte Velvet PVC + Gold Hot Foil',
          icon: Layers,
        },
        {
          label: locale === 'tr' ? 'Doğrudan Bağlantı' : 'Direct Link',
          value: 'Google Reviews 5-Star Direct Maps URL',
          icon: Cpu,
        },
        {
          label: locale === 'tr' ? 'Okuma Hızı' : 'Read Speed',
          value: '< 0.2 sn Anında Yönlendirme',
          icon: Sparkles,
        },
        {
          label: locale === 'tr' ? 'Standart Boyut' : 'Standard Size',
          value: '85.6 × 53.98 mm (ISO 7810 Standart Kart)',
          icon: ShieldCheck,
        },
      ],
    },
  ];

  const activeProduct = PRODUCTS.find((p) => p.id === selectedProduct) || PRODUCTS[0];

  return (
    <section id="customizer" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* ── HEADER TITLE ── */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{locale === 'tr' ? 'İnteraktif 3D Donanım & Decal Stüdyosu' : 'Interactive 3D Hardware & Decal Studio'}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          {locale === 'tr' ? 'Masanız İçin ' : 'Custom Crafted '}
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
            {locale === 'tr' ? 'Akıllı 3D L-Stand & Masa Diski' : '3D L-Stand & Table Puck'}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
          {locale === 'tr'
            ? 'Google 5 yıldız yorum rozeti, yüksek kontrastlı QR kod, Tap/Scan yönlendirmeleri ve dinamik marka rozetleriyle donatılmış yeni nesil akrilik L-Stand ve masa diskleri.'
            : 'Next-gen acrylic L-Stand & table pucks equipped with Google 5-star review badges, QR code matrix, Tap/Scan sub-actions, and dynamic brand pills.'}
        </p>
      </div>

      {/* ── PRODUCT SELECTOR TABS ── */}
      <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto p-1.5 bg-neutral-900/80 backdrop-blur-xl rounded-2xl border border-white/10 max-w-2xl mx-auto shadow-2xl">
        {PRODUCTS.map((prod) => {
          const isActive = prod.id === selectedProduct;
          return (
            <button
              key={prod.id}
              onClick={() => setSelectedProduct(prod.id)}
              className="relative px-5 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
              style={{ color: isActive ? '#000000' : 'rgba(255,255,255,0.7)' }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-showcase-tab"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 shadow-lg shadow-amber-500/25"
                  transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                />
              )}
              <span className="relative z-10">{prod.name.split(' ')[0]} {prod.name.split(' ')[1] || ''}</span>
            </button>
          );
        })}
      </div>

      {/* ── MAIN WORKSPACE GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left / Center: 3D Interactive WebGL Stand or Walnut Table Preview */}
        <div className="lg:col-span-8 relative min-h-[500px] sm:min-h-[560px] rounded-3xl border border-white/10 overflow-hidden bg-neutral-950/80 backdrop-blur-2xl shadow-2xl flex flex-col justify-between p-6">
          {/* Radial Studio Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-amber-500/15 via-yellow-500/5 to-transparent blur-3xl pointer-events-none" />

          {/* Top Controls Bar */}
          <div className="relative z-20 flex items-center justify-between w-full flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {activeProduct.tag}
              </span>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/15">
                {activeProduct.unitPrice}
              </span>
            </div>

            {/* Sticker Preview Mode Switcher or Auto Rotate Toggle */}
            <div className="flex items-center gap-2">
              {selectedProduct === 'sticker' && (
                <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setStickerPreviewMode('walnut')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      stickerPreviewMode === 'walnut'
                        ? 'bg-amber-500 text-black font-black shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {locale === 'tr' ? '🌳 Masif Ceviz Masa' : '🌳 Walnut Table'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStickerPreviewMode('3d')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      stickerPreviewMode === '3d'
                        ? 'bg-amber-500 text-black font-black shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {locale === 'tr' ? '🔮 3D Canvas' : '🔮 3D Canvas'}
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                  autoRotate
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                }`}
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

          {/* Center Display Viewport */}
          <div className="relative w-full h-[390px] sm:h-[430px] my-auto flex items-center justify-center">
            {/* 1. L-STAND 3D CANVAS */}
            {selectedProduct === 'stand' && (
              <div className="w-full h-full cursor-grab active:cursor-grabbing">
                <DynamicStand3D
                  white={whiteMode}
                  branding={branding}
                  logoText={logoText}
                  businessName={businessName}
                  qrText={qrText}
                  showStars={showStars}
                  material={whiteMode ? 'crystal' : 'black'}
                  autoRotate={autoRotate}
                />
              </div>
            )}

            {/* 2. STICKER SECTION (REALISTIC WALNUT WOOD TABLE VIEW OR 3D) */}
            {selectedProduct === 'sticker' && stickerPreviewMode === 'walnut' && (
              <div className="relative w-full max-w-lg h-80 rounded-2xl overflow-hidden shadow-2xl border border-amber-950/60 flex items-center justify-center p-8 bg-gradient-to-br from-[#2a170d] via-[#1c0f08] to-[#120a05]">
                {/* Simulated Luxury Dark Walnut Wood Surface Grain & Lighting */}
                <div
                  className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 8px), radial-gradient(circle at 50% 30%, rgba(245,158,11,0.15), transparent 70%)`,
                  }}
                />

                {/* Soft Table Ambient Shadow under Sticker */}
                <div className="absolute w-56 h-56 rounded-full bg-black/80 blur-xl pointer-events-none transform translate-y-3" />

                {/* Realistic 2mm Acrylic Sticker Disc */}
                <motion.div
                  key={stickerPattern + stickerVenueName + stickerTableNumber}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 260 }}
                  className="relative w-52 h-52 rounded-full border-4 border-amber-500/80 bg-gradient-to-b from-[#18181c] via-[#101014] to-[#0a0a0d] shadow-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer group select-none ring-2 ring-amber-400/30"
                >
                  {/* Outer Glossy Resin Reflection Flare */}
                  <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" />

                  {/* ── PATTERN 1: MINIMALIST GOLD RIM ── */}
                  {stickerPattern === 1 && (
                    <div className="space-y-2 relative z-10">
                      <div className="w-40 h-40 rounded-full border border-amber-400/50 flex flex-col items-center justify-center space-y-1.5 p-3">
                        <div className="w-11 h-11 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-400 font-black text-xs shadow-md shadow-amber-500/30 bg-amber-500/10">
                          NFC
                        </div>
                        <span className="text-[11px] font-black tracking-widest text-amber-300 uppercase">
                          TEMASSIZ MENÜ
                        </span>
                        <span className="text-[9px] font-medium text-white/50 tracking-wider">
                          DOKUNDURUN
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ── PATTERN 2: GEOMETRIC BORDER ── */}
                  {stickerPattern === 2 && (
                    <div className="relative z-10 w-40 h-40 rounded-full border-2 border-dashed border-amber-400/60 flex flex-col items-center justify-center space-y-2 p-2">
                      <div className="w-12 h-12 rotate-45 border-2 border-amber-400 flex items-center justify-center bg-amber-500/10">
                        <span className="-rotate-45 font-black text-amber-300 text-xs tracking-wider">
                          NFC
                        </span>
                      </div>
                      <span className="text-[10px] font-black tracking-widest text-white uppercase">
                        SMART CONTACTLESS
                      </span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      </div>
                    </div>
                  )}

                  {/* ── PATTERN 3: CUSTOM VENUE LOGO & TABLE NUMBER ── */}
                  {stickerPattern === 3 && (
                    <div className="space-y-2 relative z-10 w-full flex flex-col items-center">
                      <div className="text-xs font-black tracking-wider text-amber-400 uppercase truncate max-w-[140px]">
                        {stickerVenueName || 'Baltazar Bistro'}
                      </div>
                      <div className="w-11 h-11 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-300 font-black text-xs shadow-lg shadow-amber-500/20 bg-amber-500/10">
                        NFC
                      </div>
                      <div className="px-3.5 py-1 rounded-md bg-neutral-900 border border-amber-500/50 text-[11px] font-black tracking-widest text-white uppercase shadow-sm">
                        {stickerTableNumber || 'MASA #12'}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            )}

            {selectedProduct === 'sticker' && stickerPreviewMode === '3d' && (
              <div className="w-full h-full cursor-grab active:cursor-grabbing">
                <DynamicHardwareScene
                  product="sticker"
                  patternVariant={stickerPattern}
                  venueName={stickerVenueName}
                  tableNumber={stickerTableNumber}
                  autoRotate={autoRotate}
                />
              </div>
            )}

            {/* 3. GOOGLE REVIEW CARD */}
            {selectedProduct === 'card' && (
              <div className="w-full h-full cursor-grab active:cursor-grabbing">
                <DynamicHardwareScene
                  product="card"
                  autoRotate={autoRotate}
                />
              </div>
            )}
          </div>

          {/* Bottom Customization Quick-Bar */}
          <div className="relative z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">{activeProduct.name}</h3>
              <p className="text-xs text-white/50">{activeProduct.subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-white/50 font-semibold">{locale === 'tr' ? 'Birim Fiyat' : 'Unit Price'}</div>
                <div className="text-sm sm:text-base font-black text-amber-400">{activeProduct.unitPrice}</div>
              </div>
              <a
                href="#pricing"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs shadow-lg shadow-amber-500/20 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{locale === 'tr' ? 'Hemen Sipariş Ver' : 'Order Now'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Interactive Customizer Panel & Specs */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          {/* ────────────────────────────────────────────────────────
              1. L-STAND CUSTOMIZER PANEL
              ──────────────────────────────────────────────────────── */}
          {selectedProduct === 'stand' && (
            <div className="rounded-3xl border border-white/10 bg-neutral-900/70 backdrop-blur-xl p-6 shadow-2xl space-y-4">
              <h4 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                {locale === 'tr' ? '3D L-Stand Tasarımı & Decal' : '3D L-Stand Decal Studio'}
              </h4>

              {/* Acrylic Finish: Glossy Frost White vs Matte Obsidian Black */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/70 block">
                  {locale === 'tr' ? 'Akrilik Gövde Materyali' : 'Acrylic Body Finish'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWhiteMode(true)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      whiteMode
                        ? 'border-amber-500 bg-amber-500/10 text-white ring-1 ring-amber-500/40'
                        : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full border border-slate-300 bg-white shrink-0 shadow-sm" />
                    <span className="truncate">{locale === 'tr' ? 'Buzlu Beyaz Akrilik' : 'Glossy Frost White'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWhiteMode(false)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      !whiteMode
                        ? 'border-amber-500 bg-amber-500/10 text-white ring-1 ring-amber-500/40'
                        : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full border border-neutral-700 bg-neutral-950 shrink-0 shadow-sm" />
                    <span className="truncate">{locale === 'tr' ? 'Saten Mat Siyah' : 'Obsidian Black'}</span>
                  </button>
                </div>
              </div>

              {/* Logo / Brand Text Input */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-white/70 block">
                  {locale === 'tr' ? 'Logo / Marka Yazısı (Rozet 1)' : 'Logo / Brand Pill Badge'}
                </label>
                <input
                  type="text"
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  placeholder="Baltazar / Your Logo"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500 transition-all font-semibold"
                />
              </div>

              {/* Business Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70 block">
                  {locale === 'tr' ? 'İşletme Adı (Rozet 2 - Opsiyonel)' : 'Business Name (Optional)'}
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Gourmet Burger & Bistro"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500 transition-all text-white/90"
                />
              </div>

              {/* QR Plate Text Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70 block">
                  {locale === 'tr' ? 'QR Yönlendirme Bağlantısı' : 'QR Destination Link'}
                </label>
                <input
                  type="text"
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  placeholder="baltazar.nfcmyplace.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500 transition-all font-mono"
                />
              </div>

              {/* 5-Star Badge Toggle */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{locale === 'tr' ? 'Google 5 Altın Yıldız' : 'Google 5 Gold Stars'}</span>
                  </div>
                  <div className="text-[11px] text-white/50">
                    {locale === 'tr' ? 'Google G altında 5 altın yıldız rozeti' : 'Show 5 gold stars under Google G'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStars(!showStars)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    showStars ? 'bg-amber-500' : 'bg-neutral-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      showStars ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Branding Badges Toggle */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{locale === 'tr' ? 'Özel Marka Rozetleri' : 'Custom Brand Badges'}</span>
                  </div>
                  <div className="text-[11px] text-white/50">
                    {locale === 'tr' ? 'Logo ve işletme adı rozetlerini göster' : 'Show logo & business name pills'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBranding(!branding)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    branding ? 'bg-amber-500' : 'bg-neutral-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      branding ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              2. CUSTOMIZABLE ACRYLIC TABLE STICKER PANEL
              ──────────────────────────────────────────────────────── */}
          {selectedProduct === 'sticker' && (
            <div className="rounded-3xl border border-white/10 bg-neutral-900/70 backdrop-blur-xl p-6 shadow-2xl space-y-4">
              <h4 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                {locale === 'tr' ? 'Masa Diski Desen Seçici' : 'Table Sticker Pattern Studio'}
              </h4>

              {/* 3 Pattern Variants */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/70 block">
                  {locale === 'tr' ? 'Lazer Kazıma Desen Tipi' : 'Laser Engraved Pattern'}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {/* Pattern 1: Minimalist Gold Rim */}
                  <button
                    type="button"
                    onClick={() => setStickerPattern(1)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      stickerPattern === 1
                        ? 'border-amber-500 bg-amber-500/10 text-white ring-1 ring-amber-500/40'
                        : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CircleDot className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="font-bold text-white">
                          {locale === 'tr' ? 'Desen 1: Minimalist Altın Halka' : 'Pattern 1: Minimalist Gold Rim'}
                        </div>
                        <div className="text-[10px] text-white/50">
                          {locale === 'tr' ? 'Zarif metalik altın çerçeve & NFC çipi' : 'Sleek gold metallic border & center NFC'}
                        </div>
                      </div>
                    </div>
                    {stickerPattern === 1 && <Check className="w-4 h-4 text-amber-400" />}
                  </button>

                  {/* Pattern 2: Geometric Border */}
                  <button
                    type="button"
                    onClick={() => setStickerPattern(2)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      stickerPattern === 2
                        ? 'border-amber-500 bg-amber-500/10 text-white ring-1 ring-amber-500/40'
                        : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Hexagon className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="font-bold text-white">
                          {locale === 'tr' ? 'Desen 2: Geometrik Lazer Bordür' : 'Pattern 2: Geometric Border'}
                        </div>
                        <div className="text-[10px] text-white/50">
                          {locale === 'tr' ? 'Art-deco / Hexagonal altın kazıma desen' : 'Art-deco / Hexagonal etched pattern'}
                        </div>
                      </div>
                    </div>
                    {stickerPattern === 2 && <Check className="w-4 h-4 text-amber-400" />}
                  </button>

                  {/* Pattern 3: Custom Logo & Table Number */}
                  <button
                    type="button"
                    onClick={() => setStickerPattern(3)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      stickerPattern === 3
                        ? 'border-amber-500 bg-amber-500/10 text-white ring-1 ring-amber-500/40'
                        : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="font-bold text-white">
                          {locale === 'tr' ? 'Desen 3: Özel Logo & Masa Numarası' : 'Pattern 3: Custom Logo & Table No'}
                        </div>
                        <div className="text-[10px] text-white/50">
                          {locale === 'tr' ? 'Mekan logosu + belirgin Masa #12 rozeti' : 'Venue logo + Table #12 badge'}
                        </div>
                      </div>
                    </div>
                    {stickerPattern === 3 && <Check className="w-4 h-4 text-amber-400" />}
                  </button>
                </div>
              </div>

              {/* Dynamic Inputs for Pattern 3 */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className="text-xs font-bold text-white/70 block">
                  {locale === 'tr' ? 'Mekan Adı / Logo Metni' : 'Venue Name / Logo'}
                </label>
                <input
                  type="text"
                  value={stickerVenueName}
                  onChange={(e) => setStickerVenueName(e.target.value)}
                  placeholder="Baltazar Bistro"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500 transition-all font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/70 block">
                  {locale === 'tr' ? 'Masa Numarası Rozeti' : 'Table Number Badge'}
                </label>
                <input
                  type="text"
                  value={stickerTableNumber}
                  onChange={(e) => setStickerTableNumber(e.target.value)}
                  placeholder="MASA #12"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500 transition-all font-bold"
                />
              </div>
            </div>
          )}

          {/* Technical Specs Card */}
          <div className="rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl p-6 shadow-2xl space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              {locale === 'tr' ? 'Teknik Donanım Özellikleri' : 'Hardware Specifications'}
            </h4>

            <div className="space-y-2.5">
              {activeProduct.specs.map((spec, i) => {
                const Icon = spec.icon;
                return (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/30 transition-all flex items-start gap-3"
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

          {/* Plug & Play Delivery Guarantee */}
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              {locale === 'tr' ? 'Kullanıma Hazır Ön Programlı Teslimat' : 'Plug & Play Pre-Configured'}
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              {locale === 'tr'
                ? 'Tüm L-Stand ve masa diskleri restoranınızın menü bağlantısı ve masa numaralarıyla eşleşmiş şekilde, anında kullanıma hazır gönderilir.'
                : 'All stands and table pucks arrive pre-programmed with your restaurant URL, branding, and table context.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NFCShowcase;
