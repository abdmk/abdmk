import { NextResponse } from 'next/server';
import { createHash, createHmac } from 'node:crypto';
import { cookies } from 'next/headers';
import { query } from '@/lib/supabase';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

const USER_SECRET = process.env.USER_SESSION_SECRET || process.env.ADMIN_SECRET || 'dev-user-secret';
const TWELVE_HOURS = 12 * 60 * 60 * 1000;

function makeUserToken(userId: string): string {
  const expires = Date.now() + TWELVE_HOURS;
  const payload = `${userId}:${expires}`;
  const sig = createHmac('sha256', USER_SECRET).update(payload).digest('hex');
  return `${payload}:${sig}`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: 'email and password required' }, { status: 400 });
  }

  const users = await query<{ id: string; email: string; name: string; password_hash: string }>({
    table: 'users',
    filters: { email: body.email.toLowerCase().trim() },
    limit: 1,
  });

  if (users.length === 0 || users[0].password_hash !== hashPassword(body.password)) {
    // Uniform delay to prevent timing attacks
    await new Promise(r => setTimeout(r, 600));
    return NextResponse.json({ error: 'invalid credentials' }, { status: 401 });
  }

  const user = users[0];
  const token = makeUserToken(user.id);

  const jar = await cookies();
  jar.set('user_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TWELVE_HOURS / 1000,
  });

  return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete('user_session');
  return NextResponse.json({ ok: true });
}
