import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || request.headers.get('x-forwarded-host') || '';

  // Exclude static assets, api routes, next internal files
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.') ||
    url.pathname.startsWith('/baltazar') || 
    url.pathname.startsWith('/kahve-erenkoy')
  ) {
    return NextResponse.next();
  }

  // Extract subdomain
  let slug = 'kahve-erenkoy'; // default fallback
  
  const hostParts = hostname.split('.');
  
  if (
    hostParts.length >= 2 && 
    !hostname.startsWith('www') && 
    !hostname.startsWith('localhost') && 
    !hostname.includes('vercel.app') &&
    !hostname.includes('railway.app')
  ) {
    slug = hostParts[0];
  }
  
  if (hostname.includes('baltazar.localhost') || hostname.includes('baltazar.nfcmyplace')) {
    slug = 'baltazar';
  } else if (hostname.includes('kahve-erenkoy.localhost') || hostname.includes('kahve-erenkoy.nfcmyplace')) {
    slug = 'kahve-erenkoy';
  }

  // Rewrite to dynamic route
  const targetUrl = new URL(`/${slug}${url.pathname === '/' ? '' : url.pathname}`, request.url);
  return NextResponse.rewrite(targetUrl);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
