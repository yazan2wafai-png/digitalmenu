import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://digitalmenu-backend-production.up.railway.app';

type Params = { path: string[] };
async function proxy(request: NextRequest, params: Params, method: string) {
  const cookieStore = await cookies();
  const superAdminToken = cookieStore.get('super_admin_token')?.value;
  const adminToken = cookieStore.get('admin_token')?.value;
  const authHeader = request.headers.get('authorization');

  // Prioritize request Authorization header, then super_admin_token (for super-admin routes or general), then admin_token
  const isSuperAdminRoute = params.path[0] === 'super-admin';
  const token = authHeader?.replace(/^Bearer\s+/i, '') || (isSuperAdminRoute ? (superAdminToken || adminToken) : (adminToken || superAdminToken));

  const pathStr = params.path.join('/');
  const { search } = new URL(request.url);
  const backendUrl = `${BACKEND_URL}/${pathStr}${search}`;

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let body: BodyInit | undefined;
  const contentType = request.headers.get('content-type') ?? '';

  if (method !== 'GET' && method !== 'DELETE') {
    if (contentType.includes('multipart/form-data')) {
      const incomingFormData = await request.formData();
      const outgoingFormData = new FormData();
      for (const [key, value] of incomingFormData.entries()) {
        if (value && typeof value === 'object' && 'arrayBuffer' in value) {
          const file = value as unknown as File;
          const buffer = await file.arrayBuffer();
          const blob = new Blob([buffer], { type: file.type || 'application/octet-stream' });
          outgoingFormData.append(key, blob, file.name || 'upload.jpg');
        } else {
          outgoingFormData.append(key, value as string);
        }
      }
      body = outgoingFormData;
      // Do NOT set Content-Type header — fetch sets multipart boundary automatically
    } else if (contentType.includes('application/json')) {
      headers['Content-Type'] = 'application/json';
      body = await request.text();
    } else {
      body = await request.text();
    }
  }

  try {
    // Never cache: admin/tenant data must always reflect the live DB,
    // never a stale Next.js fetch cache.
    const res = await fetch(backendUrl, { method, headers, body, cache: 'no-store' });
    const resContentType = res.headers.get('content-type') || '';
    if (resContentType.startsWith('image/')) {
      const buffer = await res.arrayBuffer();
      return new NextResponse(buffer, {
        status: res.status,
        headers: {
          'Content-Type': resContentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Proxy backend connection error';
    return NextResponse.json({ message }, { status: 502 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<Params> }) {
  return proxy(req, await params, 'GET');
}
export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
  return proxy(req, await params, 'POST');
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<Params> }) {
  return proxy(req, await params, 'PATCH');
}
export async function PUT(req: NextRequest, { params }: { params: Promise<Params> }) {
  return proxy(req, await params, 'PUT');
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<Params> }) {
  return proxy(req, await params, 'DELETE');
}
