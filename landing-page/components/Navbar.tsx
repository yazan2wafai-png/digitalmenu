'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Radio, Menu, X, ArrowRight, Zap } from 'lucide-react';

export function Navbar({ onOpenOrder }: { onOpenOrder?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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
            ? 'bg-[rgba(13,11,8,0.92)] backdrop-blur-2xl border border-[rgba(201,168,108,0.2)] shadow-[0_8px_40px_rgba(0,0,0,0.6)]'
            : 'bg-[rgba(13,11,8,0.6)] backdrop-blur-xl border border-[rgba(201,168,108,0.1)]'
        }`}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center border border-[rgba(201,168,108,0.4)]"
            style={{ background: 'linear-gradient(135deg, #2A2010, #1A1508)' }}>
            <Radio className="w-4 h-4" style={{ color: '#C9A86C' }} />
          </div>
          <span className="font-bold text-base tracking-tight" style={{ color: '#F0E6D3' }}>
            NFC<span className="gold-text">MyPlace</span>
            <sup style={{ color: '#C9A86C', fontSize: '10px', marginLeft: '1px' }}>®</sup>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold" style={{ color: 'rgba(212,188,150,0.75)' }}>
          {[
            { href: '#products', label: 'Ürünler' },
            { href: '#simulator', label: 'Simülatör', icon: true },
            { href: '#vision', label: 'Vizyon' },
            { href: '#demos', label: 'Canlı Menüler' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-1 transition-colors duration-200 hover:text-[#E2C99A]"
            >
              {item.icon && <Zap className="w-3 h-3" style={{ color: '#C9A86C' }} />}
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="#products"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #C9A86C, #8A6835)',
              color: '#0D0B08',
              boxShadow: '0 4px 20px rgba(201,168,108,0.3)',
            }}
          >
            <span>Sipariş Ver</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ background: 'rgba(201,168,108,0.08)', color: '#C9A86C' }}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-2 mx-4 p-5 rounded-2xl border flex flex-col gap-3 text-sm font-semibold"
          style={{
            background: 'rgba(13,11,8,0.97)',
            backdropFilter: 'blur(24px)',
            borderColor: 'rgba(201,168,108,0.2)',
          }}
        >
          {['Ürünler:#products','Simülatör:#simulator','Vizyon:#vision','Canlı Menüler:#demos'].map((item) => {
            const [label, href] = item.split(':');
            return (
              <a key={href} href={href} onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-xl transition-colors"
                style={{ color: 'rgba(212,188,150,0.8)' }}>
                {label}
              </a>
            );
          })}
          <a href="#products" onClick={() => setMobileOpen(false)}
            className="mt-2 py-3 rounded-xl text-center font-bold text-xs"
            style={{ background: 'linear-gradient(135deg, #C9A86C, #8A6835)', color: '#0D0B08' }}>
            Hemen Sipariş Ver
          </a>
        </motion.div>
      )}
    </header>
  );
}
