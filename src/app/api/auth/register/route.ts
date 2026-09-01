import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { insert, query } from '@/lib/supabase';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.password || !body?.name) {
    return NextResponse.json({ error: 'name, email, and password required' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 });
  }

  if (body.password.length < 8) {
    return NextResponse.json({ error: 'password must be at least 8 characters' }, { status: 400 });
  }

  // Check if email already exists
  const existing = await query({ table: 'users', filters: { email: body.email }, limit: 1 });
  if (existing.length > 0) {
    return NextResponse.json({ error: 'email already registered' }, { status: 409 });
  }

  const user = await insert('users', {
    email: body.email.toLowerCase().trim(),
    name: body.name.trim(),
    password_hash: hashPassword(body.password),
  });

  if (!user) {
    return NextResponse.json({ error: 'could not create account' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
