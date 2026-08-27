'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Radio, Menu, X, ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/lib/translations';
import { translations } from '@/lib/translations';

export interface NavbarProps {
  locale: Locale;
  onToggleLocale: (locale: Locale) => void;
  onOpenDiscount?: () => void;
}

export function Navbar({ locale, onToggleLocale, onOpenDiscount }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[locale].nav;

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto rounded-2xl bg-neutral-950/80 backdrop-blur-xl border border-white/10 shadow-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* ── BRAND LOGO: NFCMyPlace® with Amber Radio Icon Badge ── */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
            <Radio className="w-4 h-4 text-black stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-base sm:text-lg text-white tracking-tight flex items-center">
            <span>NFC</span>
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">MyPlace</span>
            <span className="text-amber-400 text-xs font-bold ml-0.5 self-start">®</span>
          </span>
        </Link>

        {/* ── DESKTOP NAVIGATION LINKS ── */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-white/70">
          <a
            href="#customizer"
            className="hover:text-amber-400 transition-colors tracking-wide"
          >
            {t.products}
          </a>
          <a
            href="#sticker"
            className="hover:text-amber-400 transition-colors tracking-wide"
          >
            {t.tableSolutions}
          </a>
          <a
            href="#saas"
            className="hover:text-amber-400 transition-colors tracking-wide"
          >
            {t.saas}
          </a>
          <a
            href="#pricing"
            className="hover:text-amber-400 transition-colors tracking-wide"
          >
            {t.pricing}
          </a>
        </nav>

        {/* ── ACTION CONTROLS & LANGUAGE SWITCHER & ADMIN LOGIN CTA ── */}
        <div className="flex items-center gap-3">
          {/* TR | EN Language Switcher */}
          <div className="flex items-center bg-white/[0.06] border border-white/10 rounded-xl p-0.5 text-[11px] font-bold">
            <button
              onClick={() => onToggleLocale('tr')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                locale === 'tr'
                  ? 'bg-amber-500 text-black font-black shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              TR
            </button>
            <button
              onClick={() => onToggleLocale('en')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                locale === 'en'
                  ? 'bg-amber-500 text-black font-black shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* CTA Button: "Yönetici Girişi" pointing to admin.nfcmyplace.com */}
          <a
            href="https://admin.nfcmyplace.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs shadow-lg shadow-amber-500/20 transition-all transform active:scale-95 cursor-pointer"
          >
            <span>{t.adminLogin}</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
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

      {/* ── MOBILE DROPDOWN MENU ── */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl bg-neutral-950/95 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col gap-3 text-sm font-semibold">
          <a
            href="#customizer"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-white/5 text-white/80 hover:text-amber-400"
          >
            {t.products}
          </a>
          <a
            href="#sticker"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-white/5 text-white/80 hover:text-amber-400"
          >
            {t.tableSolutions}
          </a>
          <a
            href="#saas"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-white/5 text-white/80 hover:text-amber-400"
          >
            {t.saas}
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-white/5 text-white/80 hover:text-amber-400"
          >
            {t.pricing}
          </a>
          <div className="pt-2 border-t border-white/10">
            <a
              href="https://admin.nfcmyplace.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs flex items-center justify-between shadow-md"
            >
              <span>{t.adminLogin}</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
