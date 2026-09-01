import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createHmac } from 'node:crypto';
import { query, insert } from '@/lib/supabase';

const USER_SECRET =
  process.env.USER_SESSION_SECRET || process.env.ADMIN_SECRET || 'dev-user-secret';

async function getUserId(): Promise<string | null> {
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

  return userId;
}

export async function GET(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const courseSlug = searchParams.get('course');
  if (!courseSlug) {
    return NextResponse.json({ error: 'course parameter required' }, { status: 400 });
  }

  const progress = await query<{
    id: string;
    lesson_id: string;
    completed: boolean;
    completed_at: string | null;
  }>({
    table: 'lesson_progress',
    select: 'id,lesson_id,completed,completed_at',
    filters: { user_id: userId, course_slug: courseSlug },
  });

  return NextResponse.json({ progress });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.courseSlug || !body?.lessonId) {
    return NextResponse.json({ error: 'courseSlug and lessonId required' }, { status: 400 });
  }

  // Verify enrollment
  const enrollments = await query({
    table: 'enrollments',
    filters: { user_id: userId, course_slug: body.courseSlug },
    limit: 1,
  });

  if (enrollments.length === 0) {
    return NextResponse.json({ error: 'not enrolled' }, { status: 403 });
  }

  // Check if already completed
  const existing = await query({
    table: 'lesson_progress',
    filters: {
      user_id: userId,
      course_slug: body.courseSlug,
      lesson_id: body.lessonId,
    },
    limit: 1,
  });

  if (existing.length > 0) {
    return NextResponse.json({ ok: true, alreadyCompleted: true });
  }

  const result = await insert('lesson_progress', {
    user_id: userId,
    course_slug: body.courseSlug,
    lesson_id: body.lessonId,
    completed: true,
    completed_at: new Date().toISOString(),
  });

  if (!result) {
    return NextResponse.json({ error: 'could not save progress' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
