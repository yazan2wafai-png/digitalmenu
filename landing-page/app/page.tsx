'use client';
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { NFCShowcase } from '@/components/nfc-showcase';
import { DiscountModal } from '@/components/DiscountModal';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Zap,
  Globe2,
  Smartphone,
  ChevronRight,
  Palette,
  CircleDot,
  Hexagon,
  Award,
  Plus,
  Minus,
  Radio,
  Filter,
} from 'lucide-react';
import type { Locale } from '@/lib/translations';
import { translations } from '@/lib/translations';

export default function LandingPage() {
  const [locale, setLocale] = useState<Locale>('tr');
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);

  // Service 2: Acrylic Table Sticker State
  const [stickerPattern, setStickerPattern] = useState<1 | 2 | 3>(1);
  const [stickerVenueName, setStickerVenueName] = useState<string>('Baltazar Bistro');
  const [stickerTableNumber, setStickerTableNumber] = useState<string>('Masa #12');
  const [stickerQuantity, setStickerQuantity] = useState<number>(10);

  const t = translations[locale];

  // Calculated subtotal for stickers
  const stickerSubtotal = stickerQuantity * 175;

  const LIVE_DEMOS = [
    {
      name: 'Baltazar Burger',
      tag: t.saas.baltazarTag,
      slug: 'baltazar',
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
      url: 'https://baltazar.nfcmyplace.com',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
      description: t.saas.baltazarDesc,
      buttonText: t.saas.baltazarBtn,
      highlights:
        locale === 'tr'
          ? ['Karanlık Mod 3D UI', 'Masa Siparişi', '3 Dil Desteği (TR/EN/AR)']
          : ['Dark Mode 3D UI', 'Table Ordering', '3 Languages (TR/EN/AR)'],
    },
    {
      name: 'Kahve Erenköy',
      tag: t.saas.erenkoyTag,
      slug: 'kahve-erenkoy',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      url: 'https://kahve-erenkoy.nfcmyplace.com',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
      description: t.saas.erenkoyDesc,
      buttonText: t.saas.erenkoyBtn,
      highlights:
        locale === 'tr'
          ? ['V60 Özel Menü', 'Masa Rozetleri', 'Alerjen & Kalori Filtresi']
          : ['V60 Pour Over', 'Table Badges', 'Allergen & Calorie Filters'],
    },
  ];

  const PRICING_CARDS = [
    {
      id: 'stand',
      badge: locale === 'tr' ? 'En Popüler Donanım' : 'Most Popular Hardware',
      title: locale === 'tr' ? 'Google Değerlendirme Standı' : 'Google Review Stand',
      price: '1.750 TL',
      unit: locale === 'tr' ? '/ adet' : '/ unit',
      subtitle: locale === 'tr' ? '75° ergonomik açılı akıllı akrilik masa standı' : '75° ergonomic inclined smart acrylic stand',
      features:
        locale === 'tr'
          ? [
              '75° Ergonomik Açılı Monolitik Akrilik Gövde',
              'Google G Logosu & 5 Altın Yıldız Rozeti',
              'NTAG213 Dual-Coil NFC + Yüksek Kontrast QR',
              'Mat Siyah veya Parlak Beyaz Seçenekleri',
              'Özel Logo & İşletme Adı Lazer/UV Baskısı',
              'Tak-Çalıştır Ön Yapılandırma & Hızlı Teslimat',
            ]
          : [
              '75° Ergonomic Monolithic Acrylic Body',
              'Google G Logo & 5 Gold Stars Rating Badge',
              'NTAG213 Dual-Coil NFC + High Contrast QR',
              'Matte Obsidian Black or Glossy Frost White',
              'Custom Logo & Business Name Engraving',
              'Plug & Play Pre-Configured Fast Delivery',
            ],
      cta: locale === 'tr' ? 'Hemen Sipariş Ver' : 'Order Now',
      popular: true,
      action: () => setIsDiscountOpen(true),
    },
    {
      id: 'sticker',
      badge: locale === 'tr' ? 'Masa Çözümleri' : 'Table Solutions',
      title: locale === 'tr' ? 'Akrilik Masa Stickerları' : 'Acrylic Table Stickers',
      price: '175 TL',
      unit: locale === 'tr' ? '/ adet (Min. 10 adet)' : '/ unit (Min. 10 units)',
      subtitle: locale === 'tr' ? 'Kompakt, suya dayanıklı ve masa numaralı diskler' : 'Compact, waterproof & numbered table discs',
      features:
        locale === 'tr'
          ? [
              'Ø 60mm & Ø 70mm, 2mm Lazer Kesim Pleksi',
              '3 Lazer Desen (Altın Kenar, Geometrik, Masa No)',
              '3M Endüstriyel VHB Güçlü Yapışkan',
              'IP68 Sıvı Geçirmez & Çizilmeye Dayanıklı',
              'Masif Ahşap, Mermer ve Cam Masalarla %100 Uyumlu',
              '10x (1.750 TL), 25x (4.375 TL), 50x (8.750 TL)',
            ]
          : [
              'Ø 60mm & Ø 70mm, 2mm Laser Cut Acrylic',
              '3 Laser Patterns (Gold Rim, Geometric, Table No)',
              '3M Industrial VHB Heavy-Duty Adhesive',
              'IP68 Waterproof & Scratch-Resistant Resin',
              '100% Compatible with Walnut Wood, Marble & Glass',
              '10x (1,750 TL), 25x (4,375 TL), 50x (8,750 TL)',
            ],
      cta: locale === 'tr' ? 'Adet Seç & Sipariş Ver' : 'Select Quantity & Order',
      popular: false,
      action: () => {
        const el = document.getElementById('sticker');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else setIsDiscountOpen(true);
      },
    },
    {
      id: 'saas',
      badge: locale === 'tr' ? 'Eksiksiz Bulut Altyapısı' : 'Complete Cloud Platform',
      title: locale === 'tr' ? 'Dijital Menü SaaS' : 'Digital Menu SaaS',
      price: '3.000 TL',
      unit: locale === 'tr' ? '(Kurulum & Yıllık)' : '(Setup & Annual)',
      subtitle: locale === 'tr' ? 'Sıfır komisyonlu, çok dilli restoran menü altyapısı' : 'Zero commission multi-language restaurant SaaS',
      features:
        locale === 'tr'
          ? [
              'Çoklu Şube ve 3 Dil Desteği (TR / EN / AR)',
              'Anlık Menü, Fiyat ve Stok Yönetim Paneli',
              'Alerjen, Kalori & Dinamik Kategori Filtreleri',
              'Mobil Uyumlu 3D Kart Arayüzü & Yapışkan Bar',
              'Masa Bazlı Trafik & Ziyaretçi Analitiği',
              '%99.9 Bulut Güvenilirliği & 7/24 Kesintisiz Destek',
            ]
          : [
              'Multi-Branch & 3-Language Support (TR / EN / AR)',
              'Instant Menu, Price & Stock Admin Dashboard',
              'Allergen, Calorie & Category Dynamic Filters',
              'Mobile-Optimized 3D Card UI & Sticky Bar',
              'Table-Level Analytics & Dwell Time Insights',
              '99.9% Cloud Uptime & 24/7 Priority Support',
            ],
      cta: locale === 'tr' ? 'Hemen Başla' : 'Get Started',
      popular: false,
      action: () => setIsDiscountOpen(true),
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
      {/* ── STICKY GLASSMORPHIC NAVBAR ── */}
      <Navbar
        locale={locale}
        onToggleLocale={setLocale}
        onOpenDiscount={() => setIsDiscountOpen(true)}
      />

      {/* ── DISCOUNT PROMO MODAL ── */}
      <DiscountModal
        locale={locale}
        isOpen={isDiscountOpen}
        onClose={() => setIsDiscountOpen(false)}
      />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-12 sm:pt-20 pb-12 px-4 sm:px-6 text-center overflow-hidden">
        {/* Glowing Radial Mesh Backgrounds */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-amber-500/20 via-yellow-600/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto space-y-6 relative z-10"
        >
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-inner">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{t.hero.badge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
            <span className="bg-gradient-to-r from-white via-neutral-200 to-white/90 bg-clip-text text-transparent">
              {t.hero.title}
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            {t.hero.tagline}
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#customizer"
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <span>{t.hero.primaryCta}</span>
            </a>
            <a
              href="#saas"
              className="px-7 py-4 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white font-bold text-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>{t.hero.secondaryCta}</span>
              <ArrowUpRight className="w-4 h-4 text-white/70" />
            </a>
          </div>

          {/* Trust Metric Stats Strip */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {Object.values(t.hero.stats).map((stat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-center"
              >
                <div className="text-sm sm:text-base font-extrabold text-amber-400">{stat.split(' ')[0]}</div>
                <div className="text-[11px] text-white/50 font-medium mt-0.5">{stat.substring(stat.indexOf(' ') + 1)}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SERVICE 1: ÖZEL DESENLİ NFC & QR GOOGLE DEĞERLENDİRME STANDI (1.750 TL)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-8 border-t border-white/5 bg-gradient-to-b from-neutral-950 via-neutral-900/60 to-neutral-950 relative">
        <NFCShowcase
          locale={locale}
          onOrderClick={() => setIsDiscountOpen(true)}
        />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SERVICE 2: AKRİLİK MASA STICKERI (NFC + QR) (175 TL / ADET)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="sticker"
        className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/5 scroll-mt-20"
      >
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.sticker.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {locale === 'tr' ? 'Akrilik Masa Stickerı ' : 'Acrylic Table Sticker '}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              (NFC + QR)
            </span>
          </h2>
          <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
            {t.sticker.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left / Center: Realistic Acrylic Sticker Mockup on Dark Walnut Wood Table */}
          <div className="lg:col-span-7 relative min-h-[460px] rounded-3xl border border-white/10 overflow-hidden bg-gradient-to-br from-[#1e1109] via-[#150a04] to-[#0c0502] p-6 shadow-2xl flex flex-col justify-between">
            {/* Simulated Luxury Dark Walnut Wood Surface Grain & Lighting */}
            <div
              className="absolute inset-0 opacity-45 pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 10px), radial-gradient(circle at 50% 35%, rgba(245,158,11,0.2), transparent 75%)`,
              }}
            />

            {/* Top Badges */}
            <div className="relative z-20 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {locale === 'tr' ? '🌳 Masif Ahşap Masa Görünümü' : '🌳 Walnut Table Mockup'}
                </span>
                <span className="text-[11px] font-black px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40">
                  {t.sticker.unitPrice}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-white/50 bg-black/40 px-3 py-1 rounded-full border border-white/10">
                {t.sticker.minOrder}
              </span>
            </div>

            {/* Center Realistic Circular Acrylic Sticker Disc */}
            <div className="relative my-auto flex items-center justify-center py-6">
              {/* Soft Table Ambient Shadow */}
              <div className="absolute w-56 h-56 rounded-full bg-black/85 blur-2xl pointer-events-none transform translate-y-4" />

              {/* 2mm Acrylic Disc Container */}
              <motion.div
                key={stickerPattern + stickerVenueName + stickerTableNumber}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 260 }}
                className="relative w-56 h-56 rounded-full border-4 border-amber-500/80 bg-gradient-to-b from-[#1c1c22] via-[#121216] to-[#0a0a0d] shadow-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer group select-none ring-2 ring-amber-400/40"
              >
                {/* Glossy Acrylic Reflection Flare */}
                <div className="absolute inset-1.5 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" />

                {/* ── PATTERN 1: MINIMALIST GOLD RIM ── */}
                {stickerPattern === 1 && (
                  <div className="space-y-2 relative z-10 w-full flex flex-col items-center justify-center">
                    <div className="w-44 h-44 rounded-full border border-amber-400/60 flex flex-col items-center justify-center space-y-2 p-3 bg-amber-500/[0.02]">
                      <div className="w-12 h-12 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-400 font-black text-xs shadow-lg shadow-amber-500/30 bg-amber-500/10">
                        <Radio className="w-5 h-5 text-amber-400 stroke-[2.5]" />
                      </div>
                      <span className="text-xs font-black tracking-widest text-amber-300 uppercase">
                        TEMASSIZ MENÜ
                      </span>
                      <span className="text-[10px] font-bold text-white/60 tracking-wider">
                        DOKUNDUR VEYA OKUT
                      </span>
                    </div>
                  </div>
                )}

                {/* ── PATTERN 2: GEOMETRIC BORDER ── */}
                {stickerPattern === 2 && (
                  <div className="relative z-10 w-44 h-44 rounded-full border-2 border-dashed border-amber-400/70 flex flex-col items-center justify-center space-y-2 p-2 bg-amber-500/[0.03]">
                    <div className="w-12 h-12 rotate-45 border-2 border-amber-400 flex items-center justify-center bg-amber-500/10 shadow-md">
                      <span className="-rotate-45 font-black text-amber-300 text-xs tracking-wider">
                        NFC
                      </span>
                    </div>
                    <span className="text-[11px] font-black tracking-widest text-white uppercase">
                      SMART CONTACTLESS
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
                    </div>
                  </div>
                )}

                {/* ── PATTERN 3: CUSTOM LOGO & TABLE NUMBER ── */}
                {stickerPattern === 3 && (
                  <div className="space-y-2.5 relative z-10 w-full flex flex-col items-center">
                    <div className="text-xs font-black tracking-wider text-amber-400 uppercase truncate max-w-[150px] px-2">
                      {stickerVenueName || 'Baltazar Bistro'}
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-300 font-black text-xs shadow-lg shadow-amber-500/30 bg-amber-500/10">
                      <Radio className="w-5 h-5 text-amber-300 stroke-[2.5]" />
                    </div>
                    <div className="px-4 py-1 rounded-lg bg-neutral-900 border border-amber-500/60 text-xs font-black tracking-widest text-white uppercase shadow-md">
                      {stickerTableNumber || 'MASA #12'}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Bottom Info */}
            <div className="relative z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div>
                <h4 className="text-sm font-bold text-white">
                  {locale === 'tr' ? '2mm Lazer Pleksi Akrilik & 3M VHB' : '2mm Laser Acrylic & 3M VHB'}
                </h4>
                <p className="text-xs text-white/50">
                  {locale === 'tr' ? 'IP68 Su Geçirmez, solmaz UV baskı' : 'IP68 Waterproof, UV-resistant print'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-white/50 block font-semibold">{locale === 'tr' ? 'Birim Fiyat' : 'Unit Price'}</span>
                <span className="text-base font-black text-amber-400">175 TL / adet</span>
              </div>
            </div>
          </div>

          {/* Right: Pattern Switcher, Dynamic Inputs & Quantity Subtotal Calculator */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Pattern Switcher & Inputs */}
            <div className="rounded-3xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl p-6 shadow-2xl space-y-4">
              <h4 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>{locale === 'tr' ? 'Masa Stickerı Desen Seçimi' : 'Table Sticker Pattern Selector'}</span>
              </h4>

              {/* 3 Pattern Options */}
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  type="button"
                  onClick={() => setStickerPattern(1)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    stickerPattern === 1
                      ? 'border-amber-500 bg-amber-500/10 text-white ring-1 ring-amber-500/40'
                      : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CircleDot className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-bold text-white">
                        {locale === 'tr' ? 'Desen 1: Minimalist Altın Kenar' : 'Pattern 1: Minimalist Gold Rim'}
                      </div>
                      <div className="text-[10px] text-white/50">
                        {locale === 'tr' ? 'Zarif metalik altın halka & NFC çipi' : 'Sleek metallic gold rim & NFC'}
                      </div>
                    </div>
                  </div>
                  {stickerPattern === 1 && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setStickerPattern(2)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    stickerPattern === 2
                      ? 'border-amber-500 bg-amber-500/10 text-white ring-1 ring-amber-500/40'
                      : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Hexagon className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-bold text-white">
                        {locale === 'tr' ? 'Desen 2: Geometrik Izgara' : 'Pattern 2: Geometric Border'}
                      </div>
                      <div className="text-[10px] text-white/50">
                        {locale === 'tr' ? 'Modern geometrik çerçeve & Smart NFC' : 'Geometric pattern & Smart NFC'}
                      </div>
                    </div>
                  </div>
                  {stickerPattern === 2 && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setStickerPattern(3)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    stickerPattern === 3
                      ? 'border-amber-500 bg-amber-500/10 text-white ring-1 ring-amber-500/40'
                      : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-bold text-white">
                        {locale === 'tr' ? 'Desen 3: Özel Logo & Masa No' : 'Pattern 3: Custom Logo & Table No'}
                      </div>
                      <div className="text-[10px] text-white/50">
                        {locale === 'tr' ? 'Mekan adı + belirgin masa numarası rozeti' : 'Venue name + custom table badge'}
                      </div>
                    </div>
                  </div>
                  {stickerPattern === 3 && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                </button>
              </div>

              {/* Dynamic Inputs for Pattern 3 */}
              {stickerPattern === 3 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3 pt-2 border-t border-white/10"
                >
                  <div className="space-y-1">
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

                  <div className="space-y-1">
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
                </motion.div>
              )}
            </div>

            {/* Quantity Selector & Live Subtotal Calculator Card */}
            <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-neutral-900/90 via-neutral-900/70 to-neutral-950 p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black uppercase tracking-wider text-amber-400">
                  {locale === 'tr' ? 'Adet Seçimi & Fiyat Hesaplayıcı' : 'Quantity & Live Subtotal'}
                </h4>
                <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  175 TL / adet
                </span>
              </div>

              {/* Preset Buttons: 10x, 25x, 50x */}
              <div className="grid grid-cols-3 gap-2">
                {[10, 25, 50].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setStickerQuantity(qty)}
                    className={`py-2.5 px-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      stickerQuantity === qty
                        ? 'border-amber-500 bg-amber-500 text-black font-black shadow-md shadow-amber-500/25'
                        : 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div>{qty}x Adet</div>
                    <div className={`text-[10px] mt-0.5 ${stickerQuantity === qty ? 'text-black/80 font-bold' : 'text-amber-400'}`}>
                      {(qty * 175).toLocaleString('tr-TR')} TL
                    </div>
                  </button>
                ))}
              </div>

              {/* Stepper for Custom Quantities (Min. 10) */}
              <div className="flex items-center justify-between bg-neutral-950 border border-white/10 rounded-2xl p-2.5">
                <span className="text-xs font-bold text-white/70 ml-2">
                  {locale === 'tr' ? 'Özel Adet (Min. 10):' : 'Custom Quantity (Min 10):'}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStickerQuantity((prev) => Math.max(10, prev - 5))}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-base font-black text-white min-w-[32px] text-center">
                    {stickerQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStickerQuantity((prev) => prev + 5)}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Live Subtotal Display & CTA */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs text-white/50 font-semibold">{locale === 'tr' ? 'Hesaplanan Tutar' : 'Subtotal'}</div>
                  <div className="text-2xl font-black text-amber-400">
                    {stickerSubtotal.toLocaleString('tr-TR')} TL
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDiscountOpen(true)}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center gap-1.5 cursor-pointer transform active:scale-95"
                >
                  <span>{locale === 'tr' ? 'Adet Seç & Sipariş Ver' : 'Order Selected Qty'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SERVICE 3: RESTORAN DİJİTAL MENÜ SAAS ALTYAPISI (3.000 TL)
          ───────────────────────────────────────────────────────────── */}
      <section id="saas" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/5 scroll-mt-20">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.saas.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {t.saas.title}
          </h2>
          <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
            {t.saas.subtitle}
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-black">
              ★ {t.saas.price} {t.saas.priceSub}
            </span>
          </div>
        </div>

        {/* 4 Core Features Grid (Bento Box) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {/* Feature 1: Multi-Branch & Multi-Language */}
          <div className="group rounded-3xl p-8 bg-neutral-900/60 border border-white/10 hover:border-amber-500/30 backdrop-blur-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {locale === 'tr' ? 'Çoklu Şube ve Dil Desteği (TR / EN / AR)' : 'Multi-Branch & Multi-Language (TR/EN/AR)'}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {locale === 'tr'
                  ? 'Türkçe, İngilizce ve Arapça dil seçenekleriyle yerli ve yabancı misafirlerinize anında kendi dillerinde kusursuz dijital menü sunun.'
                  : 'Deliver dynamic digital menus in Turkish, English, and Arabic to delight both local guests and international travelers.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-amber-400">
              <span>Otomatik Dil Algılama & Şube Yönetimi</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 2: Instant Menu & Price Updating Panel */}
          <div className="group rounded-3xl p-8 bg-neutral-900/60 border border-white/10 hover:border-amber-500/30 backdrop-blur-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {locale === 'tr' ? 'Anlık Menü ve Fiyat Güncelleme Paneli' : 'Real-Time Menu & Price Update Panel'}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {locale === 'tr'
                  ? 'Yönetici panelinden saniyeler içinde ürün fiyatlarını revize edin, tükenen ürünleri anında gizleyin ve yeni kampanyalarınızı yayınlayın.'
                  : 'Update item prices in seconds from your cloud dashboard, instantly toggle out-of-stock items, and launch seasonal promotions.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-amber-400">
              <span>https://admin.nfcmyplace.com Entegrasyonu</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 3: Allergen / Calorie / Dynamic Filters */}
          <div className="group rounded-3xl p-8 bg-neutral-900/60 border border-white/10 hover:border-amber-500/30 backdrop-blur-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {locale === 'tr' ? 'Alerjen, Kalori & Kategori Filtreleri' : 'Allergen, Calorie & Category Filters'}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {locale === 'tr'
                  ? 'Glutensiz, vegan, vejetaryen, acı seviyesi ve kalori filtreleri ile misafirlerinizin aradığı lezzete saniyeler içinde ulaşmasını sağlayın.'
                  : 'Gluten-free, vegan, vegetarian, spice levels, and calorie counts let customers filter their preferences effortlessly.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-amber-400">
              <span>Akıllı Beslenme & Diyet Etiketleri</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 4: Mobile-Optimized 3D Card UI & Sticky Bar */}
          <div className="group rounded-3xl p-8 bg-neutral-900/60 border border-white/10 hover:border-amber-500/30 backdrop-blur-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-inner">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {locale === 'tr' ? 'Mobil Uyumlu 3D Kart Arayüzü & Yapışkan Bar' : 'Mobile 3D Card UI & Sticky Category Bar'}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {locale === 'tr'
                  ? 'iPhone ve Android telefonlarda 60 FPS ultra akıcı kaydırma, yapışkan kategori sekmeleri ve yüksek çözünürlüklü görsel 3D kartlar.'
                  : 'Ultra-smooth 60 FPS scrolling on iOS and Android, sticky category navigation, and high-res 3D food cards.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-amber-400">
              <span>Sıfır Uygulama İndirme, Anında Açılış</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Live Interactive Demo Cards: Baltazar Burger & Kahve Erenköy */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {locale === 'tr' ? 'Canlı Restoran Menü Demoları' : 'Live Interactive Venue Demos'}
            </h3>
            <p className="text-xs sm:text-sm text-white/50">
              {locale === 'tr'
                ? 'Aşağıdaki kartlara tıklayarak NFCMyPlace altyapısıyla çalışan canlı işletme menülerini deneyimleyin.'
                : 'Click the demo cards below to test live multi-tenant restaurant menus powered by NFCMyPlace.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {LIVE_DEMOS.map((demo) => (
              <motion.article
                key={demo.slug}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="bg-neutral-900/80 border border-white/10 hover:border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between backdrop-blur-xl group"
              >
                <a
                  href={demo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {/* Image Container */}
                  <div className="relative w-full h-56 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={demo.image}
                      alt={demo.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                    {/* Tag Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md ${demo.badgeColor}`}>
                        {demo.tag}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 border border-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-amber-500 group-hover:text-black transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h4 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                      {demo.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-white/60 leading-relaxed">{demo.description}</p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {demo.highlights.map((badge, bIdx) => (
                        <span
                          key={bIdx}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70"
                        >
                          ✓ {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>

                <div className="p-6 pt-0">
                  <a
                    href={demo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    <span>{demo.buttonText}</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          UNIFIED PRICING GRID (#pricing)
          ───────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-4 sm:px-6 bg-white/[0.01] border-t border-white/5 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">
              {t.pricing.badge}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {t.pricing.title}
            </h2>
            <p className="text-sm sm:text-base text-white/50 max-w-2xl mx-auto">
              {t.pricing.subtitle}
            </p>
          </div>

          {/* 3 Unified Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {PRICING_CARDS.map((card) => (
              <div
                key={card.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between border backdrop-blur-xl transition-all duration-300 ${
                  card.popular
                    ? 'bg-neutral-900/95 border-amber-500 shadow-2xl shadow-amber-900/40 ring-1 ring-amber-500/50 md:-translate-y-2'
                    : 'bg-neutral-900/50 border-white/10 hover:border-white/20'
                }`}
              >
                {card.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-[10px] uppercase tracking-widest shadow-md">
                    ★ {card.badge}
                  </span>
                )}

                <div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                    {card.badge}
                  </div>
                  <h3 className="text-xl font-black text-white">{card.title}</h3>
                  <p className="text-xs text-white/50 mt-1">{card.subtitle}</p>

                  <div className="my-6">
                    <span className="text-4xl font-black text-amber-400 tracking-tight">
                      {card.price}
                    </span>
                    <span className="text-xs text-white/50 ml-1.5 font-semibold">
                      {card.unit}
                    </span>
                  </div>

                  <ul className="space-y-3 text-xs text-white/70 mb-8">
                    {card.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={card.action}
                  className={`w-full py-4 rounded-xl text-center font-black text-xs transition-all cursor-pointer ${
                    card.popular
                      ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-black hover:from-amber-400 hover:to-yellow-300 shadow-xl shadow-amber-500/25'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-amber-500/40'
                  }`}
                >
                  {card.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-14 px-4 sm:px-6 border-t border-white/10 bg-neutral-950/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          {/* Brand & Rights */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-black shadow-md">
                <Radio className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight flex items-center">
                <span>NFC</span>
                <span className="text-amber-400">MyPlace</span>
                <span className="text-amber-400 text-xs font-bold ml-0.5 self-start">®</span>
              </span>
            </div>
            <p className="text-xs text-white/50 max-w-sm">{t.footer.tagline}</p>
            <p className="text-[11px] text-white/30">{t.footer.rights}</p>
          </div>

          {/* Quick Nav Links & Admin Portal Link */}
          <div className="flex flex-wrap justify-center items-center gap-7 text-xs font-semibold text-white/60">
            <a href="#customizer" className="hover:text-amber-400 transition-colors">
              {t.nav.products}
            </a>
            <a href="#sticker" className="hover:text-amber-400 transition-colors">
              {t.nav.tableSolutions}
            </a>
            <a href="#saas" className="hover:text-amber-400 transition-colors">
              {t.nav.saas}
            </a>
            <a href="#pricing" className="hover:text-amber-400 transition-colors">
              {t.nav.pricing}
            </a>
            <a
              href="https://admin.nfcmyplace.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold transition-colors"
            >
              <span>{t.nav.adminLogin}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
