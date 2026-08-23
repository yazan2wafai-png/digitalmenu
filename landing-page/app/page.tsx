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
  Star,
  BarChart3,
  Smartphone,
  ShieldCheck,
  Cpu,
  ChevronRight,
  Layers,
  ArrowRight,
} from 'lucide-react';
import type { Locale } from '@/lib/translations';
import { translations } from '@/lib/translations';

export default function LandingPage() {
  const [locale, setLocale] = useState<Locale>('tr');
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const t = translations[locale];

  const LIVE_DEMOS = [
    {
      name: 'Baltazar Burger',
      tag: t.demos.baltazarTag,
      slug: 'baltazar',
      accentColor: 'from-red-600 to-amber-600',
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
      url: 'https://baltazar.nfcmyplace.com',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
      description: t.demos.baltazarDesc,
      buttonText: t.demos.baltazarBtn,
      highlights:
        locale === 'tr'
          ? ['Karanlık Mod UI', 'Masa Siparişi', '3 Dil Desteği (TR/EN/AR)']
          : ['Dark Mode UI', 'Table Ordering', '3 Languages (TR/EN/AR)'],
    },
    {
      name: 'Kahve Erenköy',
      tag: t.demos.erenkoyTag,
      slug: 'kahve-erenkoy',
      accentColor: 'from-amber-600 to-yellow-600',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      url: 'https://kahve-erenkoy.nfcmyplace.com',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
      description: t.demos.erenkoyDesc,
      buttonText: t.demos.erenkoyBtn,
      highlights:
        locale === 'tr'
          ? ['V60 Özel Menü', 'Masa Rozetleri', 'Görsel Şölen']
          : ['V60 Pour Over', 'Table Badges', 'Visual Showcase'],
    },
  ];

  const PRICING_TIERS = [
    {
      name: t.pricing.starterName,
      price: t.pricing.starterPrice,
      subtitle: t.pricing.starterSub,
      features:
        locale === 'tr'
          ? [
              '10x 75° Eğimli Akıllı Akrilik 3D L-Stand',
              '2x Mat Siyah Altın Varak Google Yorum Kartı',
              'Sınırsız Dijital Menü SaaS Erişimi',
              'Çoklu Dil Desteği (TR / EN / AR)',
              'Masa Bazlı Ziyaretçi Analitiği',
              'QR Kod & Dual-Coil NFC Hibrit Çalışma',
            ]
          : [
              '10x 75° Inclined Smart Acrylic 3D L-Stands',
              '2x Gold Foil Google Review Cards',
              'Full Digital Menu SaaS Access',
              'Multi-Language (TR / EN / AR)',
              'Table Traffic Analytics',
              'Hybrid QR & Dual-Coil NFC Dual Support',
            ],
      highlight: false,
      cta: t.pricing.starterCta,
      action: 'modal' as const,
    },
    {
      name: t.pricing.proName,
      price: t.pricing.proPrice,
      subtitle: t.pricing.proSub,
      features:
        locale === 'tr'
          ? [
              '25x 75° Eğimli Akıllı Akrilik 3D L-Stand',
              '5x Mat Siyah Altın Varak Google Yorum Kartı',
              '15x Özelleştirilebilir NFC Akrilik Masa Diski',
              'Tam SaaS + Masa Yönlendirme Desteği',
              'Gelişmiş Gerçek Zamanlı Analitik & Raporlama',
              'Özel Logo & Renk Teması Entegrasyonu',
              'Öncelikli Kurulum & Özel Tasarım Desteği',
            ]
          : [
              '25x 75° Inclined Smart Acrylic 3D L-Stands',
              '5x Gold Foil Google Review Cards',
              '15x Customizable NFC Table Discs',
              'Full SaaS + Table Routing Context',
              'Advanced Real-Time Traffic Analytics',
              'Custom Logo & Theme Styling',
              'Priority Onboarding & Direct Support',
            ],
      highlight: true,
      cta: t.pricing.proCta,
      action: 'modal' as const,
    },
    {
      name: t.pricing.entName,
      price: t.pricing.entPrice,
      subtitle: t.pricing.entSub,
      features:
        locale === 'tr'
          ? [
              'Sınırsız Özel Lazer Baskılı L-Stand & Kart',
              'Özel Müşteri Temsilcisi & SLA',
              'Özel Subdomain (mekan.nfcmyplace.com)',
              'POS & Sipariş Entegrasyonu & Webhook',
              'Öncelikli 7/24 Kesintisiz Teknik Destek',
            ]
          : [
              'Unlimited Custom Engraved Hardware',
              'Dedicated Account Manager & SLA',
              'Custom Subdomain (venue.nfcmyplace.com)',
              'POS Integration & Webhook Sync',
              '24/7 Priority SLA Support',
            ],
      highlight: false,
      cta: t.pricing.entCta,
      action: 'contact' as const,
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
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 text-center overflow-hidden">
        {/* Apple/Stripe-Style Glowing Radial Mesh Backgrounds */}
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

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
            {t.hero.titleStart}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              {t.hero.titleGradient}
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            {t.hero.tagline}
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#customizer"
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <span>{t.hero.primaryCta}</span>
            </a>
            <a
              href="#demos"
              className="px-7 py-4 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white font-bold text-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>{t.hero.secondaryCta}</span>
              <ArrowUpRight className="w-4 h-4 text-white/70" />
            </a>
          </div>

          {/* Trust Metric Stats Strip */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
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

      {/* ── 3D HARDWARE SHOWCASE SECTION (REACT THREE FIBER & L-STAND) ── */}
      <section
        id="hardware"
        className="py-12 border-t border-white/5 bg-gradient-to-b from-neutral-950 via-neutral-900/60 to-neutral-950 relative"
      >
        <NFCShowcase locale={locale} />
      </section>

      {/* ── BENTO BOX FEATURE GRID SECTION ── */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">
            {t.features.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t.features.title}
          </h2>
          <p className="text-sm sm:text-base text-white/50 max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Zero App Install */}
          <div className="group rounded-3xl p-8 bg-neutral-900/60 border border-white/10 hover:border-amber-500/30 backdrop-blur-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{t.features.f1Title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{t.features.f1Desc}</p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-amber-400">
              <span>iOS & Android Ready</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Multi-Language & Live Updates */}
          <div className="group rounded-3xl p-8 bg-neutral-900/60 border border-white/10 hover:border-amber-500/30 backdrop-blur-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{t.features.f2Title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{t.features.f2Desc}</p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-amber-400">
              <span>TR / EN / AR Real-Time Sync</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Google 5-Star Reviews */}
          <div className="group rounded-3xl p-8 bg-neutral-900/60 border border-white/10 hover:border-amber-500/30 backdrop-blur-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 shadow-inner">
                <Star className="w-6 h-6 fill-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{t.features.f3Title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{t.features.f3Desc}</p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-amber-400">
              <span>3.4x Değerlendirme Artışı</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Table Analytics */}
          <div className="group rounded-3xl p-8 bg-neutral-900/60 border border-white/10 hover:border-amber-500/30 backdrop-blur-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{t.features.f4Title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{t.features.f4Desc}</p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-amber-400">
              <span>Canlı Masa & Kategori Raporları</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE DEMO LAUNCHERS SECTION ── */}
      <section id="demos" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/5">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">
            {t.demos.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t.demos.title}
          </h2>
          <p className="text-sm sm:text-base text-white/50 max-w-2xl mx-auto">
            {t.demos.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {LIVE_DEMOS.map((demo) => (
            <motion.article
              key={demo.slug}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="bg-neutral-900/70 border border-white/10 hover:border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between backdrop-blur-xl group"
            >
              <a
                href={demo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {/* Image Container with Gradient Overlay */}
                <div className="relative w-full h-56 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={demo.image}
                    alt={demo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                  {/* Live Badge */}
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
                  <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                    {demo.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed">{demo.description}</p>

                  {/* Highlight Badges */}
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
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <span>{demo.buttonText}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── PRICING TIERS SECTION ── */}
      <section id="pricing" className="py-20 px-4 sm:px-6 bg-white/[0.01] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">
              {t.pricing.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {t.pricing.title}
            </h2>
            <p className="text-sm sm:text-base text-white/50 max-w-2xl mx-auto">
              {t.pricing.subtitle}
            </p>
          </div>

          {/* ── STANDALONE HARDWARE UNIT PRICING STRIP ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-amber-500/30 backdrop-blur-xl flex items-center justify-between">
              <div>
                <div className="text-xs text-white/50 font-semibold">
                  {locale === 'tr' ? 'Tekil Donanım' : 'Single Hardware'}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {locale === 'tr' ? 'Akıllı 3D Akrilik L-Stand' : 'Smart 3D Acrylic L-Stand'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-black text-amber-400">₺1.750 TL</div>
                <div className="text-[10px] text-white/40">{locale === 'tr' ? 'adet başı' : 'per unit'}</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl flex items-center justify-between">
              <div>
                <div className="text-xs text-white/50 font-semibold">
                  {locale === 'tr' ? 'Tekil Donanım' : 'Single Hardware'}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {locale === 'tr' ? 'NFC Masa Diski (Sticker)' : 'NFC Table Sticker Disc'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-black text-amber-400">₺175 TL</div>
                <div className="text-[10px] text-white/40">{locale === 'tr' ? 'adet başı' : 'per unit'}</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl flex items-center justify-between">
              <div>
                <div className="text-xs text-white/50 font-semibold">
                  {locale === 'tr' ? 'Tekil Donanım' : 'Single Hardware'}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {locale === 'tr' ? 'Google Yorum Kartı' : 'Google Review Card'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-black text-amber-400">₺350 TL</div>
                <div className="text-[10px] text-white/40">{locale === 'tr' ? 'adet başı' : 'per unit'}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-3xl p-8 flex flex-col justify-between border backdrop-blur-xl transition-all duration-300 ${
                  tier.highlight
                    ? 'bg-neutral-900/90 border-amber-500 shadow-2xl shadow-amber-900/40 ring-1 ring-amber-500/50 md:-translate-y-2'
                    : 'bg-neutral-900/50 border-white/10 hover:border-white/20'
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-[10px] uppercase tracking-widest shadow-md">
                    ★ {t.pricing.popular}
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  <p className="text-xs text-white/50 mt-1">{tier.subtitle}</p>

                  <div className="text-4xl font-black text-amber-400 my-6 tracking-tight">
                    {tier.price}
                  </div>

                  <ul className="space-y-3 text-xs text-white/70 mb-8">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {tier.action === 'modal' ? (
                  <button
                    type="button"
                    onClick={() => setIsDiscountOpen(true)}
                    className={`w-full py-4 rounded-xl text-center font-black text-xs transition-all cursor-pointer ${
                      tier.highlight
                        ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-black hover:from-amber-400 hover:to-yellow-300 shadow-xl shadow-amber-500/25'
                        : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                    }`}
                  >
                    {tier.cta}
                  </button>
                ) : (
                  <a
                    href="mailto:destek@nfcmyplace.com?subject=NFCMyPlace%20Kurumsal%20ve%20Ozel%20Tasarim%20Talebi"
                    className="w-full py-4 rounded-xl text-center font-bold text-xs transition-all bg-white/10 hover:bg-white/15 text-white block border border-white/10"
                  >
                    {tier.cta}
                  </a>
                )}
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
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center font-black text-black text-xs shadow-md">
                NFC
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                NFC<span className="text-amber-400">MyPlace</span>
              </span>
            </div>
            <p className="text-xs text-white/50 max-w-sm">{t.footer.tagline}</p>
            <p className="text-[11px] text-white/30">{t.footer.rights}</p>
          </div>

          {/* Quick Links & Admin Portal Link */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-xs font-semibold text-white/60">
            <a href="#customizer" className="hover:text-amber-400 transition-colors">
              {t.nav.hardware}
            </a>
            <a href="#demos" className="hover:text-amber-400 transition-colors">
              {t.nav.demos}
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
