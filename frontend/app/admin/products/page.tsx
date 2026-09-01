'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ProductModal } from '@/components/admin/ProductModal';
import { useAdminI18n } from '@/lib/admin-i18n';
import { resolveImageUrl } from '@/lib/image-url';

import type {
  AdminProduct as Product,
  AdminCategory as Category,
  RestaurantPermissions,
} from '@/types/admin';

function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : '';
}

const DEFAULT_PERMISSIONS: RestaurantPermissions = {
  canViewOrders: true,
  canTrackTables: true,
  canManageMenu: true,
  canManageStaff: true,
  canViewAnalytics: true,
};

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get('categoryId') || '';
  const { locale, t } = useAdminI18n();

  const [slug, setSlug] = useState('');
  const [email, setEmail] = useState('');
  const [locales, setLocales] = useState<string[]>(['tr', 'en', 'ar']);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCategoryId);
  const [permissions, setPermissions] = useState<RestaurantPermissions>(DEFAULT_PERMISSIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [prodModal, setProdModal] = useState<{ open: boolean; categoryId: string; product?: Product }>({
    open: false,
    categoryId: '',
  });

  const fetchData = useCallback(
    async (restaurantSlug: string) => {
      setLoading(true);
      setError('');
      try {
        const [catRes, restRes, permRes] = await Promise.all([
          fetch(`/api/proxy/admin/restaurants/${restaurantSlug}/categories`),
          fetch(`/api/proxy/restaurants/${restaurantSlug}`),
          fetch(`/api/proxy/super-admin/restaurants/${restaurantSlug}/permissions`).catch(() => null),
        ]);

        if (!catRes.ok) {
          setError(t.products.loading);
          return;
        }
        const catData: Category[] = await catRes.json();
        setCategories(catData);
        if (catData.length > 0 && !selectedCategoryId) {
          setSelectedCategoryId(catData[0].id);
        }
        if (restRes.ok) {
          const restData = await restRes.json();
          if (restData.supportedLocales) setLocales(restData.supportedLocales);
          if (restData.featureFlags && !permRes?.ok) {
            setPermissions({
              canViewOrders: restData.featureFlags.enableOrdering ?? true,
              canTrackTables: restData.featureFlags.enableTables ?? true,
              canManageMenu: restData.featureFlags.enableMultiLanguage ?? true,
              canManageStaff: restData.featureFlags.enableReviews ?? true,
              canViewAnalytics: restData.featureFlags.enableAnalytics ?? true,
            });
          }
        }

        if (permRes && permRes.ok) {
          const permData = await permRes.json();
          if (permData.permissions) {
            setPermissions(permData.permissions);
          } else if (permData.canViewOrders !== undefined) {
            setPermissions(permData);
          }
        }
      } catch {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    },
    [selectedCategoryId, t.products.loading]
  );

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

  // If menu management has been disabled for this tenant, don't reveal this
  // page exists at all - bounce back to the overview silently.
  useEffect(() => {
    if (!loading && !permissions.canManageMenu) {
      router.replace('/admin');
    }
  }, [loading, permissions.canManageMenu, router]);

  const refresh = () => slug && fetchData(slug);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];
  const products = selectedCategory?.products || [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminHeader slug={slug} email={email} permissions={permissions} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t.products.title}</h1>
            <p className="text-xs text-gray-500">{t.products.subtitle}</p>
          </div>
          {selectedCategory && permissions.canManageMenu && (
            <button
              onClick={() => setProdModal({ open: true, categoryId: selectedCategory.id })}
              className="bg-emerald-600 text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-emerald-700 transition cursor-pointer shadow-xs"
            >
              {t.products.addProductTo}{' '}
              {selectedCategory.name[locale] ||
                selectedCategory.name['tr'] ||
                selectedCategory.name[locales[0]] ||
                'Category'}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        {/* Category filter tabs */}
        {categories.length > 0 && (
          <div className="flex space-x-2 overflow-x-auto pb-4 mb-2 hide-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory?.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.name[locale] || cat.name['tr'] || cat.name[locales[0]] || 'Unnamed'}</span>
                  <span
                    className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {cat.products?.length || 0}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {loading && <div className="text-center py-12 text-gray-500">{t.products.loading}</div>}

        {!loading && categories.length === 0 && (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl p-8">
            <p className="text-4xl mb-3">📂</p>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {t.products.createCategoryFirstTitle}
            </h3>
            <p className="text-gray-500 text-sm mb-4">{t.products.createCategoryFirstDesc}</p>
            <button
              onClick={() => router.push('/admin/categories')}
              className="bg-blue-600 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-blue-700 cursor-pointer"
            >
              {t.products.goToCategories}
            </button>
          </div>
        )}

        {!loading && selectedCategory && products.length === 0 && (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl p-8">
            <p className="text-4xl mb-3">🍕</p>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{t.products.noProductsTitle}</h3>
            <p className="text-gray-500 text-sm mb-4">{t.products.noProductsDesc}</p>
            {permissions.canManageMenu && (
              <button
                onClick={() => setProdModal({ open: true, categoryId: selectedCategory.id })}
                className="bg-emerald-600 text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-emerald-700 cursor-pointer"
              >
                {t.products.addProduct}
              </button>
            )}
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  <th className="px-6 py-3.5 text-left">{t.products.thOrder}</th>
                  <th className="px-6 py-3.5 text-left">{t.products.thPhoto}</th>
                  <th className="px-6 py-3.5 text-left">{t.products.thName}</th>
                  <th className="px-6 py-3.5 text-left">{t.products.thPrice}</th>
                  <th className="px-6 py-3.5 text-right">{t.products.thActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-400 font-bold">
                      #{prod.sortOrder}
                    </td>
                    <td className="px-6 py-4">
                      {prod.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolveImageUrl(prod.photoUrl)}
                          alt={prod.name[locale] || prod.name['tr'] || 'Product'}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-2xs"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                          🍽️
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {prod.name[locale] || prod.name['tr'] || prod.name[locales[0]] || 'Unnamed'}
                      </div>
                      <div className="text-xs text-gray-500 flex gap-2 mt-0.5">
                        {prod.name['tr'] && <span>🇹🇷 {prod.name['tr']}</span>}
                        {prod.name['en'] && <span>🇬🇧 {prod.name['en']}</span>}
                        {prod.name['ar'] && <span>🇸🇦 {prod.name['ar']}</span>}
                      </div>
                      {prod.description &&
                        (prod.description[locale] || prod.description['tr']) && (
                          <div className="text-xs text-gray-400 line-clamp-1 mt-1">
                            {prod.description[locale] || prod.description['tr']}
                          </div>
                        )}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 text-base">₺{prod.price}</td>
                    <td className="px-6 py-4 text-right">
                      {permissions.canManageMenu && (
                        <button
                          onClick={() =>
                            setProdModal({
                              open: true,
                              categoryId: selectedCategory.id,
                              product: prod,
                            })
                          }
                          className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 border border-blue-200 rounded-lg bg-blue-50/50 hover:bg-blue-50 transition cursor-pointer"
                        >
                          {t.products.editProduct}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Product Modal */}
      {prodModal.open && permissions.canManageMenu && (
        <ProductModal
          categoryId={prodModal.categoryId}
          locales={locales}
          product={prodModal.product}
          onClose={() => setProdModal({ open: false, categoryId: '' })}
          onSaved={() => {
            setProdModal({ open: false, categoryId: '' });
            refresh();
          }}
        />
      )}
    </div>
  );
}

export default function ProductsAdminPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-center text-gray-500">Loading products management…</div>}
    >
      <ProductsContent />
    </Suspense>
  );
}
