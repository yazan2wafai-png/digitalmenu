'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter } from 'next/navigation';

function SuperAdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('superadmin@nfcmyplace.com');
  const [password, setPassword] = useState('SuperAdmin123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/super-admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Invalid credentials');
        return;
      }
      router.replace('/super-admin');
    } catch {
      setError('Network error — unable to reach authentication endpoint.');
    } finally {
      setLoading(false);
    }
  }

  function handleQuickFill() {
    setEmail('superadmin@nfcmyplace.com');
    setPassword('SuperAdmin123!');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-slate-900 via-slate-950 to-black p-4">
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-indigo-950/40">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30 mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
              ⚡
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">SuperAdmin Portal</h1>
          <p className="text-xs text-slate-400 mt-1 text-center">
            Multi-Tenant Platform Governance & Global Administration
          </p>
        </div>

        {/* Demo Credentials Quick Pill */}
        <div className="mb-6 p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs">
          <div className="text-slate-300">
            <span className="font-semibold text-indigo-400">Default SuperAdmin:</span>
            <div className="text-[11px] font-mono text-slate-400">superadmin@nfcmyplace.com</div>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="px-2.5 py-1 text-[11px] font-medium bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg transition border border-indigo-500/30 cursor-pointer"
          >
            Auto Fill
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              SuperAdmin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition ring-0 focus:ring-2 focus:ring-indigo-500/20 font-medium"
              placeholder="superadmin@nfcmyplace.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition ring-0 focus:ring-2 focus:ring-indigo-500/20 font-medium"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl py-3 text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Authenticating…</span>
              </>
            ) : (
              'Enter SuperAdmin Portal →'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500">
            Protected Platform Endpoint &bull; Digital Menu Engine
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
          Loading SuperAdmin login...
        </div>
      }
    >
      <SuperAdminLoginForm />
    </Suspense>
  );
}
