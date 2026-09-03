'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Radio, Menu, X, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenOrder?: () => void;
}

export function Navbar({ onOpenOrder }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 py-4">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-6xl mx-auto rounded-2xl px-5 sm:px-7 py-3.5 flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? 'bg-[rgba(13,11,8,0.92)] backdrop-blur-2xl border border-[rgba(201,168,108,0.22)] shadow-[0_8px_40px_rgba(0,0,0,0.65)]'
            : 'bg-[rgba(13,11,8,0.65)] backdrop-blur-xl border border-[rgba(201,168,108,0.12)]'
        }`}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center border border-[rgba(201,168,108,0.4)] transition-transform group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #2A2010, #1A1508)' }}
          >
            <Radio className="w-4 h-4" style={{ color: '#C9A86C' }} />
          </div>
          <span className="font-bold text-base tracking-tight" style={{ color: '#F0E6D3' }}>
            NFC<span className="gold-text">MyPlace</span>
            <sup style={{ color: '#C9A86C', fontSize: '10px', marginLeft: '2px' }}>®</sup>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold" style={{ color: 'rgba(212,188,150,0.8)' }}>
          <a href="#products" className="transition-colors duration-200 hover:text-[#E2C99A]">
            Ürünler
          </a>
          <a href="#simulator" className="flex items-center gap-1.5 transition-colors duration-200 hover:text-[#E2C99A]">
            <Zap className="w-3.5 h-3.5" style={{ color: '#C9A86C' }} />
            Simülatör
          </a>
          <a href="#vision" className="transition-colors duration-200 hover:text-[#E2C99A]">
            Vizyon
          </a>
          <a href="#demos" className="transition-colors duration-200 hover:text-[#E2C99A]">
            Canlı Menüler
          </a>
          <Link
            href="/admin"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all duration-200 hover:text-white"
            style={{
              background: 'rgba(201,168,108,0.06)',
              borderColor: 'rgba(201,168,108,0.2)',
              color: '#C9A86C',
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Restoran Paneli
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenOrder}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #C9A86C, #8A6835)',
              color: '#0D0B08',
              boxShadow: '0 4px 20px rgba(201,168,108,0.3)',
            }}
          >
            <span>Sipariş Ver</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl transition-colors cursor-pointer"
            style={{ background: 'rgba(201,168,108,0.08)', color: '#C9A86C', border: '1px solid rgba(201,168,108,0.15)' }}
            aria-label="Menü"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-2 mx-auto max-w-6xl p-5 rounded-2xl border flex flex-col gap-3 text-sm font-semibold"
          style={{
            background: 'rgba(13,11,8,0.98)',
            backdropFilter: 'blur(24px)',
            borderColor: 'rgba(201,168,108,0.25)',
          }}
        >
          <a
            href="#products"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-xl transition-colors"
            style={{ color: 'rgba(212,188,150,0.85)' }}
          >
            Ürünler & Fiyatlar
          </a>
          <a
            href="#simulator"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-xl transition-colors"
            style={{ color: 'rgba(212,188,150,0.85)' }}
          >
            NFC Tap Simülatörü
          </a>
          <a
            href="#vision"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-xl transition-colors"
            style={{ color: 'rgba(212,188,150,0.85)' }}
          >
            Vizyon & Teknoloji
          </a>
          <a
            href="#demos"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-xl transition-colors"
            style={{ color: 'rgba(212,188,150,0.85)' }}
          >
            Canlı Restoran Menüleri
          </a>
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-xl transition-colors flex items-center gap-2"
            style={{ color: '#C9A86C' }}
          >
            <ShieldCheck className="w-4 h-4" />
            Restoran Yönetim Paneli Girişi
          </Link>
          <button
            onClick={() => {
              setMobileOpen(false);
              if (onOpenOrder) onOpenOrder();
            }}
            className="mt-2 py-3 rounded-xl text-center font-bold text-xs cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #C9A86C, #8A6835)', color: '#0D0B08' }}
          >
            Hemen Sipariş Ver
          </button>
        </motion.div>
      )}
    </header>
  );
}
