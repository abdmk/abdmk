import { NextResponse } from 'next/server';
import { SESSION_COOKIE, checkPassword, makeToken } from '@/lib/auth';

export async function POST(request: Request) {
  const { password } = (await request.json().catch(() => ({}))) as { password?: string };

  if (!checkPassword(password ?? '')) {
    // A uniform delay makes a wrong password indistinguishable from a slow one.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return NextResponse.json({ error: 'invalid password' }, { status: 401 });
  }

  const token = makeToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token.value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: token.maxAge,
  });
  return response;
}

/** Sign out. */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return response;
}
