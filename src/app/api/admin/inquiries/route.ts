import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query, update } from '@/lib/supabase';

export async function GET(request: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const limit = Number(searchParams.get('limit') || 50);
  const offset = Number(searchParams.get('offset') || 0);

  const filters: Record<string, string> = {};
  if (status && status !== 'all') filters.status = status;

  const items = await query({
    table: 'inquiries',
    select: '*',
    filters,
    order: { column: 'created_at', ascending: false },
    limit,
    offset,
  });

  return NextResponse.json(items);
}

export async function PATCH(request: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  if (!body?.id || !body?.status) {
    return NextResponse.json({ error: 'missing id or status' }, { status: 400 });
  }

  const ok = await update('inquiries', { id: body.id }, {
    status: body.status,
    notes: body.notes || null,
    updated_at: new Date().toISOString(),
  });

  return NextResponse.json({ ok });
}
