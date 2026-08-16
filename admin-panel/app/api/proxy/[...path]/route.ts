import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

type Params = { path: string[] };

async function proxy(request: NextRequest, params: Params, method: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  const pathStr = params.path.join('/');
  const { search } = new URL(request.url);
  const backendUrl = `${BACKEND_URL}/${pathStr}${search}`;

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let body: BodyInit | undefined;
  const contentType = request.headers.get('content-type') ?? '';

  if (method !== 'GET' && method !== 'DELETE') {
    if (contentType.includes('multipart/form-data')) {
      body = await request.formData();
      // Do NOT set Content-Type — let fetch set it with boundary
    } else if (contentType.includes('application/json')) {
      headers['Content-Type'] = 'application/json';
      body = await request.text();
    }
  }

  const res = await fetch(backendUrl, { method, headers, body });
  const text = await res.text();

  let data: unknown;
  try { data = JSON.parse(text); } catch { data = { message: text }; }

  return NextResponse.json(data, { status: res.status });
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
export async function DELETE(req: NextRequest, { params }: { params: Promise<Params> }) {
  return proxy(req, await params, 'DELETE');
}
