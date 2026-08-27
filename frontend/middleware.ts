import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const hostname = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  const hostWithoutPort = hostname.split(':')[0].toLowerCase();

  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'nfcmyplace.com').toLowerCase();
  const landingUrl = process.env.NEXT_PUBLIC_LANDING_URL || `https://${rootDomain}`;

  // 1. Explicit query parameter or custom header overrides (for dev testing & explicit routing)
  const querySlug = url.searchParams.get('slug') || url.searchParams.get('tenant');
  const headerSlug = request.headers.get('x-tenant-slug');

  // 2. Check if request is targeting the Super Admin hostname
  const isAdminHost =
    hostWithoutPort === `admin.${rootDomain}` ||
    hostWithoutPort === 'admin.localhost' ||
    hostWithoutPort === 'admin.nfcmyplace.local' ||
    hostWithoutPort.startsWith('admin.');

  if (isAdminHost) {
    const superAdminToken = request.cookies.get('super_admin_token')?.value;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-tenant-slug', 'super-admin');

    // Root / -> /super-admin
    if (pathname === '/') {
      if (!superAdminToken) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      const response = NextResponse.rewrite(new URL('/super-admin', request.url), {
        request: {
          headers: requestHeaders,
        },
      });
      response.headers.set('x-tenant-slug', 'super-admin');
      return response;
    }

    // /login -> /super-admin/login
    if (pathname === '/login') {
      if (superAdminToken) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      const response = NextResponse.rewrite(new URL('/super-admin/login', request.url), {
        request: {
          headers: requestHeaders,
        },
      });
      response.headers.set('x-tenant-slug', 'super-admin');
      return response;
    }

    // /super-admin and /super-admin/* routes
    if (pathname.startsWith('/super-admin')) {
      if (!superAdminToken && pathname !== '/super-admin/login') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      if (superAdminToken && pathname === '/super-admin/login') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      response.headers.set('x-tenant-slug', 'super-admin');
      return response;
    }

    // Any other routes on admin host -> redirect to /login if unauthenticated
    if (!superAdminToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    response.headers.set('x-tenant-slug', 'super-admin');
    return response;
  }

  // 3. Extract tenant subdomain slug (strictly from subdomain or explicit query/header)
  let tenantSlug: string | null = null;

  if (querySlug) {
    tenantSlug = querySlug.toLowerCase();
  } else if (headerSlug) {
    tenantSlug = headerSlug.toLowerCase();
  } else if (
    hostWithoutPort.endsWith(`.${rootDomain}`) &&
    hostWithoutPort !== rootDomain &&
    hostWithoutPort !== `www.${rootDomain}`
  ) {
    const sub = hostWithoutPort.slice(0, -(rootDomain.length + 1));
    if (sub && sub !== 'www' && sub !== 'admin') {
      tenantSlug = sub;
    }
  } else if (
    hostWithoutPort.endsWith('.localhost') &&
    hostWithoutPort !== 'localhost'
  ) {
    const sub = hostWithoutPort.slice(0, -('.localhost'.length));
    if (sub && sub !== 'www' && sub !== 'admin') {
      tenantSlug = sub;
    }
  } else if (
    hostWithoutPort.endsWith('.nfcmyplace.local') &&
    hostWithoutPort !== 'nfcmyplace.local'
  ) {
    const sub = hostWithoutPort.slice(0, -('.nfcmyplace.local'.length));
    if (sub && sub !== 'www' && sub !== 'admin') {
      tenantSlug = sub;
    }
  } else if (
    hostWithoutPort !== 'localhost' &&
    hostWithoutPort !== '127.0.0.1' &&
    !hostWithoutPort.includes('vercel.app') &&
    !hostWithoutPort.includes('railway.app') &&
    hostWithoutPort.includes('.')
  ) {
    const parts = hostWithoutPort.split('.');
    if (parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'admin') {
      tenantSlug = parts[0];
    }
  }

  // 4. If request is on Root Domain (no tenant slug determined)
  if (!tenantSlug) {
    // If naked domain nfcmyplace.com or www.nfcmyplace.com and root path, redirect to distinct landing page if configured
    if (
      (hostWithoutPort === rootDomain || hostWithoutPort === `www.${rootDomain}`) &&
      pathname === '/'
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

    // Handle SuperAdmin routes directly accessed on root domain
    if (pathname.startsWith('/super-admin')) {
      const superAdminToken = request.cookies.get('super_admin_token')?.value;
      if (!superAdminToken && pathname !== '/super-admin/login') {
        return NextResponse.redirect(new URL('/super-admin/login', request.url));
      }
      if (superAdminToken && pathname === '/super-admin/login') {
        return NextResponse.redirect(new URL('/super-admin', request.url));
      }
      return NextResponse.next();
    }

    // Handle Tenant Admin routes directly accessed on root domain
    if (pathname.startsWith('/admin')) {
      const token = request.cookies.get('admin_token')?.value;
      if (!token && pathname !== '/admin/login') {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
      if (token && pathname === '/admin/login') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // Pass through to root route / or direct /[slug] routes without hardcoded rewrites
    return NextResponse.next();
  }

  // 5. Tenant Subdomain Request (or ?slug= override)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-slug', tenantSlug);

  // 5.1 SuperAdmin routes handling on tenant domain
  if (pathname.startsWith('/super-admin')) {
    const superAdminToken = request.cookies.get('super_admin_token')?.value;
    if (!superAdminToken && pathname !== '/super-admin/login') {
      return NextResponse.redirect(new URL('/super-admin/login', request.url));
    }
    if (superAdminToken && pathname === '/super-admin/login') {
      return NextResponse.redirect(new URL('/super-admin', request.url));
    }
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 5.2 Tenant Admin routes handling
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;
    if (!token && pathname !== '/admin/login') {
      const loginUrl = new URL('/admin/login', request.url);
      if (querySlug) {
        loginUrl.searchParams.set('slug', tenantSlug);
      }
      return NextResponse.redirect(loginUrl);
    }
    if (token && pathname === '/admin/login') {
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    }
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    response.headers.set('x-tenant-slug', tenantSlug);
    return response;
  }

  // 5.3 Root path rewriting -> /[slug]
  if (pathname === '/') {
    const targetUrl = new URL(`/${tenantSlug}${url.search}`, request.url);
    const response = NextResponse.rewrite(targetUrl, {
      request: {
        headers: requestHeaders,
      },
    });
    response.headers.set('x-tenant-slug', tenantSlug);
    return response;
  }

  // 5.4 Subdomain category & table route rewrites (e.g. /category/123 -> /[slug]/category/123)
  if (pathname.startsWith('/category/') || pathname.startsWith('/t/')) {
    const targetUrl = new URL(`/${tenantSlug}${pathname}${url.search}`, request.url);
    const response = NextResponse.rewrite(targetUrl, {
      request: {
        headers: requestHeaders,
      },
    });
    response.headers.set('x-tenant-slug', tenantSlug);
    return response;
  }

  // 5.5 Passthrough for other routes with tenant headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set('x-tenant-slug', tenantSlug);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
