import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  const body = await request.json();

  let backendData: { access_token?: string; restaurantSlug?: string; email?: string; message?: string };
  let backendStatus: number;

  try {
    const backendRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    backendData = await backendRes.json();
    backendStatus = backendRes.status;
  } catch {
    return NextResponse.json({ message: 'Cannot reach backend server' }, { status: 503 });
  }

  if (backendStatus !== 200 || !backendData.access_token) {
    return NextResponse.json(
      { message: backendData.message || 'Invalid credentials' },
      { status: backendStatus },
    );
  }

  const response = NextResponse.json({
    restaurantSlug: backendData.restaurantSlug,
    email: backendData.email,
  });

  const cookieOpts = {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  };

  // httpOnly: JS cannot read — protects against XSS token theft
  response.cookies.set('admin_token', backendData.access_token, { ...cookieOpts, httpOnly: true });
  // Non-httpOnly: client components need these for display
  response.cookies.set('restaurant_slug', backendData.restaurantSlug!, cookieOpts);
  response.cookies.set('admin_email', backendData.email!, cookieOpts);

  return response;
}
