'use client';
import { useState, useEffect, FormEvent } from 'react';
import { LocaleTabInput } from './LocaleTabInput';
import { useAdminI18n } from '@/lib/admin-i18n';

interface Category {
  id?: string;
  name: Record<string, string>;
  photoUrl?: string | null;
  sortOrder: number;
}

interface Props {
  slug: string;
  locales: string[];
  category?: Category;
  onClose: () => void;
  onSaved: () => void;
}

export function CategoryModal({ slug, locales, category, onClose, onSaved }: Props) {
  const { t } = useAdminI18n();
  const isEdit = Boolean(category?.id);
  const [name, setName] = useState<Record<string, string>>(category?.name ?? {});
  const [photoUrl, setPhotoUrl] = useState<string | null>(category?.photoUrl ?? null);
  const [sortOrder, setSortOrder] = useState(category?.sortOrder ?? 0);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/proxy/upload/image', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? 'Görsel yüklenemedi');
        return;
      }
      setPhotoUrl(data.url);
    } catch {
      setError('Görsel yüklenemedi');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const url = isEdit
        ? `/api/proxy/admin/restaurants/${slug}/categories/${category!.id}`
        : `/api/proxy/admin/restaurants/${slug}/categories`;
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, photoUrl: photoUrl || null, sortOrder }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.message ?? 'Error saving category');
        return;
      }
      onSaved();
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!category?.id || !confirm(t.categoryModal.deleteConfirm)) return;
    setLoading(true);
    try {
      await fetch(`/api/proxy/admin/restaurants/${slug}/categories/${category.id}`, { method: 'DELETE' });
      onSaved();
    } catch {
      setError(t.categoryModal.deleteFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-gray-900">
        <h2 className="text-lg font-bold mb-4">{isEdit ? t.categoryModal.editTitle : t.categoryModal.newTitle}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <LocaleTabInput label={t.categoryModal.nameLabel} locales={locales} values={name} onChange={setName} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.categoryModal.sortOrderLabel}</label>
            <input
              type="number"
              value={sortOrder}
              onChange={e => setSortOrder(Number(e.target.value))}
              className="w-24 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>

          {/* Category Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Fotoğrafı</label>
            {photoUrl ? (
              <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="relative w-16 h-16 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || ''}${photoUrl}` : photoUrl}
                    alt="Category"
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(null)}
                    title="Fotoğrafı Kaldır"
                    className="absolute -top-1.5 -right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center cursor-pointer shadow-xs transition"
                  >
                    ×
                  </button>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                  <p className="text-xs text-gray-500 truncate font-mono mb-2" title={photoUrl}>
                    {photoUrl}
                  </p>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200 cursor-pointer shadow-2xs transition">
                    <span>↻ Değiştir</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (f) handleImageUpload(f);
                      }}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition">
                <span className="text-2xl mb-1">🖼️</span>
                <span className="text-xs font-medium text-gray-600">
                  {uploading ? 'Yükleniyor…' : '+ Fotoğraf Seç'}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) handleImageUpload(f);
                  }}
                  disabled={uploading}
                />
              </label>
            )}
          </div>
          {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">{error}</p>}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? t.categoryModal.savingBtn : t.categoryModal.saveBtn}
            </button>
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 bg-red-100 text-red-700 rounded-lg py-2 text-sm font-medium hover:bg-red-200 disabled:opacity-50 transition cursor-pointer"
              >
                {t.categoryModal.deleteBtn}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 bg-gray-100 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-200 transition cursor-pointer"
            >
              {t.categoryModal.cancelBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
