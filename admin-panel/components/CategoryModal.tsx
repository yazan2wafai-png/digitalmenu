'use client';
import { useState, useEffect, FormEvent } from 'react';
import { LocaleTabInput } from './LocaleTabInput';

interface Category {
  id?: string;
  name: Record<string, string>;
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
  const isEdit = Boolean(category?.id);
  const [name, setName] = useState<Record<string, string>>(category?.name ?? {});
  const [sortOrder, setSortOrder] = useState(category?.sortOrder ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

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
        body: JSON.stringify({ name, sortOrder }),
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
    if (!category?.id || !confirm(`Delete category? This will also delete all its products.`)) return;
    setLoading(true);
    try {
      await fetch(`/api/proxy/admin/restaurants/${slug}/categories/${category.id}`, { method: 'DELETE' });
      onSaved();
    } catch {
      setError('Delete failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-4">{isEdit ? 'Edit' : 'New'} Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <LocaleTabInput label="Name" locales={locales} values={name} onChange={setName} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))}
              className="w-24 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Saving…' : 'Save'}
            </button>
            {isEdit && (
              <button type="button" onClick={handleDelete} disabled={loading}
                className="px-4 bg-red-100 text-red-700 rounded-lg py-2 text-sm font-medium hover:bg-red-200 disabled:opacity-50">
                Delete
              </button>
            )}
            <button type="button" onClick={onClose}
              className="px-4 bg-gray-100 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-200">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
