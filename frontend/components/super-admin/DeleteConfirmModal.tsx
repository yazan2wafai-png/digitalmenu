'use client';

import { useState } from 'react';

interface Props {
  slug: string;
  restaurantName?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteConfirmModal({ slug, restaurantName, onClose, onSuccess }: Props) {
  const [confirmInput, setConfirmInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    if (confirmInput.trim() !== slug) {
      setError(`Please type "${slug}" exactly to confirm deletion.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/proxy/super-admin/restaurants/${slug}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to delete restaurant');
        return;
      }

      onSuccess();
    } catch {
      setError('Network error while attempting to delete restaurant');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-red-500/30 rounded-3xl w-full max-w-md p-6 shadow-2xl shadow-red-950/40 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center text-xl">
            🗑️
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Delete Tenant Restaurant</h3>
            <p className="text-xs text-slate-400">This action is permanent and cannot be undone.</p>
          </div>
        </div>

        <div className="p-3.5 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300 space-y-1">
          <p className="font-semibold text-red-200">
            ⚠️ Warning: Cascading Database Destruction
          </p>
          <p className="text-slate-400">
            Deleting <strong className="text-white">{restaurantName || slug}</strong> will permanently remove all associated categories, products, locations, tables, and admin user credentials.
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Type <span className="font-mono text-indigo-400 font-bold">{slug}</span> to confirm:
          </label>
          <input
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder={slug}
            className="w-full bg-slate-950 border border-slate-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono outline-none transition"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || confirmInput.trim() !== slug}
            className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 rounded-xl shadow-lg shadow-red-600/30 transition cursor-pointer flex items-center gap-1.5"
          >
            {loading ? 'Deleting…' : 'Confirm & Delete Tenant'}
          </button>
        </div>
      </div>
    </div>
  );
}
