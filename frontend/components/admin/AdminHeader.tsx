'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminI18n } from '@/lib/admin-i18n';
import type { RestaurantPermissions } from '@/types/admin';

interface Props {
  slug: string;
  email: string;
  permissions?: RestaurantPermissions;
}

export function AdminHeader({ slug, email, permissions }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale, t } = useAdminI18n();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
  }

  const navItems = [
    { label: t.nav.overview, href: '/admin', isGated: false },
    {
      label: permissions?.canManageMenu === false ? `${t.nav.categories} 🔒` : t.nav.categories,
      href: '/admin/categories',
      isGated: permissions?.canManageMenu === false,
      gatedTitle: 'Menu modification restricted',
    },
    {
      label: permissions?.canManageMenu === false ? `${t.nav.products} 🔒` : t.nav.products,
      href: '/admin/products',
      isGated: permissions?.canManageMenu === false,
      gatedTitle: 'Product modification restricted',
    },
    {
      label: permissions?.canTrackTables === false ? `${t.nav.tables} 🔒` : t.nav.tables,
      href: '/admin/locations',
      isGated: permissions?.canTrackTables === false,
      gatedTitle: 'Table tracking restricted',
    },
    { label: t.nav.settings, href: '/admin/settings', isGated: false },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3.5 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
            {slug ? slug.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">
              {slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : (locale === 'tr' ? 'Restoran' : 'Restaurant')}{' '}
              <span className="text-blue-600 text-xs font-semibold uppercase px-1.5 py-0.5 bg-blue-50 border border-blue-100 rounded ml-1">
                {locale === 'tr' ? 'Panel' : 'Admin'}
              </span>
            </h1>
            <p className="text-xs text-gray-400 font-mono">{email || 'admin'}</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex space-x-1 bg-gray-100/80 p-1 rounded-xl overflow-x-auto max-w-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.isGated ? item.gatedTitle : undefined}
                className={`whitespace-nowrap px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-xs'
                    : item.isGated
                    ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-200/40'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Language Switcher & Actions */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-shrink-0">
          {/* TR | EN Language Switcher Toggle */}
          <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg p-0.5 text-xs font-bold shadow-2xs">
            <button
              type="button"
              onClick={() => setLocale('tr')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                locale === 'tr'
                  ? 'bg-white text-blue-700 shadow-xs font-extrabold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Türkçe"
            >
              TR
            </button>
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                locale === 'en'
                  ? 'bg-white text-blue-700 shadow-xs font-extrabold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          <Link
            href={slug ? `/${slug}` : '/'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 font-medium rounded-lg px-3 py-1.5 transition flex items-center gap-1 border border-blue-200"
          >
            <span>{t.nav.liveMenu}</span>
            <span>↗</span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-lg px-3 py-1.5 transition cursor-pointer font-medium"
          >
            {t.nav.signOut}
          </button>
        </div>
      </div>
    </header>
  );
}
