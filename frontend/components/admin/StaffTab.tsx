'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useAdminI18n } from '@/lib/admin-i18n';

interface StaffMember {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  isOwner: boolean;
}

export default function StaffTab() {
  const { t, locale } = useAdminI18n();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function load() {
    setLoading(true);
    fetch('/api/proxy/admin/me/staff')
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: StaffMember[]) => setStaff(Array.isArray(data) ? data : []))
      .catch(() => setStaff([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      const res = await fetch('/api/proxy/admin/me/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 409) {
          setError(t.staff.emailExistsError);
        } else if (res.status === 403) {
          setError(t.staff.disabledNotice);
        } else {
          setError(data.message || t.staff.createError);
        }
        return;
      }
      setName('');
      setEmail('');
      setPassword('');
      setShowForm(false);
      load();
    } catch {
      setError(t.staff.createError);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(member: StaffMember) {
    if (member.isOwner) {
      alert(t.staff.deleteOwnerError);
      return;
    }
    if (!confirm(t.staff.deleteConfirm)) return;
    try {
      const res = await fetch(`/api/proxy/admin/me/staff/${member.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || t.staff.deleteError);
        return;
      }
      load();
    } catch {
      alert(t.staff.deleteError);
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-500">{t.staff.loading}</div>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs text-gray-900">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{t.staff.title}</h2>
          <p className="text-xs text-gray-500 mt-1">{t.staff.subtitle}</p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
          >
            {t.staff.addBtn}
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="border border-gray-200 rounded-xl p-4 mb-6 bg-gray-50/50 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">{t.staff.nameLabel}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.staff.namePlaceholder}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">{t.staff.emailLabel}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">{t.staff.passwordLabel}</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.staff.passwordHint}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 p-2.5 rounded-lg border border-red-200">{error}</p>}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={creating}
              className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
            >
              {creating ? t.staff.creatingBtn : t.staff.createBtn}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setError('');
              }}
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 transition cursor-pointer"
            >
              {t.staff.cancelBtn}
            </button>
          </div>
        </form>
      )}

      {staff.length === 0 ? (
        <p className="text-sm text-gray-400 py-6 text-center">{t.staff.empty}</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {staff.map((member) => (
            <div key={member.id} className="flex items-center justify-between py-3 flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800 text-sm">
                    {member.name || member.email}
                  </span>
                  {member.isOwner && (
                    <span className="text-[10px] font-semibold uppercase text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                      {t.staff.ownerBadge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 font-mono">{member.email}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {t.staff.createdAt}: {new Date(member.createdAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US')}
                </p>
              </div>
              {!member.isOwner && (
                <button
                  type="button"
                  onClick={() => handleDelete(member)}
                  className="text-xs text-red-600 hover:text-red-800 border border-red-200 hover:border-red-300 rounded-lg px-3 py-1.5 transition cursor-pointer font-medium"
                >
                  {t.staff.deleteBtn}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
