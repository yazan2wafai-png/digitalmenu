'use client';
import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { useAdminI18n } from '@/lib/admin-i18n';
import type { RestaurantSettings } from '@/types/admin';

interface RestaurantProfile {
  name?: Record<string, string>;
  logoUrl?: string | null;
  themeColor?: string;
  settings?: RestaurantSettings;
}

export default function SeoSettingsTab({ slug, onSettingsUpdated }: { slug: string; onSettingsUpdated?: () => void }) {
  const { t } = useAdminI18n();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState('#E63946');
  const [currency, setCurrency] = useState('TRY');
  const [enableOrdering, setEnableOrdering] = useState(true);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');

  useEffect(() => {
    fetch('/api/proxy/admin/me/restaurant')
      .then((res) => res.json())
      .then((d: RestaurantProfile) => {
        setLogoUrl(d.logoUrl ?? null);
        setThemeColor(d.themeColor ?? '#E63946');
        const s = d.settings ?? {};
        setCurrency(s.currency ?? 'TRY');
        setEnableOrdering(s.enableOrdering ?? true);
        setMetaTitle(s.metaTitle ?? '');
        setMetaDescription(s.metaDescription ?? '');
        setKeywords(s.keywords ?? '');
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const resolvedLogoSrc =
    logoUrl && logoUrl.startsWith('/')
      ? `${process.env.NEXT_PUBLIC_API_URL ?? ''}${logoUrl}`
      : logoUrl;

  async function handleLogoSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/proxy/upload/image', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        setError(uploadData.message ?? t.settings.uploadFailed);
        return;
      }

      const profileRes = await fetch('/api/proxy/admin/me/restaurant/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoUrl: uploadData.url }),
      });
      if (!profileRes.ok) {
        setError(t.settings.uploadFailed);
        return;
      }

      setLogoUrl(uploadData.url);
      setSuccess(t.settings.logoUpdated);
      onSettingsUpdated?.();
    } catch {
      setError(t.settings.uploadFailed);
    } finally {
      setUploading(false);
    }
  }

  async function handleRemoveLogo() {
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const profileRes = await fetch('/api/proxy/admin/me/restaurant/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoUrl: null }),
      });
      if (!profileRes.ok) {
        setError(t.settings.saveError);
        return;
      }

      setLogoUrl(null);
      setSuccess(t.settings.logoRemoved);
      onSettingsUpdated?.();
    } catch {
      setError(t.settings.saveError);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const [settingsRes, profileRes] = await Promise.all([
        fetch('/api/proxy/admin/me/restaurant/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currency, enableOrdering, metaTitle, metaDescription, keywords }),
        }),
        fetch('/api/proxy/admin/me/restaurant/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ themeColor }),
        }),
      ]);
      if (!settingsRes.ok || !profileRes.ok) {
        throw new Error(t.settings.saveError);
      }
      setSuccess(t.settings.saveSuccess);
      onSettingsUpdated?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.settings.saveError);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6 text-gray-500">{t.settings.loadingSettings}</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-gray-900">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
        <h2 className="text-xl font-bold mb-6 text-gray-800">{t.settings.title}</h2>
        <form onSubmit={handleSave} className="space-y-6">
          {/* Branding */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm border-b pb-2">{t.settings.brandingTitle}</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                {resolvedLogoSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={resolvedLogoSrc} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-2xl text-gray-300">🖼️</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg px-3 py-1.5 bg-blue-50/50 hover:bg-blue-50 disabled:opacity-50 cursor-pointer transition"
                  >
                    {uploading ? t.settings.uploadingBtn : t.settings.uploadLogoBtn}
                  </button>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      disabled={uploading}
                      className="text-xs font-semibold text-red-600 hover:text-red-800 border border-red-200 rounded-lg px-3 py-1.5 bg-red-50/50 hover:bg-red-50 disabled:opacity-50 cursor-pointer transition"
                    >
                      {t.settings.removeLogoBtn}
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleLogoSelect} />
                <p className="text-[11px] text-gray-400 mt-1">{t.settings.logoHint}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.settings.themeColorLabel}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  placeholder="#E63946"
                />
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm border-b pb-2">{t.settings.orderingTitle}</h3>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableOrdering}
                onChange={(e) => setEnableOrdering(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="text-sm text-gray-700 font-medium">{t.settings.enableOrdering}</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.settings.currencyLabel}</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              >
                <option value="TRY">TRY (₺)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm border-b pb-2">{t.settings.seoTitle}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.settings.metaTitleLabel}</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                placeholder={t.settings.metaTitlePlaceholder}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.settings.metaDescLabel}</label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                rows={3}
                placeholder={t.settings.metaDescPlaceholder}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.settings.keywordsLabel}</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                placeholder={t.settings.keywordsPlaceholder}
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 p-2.5 rounded-lg border border-red-200">{error}</p>}
          {success && <p className="text-green-600 text-sm bg-green-50 p-2.5 rounded-lg border border-green-200 font-medium">{success}</p>}

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
          >
            {saving ? t.settings.savingBtn : t.settings.saveBtn}
          </button>
        </form>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-4">{t.settings.previewTitle}</h3>
        <div className="border border-gray-200 rounded-2xl overflow-hidden max-w-sm shadow-xs bg-white">
          <div className="h-48 w-full flex flex-col items-center justify-center text-gray-400" style={{ backgroundColor: `${themeColor}1A` }}>
            {resolvedLogoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resolvedLogoSrc} alt="Logo" className="w-20 h-20 object-contain" />
            ) : (
              <>
                <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">{t.settings.bannerPlaceholder}</span>
              </>
            )}
          </div>
          <div className="p-4 bg-gray-50/50 border-t border-gray-100">
            <div className="text-[11px] text-gray-400 uppercase font-mono tracking-wide mb-1">https://{slug}.nfcmyplace.com</div>
            <div className="font-bold text-[#1a0dab] truncate text-base leading-tight mb-1">{metaTitle || `${slug} - Digital Menu`}</div>
            <div className="text-xs text-gray-600 line-clamp-2">{metaDescription || t.settings.defaultPreviewDesc}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
