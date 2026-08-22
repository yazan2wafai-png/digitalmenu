'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { SuperAdminHeader } from '@/components/super-admin/SuperAdminHeader';
import { ProvisionModal } from '@/components/super-admin/ProvisionModal';
import { AnalyticsModal } from '@/components/super-admin/AnalyticsModal';
import { DeleteConfirmModal } from '@/components/super-admin/DeleteConfirmModal';

interface RestaurantItem {
  id: string;
  slug: string;
  name: Record<string, string>;
  themeColor: string;
  supportedLocales: string[];
  defaultLocale: string;
  isActive: boolean;
  createdAt: string;
  categoryCount: number;
  productCount: number;
  viewCount: number;
}

function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : '';
}

export default function SuperAdminDashboardPage() {
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [search, setSearch] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal States
  const [provisionOpen, setProvisionOpen] = useState(false);
  const [analyticsTarget, setAnalyticsTarget] = useState<{ slug: string; name: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ slug: string; name: string } | null>(null);

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/proxy/super-admin/restaurants');
      if (!res.ok) {
        throw new Error(`Failed to load restaurants (${res.status})`);
      }
      const data: RestaurantItem[] = await res.json();
      setRestaurants(data);
    } catch (err: any) {
      setError(err?.message || 'Error connecting to SuperAdmin API');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const adminEmail = getCookie('super_admin_email');
    setEmail(adminEmail);
    fetchRestaurants();
  }, [fetchRestaurants]);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }

  function handleCopy(slug: string) {
    const url = `https://${slug}.nfcmyplace.com`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
    showToast(`Copied ${url} to clipboard!`);
  }

  // Aggregate Metrics
  const totalTenants = restaurants.length;
  const totalCategories = restaurants.reduce((sum, r) => sum + (r.categoryCount || 0), 0);
  const totalProducts = restaurants.reduce((sum, r) => sum + (r.productCount || 0), 0);
  const totalViews = restaurants.reduce((sum, r) => sum + (r.viewCount || 0), 0);

  // Filtered Restaurants
  const filteredRestaurants = restaurants.filter((r) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    const nameMatch = Object.values(r.name || {}).some((v) =>
      typeof v === 'string' && v.toLowerCase().includes(term)
    );
    const slugMatch = r.slug.toLowerCase().includes(term);
    return nameMatch || slugMatch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <SuperAdminHeader email={email} onRefresh={fetchRestaurants} loading={loading} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-3 rounded-2xl shadow-xl shadow-indigo-950/60 text-xs font-semibold flex items-center gap-2 border border-indigo-400/30 animate-bounce">
            <span>✨</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Global Platform KPIs */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Platform Intelligence</h2>
              <p className="text-xs text-slate-400">
                Aggregated metrics across all registered tenant restaurant ecosystems
              </p>
            </div>

            <button
              onClick={() => setProvisionOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition cursor-pointer flex items-center gap-2 self-start sm:self-auto"
            >
              <span>✨</span>
              <span>+ Provision New Restaurant</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Tenants KPI */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg shadow-black/20 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500"></div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Active Tenants</span>
                <span className="text-base p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">🏢</span>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black text-white">{totalTenants}</div>
                <div className="text-[11px] text-slate-500 mt-1">Multi-tenant instances</div>
              </div>
            </div>

            {/* Categories KPI */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg shadow-black/20 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500"></div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Menu Categories</span>
                <span className="text-base p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">📂</span>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black text-white">{totalCategories}</div>
                <div className="text-[11px] text-slate-500 mt-1">Organized sections</div>
              </div>
            </div>

            {/* Products KPI */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg shadow-black/20 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Live Products</span>
                <span className="text-base p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">🍕</span>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black text-white">{totalProducts}</div>
                <div className="text-[11px] text-slate-500 mt-1">Total catalog items</div>
              </div>
            </div>

            {/* PageViews KPI */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg shadow-black/20 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-violet-500"></div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Platform PageViews</span>
                <span className="text-base p-1.5 rounded-lg bg-violet-500/10 text-violet-400">👁️</span>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black text-white">{totalViews.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500 mt-1">Total customer menu visits</div>
              </div>
            </div>
          </div>
        </section>

        {/* Restaurants Table Section */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-black/30">
          {/* Table Toolbar */}
          <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Restaurant Tenants Directory</h3>
              <p className="text-xs text-slate-400">
                Inspect, analyze traffic, provision, or manage existing client tenant records
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or slug…"
                  className="w-64 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="m-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs flex items-center justify-between">
              <span>⚠️ {error}</span>
              <button
                onClick={fetchRestaurants}
                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-xs font-semibold"
              >
                Retry
              </button>
            </div>
          )}

          {/* Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="px-6 py-3.5">Restaurant</th>
                  <th className="px-6 py-3.5">Subdomain &amp; Routing</th>
                  <th className="px-6 py-3.5">Locales</th>
                  <th className="px-6 py-3.5 text-center">Categories</th>
                  <th className="px-6 py-3.5 text-center">Products</th>
                  <th className="px-6 py-3.5 text-right">PageViews</th>
                  <th className="px-6 py-3.5">Provisioned</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {loading && restaurants.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="animate-spin h-6 w-6 text-indigo-500" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span>Loading platform tenants...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredRestaurants.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-slate-400">
                      <p className="text-3xl mb-2">🍽️</p>
                      <p className="font-semibold text-slate-300">No restaurants found</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {search
                          ? `No restaurants match "${search}"`
                          : 'Click "+ Provision New Restaurant" to create your first restaurant tenant.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredRestaurants.map((r) => {
                    const displayName =
                      r.name?.['tr'] ||
                      r.name?.['en'] ||
                      Object.values(r.name || {})[0] ||
                      r.slug;
                    const subName = r.name?.['en'] && r.name?.['tr'] !== r.name?.['en'] ? r.name['en'] : '';

                    return (
                      <tr key={r.id} className="hover:bg-slate-800/30 transition">
                        {/* Restaurant Identity */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              style={{ backgroundColor: r.themeColor || '#E63946' }}
                              className="w-4 h-4 rounded-full border border-white/20 shadow-xs flex-shrink-0"
                              title={`Theme: ${r.themeColor}`}
                            />
                            <div>
                              <div className="font-bold text-white text-sm">{displayName}</div>
                              {subName && (
                                <div className="text-[11px] text-slate-400 font-medium">
                                  {subName}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Subdomain Slug & Direct Links */}
                        <td className="px-6 py-4 font-mono">
                          <div className="flex items-center gap-2">
                            <span className="text-indigo-300 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                              {r.slug}
                            </span>
                            <button
                              onClick={() => handleCopy(r.slug)}
                              title="Copy URL"
                              className="text-slate-500 hover:text-indigo-300 transition text-xs cursor-pointer"
                            >
                              {copiedSlug === r.slug ? '✓' : '📋'}
                            </button>
                            <Link
                              href={`/${r.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-500 hover:text-white transition text-xs"
                              title="Preview Customer Live Menu"
                            >
                              ↗
                            </Link>
                          </div>
                        </td>

                        {/* Supported Locales */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 flex-wrap">
                            {r.supportedLocales?.map((loc) => (
                              <span
                                key={loc}
                                className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                                  loc === r.defaultLocale
                                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-bold'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                                title={loc === r.defaultLocale ? 'Default Language' : undefined}
                              >
                                {loc}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Category Count */}
                        <td className="px-6 py-4 text-center font-semibold text-slate-300">
                          {r.categoryCount}
                        </td>

                        {/* Product Count */}
                        <td className="px-6 py-4 text-center font-semibold text-slate-300">
                          {r.productCount}
                        </td>

                        {/* PageViews */}
                        <td className="px-6 py-4 text-right">
                          <span className="font-mono font-bold text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                            {r.viewCount.toLocaleString()}
                          </span>
                        </td>

                        {/* Created Date */}
                        <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                          {new Date(r.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>

                        {/* Action Buttons */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Analytics Button */}
                            <button
                              onClick={() => setAnalyticsTarget({ slug: r.slug, name: displayName })}
                              className="px-2.5 py-1 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1"
                              title="View 30-day analytics"
                            >
                              <span>📈</span>
                              <span>Stats</span>
                            </button>

                            {/* Restaurant Admin Link */}
                            <Link
                              href={`/admin/login?slug=${r.slug}`}
                              target="_blank"
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-medium transition flex items-center gap-1"
                              title="Sign in to restaurant admin"
                            >
                              <span>⚙️</span>
                              <span>Admin</span>
                            </Link>

                            {/* Delete Tenant */}
                            <button
                              onClick={() => setDeleteTarget({ slug: r.slug, name: displayName })}
                              className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 rounded-lg text-xs font-medium transition cursor-pointer"
                              title="Delete tenant restaurant"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modals */}
      {provisionOpen && (
        <ProvisionModal
          onClose={() => setProvisionOpen(false)}
          onSuccess={() => {
            setProvisionOpen(false);
            fetchRestaurants();
            showToast('Restaurant tenant provisioned successfully!');
          }}
        />
      )}

      {analyticsTarget && (
        <AnalyticsModal
          slug={analyticsTarget.slug}
          restaurantName={analyticsTarget.name}
          onClose={() => setAnalyticsTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          slug={deleteTarget.slug}
          restaurantName={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onSuccess={() => {
            setDeleteTarget(null);
            fetchRestaurants();
            showToast('Restaurant deleted successfully.');
          }}
        />
      )}
    </div>
  );
}
