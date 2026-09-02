'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Zap,
  Globe2,
  Layers,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { InteractiveBackground } from '@/components/InteractiveBackground';
import { ProductCardBespoke } from '@/components/ProductCardBespoke';
import { ProductOrderModal } from '@/components/ProductOrderModal';
import { NfcTapSimulator } from '@/components/NfcTapSimulator';
import { VisionSection } from '@/components/VisionSection';
import { EmailCaptureBespoke } from '@/components/EmailCaptureBespoke';
import { PRODUCTS, ProductItem, ProductColor } from '@/lib/products';

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

export default function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'google' | 'menu' | 'saas'>('all');
  const [activeOrderProduct, setActiveOrderProduct] = useState<ProductItem | null>(null);
  const [activeOrderColor, setActiveOrderColor] = useState<ProductColor>('black');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleOpenOrder = (product: ProductItem, color: ProductColor = 'black') => {
    setActiveOrderProduct(product);
    setActiveOrderColor(color);
    setIsOrderModalOpen(true);
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'google') return p.id.includes('google');
    if (selectedCategory === 'menu') return p.id.includes('menu') && p.category === 'hardware';
    if (selectedCategory === 'saas') return p.category === 'saas';
    return true;
  });

  const LIVE_DEMOS: LiveDemoItem[] = [
    {
      name: 'Baltazar Burger',
      tag: 'Karaköy • Gurme Burger',
      slug: 'baltazar',
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
      url: 'https://baltazar.nfcmyplace.com',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
      description: 'Karanlık mod 3D UI, masadan sipariş, TR/EN/AR 3 dilde anında menü erişimi.',
      buttonText: 'Baltazar Canlı Menüyü Aç',
      highlights: ['Karanlık Mod 3D UI', 'Masadan Sipariş', '3 Dil Desteği (TR/EN/AR)'],
    },
    {
      name: 'Kahve Erenköy',
      tag: 'Erenköy • Nitelikli Kahve',
      slug: 'kahve-erenkoy',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      url: 'https://kahve-erenkoy.nfcmyplace.com',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
      description: 'V60 özel reçeteleri, masa rozetleri, alerjen ve kategori filtreleri.',
      buttonText: 'Erenköy Canlı Menüyü Aç',
      highlights: ['V60 Nitelikli Menü', 'Masa Rozetleri', 'Alerjen & Kalori Filtresi'],
    },
    {
      name: 'Act Noir Café',
      tag: 'Moda • Butik Kahve & Bakery',
      slug: 'act-noir-cafe',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      url: 'https://act-noir-cafe.nfcmyplace.com',
      image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&auto=format&fit=crop&q=80',
      description: 'Minimalist masa deneyimi, ultra hızlı görsel yükleme ve akıllı garson çağırma.',
      buttonText: 'Act Noir Canlı Menüyü Aç',
      highlights: ['Butik Kahve Menüsü', 'Sade Masa Deneyimi', 'Cloudflare CDN Hızı'],
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#07090E] text-white selection:bg-purple-500 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* ── INTERACTIVE CONNECTED AMBIENT BACKGROUND ── */}
      <InteractiveBackground />

      {/* ── FLOATING LUXURY NAVBAR ── */}
      <Navbar onOpenOrder={() => handleOpenOrder(PRODUCTS[0])} />

      {/* ── HERO SECTION: HIGH-IMPACT MANIFESTO ── */}
      <section className="relative pt-16 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Holographic Pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 border border-white/20 text-white backdrop-blur-xl shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Yeni Nesil Hibrit NFC Ekosistemi</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]"
          >
            Fiziksel Dünyayı{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Dijitalin Hızıyla
            </span>{' '}
            Buluşturuyoruz.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed"
          >
            Özel lazer kesim pleksi kartlar, L-standlar ve suya dayanıklı 3M stickerlar ile Google yorumlarınızı 5 yıldıza taşıyın, masalarınızı akıllı SaaS menülerle donatın.
          </motion.p>

          {/* Action Button Group */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <a
              href="#products"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-black text-sm tracking-wide shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
            >
              <span>Ürünleri İncele & Sipariş Ver</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#simulator"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm tracking-wide backdrop-blur-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Canlı NFC Simülatörünü Dene</span>
            </a>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-white/50"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sıfır Uygulama & Pil Gereksinimi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Siyah / Beyaz / Şeffaf Pleksi Seçenekleri</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>48 Saatte Kişiye Özel Üretim & Kargo</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── INTERACTIVE NFC TAP SIMULATOR ── */}
      <div id="simulator">
        <NfcTapSimulator />
      </div>

      {/* ── CORE 6 PRODUCTS SHOWCASE & ORDER HUB ── */}
      <section id="products" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 border border-purple-500/20 text-purple-300">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                Donanım & Yazılım Kataloğu
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Mekanınız İçin{' '}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  6 İnovatif Çözüm
                </span>
              </h2>
              <p className="text-sm sm:text-base text-white/60 max-w-xl">
                Tüm ürünlerimizde kurumsal logonuzla kişiselleştirme, Siyah/Beyaz/Şeffaf pleksi seçenekleri ve toptan indirim avantajları mevcuttur.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              {[
                { id: 'all', label: 'Tüm Ürünler' },
                { id: 'google', label: 'Google Değerlendirme' },
                { id: 'menu', label: 'Masa Donanımı' },
                { id: 'saas', label: 'Dijital Menü SaaS' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 6 Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((prod) => (
              <ProductCardBespoke
                key={prod.id}
                product={prod}
                onOrderClick={(p, col) => handleOpenOrder(p, col)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── VISION & HYBRID MANIFESTO ── */}
      <div id="vision">
        <VisionSection />
      </div>

      {/* ── LIVE RESTAURANT MENU DEMOS ── */}
      <section id="demos" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 text-blue-300">
              <Globe2 className="w-3.5 h-3.5 text-blue-400" />
              Canlıda Çalışan Restoranlar
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              SaaS Menümüzü Canlıda İnceleyin
            </h2>
            <p className="text-sm sm:text-base text-white/60">
              Gerçek mekanların menülerini telefonunuzdan veya bilgisayarınızdan anında açıp test edebilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {LIVE_DEMOS.map((demo, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl bg-neutral-900/60 border border-white/10 hover:border-white/25 overflow-hidden backdrop-blur-xl p-5 flex flex-col justify-between shadow-2xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)]"
              >
                <div>
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-5">
                    <Image
                      src={demo.image}
                      alt={demo.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${demo.badgeColor}`}>
                      {demo.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{demo.name}</h3>
                  <p className="text-xs text-white/60 mb-4 leading-relaxed">{demo.description}</p>

                  <div className="space-y-1.5 mb-6">
                    {demo.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-white/70">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={demo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span>{demo.buttonText}</span>
                  <ArrowUpRight className="w-4 h-4 text-purple-400" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIP EMAIL CAPTURE & DISCOUNT PERK ── */}
      <EmailCaptureBespoke />

      {/* ── FOOTER ── */}
      <footer className="relative border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 z-10 bg-neutral-950/80 backdrop-blur-xl text-white/50 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
              <Zap className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">NFC My Place®</span>
            <span>— Fizikseli Dijitalle Buluşturan Akıllı Ekosistem</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#products" className="hover:text-white transition-colors">Ürünler</a>
            <a href="#simulator" className="hover:text-white transition-colors">Simülatör</a>
            <a href="#vision" className="hover:text-white transition-colors">Vizyon</a>
            <a href="#demos" className="hover:text-white transition-colors">Canlı Menüler</a>
          </div>

          <p>© {new Date().getFullYear()} NFC My Place. Tüm hakları saklıdır.</p>
        </div>
      </footer>

      {/* ── INTERACTIVE PRODUCT ORDER CONFIGURATOR MODAL ── */}
      <ProductOrderModal
        product={activeOrderProduct}
        initialColor={activeOrderColor}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
}
