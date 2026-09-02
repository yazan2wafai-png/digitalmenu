'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Radio, Menu, X, Sparkles, ArrowRight, Zap } from 'lucide-react';
import type { Locale } from '@/lib/translations';

export interface NavbarProps {
  locale: Locale;
  onToggleLocale: (locale: Locale) => void;
  onOpenOrder?: () => void;
}

export function Navbar({ locale, onToggleLocale, onOpenOrder }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 py-4 transition-all">
      <div className="max-w-6xl mx-auto rounded-2xl bg-neutral-900/80 backdrop-blur-2xl border border-white/15 shadow-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
            <Radio className="w-4 h-4 text-white stroke-[2.5]" />
          </div>
          <span className="font-bold text-base sm:text-lg text-white tracking-tight flex items-center">
            <span>NFC</span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">MyPlace</span>
            <span className="text-pink-400 text-xs font-bold ml-0.5 self-start">®</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-white/70">
          <a
            href="#products"
            className="hover:text-white hover:text-purple-300 transition-colors tracking-wide"
          >
            {locale === 'tr' ? 'NFC Ürünleri' : 'NFC Products'}
          </a>
          <a
            href="#simulator"
            className="hover:text-white hover:text-purple-300 transition-colors tracking-wide flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            {locale === 'tr' ? 'Canlı Simülatör' : 'Live Simulator'}
          </a>
          <a
            href="#vision"
            className="hover:text-white hover:text-purple-300 transition-colors tracking-wide"
          >
            {locale === 'tr' ? 'Vizyon' : 'Vision'}
          </a>
          <a
            href="#demos"
            className="hover:text-white hover:text-purple-300 transition-colors tracking-wide"
          >
            {locale === 'tr' ? 'Canlı Menüler' : 'Live Menus'}
          </a>
        </nav>

        {/* Action Controls & Language Switcher & Order CTA */}
        <div className="flex items-center gap-3">
          {/* TR | EN Language Switcher */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5 text-[11px] font-bold">
            <button
              onClick={() => onToggleLocale('tr')}
              aria-pressed={locale === 'tr'}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                locale === 'tr'
                  ? 'bg-purple-600 text-white font-black shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              TR
            </button>
            <button
              onClick={() => onToggleLocale('en')}
              aria-pressed={locale === 'en'}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                locale === 'en'
                  ? 'bg-purple-600 text-white font-black shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Quick Order Button */}
          <a
            href="#products"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <span>{locale === 'tr' ? 'Sipariş Ver' : 'Order Now'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/5 text-white/80 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl bg-neutral-900/95 border border-white/15 backdrop-blur-2xl shadow-2xl flex flex-col gap-3 text-sm font-semibold text-white">
          <a
            href="#products"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-white/5 text-white/80 hover:text-white"
          >
            {locale === 'tr' ? 'NFC Ürünleri' : 'NFC Products'}
          </a>
          <a
            href="#simulator"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-white/5 text-white/80 hover:text-white"
          >
            {locale === 'tr' ? 'Canlı Simülatör' : 'Live Simulator'}
          </a>
          <a
            href="#vision"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-white/5 text-white/80 hover:text-white"
          >
            {locale === 'tr' ? 'Vizyon' : 'Vision'}
          </a>
          <a
            href="#demos"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-white/5 text-white/80 hover:text-white"
          >
            {locale === 'tr' ? 'Canlı Menüler' : 'Live Menus'}
          </a>
          <a
            href="#products"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-center text-white font-bold text-xs"
          >
            {locale === 'tr' ? 'Hemen Sipariş Ver' : 'Order Now'}
          </a>
        </div>
      )}
    </header>
  );
}
