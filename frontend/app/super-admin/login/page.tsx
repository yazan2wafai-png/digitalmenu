'use client';

import { useState, useEffect, FormEvent, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function SuperAdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('superadmin@nfcmyplace.com');
  const [password, setPassword] = useState('SuperAdmin123!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Super Admin Login | NFCMyPlace';
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/super-admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Invalid SuperAdmin credentials.');
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
    setError('');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-slate-900 via-slate-950 to-black p-4 selection:bg-indigo-500 selection:text-white">
      <title>Super Admin Login | NFCMyPlace</title>

      {/* Decorative Glow Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-indigo-950/50 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-600 to-cyan-400 p-0.5 shadow-xl shadow-indigo-500/25 mb-4 group transition-transform hover:scale-105">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-3xl">
              ⚡
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight text-center">NFCMyPlace Super Admin</h1>
          <p className="text-xs text-slate-400 mt-1.5 text-center font-medium">
            Multi-Tenant Platform Governance & Global RBAC Control
          </p>
        </div>

        {/* Demo Credentials Quick Helper */}
        <div className="mb-6 p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
          <div>
            <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              Platform SuperAdmin
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">superadmin@nfcmyplace.com</div>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="px-3 py-1.5 text-[11px] font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-xl transition border border-indigo-500/30 cursor-pointer active:scale-95"
          >
            Auto Fill
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              SuperAdmin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition focus:ring-2 focus:ring-indigo-500/20 font-medium"
              placeholder="superadmin@nfcmyplace.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition focus:ring-2 focus:ring-indigo-500/20 font-medium pr-10"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 text-xs transition cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError('')}
                className="text-red-400 hover:text-red-200 text-xs"
              >
                ✕
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl py-3.5 text-sm font-bold tracking-wide transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Authenticating SuperAdmin…</span>
              </>
            ) : (
              'Enter SuperAdmin Control Center →'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Protected SuperAdmin Gateway</span>
          <Link href="/admin/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
            Restaurant Admin →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400 text-sm">
          Loading SuperAdmin login...
        </div>
      }
    >
      <SuperAdminLoginForm />
    </Suspense>
  );
}
