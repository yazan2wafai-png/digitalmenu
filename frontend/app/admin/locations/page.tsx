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

  // If table tracking has been disabled for this tenant, don't reveal this
  // page exists at all - bounce back to the overview silently.
  useEffect(() => {
    if (!loading && !permissions.canTrackTables) {
      router.replace('/admin');
    }
  }, [loading, permissions.canTrackTables, router]);

  if (loading || !permissions.canTrackTables) {
    return <div className="p-8 text-center text-gray-500">{t.locations.loadingLocations}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminHeader slug={slug} email={email} permissions={permissions} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{t.locations.title}</h1>
          <p className="text-xs text-gray-500">{t.locations.subtitle}</p>
        </div>

        <LocationsTablesTab slug={slug} />
      </main>
    </div>
  );
}
