'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface Props {
  slug: string;
  email: string;
}

export function AdminHeader({ slug, email }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
  }

  const navItems = [
    { label: '📊 Overview', href: '/admin' },
    { label: '📂 Categories', href: '/admin/categories' },
    { label: '🍕 Products', href: '/admin/products' },
    { label: '📍 Tables & Locations', href: '/admin/locations' },
    { label: '⚙️ Settings', href: '/admin/settings' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3.5 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
            {slug ? slug.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">
              {slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Restaurant'} Admin
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
                className={`whitespace-nowrap px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 self-start md:self-auto flex-shrink-0">
          <Link
            href={`/${slug || 'baltazar'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 font-medium rounded-lg px-3 py-1.5 transition flex items-center gap-1 border border-blue-200"
          >
            <span>Live Menu</span>
            <span>↗</span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-lg px-3 py-1.5 transition cursor-pointer font-medium"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
