import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { createHmac } from 'node:crypto';
import { getCourse } from '@/lib/content/queries';
import { query } from '@/lib/supabase';
import type { Lang, Lesson } from '@/lib/content/types';
import { localePath, t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';
import { LessonView } from './LessonView';

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

function findLesson(
  course: Awaited<ReturnType<typeof getCourse>>,
  lessonId: string,
): { lesson: Lesson; sectionIndex: number; lessonIndex: number } | null {
  if (!course) return null;
  for (let si = 0; si < course.sections.length; si++) {
    const section = course.sections[si];
    for (let li = 0; li < section.lessons.length; li++) {
      if (section.lessons[li].id === lessonId) {
        return { lesson: section.lessons[li], sectionIndex: si, lessonIndex: li };
      }
    }
  }
  return null;
}

/** Flatten all lessons in section/lesson order. */
function flatLessons(course: NonNullable<Awaited<ReturnType<typeof getCourse>>>) {
  return [...course.sections]
    .sort((a, b) => a.order - b.order)
    .flatMap((s) => [...s.lessons].sort((a, b) => a.order - b.order));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang; slug: string; lessonId: string }>;
}): Promise<Metadata> {
  const { lang, slug, lessonId } = await params;
  const course = await getCourse(slug);
  if (!course) return {};
  const found = findLesson(course, lessonId);
  if (!found) return {};

  const title = t(found.lesson.title, lang);
  return {
    title: `${title} — ${t(course.title, lang)}`,
    alternates: {
      canonical: `/${lang}/course/${slug}/lesson/${lessonId}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Lang; slug: string; lessonId: string }>;
}) {
  const { lang, slug, lessonId } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const found = findLesson(course, lessonId);
  if (!found) notFound();

  const { lesson } = found;
  const tr = ui(lang);

  // Determine access
  const userId = await getUserId();
  let isEnrolled = false;

  if (userId) {
    const enrollments = await query({
      table: 'enrollments',
      filters: { user_id: userId, course_slug: slug },
      limit: 1,
    });
    isEnrolled = enrollments.length > 0;
  }

  const hasAccess = lesson.freePreview || isEnrolled;

  // If no access, show enrollment prompt
  if (!hasAccess) {
    return (
      <div className="shell pb-section pt-6 sm:pt-8">
        <div className="card mx-auto max-w-lg p-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sunken">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-h2">{t(lesson.title, lang)}</h1>
          <p className="mt-3 text-lead text-muted">{tr.courses.enrollFirst}</p>
          <a
            href={localePath(lang, `/course/${slug}`)}
            className="btn btn-primary mt-6 inline-flex"
          >
            {tr.courses.enroll}
          </a>
        </div>
      </div>
    );
  }

  // Build ordered flat list for prev/next navigation
  const allLessons = flatLessons(course);
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Fetch completion status
  let completedLessonIds: string[] = [];
  if (userId) {
    const progress = await query<{ lesson_id: string; completed: boolean }>({
      table: 'lesson_progress',
      select: 'lesson_id,completed',
      filters: { user_id: userId, course_slug: slug },
    });
    completedLessonIds = progress.filter((p) => p.completed).map((p) => p.lesson_id);
  }

  const isCompleted = completedLessonIds.includes(lessonId);

  // Build curriculum for sidebar
  const sortedSections = [...course.sections].sort((a, b) => a.order - b.order);

  return (
    <LessonView
      lang={lang}
      courseSlug={slug}
      courseTitle={t(course.title, lang)}
      lesson={{
        id: lesson.id,
        title: t(lesson.title, lang),
        description: t(lesson.description, lang),
        videoUrl: lesson.videoUrl,
        videoSource: lesson.videoSource,
        notes: t(lesson.notes, lang),
        freePreview: lesson.freePreview,
        resources: lesson.resources.map((r) => ({
          id: r.id,
          name: t(r.name, lang),
          description: t(r.description, lang),
          type: r.type,
          url: r.url,
          external: r.external,
        })),
      }}
      sections={sortedSections.map((s) => ({
        id: s.id,
        title: t(s.title, lang),
        lessons: [...s.lessons].sort((a, b) => a.order - b.order).map((l) => ({
          id: l.id,
          title: t(l.title, lang),
          freePreview: l.freePreview,
          duration: l.videoDuration,
        })),
      }))}
      prevLesson={
        prevLesson
          ? { id: prevLesson.id, title: t(prevLesson.title, lang) }
          : null
      }
      nextLesson={
        nextLesson
          ? { id: nextLesson.id, title: t(nextLesson.title, lang) }
          : null
      }
      isCompleted={isCompleted}
      completedLessonIds={completedLessonIds}
      isEnrolled={isEnrolled}
    />
  );
}
