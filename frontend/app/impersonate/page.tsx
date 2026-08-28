'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Lands here when a super-admin clicks "Login as" on a tenant from the
 * super-admin panel: https://{slug}.nfcmyplace.com/impersonate?token=...
 *
 * Deliberately NOT under /admin - the /admin/* middleware guard requires
 * an admin_token cookie to already exist (redirecting anything without one
 * to /admin/login), which is exactly the cookie this page is here to set.
 * Living at the app root instead just passes through normally for any
 * tenant subdomain, no admin_token needed yet.
 */
function ImpersonateInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const slug = searchParams.get('slug');
    const email = searchParams.get('email') ?? '';

    if (!token || !slug) {
      setError('Missing impersonation token');
      return;
    }

    fetch('/api/auth/impersonate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken: token, restaurantSlug: slug, email }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Impersonation failed');
        router.replace('/admin');
      })
      .catch(() => setError('Could not sign in as this restaurant'));
  }, [router, searchParams]);

  return error ? <p className="text-red-400">{error}</p> : <p>Signing in…</p>;
}

// useSearchParams() bails out of static prerendering unless the component
// using it is wrapped in Suspense - without this, `next build` fails to
// prerender this route entirely (see the Next.js "missing-suspense-with-
// csr-bailout" error) and the whole deploy is rejected.
export default function ImpersonatePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white/60 text-sm">
      <Suspense fallback={<p>Signing in…</p>}>
        <ImpersonateInner />
      </Suspense>
    </div>
  );
}
