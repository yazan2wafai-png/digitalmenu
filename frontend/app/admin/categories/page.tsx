'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CategoryModal } from '@/components/admin/CategoryModal';
import { useAdminI18n } from '@/lib/admin-i18n';
import { resolveImageUrl } from '@/lib/image-url';
import Link from 'next/link';

import type { AdminCategory as Category, RestaurantPermissions } from '@/types/admin';

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

export default function CategoriesAdminPage() {
  const router = useRouter();
  const { locale, t } = useAdminI18n();

  const [slug, setSlug] = useState('');
  const [email, setEmail] = useState('');
  const [locales, setLocales] = useState<string[]>(['tr', 'en', 'ar']);
  const [categories, setCategories] = useState<Category[]>([]);
  const [permissions, setPermissions] = useState<RestaurantPermissions>(DEFAULT_PERMISSIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal
  const [catModal, setCatModal] = useState<{ open: boolean; category?: Category }>({ open: false });

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
          setError(t.categories.loading);
          return;
        }
        const catData: Category[] = await catRes.json();
        setCategories(catData);

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
        setError(t.categories.deleteError);
      } finally {
        setLoading(false);
      }
    },
    [t.categories.deleteError, t.categories.loading]
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

  async function handleDeleteCategory(id: string) {
    if (!confirm(t.categories.deleteConfirm)) return;
    try {
      const res = await fetch(`/api/proxy/admin/restaurants/${slug}/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        refresh();
      } else {
        alert(t.categories.deleteFailed);
      }
    } catch {
      alert(t.categories.deleteError);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminHeader slug={slug} email={email} permissions={permissions} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t.categories.title}</h1>
            <p className="text-xs text-gray-500">{t.categories.subtitle}</p>
          </div>
          {permissions.canManageMenu && (
            <button
              onClick={() => setCatModal({ open: true })}
              className="bg-blue-600 text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 transition cursor-pointer shadow-xs"
            >
              {t.categories.addCategoryBtn}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        {loading && <div className="text-center py-12 text-gray-500">{t.categories.loading}</div>}

        {!loading && categories.length === 0 && (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl p-8">
            <p className="text-4xl mb-3">🍽️</p>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{t.categories.noCategoriesTitle}</h3>
            <p className="text-gray-500 text-sm mb-4">{t.categories.noCategoriesDesc}</p>
            {permissions.canManageMenu && (
              <button
                onClick={() => setCatModal({ open: true })}
                className="bg-blue-600 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-blue-700 cursor-pointer"
              >
                {t.categories.addCategoryBtn}
              </button>
            )}
          </div>
        )}

        {!loading && categories.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  <th className="px-6 py-3.5 text-left">{t.categories.thOrder}</th>
                  <th className="px-6 py-3.5 text-left">Fotoğraf</th>
                  <th className="px-6 py-3.5 text-left">{t.categories.thName}</th>
                  <th className="px-6 py-3.5 text-left">{t.categories.thEn}</th>
                  <th className="px-6 py-3.5 text-left">{t.categories.thAr}</th>
                  <th className="px-6 py-3.5 text-left">{t.categories.thProducts}</th>
                  <th className="px-6 py-3.5 text-right">{t.categories.thActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-400 font-bold">
                      #{cat.sortOrder}
                    </td>
                    <td className="px-6 py-4">
                      {cat.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolveImageUrl(cat.photoUrl)}
                          alt="Category"
                          className="w-10 h-10 object-cover rounded-lg border border-gray-200 shadow-2xs"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs">
                          📁
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {cat.name[locale] || cat.name['tr'] || cat.name[locales[0]] || '—'}
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
                        <span>
                          {cat.products?.length || 0} {t.categories.itemsCount}
                        </span>
                        <span>→</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {permissions.canManageMenu && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setCatModal({ open: true, category: cat })}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2.5 py-1 border border-blue-200 rounded-lg bg-blue-50/50 hover:bg-blue-50 cursor-pointer"
                          >
                            {t.categories.edit}
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="text-xs text-red-600 hover:text-red-800 font-medium px-2.5 py-1 border border-red-200 rounded-lg bg-red-50/50 hover:bg-red-50 cursor-pointer"
                          >
                            {t.categories.delete}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Category Modal */}
      {catModal.open && permissions.canManageMenu && (
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
