import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://digitalmenu-backend-production.up.railway.app';

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  let backendData: { accessToken?: string; user?: { id: string; email: string; role: string }; message?: string | string[] };
  let backendStatus: number;

  try {
    const backendRes = await fetch(`${BACKEND_URL}/super-admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    backendData = await backendRes.json();
    backendStatus = backendRes.status;
  } catch {
    return NextResponse.json({ message: 'Cannot reach backend server' }, { status: 503 });
  }

  if (backendStatus !== 200 || !backendData.accessToken) {
    const errorMsg = Array.isArray(backendData.message)
      ? backendData.message.join(', ')
      : backendData.message || 'Invalid credentials';
    return NextResponse.json(
      { message: errorMsg },
      { status: backendStatus || 401 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    user: backendData.user,
  });

  const cookieOpts = {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  };

  // httpOnly: JS cannot read — protects against XSS token theft
  response.cookies.set('super_admin_token', backendData.accessToken, { ...cookieOpts, httpOnly: true });
  // Non-httpOnly: client components can use for user identity display
  if (backendData.user?.email) {
    response.cookies.set('super_admin_email', backendData.user.email, cookieOpts);
  }
  if (backendData.user?.role) {
    response.cookies.set('super_admin_role', backendData.user.role, cookieOpts);
  }

  return response;
}
