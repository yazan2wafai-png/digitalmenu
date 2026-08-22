'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import SeoSettingsTab from '@/components/admin/SeoSettingsTab';

function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : '';
}

export default function SettingsAdminPage() {
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
    return <div className="p-8 text-center text-gray-500">Loading settings…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminHeader slug={slug} email={email} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Branding, SEO & Feature Settings</h1>
          <p className="text-xs text-gray-500">
            Control module toggles, currency preferences, meta tags, and search engine optimization
          </p>
        </div>

        <SeoSettingsTab slug={slug} />
      </main>
    </div>
  );
}
