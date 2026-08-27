'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useAdminI18n } from '@/lib/admin-i18n';
import type { RestaurantPermissions, AdminOrder, OrderStatus } from '@/types/admin';

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

const POLL_INTERVAL_MS = 6000;

const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'PREPARING',
  PREPARING: 'READY',
  READY: 'COMPLETED',
  COMPLETED: null,
  CANCELLED: null,
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: '#D97706',
  CONFIRMED: '#2563EB',
  PREPARING: '#7C3AED',
  READY: '#059669',
  COMPLETED: '#4B5563',
  CANCELLED: '#DC2626',
};

function timeAgo(iso: string, locale: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return locale === 'tr' ? 'az önce' : 'just now';
  if (mins < 60) return locale === 'tr' ? `${mins} dk önce` : `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return locale === 'tr' ? `${hours} sa önce` : `${hours}h ago`;
}

export default function OrdersAdminPage() {
  const router = useRouter();
  const { locale, t } = useAdminI18n();
  const [slug, setSlug] = useState('');
  const [email, setEmail] = useState('');
  const [permissions, setPermissions] = useState<RestaurantPermissions>(DEFAULT_PERMISSIONS);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [, forceTick] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOrders = useCallback(async (isInitial: boolean) => {
    if (isInitial) setLoading(true);
    try {
      const res = await fetch('/api/proxy/admin/orders');
      if (!res.ok) {
        if (isInitial) setError(t.orders.error);
        return;
      }
      const data: AdminOrder[] = await res.json();
      setOrders(data);
      setError('');
    } catch {
      if (isInitial) setError(t.orders.error);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [t.orders.error]);

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
        if (data?.permissions) setPermissions(data.permissions);
        else if (data?.canViewOrders !== undefined) setPermissions(data);
      })
      .catch(() => {});

    fetchOrders(true);
    pollRef.current = setInterval(() => fetchOrders(false), POLL_INTERVAL_MS);
    const tickRef = setInterval(() => forceTick((n) => n + 1), 30000); // re-render for "time ago" labels
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      clearInterval(tickRef);
    };
  }, [router, fetchOrders]);

  // If order viewing has been disabled for this tenant, don't reveal this
  // page exists at all - bounce back to the overview silently.
  useEffect(() => {
    if (!loading && !permissions.canViewOrders) {
      router.replace('/admin');
    }
  }, [loading, permissions.canViewOrders, router]);

  async function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await fetch(`/api/proxy/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {
      // Re-sync on next poll if this failed silently
      fetchOrders(false);
    }
  }

  const statusLabel: Record<OrderStatus, string> = {
    PENDING: t.orders.statusPending,
    CONFIRMED: t.orders.statusConfirmed,
    PREPARING: t.orders.statusPreparing,
    READY: t.orders.statusReady,
    COMPLETED: t.orders.statusCompleted,
    CANCELLED: t.orders.statusCancelled,
  };

  const nextActionLabel: Record<OrderStatus, string> = {
    PENDING: t.orders.markConfirmed,
    CONFIRMED: t.orders.markPreparing,
    PREPARING: t.orders.markReady,
    READY: t.orders.markCompleted,
    COMPLETED: '',
    CANCELLED: '',
  };

  const filteredOrders = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);
  const filterOptions: (OrderStatus | 'ALL')[] = [
    'ALL',
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'COMPLETED',
    'CANCELLED',
  ];

  if (loading || !permissions.canViewOrders) {
    return <div className="p-8 text-center text-gray-500">{t.orders.loading}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminHeader slug={slug} email={email} permissions={permissions} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t.orders.title}</h1>
            <p className="text-xs text-gray-500">{t.orders.subtitle}</p>
          </div>
        </div>

        {/* Status filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                filter === opt
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {opt === 'ALL' ? t.orders.filterAll : statusLabel[opt]}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">{error}</div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400 text-sm">
            {t.orders.empty}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const nextStatus = STATUS_FLOW[order.status];
              const isTerminal = order.status === 'COMPLETED' || order.status === 'CANCELLED';
              return (
                <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                          style={{ backgroundColor: STATUS_COLORS[order.status] }}
                        >
                          {statusLabel[order.status]}
                        </span>
                        <span className="text-xs text-gray-400">{timeAgo(order.createdAt, locale)}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 mt-1.5">
                        📍 {order.tableName || (order.tableId ? `#${order.tableId.slice(-6)}` : t.orders.noTable)}
                      </p>
                    </div>
                    <div className="text-lg font-extrabold text-gray-900">
                      ₺{order.totalAmount.toFixed(2).replace(/\.00$/, '')}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm text-gray-700">
                        <span>
                          <span className="font-semibold">{item.quantity}×</span> {item.productName}
                        </span>
                        <span className="text-gray-400">
                          ₺{(item.productPrice * item.quantity).toFixed(2).replace(/\.00$/, '')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <p className="mt-2 text-xs text-gray-500 italic bg-gray-50 rounded-lg px-3 py-2">
                      {order.notes}
                    </p>
                  )}

                  {!isTerminal && (
                    <div className="flex gap-2 mt-4">
                      {nextStatus && (
                        <button
                          onClick={() => updateStatus(order.id, nextStatus)}
                          className="flex-1 py-2 rounded-xl text-xs font-bold text-white transition-colors"
                          style={{ backgroundColor: STATUS_COLORS[nextStatus] }}
                        >
                          {nextActionLabel[order.status]}
                        </button>
                      )}
                      <button
                        onClick={() => updateStatus(order.id, 'CANCELLED')}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                      >
                        {t.orders.markCancelled}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
