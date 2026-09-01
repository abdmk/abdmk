import { NextResponse } from 'next/server';
import { insert } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json({ error: 'name, email, and message are required' }, { status: 400 });
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 });
  }

  const inquiry = await insert<{ id: string }>('inquiries', {
    name: body.name,
    email: body.email,
    company: body.company || null,
    service_slug: body.serviceSlug || null,
    package_name: body.packageName || null,
    budget: body.budget || null,
    deadline: body.deadline || null,
    message: body.message,
    file_url: body.fileUrl || null,
    status: 'new',
  });

  return NextResponse.json({ ok: true, id: inquiry?.id || null });
}
