'use client';

import { useState, FormEvent } from 'react';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const AVAILABLE_LOCALES = [
  { code: 'tr', label: 'Turkish (TR)' },
  { code: 'en', label: 'English (EN)' },
  { code: 'ar', label: 'Arabic (AR)' },
  { code: 'de', label: 'German (DE)' },
  { code: 'ru', label: 'Russian (RU)' },
  { code: 'fr', label: 'French (FR)' },
  { code: 'es', label: 'Spanish (ES)' },
];

const PRESET_COLORS = [
  '#E63946',
  '#2563EB',
  '#10B981',
  '#8B5CF6',
  '#F59E0B',
  '#EC4899',
  '#0EA5E9',
  '#14B8A6',
];

export function ProvisionModal({ onClose, onSuccess }: Props) {
  const [nameTr, setNameTr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [slug, setSlug] = useState('');
  const [themeColor, setThemeColor] = useState('#E63946');
  const [supportedLocales, setSupportedLocales] = useState<string[]>(['tr', 'en', 'ar']);
  const [defaultLocale, setDefaultLocale] = useState('tr');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-slug generator
  function handleNameChange(val: string) {
    setNameTr(val);
    if (!slug || slug === generateSlug(nameTr)) {
      setSlug(generateSlug(val));
    }
  }

  function generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function generateRandomPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
    let pwd = '';
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAdminPassword(pwd);
  }

  function toggleLocale(loc: string) {
    if (supportedLocales.includes(loc)) {
      if (supportedLocales.length === 1) return; // Keep at least one
      const updated = supportedLocales.filter((l) => l !== loc);
      setSupportedLocales(updated);
      if (defaultLocale === loc) {
        setDefaultLocale(updated[0]);
      }
    } else {
      setSupportedLocales([...supportedLocales, loc]);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const formattedSlug = slug.toLowerCase().trim();
    if (!/^[a-z0-9-]+$/.test(formattedSlug)) {
      setError('Slug must contain only lowercase alphanumeric characters and hyphens (a-z, 0-9, -)');
      return;
    }

    if (!nameTr.trim() && !nameEn.trim()) {
      setError('At least one restaurant name (TR or EN) is required');
      return;
    }

    if (!adminEmail.includes('@')) {
      setError('A valid admin email is required');
      return;
    }

    if (adminPassword.length < 6) {
      setError('Admin password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const nameObj: Record<string, string> = {};
    if (nameTr.trim()) nameObj.tr = nameTr.trim();
    if (nameEn.trim()) nameEn.trim() && (nameObj.en = nameEn.trim());
    if (nameAr.trim()) nameAr.trim() && (nameObj.ar = nameAr.trim());
    if (!nameObj.tr && nameObj.en) nameObj.tr = nameObj.en;
    if (!nameObj.en && nameObj.tr) nameObj.en = nameObj.tr;

    try {
      const res = await fetch('/api/proxy/super-admin/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameObj,
          slug: formattedSlug,
          themeColor,
          supportedLocales,
          defaultLocale,
          adminEmail: adminEmail.trim(),
          adminPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to provision restaurant');
        return;
      }

      onSuccess();
    } catch {
      setError('Network error while provisioning restaurant');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-indigo-950/50 my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-lg">
              ✨
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Provision New Restaurant</h2>
              <p className="text-xs text-slate-400">
                Instantly creates tenant database record, default settings &amp; admin account
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Restaurant Names */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              1. Restaurant Identity &amp; Branding
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Restaurant Name (TR) <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nameTr}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Baltazar Burger"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Restaurant Name (EN)
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Baltazar Burger House"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Subdomain Slug <span className="text-indigo-400">*</span>
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="baltazar"
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-l-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none font-mono transition"
                />
                <span className="bg-slate-800 border border-l-0 border-slate-800 rounded-r-xl px-3.5 py-2.5 text-xs text-slate-400 font-mono">
                  .nfcmyplace.com
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                Live URL: https://{slug || 'restaurant'}.nfcmyplace.com
              </p>
            </div>

            {/* Theme Color */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Brand Theme Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-28 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono uppercase"
                />
                <div className="flex items-center gap-1.5 flex-wrap">
                  {PRESET_COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setThemeColor(col)}
                      style={{ backgroundColor: col }}
                      className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                        themeColor.toUpperCase() === col.toUpperCase()
                          ? 'border-white scale-110 shadow-md'
                          : 'border-transparent hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Languages Section */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              2. Supported Languages &amp; Defaults
            </h3>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Enabled Locales (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_LOCALES.map((loc) => {
                  const isChecked = supportedLocales.includes(loc.code);
                  return (
                    <button
                      key={loc.code}
                      type="button"
                      onClick={() => toggleLocale(loc.code)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                        isChecked
                          ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '} {loc.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Default Menu Locale
              </label>
              <select
                value={defaultLocale}
                onChange={(e) => setDefaultLocale(e.target.value)}
                className="w-full sm:w-60 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
              >
                {supportedLocales.map((code) => {
                  const locInfo = AVAILABLE_LOCALES.find((l) => l.code === code);
                  return (
                    <option key={code} value={code}>
                      {locInfo?.label || code.toUpperCase()}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Admin User Provisioning */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              3. Initial Restaurant Admin User
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Admin Email Address <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@restaurant.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-300">
                    Admin Password <span className="text-indigo-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    ⚡ Generate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none font-mono transition"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Provisioning Restaurant…</span>
                </>
              ) : (
                '🚀 Provision Restaurant'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
