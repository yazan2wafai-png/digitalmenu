'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useAdminI18n } from '@/lib/admin-i18n';
import type { RestaurantSettings } from '@/types/admin';

export default function SeoSettingsTab({ slug, onSettingsUpdated }: { slug: string; onSettingsUpdated?: () => void }) {
  const { t } = useAdminI18n();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [currency, setCurrency] = useState('TRY');
  const [timezone, setTimezone] = useState('Europe/Istanbul');
  
  const [enableOrdering, setEnableOrdering] = useState(true);
  const [enableTables, setEnableTables] = useState(true);
  const [enableAnalytics, setEnableAnalytics] = useState(true);
  const [enableMultiLanguage, setEnableMultiLanguage] = useState(true);
  const [enableReviews, setEnableReviews] = useState(true);
  const [enableServiceCall, setEnableServiceCall] = useState(true);

  useEffect(() => {
    fetch('/api/proxy/admin/me/restaurant')
      .then(res => res.json())
      .then((d: { settings?: RestaurantSettings } & RestaurantSettings) => {
        const s = d.settings ?? d;
        setMetaTitle(s.metaTitle ?? '');
        setMetaDescription(s.metaDescription ?? '');
        setKeywords(s.keywords ?? '');
        setCurrency(s.currency ?? 'TRY');
        setTimezone(s.timezone ?? 'Europe/Istanbul');
        setEnableOrdering(s.enableOrdering ?? true);
        setEnableTables(s.enableTables ?? true);
        setEnableAnalytics(s.enableAnalytics ?? true);
        setEnableMultiLanguage(s.enableMultiLanguage ?? true);
        setEnableReviews(s.enableReviews ?? true);
        setEnableServiceCall(s.enableServiceCall ?? true);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/proxy/admin/me/restaurant/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metaTitle,
          metaDescription,
          keywords,
          currency,
          timezone,
          enableOrdering,
          enableTables,
          enableAnalytics,
          enableMultiLanguage,
          enableReviews,
          enableServiceCall,
        })
      });
      if (!res.ok) {
        throw new Error(t.settings.saveError);
      }
      setSuccess(t.settings.saveSuccess);
      if (onSettingsUpdated) {
        onSettingsUpdated();
      }
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
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm border-b pb-2">{t.settings.generalTitle}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.settings.currencyLabel}</label>
                <select 
                  value={currency} 
                  onChange={e => setCurrency(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                >
                  <option value="TRY">TRY (₺)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.settings.timezoneLabel}</label>
                <input 
                  type="text" 
                  value={timezone} 
                  onChange={e => setTimezone(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" 
                  placeholder="Europe/Istanbul" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm border-b pb-2">{t.settings.modulesTitle}</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={enableOrdering} 
                  onChange={e => setEnableOrdering(e.target.checked)} 
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" 
                />
                <span className="text-sm text-gray-700 font-medium">{t.settings.enableOrdering}</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={enableTables} 
                  onChange={e => setEnableTables(e.target.checked)} 
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" 
                />
                <span className="text-sm text-gray-700 font-medium">{t.settings.enableTables}</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={enableAnalytics} 
                  onChange={e => setEnableAnalytics(e.target.checked)} 
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" 
                />
                <span className="text-sm text-gray-700 font-medium">{t.settings.enableAnalytics}</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={enableMultiLanguage} 
                  onChange={e => setEnableMultiLanguage(e.target.checked)} 
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" 
                />
                <span className="text-sm text-gray-700 font-medium">{t.settings.enableMultiLanguage}</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={enableReviews} 
                  onChange={e => setEnableReviews(e.target.checked)} 
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" 
                />
                <span className="text-sm text-gray-700 font-medium">{t.settings.enableReviews}</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={enableServiceCall} 
                  onChange={e => setEnableServiceCall(e.target.checked)} 
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" 
                />
                <span className="text-sm text-gray-700 font-medium">{t.settings.enableServiceCall}</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm border-b pb-2">{t.settings.seoTitle}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.settings.metaTitleLabel}</label>
              <input 
                type="text" 
                value={metaTitle} 
                onChange={e => setMetaTitle(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" 
                placeholder={t.settings.metaTitlePlaceholder} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.settings.metaDescLabel}</label>
              <textarea 
                value={metaDescription} 
                onChange={e => setMetaDescription(e.target.value)} 
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
                onChange={e => setKeywords(e.target.value)} 
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
          <div className="bg-gray-100 h-48 w-full flex flex-col items-center justify-center text-gray-400">
            <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">{t.settings.bannerPlaceholder}</span>
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
