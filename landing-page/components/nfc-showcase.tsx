'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Sparkles,
  Layers,
  ShieldCheck,
  Cpu,
  RotateCw,
  Eye,
  Sliders,
  ArrowUpRight,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import type { Locale } from '@/lib/translations';
import { translations } from '@/lib/translations';
export { StickerSection } from './StickerSection';

// Dynamic SSR-safe import for Three.js WebGL 3D L-Stand
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

export interface NFCShowcaseProps {
  locale?: Locale;
  onOrderClick?: () => void;
}

export interface SpecItem {
  label: string;
  value: string;
  icon: typeof Layers;
}

export function NFCShowcase({ locale = 'tr', onOrderClick }: NFCShowcaseProps) {
  // L-Stand Customizer State - Streamlined to color selection & auto-rotate
  const [whiteMode, setWhiteMode] = useState<boolean>(false); // Default: Matte Obsidian Black
  // Short expanding/fading amber ring pulse on swatch click - purely
  // decorative feedback, auto-clears itself once the animation completes.
  const [colorPulse, setColorPulse] = useState<{ id: number; mode: 'black' | 'white' } | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  const t = translations[locale];

  const SPECS: SpecItem[] = [
    {
      label: locale === 'tr' ? 'Gövde & Eğim Açısı' : 'Body & Tilt Angle',
      value: locale === 'tr' ? '75° Monolitik Pleksi Akrilik' : '75° Monolithic Plexi Acrylic Face',
      icon: Layers,
    },
    {
      label: locale === 'tr' ? 'NFC & QR Hibrit Çip' : 'NFC & QR Hybrid Chip',
      value: locale === 'tr' ? 'NTAG213 Hibrit Çip + Yüksek Kontrast QR' : 'NTAG213 Hybrid Chip + High Contrast QR',
      icon: Cpu,
    },
    {
      label: locale === 'tr' ? 'Okuma Hızı & Mesafe' : 'Read Speed & Range',
      value: locale === 'tr' ? '<0.2sn Temassız Okuma (2 - 4 cm)' : '<0.2s Contactless Read (2 - 4 cm)',
      icon: Sparkles,
    },
  ];

  return (
    <section id="customizer" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 scroll-mt-20">
      {/* ── SECTION HEADER ── */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.stand.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-100 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
          {locale === 'tr' ? 'Özel Kurumsal Tasarım ' : 'Custom Corporate Design '}
          <span className="text-zinc-100 font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-amber-400 bg-clip-text text-transparent drop-shadow-sm inline-block">
            {locale === 'tr' ? 'NFC & QR Google Yorum Standı' : 'NFC & QR Google Review Stand'}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
          {t.stand.subtitle}
        </p>
      </div>

      {/* ── MAIN 3D WORKSPACE GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left / Center: 3D Interactive WebGL Stand in Studio Pedestal Viewport */}
        <div className="lg:col-span-8 relative min-h-[520px] sm:min-h-[580px] rounded-3xl border border-white/10 overflow-hidden bg-gradient-to-b from-[#16161a] via-[#1a1a22] to-[#222228] backdrop-blur-2xl shadow-2xl flex flex-col justify-between p-6">
          {/* Studio Pedestal Ambient Spotlight Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 45%, rgba(60, 60, 75, 0.35) 0%, rgba(26, 26, 32, 0.7) 60%, rgba(18, 18, 22, 0.95) 100%)',
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-amber-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

          {/* Top Controls Bar */}
          <div className="relative z-20 flex items-center justify-between w-full flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {locale === 'tr' ? '3D İnteraktif Model' : '3D Interactive Model'}
              </span>
              <span className="text-[11px] font-black px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40">
                1.750 TL / Adet
              </span>
            </div>

            {/* Auto Rotate & Drag Hint */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                aria-pressed={autoRotate}
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
                {t.stand.dragHint}
              </span>
            </div>
          </div>

          {/* Center 3D Viewport */}
          <div className="relative w-full h-[400px] sm:h-[450px] my-auto flex items-center justify-center cursor-grab active:cursor-grabbing z-10">
            <DynamicStand3D
              white={whiteMode}
              branding={true}
              logoText="doremusic"
              businessName="doremusic Akasya AVM"
              qrText="g.page/r/doremusic"
              showStars={true}
              template="templateA"
              material={whiteMode ? 'white' : 'black'}
              autoRotate={autoRotate}
            />
          </div>

          {/* Bottom Stand Info Strip */}
          <div className="relative z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">{t.stand.title}</h3>
              <p className="text-xs text-white/50">
                {whiteMode
                  ? (locale === 'tr' ? 'Mat Frost Beyaz Akrilik Gövde' : 'Matte Frost White Acrylic Body')
                  : (locale === 'tr' ? 'Mat Obsidyen Siyah Akrilik Gövde' : 'Matte Obsidian Black Acrylic Body')}
                {' • '}
                {locale === 'tr' ? '75° Ergonomik Görüş Açısı' : '75° Ergonomic Inclination'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-white/50 font-semibold">{locale === 'tr' ? 'Birim Fiyat' : 'Unit Price'}</div>
                <div className="text-base font-black text-amber-400">1.750 TL</div>
              </div>
              <button
                type="button"
                onClick={onOrderClick}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs shadow-lg shadow-amber-500/20 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer transform active:scale-95"
              >
                <span>{locale === 'tr' ? 'Hemen Sipariş Ver' : 'Order Now'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Streamlined Customizer Panel & Specs */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          {/* Customizer Controls Card (Color Switcher + Price & CTA) */}
          <div className="rounded-3xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl p-6 shadow-2xl space-y-5">
            <h4 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>{locale === 'tr' ? 'Gövde Rengi Seçimi' : 'Body Color Selection'}</span>
            </h4>

            {/* Gövde Rengi: Mat Siyah vs Mat Beyaz */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>{locale === 'tr' ? 'Gövde Rengi' : 'Body Color'}</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setWhiteMode(false);
                    setColorPulse({ id: Date.now(), mode: 'black' });
                  }}
                  aria-pressed={!whiteMode}
                  className={`relative p-3 rounded-2xl border text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    !whiteMode
                      ? 'border-amber-500 bg-amber-500/15 text-white ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10'
                      : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <AnimatePresence>
                    {colorPulse && colorPulse.mode === 'black' && (
                      <motion.span
                        key={colorPulse.id}
                        className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-amber-400"
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.4, opacity: 0 }}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                        onAnimationComplete={() =>
                          setColorPulse((cur) => (cur?.id === colorPulse.id ? null : cur))
                        }
                      />
                    )}
                  </AnimatePresence>
                  <span className="w-4 h-4 rounded-full border border-neutral-700 bg-neutral-950 shrink-0 shadow-inner" />
                  <div className="truncate">
                    <span className="block font-bold">{locale === 'tr' ? 'Mat Siyah' : 'Matte Black'}</span>
                  </div>
                  {!whiteMode && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 ml-auto shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWhiteMode(true);
                    setColorPulse({ id: Date.now(), mode: 'white' });
                  }}
                  aria-pressed={whiteMode}
                  className={`relative p-3 rounded-2xl border text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    whiteMode
                      ? 'border-amber-500 bg-amber-500/15 text-white ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10'
                      : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <AnimatePresence>
                    {colorPulse && colorPulse.mode === 'white' && (
                      <motion.span
                        key={colorPulse.id}
                        className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-amber-400"
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.4, opacity: 0 }}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                        onAnimationComplete={() =>
                          setColorPulse((cur) => (cur?.id === colorPulse.id ? null : cur))
                        }
                      />
                    )}
                  </AnimatePresence>
                  <span className="w-4 h-4 rounded-full border border-slate-300 bg-white shrink-0 shadow-sm" />
                  <div className="truncate">
                    <span className="block font-bold">{locale === 'tr' ? 'Mat Beyaz' : 'Matte White'}</span>
                  </div>
                  {whiteMode && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 ml-auto shrink-0" />}
                </button>
              </div>
            </div>

            {/* Fiyat: 1.750 TL / Adet & Sipariş CTA */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between bg-neutral-950 p-3.5 rounded-2xl border border-white/10">
                <div>
                  <span className="text-[11px] font-semibold text-white/50 flex items-center gap-1.5">
                    {locale === 'tr' ? 'Stand Fiyatı' : 'Stand Price'}
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/25 px-1.5 py-0.5 rounded-full">
                      %24 {locale === 'tr' ? 'indirim' : 'off'}
                    </span>
                  </span>
                  <span className="flex items-baseline gap-1.5">
                    <span className="text-xs font-semibold text-white/35 line-through">2.290 TL</span>
                    <span className="text-xl font-black text-amber-400">1.750 TL <span className="text-xs font-medium text-white/50">{locale === 'tr' ? '/ Adet' : '/ Unit'}</span></span>
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  {locale === 'tr' ? 'Özel Baskı Dahil' : 'Custom Print Included'}
                </span>
              </div>

              <button
                type="button"
                onClick={onOrderClick}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
              >
                <span>{locale === 'tr' ? 'Hemen Sipariş Ver' : 'Order Now'}</span>
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Donanım Özellikleri Kartı */}
          <div className="rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl p-5 shadow-2xl space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>{locale === 'tr' ? 'Donanım Özellikleri' : 'Hardware Specifications'}</span>
            </h4>

            <div className="space-y-2">
              {SPECS.map((spec, i) => {
                const Icon = spec.icon;
                return (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-white/50">{spec.label}</div>
                      <div className="text-[11px] font-bold text-white mt-0.5">{spec.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Plug & Play Guarantee */}
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{locale === 'tr' ? 'Kullanıma Hazır Ön Programlı Teslimat' : 'Plug & Play Pre-Configured'}</span>
            </div>
            <p className="text-[11px] text-white/70 leading-relaxed">
              {locale === 'tr'
                ? 'Tüm standlar restoranınızın Google Haritalar linki veya dijital menü bağlantısıyla eşleşmiş şekilde, anında kullanıma hazır gönderilir.'
                : 'All stands arrive pre-programmed with your restaurant Google Maps URL or digital menu connection.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NFCShowcase;
