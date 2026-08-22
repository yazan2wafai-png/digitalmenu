'use client';
import { motion } from 'framer-motion';

const LOCALE_LABELS: Record<string, string> = {
  tr: 'TR',
  en: 'EN',
  ar: 'AR',
};

interface Props {
  locales: string[];
  current: string;
  onChange: (locale: string) => void;
}

export function LanguageSwitcher({ locales, current, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => onChange(loc)}
          className="relative px-3 py-1 text-xs font-semibold rounded-full transition-colors"
          style={{ color: loc === current ? undefined : 'rgba(255,255,255,0.6)' }}
        >
          {loc === current && (
            <motion.div
              layoutId="locale-pill"
              className="absolute inset-0 rounded-full bg-white"
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            />
          )}
          <span
            className="relative z-10 transition-colors"
            style={{ color: loc === current ? '#111' : undefined }}
          >
            {LOCALE_LABELS[loc] ?? loc.toUpperCase()}
          </span>
        </button>
      ))}
    </div>
  );
}
