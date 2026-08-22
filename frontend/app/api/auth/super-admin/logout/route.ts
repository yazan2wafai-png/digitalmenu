import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('super_admin_token');
  response.cookies.delete('super_admin_email');
  response.cookies.delete('super_admin_role');
  return response;
}
