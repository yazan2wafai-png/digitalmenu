'use client';

import { useState, useEffect, FormEvent } from 'react';

type StaffRole = 'OWNER' | 'EDITOR' | 'VIEWER';

interface StaffMember {
  id: string;
  email: string;
  name: string | null;
  role: string;
  staffRole: StaffRole;
  createdAt: string;
  isOwner: boolean;
}

interface Props {
  slug: string;
  restaurantName?: string;
  onClose: () => void;
}

const ROLE_LABELS: Record<StaffRole, string> = {
  OWNER: 'Owner',
  EDITOR: 'Editor',
  VIEWER: 'Viewer',
};

const ROLE_BADGE_STYLE: Record<StaffRole, string> = {
  OWNER: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
  EDITOR: 'text-sky-300 bg-sky-500/10 border-sky-500/30',
  VIEWER: 'text-slate-300 bg-slate-500/10 border-slate-500/30',
};

export function StaffModal({ slug, restaurantName, onClose }: Props) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staffRole, setStaffRole] = useState<StaffRole>('EDITOR');
  const [roleUpdatingId, setRoleUpdatingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch(`/api/proxy/super-admin/restaurants/${slug}/staff`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: StaffMember[]) => setStaff(Array.isArray(data) ? data : []))
      .catch(() => setStaff([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      const res = await fetch(`/api/proxy/super-admin/restaurants/${slug}/staff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name || undefined, staffRole }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || 'Failed to create account');
        return;
      }
      setName('');
      setEmail('');
      setPassword('');
      setStaffRole('EDITOR');
      setShowForm(false);
      load();
    } catch {
      setError('Failed to create account');
    } finally {
      setCreating(false);
    }
  }

  async function handleRoleChange(member: StaffMember, next: StaffRole) {
    if (next === member.staffRole) return;
    setRoleUpdatingId(member.id);
    try {
      const res = await fetch(`/api/proxy/super-admin/restaurants/${slug}/staff/${member.id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffRole: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || 'Failed to update role');
        return;
      }
      load();
    } catch {
      alert('Failed to update role');
    } finally {
      setRoleUpdatingId(null);
    }
  }

  async function handleDelete(member: StaffMember) {
    if (!confirm(`Remove staff account "${member.email}"?`)) return;
    try {
      const res = await fetch(`/api/proxy/super-admin/restaurants/${slug}/staff/${member.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || 'Failed to remove account');
        return;
      }
      load();
    } catch {
      alert('Failed to remove account');
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl w-full max-w-lg p-6 shadow-2xl shadow-indigo-950/40 space-y-5 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-xl">
              👥
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Staff Accounts</h3>
              <p className="text-xs text-slate-400">{restaurantName || slug}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Create as many staff/admin accounts as this restaurant needs, with any of the three
          roles - super-admin can always add accounts here even if the tenant's own staff
          management is switched off.
        </p>

        {!showForm ? (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="w-full px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            + Add Staff Account
          </button>
        ) : (
          <form
            onSubmit={handleCreate}
            className="p-4 bg-slate-950/60 border border-slate-700 rounded-xl space-y-3"
          >
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ahmet - Waiter"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Password (min 6 chars)</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Role</label>
              <select
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value as StaffRole)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="OWNER">Owner - full access incl. settings & staff</option>
                <option value="EDITOR">Editor - menu, orders, tables</option>
                <option value="VIEWER">Viewer - read-only</option>
              </select>
            </div>

            {error && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
                {error}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-xl transition cursor-pointer"
              >
                {creating ? 'Creating…' : 'Create Account'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError('');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="border-t border-slate-800 pt-3">
          {loading ? (
            <p className="text-xs text-slate-500 py-4 text-center">Loading…</p>
          ) : staff.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No staff accounts yet.</p>
          ) : (
            <div className="space-y-2">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2.5 bg-slate-950/40 border border-slate-800 rounded-xl gap-2 flex-wrap"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium">{member.name || member.email}</span>
                      <span
                        className={`text-[10px] font-semibold uppercase border rounded px-1.5 py-0.5 ${ROLE_BADGE_STYLE[member.staffRole]}`}
                      >
                        {ROLE_LABELS[member.staffRole]}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={member.staffRole}
                      disabled={roleUpdatingId === member.id}
                      onChange={(e) => handleRoleChange(member, e.target.value as StaffRole)}
                      className="text-[11px] bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 disabled:opacity-50"
                    >
                      <option value="OWNER">Owner</option>
                      <option value="EDITOR">Editor</option>
                      <option value="VIEWER">Viewer</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleDelete(member)}
                      className="px-2.5 py-1 text-[11px] font-medium text-red-400 hover:text-red-300 border border-red-500/30 rounded-lg transition cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
