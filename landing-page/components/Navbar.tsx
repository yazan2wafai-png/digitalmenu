'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ExternalLink, Menu, X, ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/lib/translations';
import { translations } from '@/lib/translations';

interface Props {
  locale: Locale;
  onToggleLocale: (locale: Locale) => void;
  onOpenDiscount?: () => void;
}

export function Navbar({ locale, onToggleLocale, onOpenDiscount }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[locale].nav;

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto rounded-2xl bg-neutral-950/70 backdrop-blur-xl border border-white/10 shadow-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* ── BRAND LOGO ── */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center font-black text-black text-xs shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
            NFC
          </div>
          <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">
            NFC<span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">MyPlace</span>
          </span>
        </Link>

        {/* ── DESKTOP NAVIGATION LINKS ── */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-white/70">
          <a
            href="#hardware"
            className="hover:text-amber-400 transition-colors tracking-wide"
          >
            {t.hardware}
          </a>
          <a
            href="#demos"
            className="hover:text-amber-400 transition-colors tracking-wide"
          >
            {t.demos}
          </a>
          <a
            href="#pricing"
            className="hover:text-amber-400 transition-colors tracking-wide"
          >
            {t.pricing}
          </a>
        </nav>

        {/* ── ACTION CONTROLS & LANGUAGE SWITCHER ── */}
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

          {/* Admin Login Link */}
          <a
            href="https://admin.nfcmyplace.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-white/70 hover:text-amber-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            <span>{t.adminLogin}</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>

          {/* CTA Button */}
          {onOpenDiscount ? (
            <button
              onClick={onOpenDiscount}
              className="relative group overflow-hidden px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer transform active:scale-95"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {t.cta}
              </span>
            </button>
          ) : (
            <a
              href="#pricing"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs shadow-lg shadow-amber-500/20 transition-all"
            >
              {t.cta}
            </a>
          )}

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
            href="#hardware"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-white/5 text-white/80 hover:text-amber-400"
          >
            {t.hardware}
          </a>
          <a
            href="#demos"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-white/5 text-white/80 hover:text-amber-400"
          >
            {t.demos}
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-white/5 text-white/80 hover:text-amber-400"
          >
            {t.pricing}
          </a>
          <a
            href="https://admin.nfcmyplace.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-lg hover:bg-white/5 text-amber-400 flex items-center justify-between"
          >
            <span>{t.adminLogin}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </header>
  );
}
