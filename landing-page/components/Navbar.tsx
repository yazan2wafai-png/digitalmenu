'use client';
import Link from 'next/link';
import type { Locale } from '@/lib/translations';
import { translations } from '@/lib/translations';

interface Props {
  locale: Locale;
  onToggleLocale: (locale: Locale) => void;
  onOpenDiscount?: () => void;
}

export function Navbar({ locale, onToggleLocale, onOpenDiscount }: Props) {
  const t = translations[locale].nav;

  return (
    <nav className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center font-black text-black text-xs shadow-md">
            NFC
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">
            NFC<span className="text-amber-400">MyPlace</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-white/70">
          <a href="#hardware" className="hover:text-white transition-colors">{t.hardware}</a>
          <a href="#demos" className="hover:text-white transition-colors">{t.demos}</a>
          <a href="#pricing" className="hover:text-white transition-colors">{t.pricing}</a>
        </div>

        {/* Action Controls & Language Switcher */}
        <div className="flex items-center gap-3">
          {/* TR | EN Switcher Toggle */}
          <div className="flex items-center bg-white/10 border border-white/15 rounded-xl p-0.5 text-[11px] font-bold">
            <button
              onClick={() => onToggleLocale('tr')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                locale === 'tr'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              TR
            </button>
            <button
              onClick={() => onToggleLocale('en')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                locale === 'en'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          <a
            href="https://digitalmenu-admin-panel.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block text-xs font-semibold text-white/60 hover:text-white transition-colors"
          >
            {t.adminLogin}
          </a>

          {onOpenDiscount ? (
            <button
              onClick={onOpenDiscount}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              {t.cta}
            </button>
          ) : (
            <a
              href="#pricing"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
            >
              {t.cta}
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
