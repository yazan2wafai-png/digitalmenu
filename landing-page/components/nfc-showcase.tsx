'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Layers,
  ShieldCheck,
  Cpu,
  RotateCw,
  Eye,
  Sliders,
  Star,
  QrCode,
  Award,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import type { Locale } from '@/lib/translations';
import { translations } from '@/lib/translations';

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

interface Props {
  locale?: Locale;
  onOrderClick?: () => void;
}

export function NFCShowcase({ locale = 'tr', onOrderClick }: Props) {
  // L-Stand Customizer State
  const [whiteMode, setWhiteMode] = useState<boolean>(true); // Glossy Frost White vs Matte Obsidian Black
  const [branding, setBranding] = useState<boolean>(true);
  const [logoText, setLogoText] = useState<string>('Baltazar');
  const [businessName, setBusinessName] = useState<string>('Gourmet Burger & Bistro');
  const [qrText, setQrText] = useState<string>('baltazar.nfcmyplace.com');
  const [showStars, setShowStars] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  const t = translations[locale];

  const SPECS = [
    {
      label: locale === 'tr' ? 'Gövde & Eğim Açısı' : 'Body & Tilt Angle',
      value: locale === 'tr' ? '75° Ergonomik Eğimli Monolitik Akrilik' : '75° Ergonomic Monolithic Acrylic Face',
      icon: Layers,
    },
    {
      label: locale === 'tr' ? 'Baskı & Decal Düzeni' : 'Decal Layout & Badges',
      value: locale === 'tr' ? 'Google G + 5 Altın Yıldız + Özel Logo & İsim Rozetleri' : 'Google G + 5 Gold Stars + Custom Brand Pills',
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
  ];

  return (
    <section id="customizer" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 scroll-mt-20">
      {/* ── SECTION HEADER ── */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.stand.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          {locale === 'tr' ? 'Özel Desenli NFC & QR ' : 'Custom Pattern NFC & QR '}
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
            {locale === 'tr' ? 'Google Değerlendirme Standı' : 'Google Review Stand'}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
          {t.stand.subtitle}
        </p>
      </div>

      {/* ── MAIN 3D WORKSPACE GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left / Center: 3D Interactive WebGL Stand */}
        <div className="lg:col-span-8 relative min-h-[500px] sm:min-h-[560px] rounded-3xl border border-white/10 overflow-hidden bg-neutral-950/90 backdrop-blur-2xl shadow-2xl flex flex-col justify-between p-6">
          {/* Radial Studio Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-amber-500/15 via-yellow-500/5 to-transparent blur-3xl pointer-events-none" />

          {/* Top Controls Bar */}
          <div className="relative z-20 flex items-center justify-between w-full flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {locale === 'tr' ? '3D İnteraktif Model' : '3D Interactive Model'}
              </span>
              <span className="text-[11px] font-black px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40">
                {t.stand.unitPrice}
              </span>
            </div>

            {/* Auto Rotate & Drag Hint */}
            <div className="flex items-center gap-2">
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
                {t.stand.dragHint}
              </span>
            </div>
          </div>

          {/* Center 3D Viewport */}
          <div className="relative w-full h-[390px] sm:h-[430px] my-auto flex items-center justify-center cursor-grab active:cursor-grabbing">
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

          {/* Bottom Stand Info Strip */}
          <div className="relative z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">{t.stand.title}</h3>
              <p className="text-xs text-white/50">
                {whiteMode
                  ? (locale === 'tr' ? 'Parlak Buzlu Beyaz Akrilik Gövde' : 'Glossy Frost White Acrylic Body')
                  : (locale === 'tr' ? 'Mat Obsidyen Siyah Akrilik Gövde' : 'Matte Obsidian Black Acrylic Body')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-white/50 font-semibold">{locale === 'tr' ? 'Birim Fiyat' : 'Unit Price'}</div>
                <div className="text-base font-black text-amber-400">1.750 TL</div>
              </div>
              <a
                href="#pricing"
                onClick={onOrderClick}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs shadow-lg shadow-amber-500/20 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{locale === 'tr' ? 'Hemen Sipariş Ver' : 'Order Now'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Interactive Customizer Panel & Specs */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          {/* Customizer Controls Card */}
          <div className="rounded-3xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl p-6 shadow-2xl space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>{locale === 'tr' ? 'Stand Kişiselleştirme' : 'Stand Customizer'}</span>
            </h4>

            {/* Acrylic Color Switcher: Matte Obsidian vs Glossy Frost */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/70 block">
                {locale === 'tr' ? 'Renk Seçeneği' : 'Color Selection'}
              </label>
              <div className="grid grid-cols-2 gap-2">
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
                  <span className="truncate">{locale === 'tr' ? 'Mat Siyah' : 'Matte Obsidian'}</span>
                </button>

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
                  <span className="truncate">{locale === 'tr' ? 'Parlak Beyaz' : 'Glossy Frost'}</span>
                </button>
              </div>
            </div>

            {/* Live QR Text Input */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-white/70 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                <span>{locale === 'tr' ? 'Canlı QR Yönlendirme Bağlantısı' : 'Live QR Destination Link'}</span>
              </label>
              <input
                type="text"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                placeholder="baltazar.nfcmyplace.com"
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500 transition-all font-mono"
              />
            </div>

            {/* Custom Branding Toggle */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{locale === 'tr' ? 'Özel Markalama' : 'Custom Branding'}</span>
                </div>
                <div className="text-[11px] text-white/50">
                  {locale === 'tr' ? 'Logo ve işletme adı rozetlerini etkinleştir' : 'Enable logo & venue name badges'}
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

            {/* Conditional Logo and Business Name inputs */}
            {branding && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 pt-2"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/70 block">
                    {locale === 'tr' ? 'Logo / Marka Yazısı' : 'Logo / Brand Name'}
                  </label>
                  <input
                    type="text"
                    value={logoText}
                    onChange={(e) => setLogoText(e.target.value)}
                    placeholder="Baltazar"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500 transition-all font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/70 block">
                    {locale === 'tr' ? 'İşletme Alt Başlığı' : 'Business Tagline'}
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Gourmet Burger & Bistro"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500 transition-all text-white/90"
                  />
                </div>
              </motion.div>
            )}

            {/* 5-Star Badge Toggle */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{locale === 'tr' ? 'Google 5 Altın Yıldız' : 'Google 5 Gold Stars'}</span>
                </div>
                <div className="text-[11px] text-white/50">
                  {locale === 'tr' ? 'Google G altında 5 altın yıldız göster' : 'Show 5 gold stars under Google G'}
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
          </div>

          {/* Technical Specifications Card */}
          <div className="rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl p-6 shadow-2xl space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>{locale === 'tr' ? 'Teknik Donanım Özellikleri' : 'Hardware Specifications'}</span>
            </h4>

            <div className="space-y-2.5">
              {SPECS.map((spec, i) => {
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

          {/* Plug & Play Guarantee */}
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{locale === 'tr' ? 'Kullanıma Hazır Ön Programlı Teslimat' : 'Plug & Play Pre-Configured'}</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
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
