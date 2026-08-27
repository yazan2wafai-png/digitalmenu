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
      <div className="max-w-6xl mx-auto rounded-2xl bg-cream/90 backdrop-blur-xl border border-ink/10 shadow-lg shadow-ink/5 px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* ── BRAND LOGO: NFCMyPlace® with Ink/Terracotta Radio Icon Badge ── */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-xl bg-ink flex items-center justify-center shadow-md shadow-ink/20 group-hover:scale-105 transition-transform">
            <Radio className="w-4 h-4 text-terracotta stroke-[2.5]" />
          </div>
          <span className="font-display font-bold text-base sm:text-lg text-ink tracking-tight flex items-center">
            <span>NFC</span>
            <span className="text-terracotta">MyPlace</span>
            <span className="text-terracotta text-xs font-bold ml-0.5 self-start">®</span>
          </span>
        </Link>

        {/* ── DESKTOP NAVIGATION LINKS ── */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-ink/60">
          <a
            href="#customizer"
            className="hover:text-terracotta transition-colors tracking-wide"
          >
            {t.products}
          </a>
          <a
            href="#sticker"
            className="hover:text-terracotta transition-colors tracking-wide"
          >
            {t.tableSolutions}
          </a>
          <a
            href="#saas"
            className="hover:text-terracotta transition-colors tracking-wide"
          >
            {t.saas}
          </a>
          <a
            href="#pricing"
            className="hover:text-terracotta transition-colors tracking-wide"
          >
            {t.pricing}
          </a>
        </nav>

        {/* ── ACTION CONTROLS & LANGUAGE SWITCHER & ADMIN LOGIN CTA ── */}
        <div className="flex items-center gap-3">
          {/* TR | EN Language Switcher */}
          <div className="flex items-center bg-ink/[0.04] border border-ink/10 rounded-xl p-0.5 text-[11px] font-bold">
            <button
              onClick={() => onToggleLocale('tr')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                locale === 'tr'
                  ? 'bg-terracotta text-cream font-black shadow-sm'
                  : 'text-ink/50 hover:text-ink'
              }`}
            >
              TR
            </button>
            <button
              onClick={() => onToggleLocale('en')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                locale === 'en'
                  ? 'bg-terracotta text-cream font-black shadow-sm'
                  : 'text-ink/50 hover:text-ink'
              }`}
            >
              EN
            </button>
          </div>

          {/* CTA Button: "Yönetici Girişi" pointing to admin.nfcmyplace.com/login */}
          <a
            href="https://admin.nfcmyplace.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink hover:bg-ink/90 text-cream font-black text-xs shadow-md shadow-ink/15 transition-all transform active:scale-95 cursor-pointer"
          >
            <span>{t.adminLogin}</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-ink/5 text-ink/80 hover:text-ink"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE DROPDOWN MENU ── */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl bg-cream/95 border border-ink/10 backdrop-blur-xl shadow-xl flex flex-col gap-3 text-sm font-semibold">
          <a
            href="#customizer"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-ink/5 text-ink/80 hover:text-terracotta"
          >
            {t.products}
          </a>
          <a
            href="#sticker"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-ink/5 text-ink/80 hover:text-terracotta"
          >
            {t.tableSolutions}
          </a>
          <a
            href="#saas"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-ink/5 text-ink/80 hover:text-terracotta"
          >
            {t.saas}
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-ink/5 text-ink/80 hover:text-terracotta"
          >
            {t.pricing}
          </a>
          <div className="pt-2 border-t border-ink/10">
            <a
              href="https://admin.nfcmyplace.com/login"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl bg-ink text-cream font-black text-xs flex items-center justify-between shadow-md"
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
