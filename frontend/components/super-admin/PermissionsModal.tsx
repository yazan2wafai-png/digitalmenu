'use client';

import { useState } from 'react';
import type { RestaurantPermissions } from '@/types/super-admin';

interface Props {
  slug: string;
  restaurantName: string;
  initialPermissions?: RestaurantPermissions;
  onClose: () => void;
  onSaved: (updatedPermissions: RestaurantPermissions) => void;
}

const DEFAULT_PERMISSIONS: RestaurantPermissions = {
  canViewOrders: true,
  canTrackTables: true,
  canManageMenu: true,
  canManageStaff: true,
  canViewAnalytics: true,
};

interface PermissionConfig {
  key: keyof RestaurantPermissions;
  title: string;
  description: string;
  icon: string;
  tag: string;
}

const PERMISSION_CONFIGS: PermissionConfig[] = [
  {
    key: 'canViewOrders',
    title: 'Order Overview & Live Feeds',
    description: 'Enables customer ordering, order summary dashboards, and kitchen status flows.',
    icon: '🛒',
    tag: 'Orders',
  },
  {
    key: 'canTrackTables',
    title: 'Table Tracking & QR Generator',
    description: 'Enables branch locations, physical dining tables, and QR/NFC code generator tools.',
    icon: '📍',
    tag: 'Tables & QR',
  },
  {
    key: 'canManageMenu',
    title: 'Product & Category Editing',
    description: 'Allows tenant admin to create, edit, upload photos, and delete categories and products.',
    icon: '🍕',
    tag: 'Catalog',
  },
  {
    key: 'canManageStaff',
    title: 'Staff Role & User Controls',
    description: 'Grants access to team member accounts, staff management, and role-based actions.',
    icon: '👥',
    tag: 'Security & Staff',
  },
  {
    key: 'canViewAnalytics',
    title: 'Analytics & Overview Dashboard',
    description: 'Enables the tenant\'s Overview tab: page view stats and traffic breakdowns.',
    icon: '📊',
    tag: 'Analytics',
  },
];

export function PermissionsModal({
  slug,
  restaurantName,
  initialPermissions,
  onClose,
  onSaved,
}: Props) {
  const [permissions, setPermissions] = useState<RestaurantPermissions>(
    initialPermissions || DEFAULT_PERMISSIONS
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function handleToggle(key: keyof RestaurantPermissions) {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function handleSetAll(value: boolean) {
    setPermissions({
      canViewOrders: value,
      canTrackTables: value,
      canManageMenu: value,
      canManageStaff: value,
      canViewAnalytics: value,
    });
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/proxy/super-admin/restaurants/${slug}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(permissions),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Failed to update permissions (${res.status})`);
      }

      onSaved(permissions);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error updating tenant permissions');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/60 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🛡️</span>
              <h2 className="text-lg font-bold text-white tracking-tight">Tenant RBAC Permissions</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Configure feature gating and administrative access for{' '}
              <span className="font-semibold text-indigo-300">{restaurantName}</span>{' '}
              <span className="font-mono text-[11px] text-slate-500">({slug})</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Quick Presets Toolbar */}
        <div className="py-3 flex items-center justify-between border-b border-slate-800/60 text-xs">
          <span className="text-slate-400 font-medium">Quick presets:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleSetAll(true)}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-semibold transition cursor-pointer text-[11px]"
            >
              Grant All
            </button>
            <button
              type="button"
              onClick={() => handleSetAll(false)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 font-semibold transition cursor-pointer text-[11px]"
            >
              Restrict All
            </button>
          </div>
        </div>

        {/* Permissions List */}
        <div className="py-4 space-y-3 flex-1">
          {PERMISSION_CONFIGS.map((item) => {
            const isEnabled = permissions[item.key];
            return (
              <div
                key={item.key}
                onClick={() => handleToggle(item.key)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
                  isEnabled
                    ? 'bg-slate-800/60 border-indigo-500/30 hover:border-indigo-500/50 shadow-xs'
                    : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 opacity-75'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition ${
                      isEnabled
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.title}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          isEnabled
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}
                      >
                        {isEnabled ? 'ACTIVE' : 'LOCKED'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 inline-block">
                      Key: {item.key}
                    </span>
                  </div>
                </div>

                {/* Switch Toggle */}
                <div className="flex-shrink-0 ml-2">
                  <div
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                      isEnabled ? 'bg-indigo-600 justify-end' : 'bg-slate-800 justify-start'
                    }`}
                  >
                    <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2 mb-4">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Saving RBAC…</span>
              </>
            ) : (
              'Save Permissions'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
