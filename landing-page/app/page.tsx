'use client';
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import NfcProduct3DCanvas from '@/components/NfcProduct3DCanvas';
import { DiscountModal } from '@/components/DiscountModal';
import { motion } from 'framer-motion';
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
      themeColor: '#C0392B',
      url: 'https://baltazar.nfcmyplace.com',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
      description: t.demos.baltazarDesc,
      buttonText: t.demos.baltazarBtn,
    },
    {
      name: 'Kahve Erenköy',
      tag: t.demos.erenkoyTag,
      slug: 'kahve-erenkoy',
      themeColor: '#6F4E37',
      url: 'https://kahve-erenkoy.nfcmyplace.com',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
      description: t.demos.erenkoyDesc,
      buttonText: t.demos.erenkoyBtn,
    },
  ];

  const PRICING_TIERS = [
    {
      name: t.pricing.starterName,
      price: t.pricing.starterPrice,
      subtitle: t.pricing.starterSub,
      features: locale === 'tr' ? [
        '10x Ahşap & Akrilik NFC Masa Standı',
        '2x Mat Siyah Altın Varak Google Yorum Kartı',
        'Sınırsız Dijital Menü SaaS Erişimi',
        'Çoklu Dil Desteği (TR / EN / AR)',
        'Masa Bazlı Ziyaretçi Analitiği',
      ] : [
        '10x Wood & Acrylic NFC Table Stands',
        '2x Gold Foil Google Review Cards',
        'Full Digital Menu SaaS Access',
        'Multi-Language (TR / EN / AR)',
        'Table Traffic Analytics',
      ],
      highlight: false,
      cta: t.pricing.starterCta,
      action: 'modal' as const,
    },
    {
      name: t.pricing.proName,
      price: t.pricing.proPrice,
      subtitle: t.pricing.proSub,
      features: locale === 'tr' ? [
        '25x Ahşap & Akrilik NFC Masa Standı',
        '5x Mat Siyah Altın Varak Google Yorum Kartı',
        '15x Su Geçirmez NFC Masa Diski',
        'Tam SaaS + Masa Yönlendirme Desteği',
        '30 Günlük Gelişmiş Analitik Raporlar',
        'Özel Logo & Renk Teması Entegrasyonu',
      ] : [
        '25x Wood & Acrylic NFC Table Stands',
        '5x Gold Foil Google Review Cards',
        '15x Waterproof NFC Table Stickers',
        'Full SaaS + Table Routing Context',
        '30-Day Advanced Traffic Analytics',
        'Custom Logo & Theme Styling',
      ],
      highlight: true,
      cta: t.pricing.proCta,
      action: 'modal' as const,
    },
    {
      name: t.pricing.entName,
      price: t.pricing.entPrice,
      subtitle: t.pricing.entSub,
      features: locale === 'tr' ? [
        'Sınırsız Özel Lazer Baskılı Donanım',
        'Özel Müşteri Temsilcisi',
        'Özel Subdomain (mekan.nfcmyplace.com)',
        'POS & Sipariş Entegrasyonu',
        'Öncelikli 7/24 Teknik Destek',
      ] : [
        'Unlimited Custom Engraved Hardware',
        'Dedicated Account Manager',
        'Custom Subdomain Support',
        'POS Integration & Webhook Sync',
        'Priority 24/7 SLA Support',
      ],
      highlight: false,
      cta: t.pricing.entCta,
      action: 'contact' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-amber-500 selection:text-black">
      <Navbar
        locale={locale}
        onToggleLocale={setLocale}
        onOpenDiscount={() => setIsDiscountOpen(true)}
      />
      <DiscountModal
        locale={locale}
        isOpen={isDiscountOpen}
        onClose={() => setIsDiscountOpen(false)}
      />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-20 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-amber-500/15 via-amber-600/5 to-transparent blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-6 relative z-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wider uppercase">
            {t.hero.badge}
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none">
            {t.hero.titleStart}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              {t.hero.titleGradient}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
            {t.hero.tagline}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#hardware"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-black text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
            >
              {t.hero.primaryCta}
            </a>
            <a
              href="#demos"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm transition-all"
            >
              {t.hero.secondaryCta}
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── 3D HARDWARE SHOWCASE SECTION ── */}
      <section id="hardware" className="py-12 px-6 border-t border-white/5 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
        <NfcProduct3DCanvas locale={locale} />
      </section>

      {/* ── LIVE DEMO LAUNCHERS SECTION ── */}
      <section id="demos" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">{t.demos.badge}</span>
          <h2 className="text-3xl sm:text-4xl font-black">{t.demos.title}</h2>
          <p className="text-sm text-white/50">{t.demos.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {LIVE_DEMOS.map((demo) => (
            <motion.article
              key={demo.slug}
              whileHover={{ y: -6 }}
              className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              <a
                href={demo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={demo.image}
                  alt={demo.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/10 text-white/80">
                    {demo.tag}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-3 group-hover:text-amber-400 transition-colors">
                    {demo.name}
                  </h3>
                  <p className="text-xs text-white/60 mt-2 leading-relaxed">{demo.description}</p>
                </div>
              </a>

              <div className="p-6 pt-0">
                <a
                  href={demo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 text-center rounded-xl font-bold text-xs transition-opacity hover:opacity-90"
                  style={{ backgroundColor: demo.themeColor, color: '#ffffff' }}
                >
                  {demo.buttonText}
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── PRICING TIERS SECTION ── */}
      <section id="pricing" className="py-20 px-6 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">{t.pricing.badge}</span>
            <h2 className="text-3xl sm:text-4xl font-black">{t.pricing.title}</h2>
            <p className="text-sm text-white/50">{t.pricing.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-3xl p-8 flex flex-col justify-between border ${
                  tier.highlight
                    ? 'bg-neutral-900 border-amber-500/50 shadow-2xl shadow-amber-900/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-black font-extrabold text-[10px] uppercase tracking-wider">
                    {t.pricing.popular}
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  <p className="text-xs text-white/50 mt-1">{tier.subtitle}</p>
                  <div className="text-4xl font-black text-amber-400 my-6">{tier.price}</div>

                  <ul className="space-y-3 text-xs text-white/70 mb-8">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">✓</span> {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                {tier.action === 'modal' ? (
                  <button
                    type="button"
                    onClick={() => setIsDiscountOpen(true)}
                    className={`w-full py-3.5 rounded-xl text-center font-bold text-xs transition-all cursor-pointer ${
                      tier.highlight
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/20'
                        : 'bg-white/10 hover:bg-white/15 text-white'
                    }`}
                  >
                    {tier.cta}
                  </button>
                ) : (
                  <a
                    href="mailto:destek@nfcmyplace.com?subject=NFCMyPlace%20Kurumsal%20ve%20Ozel%20Tasarim%20Talebi"
                    className="w-full py-3.5 rounded-xl text-center font-bold text-xs transition-all bg-white/10 hover:bg-white/15 text-white block"
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
      <footer className="py-12 px-6 border-t border-white/10 bg-black/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center font-black text-black text-[10px]">
                NFC
              </div>
              <span className="font-extrabold text-sm text-white tracking-tight">
                NFC<span className="text-amber-400">MyPlace</span>
              </span>
            </div>
            <p className="text-xs text-white/50">{t.footer.tagline}</p>
            <p className="text-[11px] text-white/30">{t.footer.rights}</p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-white/60">
            <a href="#hardware" className="hover:text-amber-400 transition-colors">
              {t.nav.hardware}
            </a>
            <a href="#demos" className="hover:text-amber-400 transition-colors">
              {t.nav.demos}
            </a>
            <a href="#pricing" className="hover:text-amber-400 transition-colors">
              {t.nav.pricing}
            </a>
            <a
              href="https://digitalmenu-admin-panel.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors"
            >
              {t.nav.adminLogin}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
