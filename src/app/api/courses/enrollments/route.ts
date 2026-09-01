import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createHmac } from 'node:crypto';
import { query } from '@/lib/supabase';
import { getCourse } from '@/lib/content/queries';
import { t } from '@/lib/i18n/config';

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

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const enrollments = await query<{
    id: string;
    course_slug: string;
    enrolled_at: string;
  }>({
    table: 'enrollments',
    select: 'id,course_slug,enrolled_at',
    filters: { user_id: userId },
    order: { column: 'enrolled_at', ascending: false },
  });

  const courses = await Promise.all(
    enrollments.map(async (enrollment) => {
      const course = await getCourse(enrollment.course_slug);
      const totalLessons = course
        ? course.sections.reduce((sum, s) => sum + s.lessons.length, 0)
        : 0;

      const progress = await query<{ lesson_id: string; completed: boolean }>({
        table: 'lesson_progress',
        select: 'lesson_id,completed',
        filters: { user_id: userId, course_slug: enrollment.course_slug },
      });

      const completedCount = progress.filter((p) => p.completed).length;

      return {
        enrollment,
        totalLessons,
        completedCount,
        courseTitle: course ? t(course.title, 'ar') + ' / ' + t(course.title, 'en') : enrollment.course_slug,
      };
    }),
  );

  return NextResponse.json({ courses });
}
