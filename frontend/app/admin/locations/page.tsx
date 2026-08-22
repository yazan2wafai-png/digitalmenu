'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import LocationsTablesTab from '@/components/admin/LocationsTablesTab';

function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : '';
}

export default function LocationsAdminPage() {
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [email, setEmail] = useState('');
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
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading locations…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminHeader slug={slug} email={email} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Locations & Tables Management</h1>
          <p className="text-xs text-gray-500">
            Configure restaurant branches, dining areas, physical tables, and generate QR code digital menus
          </p>
        </div>

        <LocationsTablesTab slug={slug} />
      </main>
    </div>
  );
}
