'use client';
import { Navbar } from '@/components/Navbar';
import NfcProduct3DCanvas from '@/components/NfcProduct3DCanvas';
import { DiscountModal } from '@/components/DiscountModal';
import { motion } from 'framer-motion';

const LIVE_DEMOS = [
  {
    name: 'Baltazar Burger',
    tag: 'Smash Burgers & Bistro',
    slug: 'baltazar',
    themeColor: '#C0392B',
    url: 'https://digitalmenu-wdo5.vercel.app/baltazar',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    description: 'High-energy gourmet burger joint with multi-language TR/EN/AR menu, table ordering, and dark mode aesthetics.',
  },
  {
    name: 'Kahve Erenköy',
    tag: 'Specialty Coffee & Bakery',
    slug: 'kahve-erenkoy',
    themeColor: '#6F4E37',
    url: 'https://digitalmenu-wdo5.vercel.app/kahve-erenkoy',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
    description: 'Warm specialty coffee shop in Kadıköy featuring V60 pour over, Bask cheesecake, croissant badges, and table banners.',
  },
];

const PRICING_TIERS = [
  {
    name: 'Starter Kit',
    price: '$149',
    subtitle: 'Ideal for small cafes & boutique venues',
    features: [
      '10x Acrylic & Wood NFC Table Stands',
      '2x Gold Foil Google Review Cards',
      'Full Digital Menu SaaS Access',
      'Multi-Language (TR / EN / AR)',
      'Basic Traffic Analytics',
    ],
    highlight: false,
    cta: 'Order Starter Kit',
  },
  {
    name: 'Restaurant Pro Kit',
    price: '$299',
    subtitle: 'Best value for busy restaurants & bars',
    features: [
      '25x Acrylic & Wood NFC Table Stands',
      '5x Gold Foil Google Review Cards',
      '10x Waterproof Table Stickers',
      'Full SaaS + Table Routing Context',
      '30-Day Advanced Traffic Analytics',
      'Custom Logo & Theme Styling',
    ],
    highlight: true,
    cta: 'Order Pro Kit',
  },
  {
    name: 'Enterprise Custom',
    price: 'Custom',
    subtitle: 'Tailored hardware & multi-branch SaaS',
    features: [
      'Unlimited Custom Engraved Hardware',
      'Dedicated Account Manager',
      'Custom Subdomain (venue.nfcmyplace.com)',
      'POS Integration & Webhook Sync',
      'Priority 24/7 SLA Support',
    ],
    highlight: false,
    cta: 'Contact Sales',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-amber-500 selection:text-black">
      <Navbar />
      <DiscountModal />

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
            ⚡ Physical NFC Hardware Meets Smart Menu SaaS
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none">
            Next-Generation Smart Menus & <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">NFC Hardware</span> for Venues
          </h1>

          <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
            Connect physical tables directly to digital menus, 5-star Google reviews, and instant ordering with custom-designed NFC stands, stickers, and cards.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#hardware"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-black text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Explore 3D Hardware ↓
            </a>
            <a
              href="#demos"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm transition-all"
            >
              Try Live Demo
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── 3D HARDWARE SHOWCASE SECTION ── */}
      <section id="hardware" className="py-12 px-6 border-t border-white/5 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="max-w-4xl mx-auto text-center space-y-3 mb-6">
          <h2 className="text-3xl sm:text-4xl font-black">Interactive 3D Product Showcase</h2>
          <p className="text-xs sm:text-sm text-white/50">
            Rotate 360° to inspect our restaurant-grade NFC hardware built for durability and instant customer taps.
          </p>
        </div>

        <NfcProduct3DCanvas />
      </section>

      {/* ── LIVE DEMO LAUNCHERS SECTION ── */}
      <section id="demos" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Live Deployments</span>
          <h2 className="text-3xl sm:text-4xl font-black">Experience Live Restaurant Menus</h2>
          <p className="text-sm text-white/50">Test real multi-tenant menus powered by our single dynamic Next.js frontend.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {LIVE_DEMOS.map((demo) => (
            <motion.article
              key={demo.slug}
              whileHover={{ y: -6 }}
              className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={demo.image} alt={demo.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/10 text-white/80">
                    {demo.tag}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-3">{demo.name}</h3>
                  <p className="text-xs text-white/60 mt-2 leading-relaxed">{demo.description}</p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href={demo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 text-center rounded-xl font-bold text-xs transition-colors"
                  style={{ backgroundColor: demo.themeColor, color: '#ffffff' }}
                >
                  Launch {demo.name} Menu →
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
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Starter Packs</span>
            <h2 className="text-3xl sm:text-4xl font-black">Hardware & SaaS Bundles</h2>
            <p className="text-sm text-white/50">Everything you need to launch smart NFC table menus in under 24 hours.</p>
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
                    Most Popular
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

                <a
                  href="#pricing"
                  className={`w-full py-3.5 rounded-xl text-center font-bold text-xs transition-all ${
                    tier.highlight
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/20'
                      : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 border-t border-white/10 text-center text-xs text-white/40 space-y-2">
        <p>© 2026 NFCMyPlace Inc. All rights reserved.</p>
        <p>Dynamic Multi-Tenant Smart Menus & Physical NFC Hardware System.</p>
      </footer>
    </div>
  );
}
