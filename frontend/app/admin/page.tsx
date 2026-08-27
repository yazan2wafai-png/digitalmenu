'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import { CategoryModal } from '@/components/admin/CategoryModal';
import { ProductModal } from '@/components/admin/ProductModal';
import { useAdminI18n } from '@/lib/admin-i18n';

import type {
  AdminProduct as Product,
  AdminCategory as Category,
  LocationItem,
  TableItem,
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
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { locale, t } = useAdminI18n();

  const [slug, setSlug] = useState('');
  const [email, setEmail] = useState('');
  const [locales, setLocales] = useState<string[]>(['tr', 'en', 'ar']);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locationsCount, setLocationsCount] = useState(0);
  const [tablesCount, setTablesCount] = useState(0);
  const [permissions, setPermissions] = useState<RestaurantPermissions>(DEFAULT_PERMISSIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Quick modals
  const [catModal, setCatModal] = useState<{ open: boolean; category?: Category }>({ open: false });
  const [prodModal, setProdModal] = useState<{ open: boolean; categoryId: string; product?: Product }>({
    open: false,
    categoryId: '',
  });

  const fetchData = useCallback(
    async (restaurantSlug: string) => {
      setLoading(true);
      setError('');
      try {
        const [catRes, restRes, locRes, permRes] = await Promise.all([
          fetch(`/api/proxy/admin/restaurants/${restaurantSlug}/categories`),
          fetch(`/api/proxy/restaurants/${restaurantSlug}`),
          fetch(`/api/proxy/admin/restaurants/${restaurantSlug}/locations`),
          fetch(`/api/proxy/super-admin/restaurants/${restaurantSlug}/permissions`).catch(() => null),
        ]);

        if (catRes.ok) {
          const catData: Category[] = await catRes.json();
          setCategories(catData);
        } else {
          setError(t.overview.failedCategories);
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

        if (locRes.ok) {
          const locData: LocationItem[] = await locRes.json();
          setLocationsCount(locData.length);
          let totalTables = 0;
          for (const loc of locData) {
            try {
              const tableRes = await fetch(`/api/proxy/admin/locations/${loc.id}/tables`);
              if (tableRes.ok) {
                const tableData: TableItem[] = await tableRes.json();
                totalTables += tableData.length;
              }
            } catch {
              // Ignore error per location
            }
          }
          setTablesCount(totalTables);
        }
      } catch {
        setError(t.overview.networkError);
      } finally {
        setLoading(false);
      }
    },
    [t.overview.failedCategories, t.overview.networkError]
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

  const refresh = () => slug && fetchData(slug);

  const totalProducts = categories.reduce((sum, cat) => sum + (cat.products?.length || 0), 0);

  if (loading && !slug) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        {t.overview.loading}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminHeader slug={slug} email={email} permissions={permissions} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Permission Warning Banners */}
        {!permissions.canManageMenu && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-xs">
            <span className="text-xl flex-shrink-0">🔒</span>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                {locale === 'tr'
                  ? 'Menü Düzenleme İzni Kısıtlandı'
                  : 'Menu Editing Permission Restricted'}
              </h3>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                {locale === 'tr'
                  ? 'Ürün ve kategori ekleme/düzenleme yetkisi platform süper yöneticisi tarafından devre dışı bırakılmıştır. Menü öğeleri salt okunur modda görüntülenmektedir.'
                  : 'Product and category modifications have been restricted by the platform SuperAdmin. Your catalog is currently in read-only mode.'}
              </p>
            </div>
          </div>
        )}

        {!permissions.canTrackTables && (
          <div className="bg-slate-100 border border-slate-200 text-slate-700 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
            <span className="text-xl flex-shrink-0">📍</span>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {locale === 'tr' ? 'Masa Takibi & QR Kısıtlandı' : 'Table Tracking & QR Restricted'}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {locale === 'tr'
                  ? 'Masa oluşturma ve QR kod yönetim modülü bu restoran için kısıtlanmıştır.'
                  : 'Table generation and QR tracking module is currently disabled for this tenant instance.'}
              </p>
            </div>
          </div>
        )}

        {/* Top Summary Cards */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{t.overview.title}</h2>
              <p className="text-xs text-gray-500">{t.overview.subtitle}</p>
            </div>
            {/* Gated Action Buttons */}
            {permissions.canManageMenu ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setCatModal({ open: true })}
                  className="bg-blue-600 text-white text-xs font-semibold rounded-lg px-3.5 py-2 hover:bg-blue-700 transition cursor-pointer shadow-xs"
                >
                  {t.overview.newCategoryBtn}
                </button>
                {categories.length > 0 && (
                  <button
                    onClick={() => setProdModal({ open: true, categoryId: categories[0].id })}
                    className="bg-emerald-600 text-white text-xs font-semibold rounded-lg px-3.5 py-2 hover:bg-emerald-700 transition cursor-pointer shadow-xs"
                  >
                    {t.overview.newProductBtn}
                  </button>
                )}
              </div>
            ) : (
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-1.5 self-start sm:self-auto">
                <span>🔒</span>
                <span>{locale === 'tr' ? 'Menü Düzenleme Kilitli' : 'Menu Editing Locked'}</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/categories"
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:border-blue-300 transition block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">{t.overview.categoriesCard}</span>
                {!permissions.canManageMenu && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold">
                    Read-Only
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold text-gray-900">{categories.length}</span>
                <span className="text-xs text-blue-600 font-semibold">{t.overview.manage}</span>
              </div>
            </Link>

            <Link
              href="/admin/products"
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:border-emerald-300 transition block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">{t.overview.productsCard}</span>
                {!permissions.canManageMenu && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold">
                    Read-Only
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold text-gray-900">{totalProducts}</span>
                <span className="text-xs text-emerald-600 font-semibold">{t.overview.manage}</span>
              </div>
            </Link>

            <Link
              href="/admin/locations"
              className={`bg-white p-5 rounded-xl border shadow-xs transition block ${
                permissions.canTrackTables
                  ? 'border-gray-200 hover:border-purple-300'
                  : 'border-gray-200 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">{t.overview.locationsCard}</span>
                {!permissions.canTrackTables && (
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-semibold">
                    🔒 Locked
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold text-gray-900">{locationsCount}</span>
                <span className="text-xs text-purple-600 font-semibold">{t.overview.manage}</span>
              </div>
            </Link>

            <Link
              href="/admin/locations"
              className={`bg-white p-5 rounded-xl border shadow-xs transition block ${
                permissions.canTrackTables
                  ? 'border-gray-200 hover:border-amber-300'
                  : 'border-gray-200 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">{t.overview.tablesCard}</span>
                {!permissions.canTrackTables && (
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-semibold">
                    🔒 Locked
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold text-gray-900">{tablesCount}</span>
                <span className="text-xs text-amber-600 font-semibold">{t.overview.manage}</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Live Traffic Analytics Section */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <AnalyticsTab slug={slug} />
        </section>

        {/* Recent Categories Preview */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">{t.overview.snapshotTitle}</h3>
            <Link
              href="/admin/categories"
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              {t.overview.viewAllCategories}
            </Link>
          </div>

          {categories.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">{t.overview.noCategories}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.slice(0, 6).map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 border border-gray-100 bg-gray-50/50 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">
                      {cat.name[locale] || cat.name['tr'] || cat.name[locales[0]] || 'Unnamed'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {cat.products?.length || 0} {t.overview.productsCount}
                    </div>
                  </div>
                  {permissions.canManageMenu ? (
                    <button
                      onClick={() => setProdModal({ open: true, categoryId: cat.id })}
                      className="text-xs text-emerald-600 hover:text-emerald-700 border border-emerald-200 rounded-lg px-2.5 py-1 bg-white cursor-pointer"
                    >
                      {t.overview.addProduct}
                    </button>
                  ) : (
                    <span className="text-[11px] text-gray-400 italic">
                      {locale === 'tr' ? 'Salt Okunur' : 'Read Only'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
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
