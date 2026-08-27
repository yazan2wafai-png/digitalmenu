'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import LocationsTablesTab from '@/components/admin/LocationsTablesTab';
import { useAdminI18n } from '@/lib/admin-i18n';
import type { RestaurantPermissions } from '@/types/admin';

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

export default function LocationsAdminPage() {
  const router = useRouter();
  const { locale, t } = useAdminI18n();
  const [slug, setSlug] = useState('');
  const [email, setEmail] = useState('');
  const [permissions, setPermissions] = useState<RestaurantPermissions>(DEFAULT_PERMISSIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getCookie('restaurant_slug');
    const e = getCookie('admin_email');
    if (!s) {
      router.replace('/admin/login');
      return;
    }
    setSlug(s);
    setEmail(e);

    // Fetch permissions
    fetch(`/api/proxy/super-admin/restaurants/${s}/permissions`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.permissions) {
          setPermissions(data.permissions);
        } else if (data?.canTrackTables !== undefined) {
          setPermissions(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">{t.locations.loadingLocations}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminHeader slug={slug} email={email} permissions={permissions} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {!permissions.canTrackTables && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-5 shadow-xs flex items-start gap-3">
            <span className="text-xl">🔒</span>
            <div>
              <h3 className="text-sm font-bold">
                {locale === 'tr' ? 'Masa & Lokasyon Yönetimi Kısıtlandı' : 'Tables & Locations Restricted'}
              </h3>
              <p className="text-xs text-amber-700 mt-1">
                {locale === 'tr'
                  ? 'Masa oluşturma ve QR üretme özellikleri platform süper yöneticisi tarafından kısıtlanmıştır.'
                  : 'Table tracking and QR generator features are currently disabled by the SuperAdmin.'}
              </p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{t.locations.title}</h1>
          <p className="text-xs text-gray-500">{t.locations.subtitle}</p>
        </div>

        {permissions.canTrackTables ? (
          <LocationsTablesTab slug={slug} />
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <p className="text-4xl mb-3">📍</p>
            <h3 className="text-base font-bold text-gray-800">
              {locale === 'tr' ? 'Masa Takip Modülü Kilitli' : 'Table Tracking Module Locked'}
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              {locale === 'tr'
                ? 'Bu restoran hesabı için masa ve QR kod yönetimi izinleri kısıtlanmıştır. Erişim sağlamak için sistem yöneticinizle iletişime geçin.'
                : 'Table tracking and QR generation features are locked for this account. Contact your SuperAdmin to request activation.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
