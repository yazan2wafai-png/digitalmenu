import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const hostname = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  const hostWithoutPort = hostname.split(':')[0].toLowerCase();

  // Extract query params or custom headers
  const querySlug = url.searchParams.get('slug') || url.searchParams.get('tenant');
  const headerSlug = request.headers.get('x-tenant-slug');

  // If naked domain nfcmyplace.com or www.nfcmyplace.com and root path, redirect to landing page
  if (
    (hostWithoutPort === 'nfcmyplace.com' || hostWithoutPort === 'www.nfcmyplace.com') &&
    pathname === '/' &&
    !querySlug
  ) {
    return NextResponse.redirect('https://landing.nfcmyplace.com');
  }

  // Extract subdomain slug
  let slug = 'baltazar'; // default fallback for localhost

  if (querySlug) {
    slug = querySlug.toLowerCase();
  } else if (headerSlug) {
    slug = headerSlug.toLowerCase();
  } else if (
    hostWithoutPort.endsWith('.nfcmyplace.com') ||
    hostWithoutPort.endsWith('.localhost') ||
    hostWithoutPort.endsWith('.nfcmyplace.local')
  ) {
    const parts = hostWithoutPort.split('.');
    if (parts.length >= 2 && parts[0] !== 'www') {
      slug = parts[0];
    }
  } else if (
    hostWithoutPort !== 'localhost' &&
    hostWithoutPort !== '127.0.0.1' &&
    !hostWithoutPort.includes('vercel.app') &&
    !hostWithoutPort.includes('railway.app') &&
    hostWithoutPort.includes('.')
  ) {
    const parts = hostWithoutPort.split('.');
    if (parts[0] !== 'www') {
      slug = parts[0];
    }
  }

  // Set request headers for downstream Server Components / Routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-slug', slug);

  // 1. Admin routes handling
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;

    // If not authenticated and trying to access protected admin page (not /admin/login)
    if (!token && pathname !== '/admin/login') {
      const loginUrl = new URL('/admin/login', request.url);
      if (querySlug) {
        loginUrl.searchParams.set('slug', slug);
      }
      return NextResponse.redirect(loginUrl);
    }

    // If already authenticated and trying to access /admin/login, redirect to /admin
    if (token && pathname === '/admin/login') {
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    }

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    response.headers.set('x-tenant-slug', slug);
    return response;
  }

  // 2. Root path rewriting -> /[slug]
  if (pathname === '/') {
    const targetUrl = new URL(`/${slug}${url.search}`, request.url);
    const response = NextResponse.rewrite(targetUrl, {
      request: {
        headers: requestHeaders,
      },
    });
    response.headers.set('x-tenant-slug', slug);
    return response;
  }

  // 3. Subdomain category & table route rewrites (e.g. /category/123 -> /[slug]/category/123)
  if (pathname.startsWith('/category/') || pathname.startsWith('/t/')) {
    const targetUrl = new URL(`/${slug}${pathname}${url.search}`, request.url);
    const response = NextResponse.rewrite(targetUrl, {
      request: {
        headers: requestHeaders,
      },
    });
    response.headers.set('x-tenant-slug', slug);
    return response;
  }

  // 4. Passthrough for /[slug] routes
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set('x-tenant-slug', slug);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
