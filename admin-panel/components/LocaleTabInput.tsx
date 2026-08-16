'use client';
import { useState } from 'react';

const LOCALE_LABELS: Record<string, string> = {
  tr: '🇹🇷 TR',
  en: '🇬🇧 EN',
  ar: '🇸🇦 AR',
};

interface Props {
  label: string;
  locales: string[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
  multiline?: boolean;
  required?: boolean;
}

export function LocaleTabInput({ label, locales, values, onChange, multiline, required }: Props) {
  const [active, setActive] = useState(locales[0] ?? 'tr');

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {/* Locale tabs */}
      <div className="flex gap-0.5 mb-0">
        {locales.map(loc => (
          <button
            key={loc}
            type="button"
            onClick={() => setActive(loc)}
            className={`px-3 py-1 text-xs rounded-t border ${
              active === loc
                ? 'bg-white border-gray-300 border-b-white font-semibold text-blue-600 z-10'
                : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {LOCALE_LABELS[loc] ?? loc.toUpperCase()}
          </button>
        ))}
      </div>
      {/* Input for active locale */}
      {multiline ? (
        <textarea
          value={values[active] ?? ''}
          onChange={e => onChange({ ...values, [active]: e.target.value })}
          rows={3}
          placeholder={`${label} in ${active.toUpperCase()}`}
          className="w-full border border-gray-300 rounded-b rounded-tr px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={active === 'ar' ? 'rtl' : 'ltr'}
        />
      ) : (
        <input
          type="text"
          value={values[active] ?? ''}
          onChange={e => onChange({ ...values, [active]: e.target.value })}
          placeholder={`${label} in ${active.toUpperCase()}`}
          className="w-full border border-gray-300 rounded-b rounded-tr px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={active === 'ar' ? 'rtl' : 'ltr'}
        />
      )}
    </div>
  );
}
