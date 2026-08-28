'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import StaffTab from '@/components/admin/StaffTab';
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

export default function StaffAdminPage() {
  const router = useRouter();
  const { t } = useAdminI18n();
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

    fetch(`/api/proxy/super-admin/restaurants/${s}/permissions`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.permissions) {
          setPermissions(data.permissions);
        } else if (data?.canManageStaff !== undefined) {
          setPermissions(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">{t.staff.loading}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminHeader slug={slug} email={email} permissions={permissions} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{t.staff.title}</h1>
          <p className="text-xs text-gray-500">{t.staff.subtitle}</p>
        </div>

        {permissions.canManageStaff === false ? (
          <div className="bg-white border border-amber-200 rounded-xl p-6 text-sm text-amber-800 bg-amber-50/50">
            {t.staff.disabledNotice}
          </div>
        ) : (
          <StaffTab />
        )}
      </main>
    </div>
  );
}
