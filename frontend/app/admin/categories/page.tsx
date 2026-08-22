'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CategoryModal } from '@/components/admin/CategoryModal';
import Link from 'next/link';

interface Product {
  id: string;
  name: Record<string, string>;
  price: string;
  photoUrl: string | null;
}

interface Category {
  id: string;
  name: Record<string, string>;
  sortOrder: number;
  restaurantId: string;
  products: Product[];
}

function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : '';
}

export default function CategoriesAdminPage() {
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [email, setEmail] = useState('');
  const [locales, setLocales] = useState<string[]>(['tr', 'en', 'ar']);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal
  const [catModal, setCatModal] = useState<{ open: boolean; category?: Category }>({ open: false });

  const fetchData = useCallback(async (restaurantSlug: string) => {
    setLoading(true);
    setError('');
    try {
      const [catRes, restRes] = await Promise.all([
        fetch(`/api/proxy/admin/restaurants/${restaurantSlug}/categories`),
        fetch(`/api/proxy/restaurants/${restaurantSlug}`),
      ]);
      if (!catRes.ok) {
        setError('Failed to load categories');
        return;
      }
      const catData: Category[] = await catRes.json();
      setCategories(catData);
      if (restRes.ok) {
        const restData = await restRes.json();
        if (restData.supportedLocales) setLocales(restData.supportedLocales);
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const s = getCookie('restaurant_slug');
    const e = getCookie('admin_email');
    if (!s) {
      router.replace('/admin/login');
      return;
    }
    setSlug(s);
    setEmail(e);
    fetchData(s);
  }, [fetchData, router]);

  const refresh = () => slug && fetchData(slug);

  async function handleDeleteCategory(id: string) {
    if (!confirm('Are you sure you want to delete this category? All its products will also be deleted.')) return;
    try {
      const res = await fetch(`/api/proxy/admin/restaurants/${slug}/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        refresh();
      } else {
        alert('Failed to delete category');
      }
    } catch {
      alert('Error deleting category');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminHeader slug={slug} email={email} />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Categories Management</h1>
            <p className="text-xs text-gray-500">Organize your digital menu sections and language translations</p>
          </div>
          <button
            onClick={() => setCatModal({ open: true })}
            className="bg-blue-600 text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 transition cursor-pointer shadow-xs"
          >
            + Add Category
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-6 text-sm">{error}</div>}

        {loading && <div className="text-center py-12 text-gray-500">Loading categories...</div>}

        {!loading && categories.length === 0 && (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl p-8">
            <p className="text-4xl mb-3">🍽️</p>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No categories created yet</h3>
            <p className="text-gray-500 text-sm mb-4">Add your first category to start organizing your digital menu.</p>
            <button
              onClick={() => setCatModal({ open: true })}
              className="bg-blue-600 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-blue-700"
            >
              + Add Category
            </button>
          </div>
        )}

        {!loading && categories.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  <th className="px-6 py-3.5 text-left">Order</th>
                  <th className="px-6 py-3.5 text-left">Category Name</th>
                  <th className="px-6 py-3.5 text-left">English</th>
                  <th className="px-6 py-3.5 text-left">Arabic</th>
                  <th className="px-6 py-3.5 text-left">Products</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-400 font-bold">#{cat.sortOrder}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {cat.name['tr'] || cat.name[locales[0]] || '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{cat.name['en'] || '—'}</td>
                    <td className="px-6 py-4 text-gray-600 font-arabic" dir="rtl">
                      {cat.name['ar'] || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/products?categoryId=${cat.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100"
                      >
                        <span>{cat.products?.length || 0} items</span>
                        <span>→</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setCatModal({ open: true, category: cat })}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2.5 py-1 border border-blue-200 rounded-lg bg-blue-50/50 hover:bg-blue-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-xs text-red-600 hover:text-red-800 font-medium px-2.5 py-1 border border-red-200 rounded-lg bg-red-50/50 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Category Modal */}
      {catModal.open && (
        <CategoryModal
          slug={slug}
          locales={locales}
          category={catModal.category}
          onClose={() => setCatModal({ open: false })}
          onSaved={() => {
            setCatModal({ open: false });
            refresh();
          }}
        />
      )}
    </div>
  );
}
