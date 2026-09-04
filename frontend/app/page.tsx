'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Zap,
  Globe2,
  Layers,
  Radio,
  ShieldCheck,
} from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { InteractiveBackground } from '@/components/landing/InteractiveBackground';
import { ProductCardBespoke } from '@/components/landing/ProductCardBespoke';
import { ProductOrderModal } from '@/components/landing/ProductOrderModal';
import { NfcTapSimulator } from '@/components/landing/NfcTapSimulator';
import { VisionSection } from '@/components/landing/VisionSection';
import { EmailCaptureBespoke } from '@/components/landing/EmailCaptureBespoke';
import { MAIN_PRODUCTS, ProductItem, ProductColor } from '@/lib/products';

const DEMOS = [
  {
    name: 'Baltazar Burger',
    tag: 'Karaköy',
    color: '#C9604A',
    url: 'https://baltazar.nfcmyplace.com',
    fallbackPath: '/baltazar',
    img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    desc: 'Karanlık mod 3D UI, masadan sipariş, anlık fiyat ve 3 dil desteği.',
    badges: ['Masadan Sipariş', 'TR / EN / AR', 'Anlık Fiyat'],
  },
  {
    name: 'Kahve Erenköy',
    tag: 'Erenköy',
    color: '#C9A86C',
    url: 'https://kahve-erenkoy.nfcmyplace.com',
    fallbackPath: '/kahve-erenkoy',
    img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    desc: 'V60 reçeteleri, masa rozetleri, alerjen filtresi ve garson çağırma.',
    badges: ['V60 Nitelikli', 'Alerjen Filtresi', 'Masa Rozeti'],
  },
  {
    name: 'Act Noir Café',
    tag: 'Moda',
    color: '#8B9CB0',
    url: 'https://act-noir-cafe.nfcmyplace.com',
    fallbackPath: '/act-noir-cafe',
    img: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&auto=format&fit=crop&q=80',
    desc: 'Butik fırın & nitelikli kahve menüsü, ultra hızlı bulut CDN yükleme.',
    badges: ['Butik Deneyim', 'CDN Hızlı', 'Garson Çağır'],
  },
];

