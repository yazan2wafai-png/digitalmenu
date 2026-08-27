import type { Metadata } from 'next';
import { AdminI18nProvider } from '@/lib/admin-i18n';

export const metadata: Metadata = {
  title: 'Digital Menu Admin Portal',
  description: 'Digital Menu Restaurant Management Portal',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminI18nProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900 antialiased font-sans">
        {children}
      </div>
    </AdminI18nProvider>
  );
}
