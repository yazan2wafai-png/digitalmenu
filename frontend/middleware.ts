import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const hostname = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  const hostWithoutPort = hostname.split(':')[0].toLowerCase();

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'nfcmyplace.com';
  const landingUrl = process.env.NEXT_PUBLIC_LANDING_URL || `https://${rootDomain}`;

  // Extract query params or custom headers
  const querySlug = url.searchParams.get('slug') || url.searchParams.get('tenant');
  const headerSlug = request.headers.get('x-tenant-slug');

  // If naked domain nfcmyplace.com or www.nfcmyplace.com and root path, redirect to landing page if on a distinct host
  if (
    (hostWithoutPort === rootDomain || hostWithoutPort === `www.${rootDomain}`) &&
    pathname === '/' &&
    !querySlug
  ) {
    try {
      const parsedLanding = new URL(landingUrl);
      if (parsedLanding.hostname !== hostWithoutPort) {
        return NextResponse.redirect(landingUrl);
      }
    } catch {
      // Passthrough if invalid URL
    }
  }

  // Extract subdomain slug
  let slug = 'baltazar'; // default fallback for localhost

  if (querySlug) {
    slug = querySlug.toLowerCase();
  } else if (headerSlug) {
    slug = headerSlug.toLowerCase();
  } else if (
    hostWithoutPort.endsWith(`.${rootDomain}`) ||
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

  // 1. SuperAdmin routes handling
  if (pathname.startsWith('/super-admin')) {
    const superAdminToken = request.cookies.get('super_admin_token')?.value;

    // If not authenticated and trying to access protected super-admin page (not /super-admin/login)
    if (!superAdminToken && pathname !== '/super-admin/login') {
      const loginUrl = new URL('/super-admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // If already authenticated and trying to access /super-admin/login, redirect to /super-admin
    if (superAdminToken && pathname === '/super-admin/login') {
      const superAdminUrl = new URL('/super-admin', request.url);
      return NextResponse.redirect(superAdminUrl);
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 2. Admin routes handling
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
