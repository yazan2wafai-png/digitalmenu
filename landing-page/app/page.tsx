'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { NFCShowcase } from '@/components/nfc-showcase';
import { StickerSection } from '@/components/StickerSection';
import { DiscountModal } from '@/components/DiscountModal';
import { AmbientNfcWaves } from '@/components/AmbientNfcWaves';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Zap,
  Globe2,
  Smartphone,
  ChevronRight,
  Radio,
  Filter,
} from 'lucide-react';
import type { Locale } from '@/lib/translations';
import { translations } from '@/lib/translations';

export interface LiveDemoItem {
  name: string;
  tag: string;
  slug: string;
  badgeColor: string;
  url: string;
  image: string;
  description: string;
  buttonText: string;
  highlights: string[];
}

export interface PricingCardItem {
  id: string;
  badge: string;
  title: string;
  price: string;
  unit: string;
  subtitle: string;
  features: string[];
  cta: string;
  popular: boolean;
  action: () => void;
}

export default function LandingPage() {
  const [locale, setLocale] = useState<Locale>('tr');
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);

  const t = translations[locale];

  const LIVE_DEMOS: LiveDemoItem[] = [
    {
      name: 'Baltazar Burger',
      tag: t.saas.baltazarTag,
      slug: 'baltazar',
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
      url: 'https://baltazar.nfcmyplace.com',
      image:
        'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
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
      image:
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
      description: t.saas.erenkoyDesc,
      buttonText: t.saas.erenkoyBtn,
      highlights:
        locale === 'tr'
          ? ['V60 Özel Menü', 'Masa Rozetleri', 'Alerjen & Kategori Filtreleri']
          : ['V60 Specialty Coffee', 'Table Badges', 'Allergen & Category Filters'],
    },
  ];

  const PRICING_CARDS: PricingCardItem[] = [
    {
      id: 'stand',
      badge: locale === 'tr' ? 'Donanım Odaklı' : 'Hardware Focused',
      title: locale === 'tr' ? 'Google Değerlendirme Standı' : 'Google Review Stand',
      price: '1.750 TL',
      unit: locale === 'tr' ? '/ adet' : '/ unit',
      subtitle:
        locale === 'tr'
          ? 'Restoranınıza özel kurumsal logo, renk ve özel tasarım UV baskı dahil.'
          : 'Includes custom corporate logo, color theme, and custom UV print for your venue.',
      features:
        locale === 'tr'
          ? [
              'Restoranınıza Özel Kurumsal Logo & Renk Teması Baskısı',
              '75° Ergonomik Açılı Monolitik Pleksi Akrilik Gövde',
              'Mat Siyah veya Mat Beyaz (Frost) Renk Seçenekleri',
              'NTAG213 Dual-Coil Hızlı NFC Çipi (<0.2sn Okuma)',
              'Yüksek Kontrastlı Özel Lazer UV QR Kod Matrisi',
              '5 Yıldızlı Google Yorum Teşvik Tasarımı',
              'Önceden Programlanmış Tak-Çalıştır Teslimat',
            ]
          : [
              'Custom Corporate Logo & Color Theme Print Included',
              '75° Ergonomic Inclined Monolithic Acrylic Body',
              'Matte Obsidian Black or Matte Frost White Options',
              'NTAG213 Dual-Coil Fast NFC Chip (<0.2s Response)',
              'High-Contrast Custom UV Screen QR Code Matrix',
              '5-Star Google Review Encouragement Layout',
              'Plug & Play Pre-Configured Fast Delivery',
            ],
      cta: locale === 'tr' ? 'Stand Siparişi Ver' : 'Order Stand',
      popular: false,
      action: () => setIsDiscountOpen(true),
    },
    {
      id: 'hybrid',
      badge: locale === 'tr' ? 'Hibrit Menü Çözümü' : 'Hybrid Menu Solution',
      title: locale === 'tr' ? 'Akrilik Masa Stickerı + Menü SaaS' : 'Acrylic Table Sticker + Menu SaaS',
      price: '175 TL + 3.000 TL',
      unit: locale === 'tr' ? '/ adet (Sticker) + Yıllık SaaS' : '/ unit (Sticker) + Annual SaaS',
      subtitle:
        locale === 'tr'
          ? 'Masalar için lazer kesim akrilik stickerlar ve bulut tabanlı dijital menü yazılımı.'
          : 'Laser-cut acrylic stickers for tables plus cloud digital menu SaaS software.',
      features:
        locale === 'tr'
          ? [
              'Ø 65mm, 2mm Lazer Kesim Pleksi Akrilik Masa Stickerı (175 TL / adet)',
              '3M Endüstriyel VHB Su Geçirmez Güçlü Yapışkan (IP68)',
              'Bulut Yönetim Paneli (admin.nfcmyplace.com)',
              'Çoklu Dil Desteği (Türkçe, İngilizce, Arapça)',
              'Akıllı Kategori & Alerjen Filtreleme',
              'Hızlı 3D Mobil Web Menü Arayüzü (Sıfır Uygulama İndirme)',
            ]
          : [
              'Ø 65mm, 2mm Laser-Cut Acrylic Table Sticker (175 TL / unit)',
              '3M Industrial VHB Heavy-Duty Waterproof Bond (IP68)',
              'Real-Time Cloud Admin Dashboard (admin.nfcmyplace.com)',
              'Multi-Language Support (Turkish, English, Arabic)',
              'Smart Category & Allergen Filtering',
              'Fast 3D Mobile Web Menu UI (Zero App Download)',
            ],
      cta: locale === 'tr' ? 'Menü Sistemini Başlat' : 'Launch Menu System',
      popular: false,
      action: () => {
        const el = document.getElementById('sticker');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else setIsDiscountOpen(true);
      },
    },
    {
      id: 'full-package',
      badge: locale === 'tr' ? 'Önerilen • Hepsi Dahil Paket' : 'Recommended • All-In-One Pack',
      title: locale === 'tr' ? 'Full Dijital Restoran Paketi' : 'Full Digital Restaurant Package',
      price: '5.000 TL',
      unit: locale === 'tr' ? 'Özel İndirimli Paket' : 'Special Discounted Bundle',
      subtitle:
        locale === 'tr'
          ? '1x L-Stand + 10x Masa Stickerı + 1 Yıllık Menü SaaS + Ücretsiz Kurulum'
          : '1x L-Stand + 10x Table Stickers + 1-Year Menu SaaS + Free Setup',
      features:
        locale === 'tr'
          ? [
              '1x Özel Tasarım NFC & QR Google Değerlendirme Standı (1.750 TL Değerinde)',
              '10x Numaralı Akrilik Masa Stickerı (1.750 TL Değerinde)',
              '1 Yıllık Tam Kapsamlı Restoran Dijital Menü SaaS Altyapısı (3.000 TL Değerinde)',
              'Ücretsiz Menü Veri Girişi, Tasarım & Yerinde Kurulum Desteği',
              'Çoklu Şube & admin.nfcmyplace.com Yönetim Paneli Erişimi',
              '7/24 Öncelikli Teknik Destek & Ömür Boyu Donanım Garantisi',
            ]
          : [
              '1x Custom Designed NFC & QR Google Review Stand (Valued at 1,750 TL)',
              '10x Numbered Acrylic Table Stickers (Valued at 1,750 TL)',
              '1-Year Complete Digital Menu SaaS Infrastructure (Valued at 3,000 TL)',
              'Free Menu Data Onboarding, Custom Styling & Setup Support',
              'Multi-Branch & admin.nfcmyplace.com Cloud Panel Access',
              '24/7 Priority Support & Lifetime Hardware Warranty',
            ],
      cta: locale === 'tr' ? 'Tüm Paketi Satın Al' : 'Buy Complete Package',
      popular: true,
      action: () => setIsDiscountOpen(true),
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden relative">
      {/* ── FLOATING AMBIENT NFC WAVES & PARTICLES ── */}
      <AmbientNfcWaves />

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
      <section className="relative pt-12 sm:pt-20 pb-12 px-4 sm:px-6 text-center overflow-hidden z-10">
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
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-zinc-100 drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)]">
            <span className="text-zinc-100 font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-amber-400 bg-clip-text text-transparent drop-shadow-sm inline-block">
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
                <div className="text-sm sm:text-base font-extrabold text-amber-400">
                  {stat.split(' ')[0]}
                </div>
                <div className="text-[11px] text-white/50 font-medium mt-0.5">
                  {stat.substring(stat.indexOf(' ') + 1)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SERVICE 1: ÖZEL DESENLİ NFC & QR GOOGLE DEĞERLENDİRME STANDI (1.750 TL)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-8 border-t border-white/5 bg-gradient-to-b from-zinc-950 via-zinc-900/60 to-zinc-950 relative z-10">
        <NFCShowcase
          locale={locale}
          onOrderClick={() => setIsDiscountOpen(true)}
        />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SERVICE 2: AKRİLİK MASA STICKERI (NFC + QR) (175 TL / ADET)
          ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10">
        <StickerSection
          locale={locale}
          onOrderClick={() => setIsDiscountOpen(true)}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SERVICE 3: RESTORAN DİJİTAL MENÜ SAAS ALTYAPISI (3.000 TL)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="saas"
        className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/5 scroll-mt-20 relative z-10"
      >
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

        {/* 4 Core Features Grid (Bento Box - Multi-Branch, Cloud Admin, Allergen Filters, 3D Mobile UI) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {/* Feature 1: Multi-Branch & Multi-Language (TR/EN/AR) */}
          <div className="group rounded-3xl p-8 bg-neutral-900/60 border border-white/10 hover:border-amber-500/30 backdrop-blur-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {locale === 'tr'
                  ? 'Çoklu Şube & Dil Yönetimi (TR / EN / AR)'
                  : 'Multi-Branch & Multi-Language (TR/EN/AR)'}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {locale === 'tr'
                  ? 'Türkçe, İngilizce ve Arapça dil seçenekleriyle yerli ve yabancı misafirlerinize anında kendi dillerinde kusursuz dijital menü sunun. Şubelerinizi tek merkezden zahmetsizce yönetin.'
                  : 'Deliver dynamic digital menus in Turkish, English, and Arabic to delight both local guests and international travelers without requiring app installation.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-amber-400">
              <span>{locale === 'tr' ? 'Otomatik Dil Algılama & Şube Yönetimi' : 'Auto Language Detection & Multi-Branch'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 2: Instant Menu & Price Updating Panel (admin.nfcmyplace.com) */}
          <div className="group rounded-3xl p-8 bg-neutral-900/60 border border-white/10 hover:border-amber-500/30 backdrop-blur-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {locale === 'tr'
                  ? 'Anlık Menü & Fiyat Güncelleme'
                  : 'Instant Menu & Price Updates'}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {locale === 'tr'
                  ? 'admin.nfcmyplace.com bulut paneli üzerinden saniyeler içinde ürün fiyatlarını, kategorileri, görselleri ve stok durumunu güncelleyin; yeni kampanyaları anında canlıya alın.'
                  : 'Instantly update item prices, categories, and stock availability in seconds via admin.nfcmyplace.com dashboard and launch promotions.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-amber-400">
              <span>https://admin.nfcmyplace.com</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 3: Smart Category & Allergen Filters */}
          <div className="group rounded-3xl p-8 bg-neutral-900/60 border border-white/10 hover:border-amber-500/30 backdrop-blur-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {locale === 'tr'
                  ? 'Akıllı Kategori & Alerjen Filtreleri'
                  : 'Smart Category & Allergen Filters'}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {locale === 'tr'
                  ? 'Vejetaryen, vegan, glutensiz, şefin önerisi ve alerjen etiketleri ile misafirlerinizin menüdeki ürün içeriklerini şeffaf, hızlı ve güvenle filtrelemesini sağlayın.'
                  : 'Vegetarian, vegan, gluten-free, chef special, and allergen tags allow guests to filter menu ingredients transparently and with complete safety.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-amber-400">
              <span>{locale === 'tr' ? 'Şeffaf İçerik & Güvenli Sipariş Deneyimi' : 'Transparent Ingredients & Safe Ordering'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 4: Fast 3D Mobile Web UI (60 FPS, Zero App Download) */}
          <div className="group rounded-3xl p-8 bg-neutral-900/60 border border-white/10 hover:border-amber-500/30 backdrop-blur-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-inner">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {locale === 'tr'
                  ? 'Hızlı 3D Mobil Web Arayüzü'
                  : 'Fast 3D Mobile Web Interface'}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {locale === 'tr'
                  ? 'iPhone ve Android telefonlarda 60 FPS ultra akıcı kaydırma, yapışkan kategori sekmeleri ve yüksek çözünürlüklü 3D kart tasarımı. Sıfır uygulama indirme, anında açılış.'
                  : 'Ultra-smooth 60 FPS scrolling on iOS and Android, sticky category navigation, high-res 3D food cards, and zero app download requirements.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-amber-400">
              <span>{locale === 'tr' ? '60 FPS Akıcı Web Performansı' : '60 FPS Ultra Fast Web Performance'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Live Interactive Demo Cards: Baltazar Burger & Kahve Erenköy */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {locale === 'tr'
                ? 'Canlı Restoran Menü Demoları'
                : 'Live Interactive Venue Demos'}
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
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md ${demo.badgeColor}`}
                      >
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
                    <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                      {demo.description}
                    </p>

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
          UNIFIED PRICING GRID (#pricing) - 3 CORE PACKAGES
          ───────────────────────────────────────────────────────────── */}
      <section
        id="pricing"
        className="py-20 px-4 sm:px-6 bg-white/[0.01] border-t border-white/5 scroll-mt-20 relative z-10"
      >
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
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-[10px] uppercase tracking-widest shadow-md whitespace-nowrap">
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
                    <span className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                      {card.price}
                    </span>
                    <span className="text-xs text-white/50 ml-1.5 font-semibold block sm:inline mt-1 sm:mt-0">
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
      <footer className="py-14 px-4 sm:px-6 border-t border-white/10 bg-neutral-950/90 backdrop-blur-xl relative z-10">
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
                <span className="text-amber-400 text-xs font-bold ml-0.5 self-start">
                  ®
                </span>
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
              href="https://admin.nfcmyplace.com/login"
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