export default function RootPage() {
  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(null);
  const [activeColor, setActiveColor] = useState<ProductColor>('black');
  const [modalOpen, setModalOpen] = useState(false);

  const openOrder = (p: ProductItem, c: ProductColor = 'black') => {
    setActiveProduct(p);
    setActiveColor(c);
    setModalOpen(true);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#0D0B08', color: '#F0E6D3' }}>
      <InteractiveBackground />

      <div className="relative z-10">
        <Navbar onOpenOrder={() => openOrder(MAIN_PRODUCTS[0])} />

        {/* ═══════════════════════════════════════════
            HERO SECTION — Editorial Luxury
        ═══════════════════════════════════════════ */}
        <section className="relative pt-16 pb-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Headline & Value Proposition */}
              <div className="lg:col-span-7 space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
                  style={{
                    background: 'rgba(201,168,108,0.1)',
                    border: '1px solid rgba(201,168,108,0.3)',
                    color: '#C9A86C',
                  }}
                >
                  <span className="w-2 h-2 rounded-full beacon" style={{ background: '#C9A86C' }} />
                  Yeni Nesil Hibrit NFC Ekosistemi
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]"
                  style={{ color: '#F0E6D3' }}
                >
                  Fiziksel Dünyayı{' '}
                  <br className="hidden sm:block" />
                  <span className="gold-text">Dijitalin Hızıyla</span>{' '}
                  Buluşturuyoruz.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-base sm:text-lg leading-relaxed max-w-xl"
                  style={{ color: 'rgba(212,188,150,0.8)' }}
                >
                  Lüks lazer kesim pleksi kartlar, L-standlar ve akıllı SaaS menülerle işletmenizin müşteri etkileşimini ve Google puanını zirveye taşıyın.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <a
                    href="#products"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #C9A86C 0%, #A07840 100%)',
                      color: '#0D0B08',
                      boxShadow: '0 8px 32px rgba(180,130,60,0.4), 0 2px 8px rgba(0,0,0,0.4)',
                    }}
                  >
                    Ürünleri İncele & Sipariş Ver
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="#simulator"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-105"
                    style={{
                      background: 'rgba(201,168,108,0.08)',
                      border: '1px solid rgba(201,168,108,0.28)',
                      color: '#C9A86C',
                    }}
                  >
                    <Zap className="w-4 h-4" />
                    Canlı Simülatörü Dene
                  </a>
                </motion.div>

                {/* Trust strip */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="flex flex-wrap gap-6 pt-2"
                  style={{ color: 'rgba(180,152,104,0.7)', fontSize: '12px', fontWeight: 600 }}
                >
                  {['Pil & Uygulama Gerektirmez', 'Siyah / Beyaz / Şeffaf Pleksi', '48 Saatte Özel Üretim'].map((t) => (
                    <div key={t} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#C9A86C' }} />
                      <span>{t}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right Column: Floating Luxury Acrylic Card */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: -4 }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                  className="float-slow relative w-64 h-40 rounded-3xl shadow-2xl flex flex-col justify-between p-5"
                  style={{
                    background: 'linear-gradient(135deg, #1C1508 0%, #2A1E0A 50%, #1C1508 100%)',
                    border: '1px solid rgba(201,168,108,0.35)',
                    boxShadow:
                      '0 32px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(201,168,108,0.1), inset 0 1px 0 rgba(255,220,130,0.1)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-widest" style={{ color: '#C9A86C' }}>
                      NFC MYPLACE
                    </span>
                    <Radio className="w-4 h-4" style={{ color: 'rgba(201,168,108,0.6)' }} />
                  </div>
                  <div className="text-center space-y-1">
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className="text-sm" style={{ color: '#C9A86C' }}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-bold block" style={{ color: 'rgba(240,230,211,0.95)' }}>
                      Google Değerlendirme
                    </span>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono" style={{ color: 'rgba(201,168,108,0.4)' }}>
                    <span>NTAG213</span>
                    <span>TEMASSIZ DOKUNUŞ</span>
                  </div>

                  {/* Under glow */}
                  <div
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-12 blur-2xl rounded-full opacity-60 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse, rgba(180,130,40,0.5), transparent)' }}
                  />
                </motion.div>

                {/* Second background card for depth */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, rotate: 8 }}
                  animate={{ opacity: 1, scale: 0.88, rotate: 8 }}
                  transition={{ duration: 0.9, delay: 0.5 }}
                  className="float-delayed absolute w-60 h-36 rounded-3xl -bottom-4 -left-4 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, #16120A, #221A08)',
                    border: '1px solid rgba(201,168,108,0.15)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                    zIndex: -1,
                  }}
                />
              </div>
            </div>

            {/* Stat Counters Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { val: '0.2 sn', label: 'NFC Okuma Hızı' },
                { val: '+%340', label: 'Google Yorum Artışı' },
                { val: '3 Dil', label: 'TR / EN / AR Otomatik' },
                { val: '100K+', label: 'Ömür Boyu Dokunuş' },
              ].map(({ val, label }) => (
                <div
                  key={val}
                  className="glass-warm rounded-2xl p-5 text-center"
                  style={{ background: 'rgba(22,18,10,0.75)' }}
                >
                  <span className="block text-2xl font-black tracking-tight gold-text">{val}</span>
                  <span className="block text-xs mt-1 font-medium" style={{ color: 'rgba(180,152,104,0.75)' }}>
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            NFC TAP SIMULATOR
        ═══════════════════════════════════════════ */}
        <div id="simulator">
          <NfcTapSimulator />
        </div>

        {/* ═══════════════════════════════════════════
            PRODUCTS — 3 Core Hardware/SaaS + 1 VIP Bundle
        ═══════════════════════════════════════════ */}
        <section
          id="products"
          className="py-28 px-4 sm:px-6 lg:px-8"
          style={{ borderTop: '1px solid rgba(201,168,108,0.1)' }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{
                  background: 'rgba(201,168,108,0.08)',
                  border: '1px solid rgba(201,168,108,0.25)',
                  color: '#C9A86C',
                }}
              >
                <Layers className="w-3.5 h-3.5" />
                Donanım & Yazılım Kataloğu
              </div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: '#F0E6D3' }}>
                Mekanınız İçin <span className="gold-text">Doğru Çözüm</span>
              </h2>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(200,174,128,0.75)' }}>
                Tekil donanım siparişi verin ya da hepsi bir arada VIP paketle eksiksiz kurulum yapın.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {MAIN_PRODUCTS.map((prod) => (
                <ProductCardBespoke
                  key={prod.id}
                  product={prod}
                  isBundle={prod.category === 'bundle'}
                  onOrderClick={openOrder}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            VISION SECTION
        ═══════════════════════════════════════════ */}
        <div id="vision">
          <VisionSection />
        </div>

        {/* ═══════════════════════════════════════════
            LIVE RESTAURANT MENUS
        ═══════════════════════════════════════════ */}
        <section
          id="demos"
          className="py-28 px-4 sm:px-6 lg:px-8"
          style={{ borderTop: '1px solid rgba(201,168,108,0.1)' }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{
                  background: 'rgba(201,168,108,0.08)',
                  border: '1px solid rgba(201,168,108,0.25)',
                  color: '#C9A86C',
                }}
              >
                <Globe2 className="w-3.5 h-3.5" />
                Canlıda Çalışan Restoran Menüleri
              </div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: '#F0E6D3' }}>
                SaaS Menümüzü <span className="gold-text">Mekanlarda İnceleyin</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DEMOS.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group glass-warm rounded-3xl overflow-hidden flex flex-col"
                  style={{ background: 'rgba(18,14,8,0.85)' }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={d.img}
                      alt={d.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(13,11,8,0.95) 0%, rgba(13,11,8,0.25) 60%, transparent 100%)',
                      }}
                    />
                    <span
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: 'rgba(13,11,8,0.85)',
                        color: d.color,
                        border: `1px solid ${d.color}50`,
                      }}
                    >
                      {d.tag}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <h3 className="text-lg font-bold" style={{ color: '#F0E6D3' }}>
                      {d.name}
                    </h3>
                    <p className="text-xs leading-relaxed flex-1" style={{ color: 'rgba(180,152,104,0.75)' }}>
                      {d.desc}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {d.badges.map((b) => (
                        <span
                          key={b}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                          style={{
                            background: 'rgba(201,168,108,0.08)',
                            color: '#C9A86C',
                            border: '1px solid rgba(201,168,108,0.2)',
                          }}
                        >
                          {b}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-xs transition-all hover:scale-[1.02]"
                        style={{
                          background: 'rgba(201,168,108,0.12)',
                          border: '1px solid rgba(201,168,108,0.3)',
                          color: '#C9A86C',
                        }}
                      >
                        <span>Subdomain</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                      <Link
                        href={d.fallbackPath}
                        className="flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-xs transition-all hover:scale-[1.02]"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#F0E6D3',
                        }}
                      >
                        <span>Önizle</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            EMAIL VIP CAPTURE
        ═══════════════════════════════════════════ */}
        <EmailCaptureBespoke />

        {/* ═══════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════ */}
        <footer
          className="py-14 px-4 sm:px-6 lg:px-8 text-xs"
          style={{ borderTop: '1px solid rgba(201,168,108,0.1)', color: 'rgba(180,152,104,0.55)' }}
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg border border-[rgba(201,168,108,0.3)] flex items-center justify-center"
                style={{ background: 'rgba(201,168,108,0.1)' }}
              >
                <Radio className="w-4 h-4" style={{ color: '#C9A86C' }} />
              </div>
              <span className="font-bold text-sm" style={{ color: '#D4BC96' }}>
                NFC My Place®
              </span>
            </div>

            <div className="flex flex-wrap gap-6 font-semibold" style={{ color: 'rgba(180,152,104,0.65)' }}>
              <a href="#products" className="hover:text-[#C9A86C] transition-colors">
                Ürünler
              </a>
              <a href="#simulator" className="hover:text-[#C9A86C] transition-colors">
                Simülatör
              </a>
              <a href="#vision" className="hover:text-[#C9A86C] transition-colors">
                Vizyon
              </a>
              <a href="#demos" className="hover:text-[#C9A86C] transition-colors">
                Canlı Menüler
              </a>
              <Link href="/admin" className="hover:text-[#C9A86C] transition-colors flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Restoran Paneli
              </Link>
            </div>

            <p>© {new Date().getFullYear()} NFC My Place. Tüm hakları saklıdır.</p>
          </div>
        </footer>
      </div>

      <ProductOrderModal
        product={activeProduct}
        initialColor={activeColor}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
