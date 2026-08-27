'use client';
import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminI18n } from '@/lib/admin-i18n';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale, setLocale, t } = useAdminI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const querySlug = searchParams.get('slug') || searchParams.get('tenant') || '';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || t.login.invalidCredentials);
        return;
      }
      router.replace('/admin');
    } catch {
      setError(t.login.networkError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
      {/* Top language toggle */}
      <div className="absolute top-4 right-4 flex items-center bg-white border border-gray-200 rounded-lg p-0.5 text-xs font-bold shadow-xs">
        <button
          type="button"
          onClick={() => setLocale('tr')}
          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
            locale === 'tr'
              ? 'bg-blue-600 text-white font-extrabold shadow-2xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          TR
        </button>
        <button
          type="button"
          onClick={() => setLocale('en')}
          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
            locale === 'en'
              ? 'bg-blue-600 text-white font-extrabold shadow-2xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          EN
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm border border-gray-100">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
            🍔
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-1 text-gray-800 text-center">{t.login.title}</h1>
        <p className="text-xs text-gray-500 mb-6 text-center">
          {querySlug ? `${querySlug} ${t.login.tenantSubtitle}` : t.login.defaultSubtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">{t.login.emailLabel}</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="admin@restaurant.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">{t.login.passwordLabel}</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer shadow-xs"
          >
            {loading ? t.login.signingInBtn : t.login.signInBtn}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
