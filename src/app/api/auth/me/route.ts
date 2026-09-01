import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createHmac } from 'node:crypto';
import { query } from '@/lib/supabase';

const USER_SECRET = process.env.USER_SESSION_SECRET || process.env.ADMIN_SECRET || 'dev-user-secret';

async function getUser(): Promise<{ id: string; name: string; email: string } | null> {
  const jar = await cookies();
  const token = jar.get('user_session')?.value;
  if (!token) return null;

  const parts = token.split(':');
  if (parts.length !== 3) return null;

  const [userId, expiresStr, sig] = parts;
  const payload = `${userId}:${expiresStr}`;
  const expected = createHmac('sha256', USER_SECRET).update(payload).digest('hex');
  if (sig !== expected) return null;
  if (Date.now() > Number(expiresStr)) return null;

  const users = await query<{ id: string; name: string; email: string }>({
    table: 'users',
    select: 'id,name,email',
    filters: { id: userId },
    limit: 1,
  });

  return users[0] || null;
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user });
}
