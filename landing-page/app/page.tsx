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
  ShieldCheck,
  Star,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { InteractiveBackground } from '@/components/InteractiveBackground';
import { ProductCardBespoke } from '@/components/ProductCardBespoke';
import { ProductOrderModal } from '@/components/ProductOrderModal';
import { NfcTapSimulator } from '@/components/NfcTapSimulator';
import { VisionSection } from '@/components/VisionSection';
import { EmailCaptureBespoke } from '@/components/EmailCaptureBespoke';
import { MAIN_PRODUCTS, ProductItem, ProductColor } from '@/lib/products';

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
  const [activeOrderProduct, setActiveOrderProduct] = useState<ProductItem | null>(null);
  const [activeOrderColor, setActiveOrderColor] = useState<ProductColor>('black');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleOpenOrder = (product: ProductItem, color: ProductColor = 'black') => {
    setActiveOrderProduct(product);
    setActiveOrderColor(color);
    setIsOrderModalOpen(true);
  };

  const LIVE_DEMOS: LiveDemoItem[] = [
    {
      name: 'Baltazar Burger',
      tag: 'Karaköy • Gurme Burger',
      slug: 'baltazar',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
      url: 'https://baltazar.nfcmyplace.com',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
      description: 'Karanlık mod 3D UI, masadan anında sipariş, TR/EN/AR 3 dilde canlı menü.',
      buttonText: 'Baltazar Menüsünü Aç',
      highlights: ['Karanlık Mod 3D UI', 'Masadan Sipariş', '3 Dil Desteği (TR/EN/AR)'],
    },
    {
      name: 'Kahve Erenköy',
      tag: 'Erenköy • Nitelikli Kahve',
      slug: 'kahve-erenkoy',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      url: 'https://kahve-erenkoy.nfcmyplace.com',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
      description: 'V60 özel reçeteleri, masa rozetleri, alerjen ve kategori filtreleme sistemi.',
      buttonText: 'Erenköy Menüsünü Aç',
      highlights: ['V60 Nitelikli Menü', 'Masa Rozetleri', 'Alerjen & Kalori Filtresi'],
    },
    {
      name: 'Act Noir Café',
      tag: 'Moda • Butik Kahve & Bakery',
      slug: 'act-noir-cafe',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      url: 'https://act-noir-cafe.nfcmyplace.com',
      image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&auto=format&fit=crop&q=80',
      description: 'Minimalist masa deneyimi, ultra hızlı görsel yükleme ve akıllı garson çağırma.',
      buttonText: 'Act Noir Menüsünü Aç',
      highlights: ['Butik Kahve Menüsü', 'Sade Masa Deneyimi', 'Cloudflare CDN Hızı'],
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#07090E] text-[#F8FAFC] selection:bg-purple-600 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* ── AMBIENT CLEAN BACKGROUND ── */}
      <InteractiveBackground />

      {/* ── FLOATING NAVBAR ── */}
      <Navbar onOpenOrder={() => handleOpenOrder(MAIN_PRODUCTS[0])} />

      {/* ── HERO SECTION: HIGH CONTRAST & IMPACT ── */}
      <section className="relative pt-16 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Holographic Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-950/80 border border-purple-500/40 text-purple-200 shadow-xl"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Yeni Nesil Hibrit NFC Ekosistemi</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed font-normal"
          >
            Lüks pleksi Google değerlendirme kartları, kasa L-standları ve akıllı masadan sipariş SaaS menüleriyle mekanınızı geleceğe taşıyın.
          </motion.p>

          {/* Action Button Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <a
              href="#products"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-black text-sm tracking-wide shadow-xl shadow-purple-600/40 hover:shadow-purple-600/60 transition-all flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
            >
              <span>Ürünleri & Paketleri İncele</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#simulator"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Canlı NFC Simülatörünü Dene</span>
            </a>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-300"
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

      {/* ── CORE 3 PRODUCTS + ALL-IN-ONE BUNDLE ── */}
      <section id="products" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 border-t border-neutral-800/80">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 border border-purple-500/40 text-purple-300">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              Ana Ürünler & Toplam VIP Paket
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Mekanınıza En Uygun Çözümü Seçin
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              İhtiyacınıza göre tekil donanım alabilir veya hepsi bir arada VIP full ekosistem paketimizle eksiksiz kurulum yapabilirsiniz.
            </p>
          </div>

          {/* Grid: 3 Core Products + 1 Full Width VIP Bundle */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MAIN_PRODUCTS.map((prod) => (
              <ProductCardBespoke
                key={prod.id}
                product={prod}
                isBundle={prod.category === 'bundle'}
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
      <section id="demos" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 border-t border-neutral-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 border border-blue-500/40 text-blue-300">
              <Globe2 className="w-3.5 h-3.5 text-blue-400" />
              Canlıda Çalışan Restoranlar
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              SaaS Menümüzü Canlıda İnceleyin
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Gerçek mekanların menülerini telefonunuzdan veya bilgisayarınızdan anında açıp test edebilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {LIVE_DEMOS.map((demo, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl bg-[#11131C] border border-neutral-800 hover:border-neutral-700 overflow-hidden p-5 flex flex-col justify-between shadow-2xl transition-all duration-300"
              >
                <div>
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-5 bg-neutral-950">
                    <Image
                      src={demo.image}
                      alt={demo.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-80" />
                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${demo.badgeColor}`}>
                      {demo.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{demo.name}</h3>
                  <p className="text-xs text-slate-300 mb-4 leading-relaxed font-normal">{demo.description}</p>

                  <div className="space-y-1.5 mb-6">
                    {demo.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium text-neutral-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={demo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
      <footer className="relative border-t border-neutral-800 py-12 px-4 sm:px-6 lg:px-8 z-10 bg-[#08090E] text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              <Zap className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">NFC My Place®</span>
            <span>— Fizikseli Dijitalle Buluşturan Akıllı Ekosistem</span>
          </div>

          <div className="flex items-center gap-6 font-medium text-slate-300">
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
