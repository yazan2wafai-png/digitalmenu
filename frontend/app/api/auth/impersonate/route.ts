import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/impersonate
 *
 * Consumes a short-lived token minted by
 * POST /super-admin/restaurants/:slug/impersonate (see backend) and sets
 * the exact same cookies a normal tenant-admin login would - so the rest
 * of the /admin app (which only ever checks the admin_token cookie) can't
 * tell the difference between a real login and a super-admin "login as"
 * action.
 *
 * This route is only ever reached by the browser being redirected to
 * https://{slug}.nfcmyplace.com/impersonate?token=... - it runs on
 * whatever subdomain it's requested from, so the admin_token cookie it
 * sets is scoped (host-only, same as the login route) to that tenant's
 * own subdomain, exactly matching how a real login on that subdomain
 * would set it.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { accessToken, restaurantSlug, email } = body as {
    accessToken?: string;
    restaurantSlug?: string;
    email?: string;
  };

  if (!accessToken || !restaurantSlug) {
    return NextResponse.json({ message: 'Missing token or restaurant slug' }, { status: 400 });
  }

  const response = NextResponse.json({ restaurantSlug, email });

  const cookieOpts = {
    path: '/',
    maxAge: 60 * 60 * 2, // matches the 2h expiry the backend signs the impersonation token with
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  };

  response.cookies.set('admin_token', accessToken, { ...cookieOpts, httpOnly: true });
  response.cookies.set('restaurant_slug', restaurantSlug, cookieOpts);
  response.cookies.set('admin_email', email ?? '', cookieOpts);

  return response;
}
