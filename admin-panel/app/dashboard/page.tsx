'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryModal } from '@/components/CategoryModal';
import { ProductModal } from '@/components/ProductModal';
import AnalyticsTab from '@/components/AnalyticsTab';
import LocationsTablesTab from '@/components/LocationsTablesTab';
import SeoSettingsTab from '@/components/SeoSettingsTab';

type TabType = 'menu' | 'tables' | 'analytics' | 'seo';

interface Product {
  id: string;
  name: Record<string, string>;
  description: Record<string, string> | null;
  price: string;
  photoUrl: string | null;
  sortOrder: number;
  categoryId: string;
}

interface Category {
  id: string;
  name: Record<string, string>;
  sortOrder: number;
  restaurantId: string;
  products: Product[];
}

function getCookie(name: string): string {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : '';
}

export default function DashboardPage() {
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [email, setEmail] = useState('');
  const [locales, setLocales] = useState<string[]>(['tr', 'en', 'ar']);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('menu');

  // Modal state
  const [catModal, setCatModal] = useState<{ open: boolean; category?: Category }>({ open: false });
  const [prodModal, setProdModal] = useState<{ open: boolean; categoryId: string; product?: Product }>({ open: false, categoryId: '' });

  const fetchData = useCallback(async (restaurantSlug: string) => {
    setLoading(true);
    setError('');
    try {
      // Fetch restaurant info for supportedLocales
      const [catRes, restRes] = await Promise.all([
        fetch(`/api/proxy/admin/restaurants/${restaurantSlug}/categories`),
        fetch(`/api/proxy/restaurants/${restaurantSlug}`),
      ]);
      if (!catRes.ok) { setError('Failed to load categories'); return; }
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
    if (!s) { router.replace('/login'); return; }
    setSlug(s);
    setEmail(e);
    fetchData(s);
  }, [fetchData, router]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  }

  const refresh = () => slug && fetchData(slug);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-800">🍔 {slug.charAt(0).toUpperCase() + slug.slice(1)} Admin</h1>
          <p className="text-xs text-gray-400">{email}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto max-w-full">
          <button onClick={() => setActiveTab('menu')} className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'menu' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>🍕 Menu Management</button>
          <button onClick={() => setActiveTab('tables')} className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'tables' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>📍 Tables & Locations</button>
          <button onClick={() => setActiveTab('analytics')} className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'analytics' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>📊 Analytics</button>
          <button onClick={() => setActiveTab('seo')} className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'seo' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>⚙️ SEO & Settings</button>
        </div>

        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 self-start md:self-auto flex-shrink-0">
          Sign out
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-6 text-sm">{error}</div>}

        {activeTab === 'menu' && (
          <>
            {/* Add Category */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
          <button onClick={() => setCatModal({ open: true })}
            className="bg-blue-600 text-white text-sm rounded-lg px-4 py-2 hover:bg-blue-700 transition">
            + Add Category
          </button>
        </div>

        {categories.length === 0 && !loading && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🍽️</p>
            <p>No categories yet. Add one to get started.</p>
          </div>
        )}

        {/* Category list */}
        <div className="space-y-6">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Category header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-mono">#{cat.sortOrder}</span>
                  <span className="font-semibold text-gray-800">{cat.name['tr'] ?? cat.name[locales[0]] ?? 'Unnamed'}</span>
                  <span className="text-xs text-gray-400">/ {cat.name['en'] ?? ''}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setProdModal({ open: true, categoryId: cat.id })}
                    className="text-sm text-green-600 hover:text-green-700 border border-green-200 rounded px-2 py-0.5">
                    + Product
                  </button>
                  <button onClick={() => setCatModal({ open: true, category: cat })}
                    className="text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded px-2 py-0.5">
                    Edit
                  </button>
                </div>
              </div>

              {/* Product list */}
              {cat.products.length === 0 ? (
                <p className="text-sm text-gray-400 px-5 py-4">No products in this category.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400 border-b border-gray-100">
                      <th className="px-5 py-2 text-left font-medium">#</th>
                      <th className="px-5 py-2 text-left font-medium">Name</th>
                      <th className="px-5 py-2 text-left font-medium">Price</th>
                      <th className="px-5 py-2 text-left font-medium">Photo</th>
                      <th className="px-5 py-2 text-left font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.products.map(prod => (
                      <tr key={prod.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="px-5 py-3 text-gray-400 font-mono text-xs">{prod.sortOrder}</td>
                        <td className="px-5 py-3">
                          <div className="font-medium text-gray-800">{prod.name['tr'] ?? prod.name[locales[0]] ?? 'Unnamed'}</div>
                          <div className="text-xs text-gray-400">{prod.name['en'] ?? ''}</div>
                        </td>
                        <td className="px-5 py-3 font-medium text-gray-700">₺{prod.price}</td>
                        <td className="px-5 py-3">
                          {prod.photoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={prod.photoUrl} alt="" className="w-10 h-10 object-cover rounded border border-gray-200" />
                          ) : <span className="text-gray-300 text-xs">—</span>}
                        </td>
                        <td className="px-5 py-3">
                          <button onClick={() => setProdModal({ open: true, categoryId: cat.id, product: prod })}
                            className="text-blue-600 hover:text-blue-700 text-xs border border-blue-200 rounded px-2 py-0.5">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
          </>
        )}
        
        {activeTab === 'tables' && <LocationsTablesTab slug={slug} />}
        {activeTab === 'analytics' && <AnalyticsTab slug={slug} />}
        {activeTab === 'seo' && <SeoSettingsTab slug={slug} />}
      </main>

      {/* Category Modal */}
      {catModal.open && (
        <CategoryModal
          slug={slug}
          locales={locales}
          category={catModal.category}
          onClose={() => setCatModal({ open: false })}
          onSaved={() => { setCatModal({ open: false }); refresh(); }}
        />
      )}

      {/* Product Modal */}
      {prodModal.open && (
        <ProductModal
          categoryId={prodModal.categoryId}
          locales={locales}
          product={prodModal.product}
          onClose={() => setProdModal({ open: false, categoryId: '' })}
          onSaved={() => { setProdModal({ open: false, categoryId: '' }); refresh(); }}
        />
      )}
    </div>
  );
}
