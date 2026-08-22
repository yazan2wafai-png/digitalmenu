'use client';
import { useState, useEffect, FormEvent, useRef } from 'react';
import { LocaleTabInput } from './LocaleTabInput';

interface Product {
  id?: string;
  name: Record<string, string>;
  description: Record<string, string> | null;
  price: string;
  photoUrl: string | null;
  sortOrder: number;
}

interface Props {
  categoryId: string;
  locales: string[];
  product?: Product;
  onClose: () => void;
  onSaved: () => void;
}

export function ProductModal({ categoryId, locales, product, onClose, onSaved }: Props) {
  const isEdit = Boolean(product?.id);
  const [name, setName] = useState<Record<string, string>>(product?.name ?? {});
  const [description, setDescription] = useState<Record<string, string>>(product?.description ?? {});
  const [price, setPrice] = useState(product?.price ?? '');
  const [photoUrl, setPhotoUrl] = useState(product?.photoUrl ?? '');
  const [sortOrder, setSortOrder] = useState(product?.sortOrder ?? 0);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

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
      if (!res.ok) { setError(data.message ?? 'Upload failed'); return; }
      setPhotoUrl(data.url);
    } catch {
      setError('Upload failed');
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
        ? `/api/proxy/admin/categories/${categoryId}/products/${product!.id}`
        : `/api/proxy/admin/categories/${categoryId}/products`;
      const body = {
        name,
        description: Object.keys(description).length ? description : undefined,
        price,
        photoUrl: photoUrl || undefined,
        sortOrder,
      };
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.message ?? 'Error saving product');
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
    if (!product?.id || !confirm('Delete this product?')) return;
    setLoading(true);
    try {
      await fetch(`/api/proxy/admin/categories/${categoryId}/products/${product.id}`, { method: 'DELETE' });
      onSaved();
    } catch {
      setError('Delete failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto text-gray-900">
        <h2 className="text-lg font-bold mb-4">{isEdit ? 'Edit' : 'New'} Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <LocaleTabInput label="Name" locales={locales} values={name} onChange={setName} required />
          <LocaleTabInput label="Description" locales={locales} values={description} onChange={setDescription} multiline />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₺) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={e => setSortOrder(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
          </div>

          {/* Photo upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
            {photoUrl && (
              <div className="mb-2 relative w-24 h-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl} alt="Product" className="w-24 h-24 object-cover rounded border border-gray-200" />
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center cursor-pointer"
                >
                  ×
                </button>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ''; }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {uploading ? 'Uploading…' : photoUrl ? '↻ Replace photo' : '+ Upload photo (jpg/png/webp, max 5MB)'}
            </button>
            {photoUrl && <p className="text-xs text-gray-400 mt-1 truncate">{photoUrl}</p>}
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">{error}</p>}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Saving…' : 'Save'}
            </button>
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 bg-red-100 text-red-700 rounded-lg py-2 text-sm font-medium hover:bg-red-200 transition"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 bg-gray-100 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
