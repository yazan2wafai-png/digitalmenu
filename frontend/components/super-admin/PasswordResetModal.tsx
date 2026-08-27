'use client';

import { useState } from 'react';

interface Props {
  slug: string;
  restaurantName?: string;
  onClose: () => void;
}

export function PasswordResetModal({ slug, restaurantName, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ email: string; newPassword: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleReset() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/proxy/super-admin/restaurants/${slug}/reset-password`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to reset password');
        return;
      }
      setResult({ email: data.email, newPassword: data.newPassword });
    } catch {
      setError('Network error while attempting to reset the password');
    } finally {
      setLoading(false);
    }
  }

  async function copyPassword() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.newPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable - user can still select the text manually
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl w-full max-w-md p-6 shadow-2xl shadow-indigo-950/40 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-xl">
            🔑
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Reset Admin Password</h3>
            <p className="text-xs text-slate-400">{restaurantName || slug}</p>
          </div>
        </div>

        {!result ? (
          <>
            <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 space-y-1">
              <p>
                Existing passwords are hashed and can never be displayed. This generates a{' '}
                <strong className="text-white">brand-new password</strong> for this tenant&apos;s admin
                account and immediately invalidates the old one.
              </p>
              <p className="text-slate-400">
                The new password is shown once, right after you confirm - make sure to copy and relay it
                to the tenant before closing this dialog.
              </p>
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
                onClick={handleReset}
                disabled={loading}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-xl shadow-lg shadow-indigo-600/30 transition cursor-pointer"
              >
                {loading ? 'Resetting…' : 'Generate New Password'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-200 space-y-2">
              <p className="font-semibold text-emerald-300">✅ Password reset. Copy it now - it won&apos;t be shown again.</p>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Admin email</label>
                <p className="font-mono text-sm text-white break-all">{result.email}</p>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">New password</label>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm text-white bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 flex-1 break-all">
                    {result.newPassword}
                  </p>
                  <button
                    type="button"
                    onClick={copyPassword}
                    className="px-3 py-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition cursor-pointer whitespace-nowrap"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
