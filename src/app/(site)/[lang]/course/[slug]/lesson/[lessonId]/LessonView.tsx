'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/icons';
import type { Lang } from '@/lib/content/types';
import { localePath } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';
import { cn } from '@/lib/utils';

interface LessonData {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  videoSource: 'upload' | 'youtube';
  notes: string;
  freePreview: boolean;
  resources: {
    id: string;
    name: string;
    description: string;
    type: string;
    url: string;
    external: boolean;
  }[];
}

interface SectionData {
  id: string;
  title: string;
  lessons: {
    id: string;
    title: string;
    freePreview: boolean;
    duration: number;
  }[];
}

interface NavLesson {
  id: string;
  title: string;
}

function formatDuration(seconds: number): string {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/,
  );
  return match ? match[1] : null;
}

export function LessonView({
  lang,
  courseSlug,
  courseTitle,
  lesson,
  sections,
  prevLesson,
  nextLesson,
  isCompleted: initialCompleted,
  completedLessonIds,
  isEnrolled,
}: {
  lang: Lang;
  courseSlug: string;
  courseTitle: string;
  lesson: LessonData;
  sections: SectionData[];
  prevLesson: NavLesson | null;
  nextLesson: NavLesson | null;
  isCompleted: boolean;
  completedLessonIds: string[];
  isEnrolled: boolean;
}) {
  const tr = ui(lang);
  const [completed, setCompleted] = useState(initialCompleted);
  const [marking, setMarking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function markComplete() {
    setMarking(true);
    try {
      const res = await fetch('/api/courses/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug, lessonId: lesson.id }),
      });
      if (res.ok) setCompleted(true);
    } catch {
      // best effort
    } finally {
      setMarking(false);
    }
  }

  const lessonUrl = (id: string) =>
    localePath(lang, `/course/${courseSlug}/lesson/${id}`);

  return (
    <div className="shell pb-section pt-6 sm:pt-8">
      {/* Top bar */}
      <div className="mb-5 flex items-center justify-between gap-4 lg:mb-6">
        <Link
          href={localePath(lang, `/course/${courseSlug}`)}
          className="chip transition-colors duration-300 hover:bg-ink hover:text-surface"
        >
          <Icon name="arrowLeft" size={13} flipRtl />
          {courseTitle}
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="chip lg:hidden"
        >
          {tr.courses.curriculum}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
        {/* Main content */}
        <div className="space-y-5 lg:col-span-8 lg:space-y-6">
          {/* Video player */}
          <div className="card overflow-hidden">
            <div className="relative w-full bg-black" style={{ aspectRatio: '16 / 9' }}>
              {lesson.videoSource === 'youtube' ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(lesson.videoUrl) || ''}?rel=0`}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <video
                  src={lesson.videoUrl}
                  controls
                  playsInline
                  className="absolute inset-0 h-full w-full"
                >
                  <track kind="captions" />
                </video>
              )}
            </div>
          </div>

          {/* Lesson header + mark complete */}
          <div className="card p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="text-h1">{lesson.title}</h1>
                {lesson.description && (
                  <p className="mt-3 max-w-prose text-lead text-muted">
                    {lesson.description}
                  </p>
                )}
              </div>
              {isEnrolled && (
                <div className="shrink-0">
                  {completed ? (
                    <span className="chip bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300">
                      <Icon name="check" size={14} />
                      {tr.courses.completed}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={markComplete}
                      disabled={marking}
                      className="btn btn-primary"
                    >
                      {marking ? tr.common.loading : tr.courses.markComplete}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Lesson notes */}
          {lesson.notes && (
            <section className="card p-6 sm:p-8">
              <h2 className="text-h2">{tr.courses.lessonNotes}</h2>
              <div className="prose-custom mt-5 max-w-none text-small text-muted whitespace-pre-wrap">
                {lesson.notes}
              </div>
            </section>
          )}

          {/* Resources */}
          {lesson.resources.length > 0 && (
            <section className="card p-6 sm:p-8">
              <h2 className="text-h2">{tr.courses.lessonResources}</h2>
              <ul className="mt-5 list-none space-y-2 p-0">
                {lesson.resources.map((r) => (
                  <li key={r.id}>
                    <a
                      href={r.url}
                      target={r.external ? '_blank' : undefined}
                      rel={r.external ? 'noopener noreferrer' : undefined}
                      className="flex items-center justify-between gap-4 rounded-xl2 bg-sunken px-4 py-3.5 text-small transition-colors duration-300 hover:bg-ink hover:text-surface"
                    >
                      <div className="min-w-0">
                        <span className="font-medium">{r.name}</span>
                        {r.description && (
                          <span className="ms-2 text-muted">{r.description}</span>
                        )}
                      </div>
                      <span className="chip shrink-0 text-meta">{r.type}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Prev / Next navigation */}
          <div className="grid gap-3 sm:grid-cols-2">
            {prevLesson ? (
              <Link
                href={lessonUrl(prevLesson.id)}
                className="card card-hover flex items-center gap-3 p-5"
              >
                <Icon name="arrowLeft" size={16} flipRtl className="shrink-0 text-muted" />
                <div className="min-w-0">
                  <span className="label mb-1 block">{tr.courses.previousLesson}</span>
                  <span className="text-small truncate block">{prevLesson.title}</span>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextLesson ? (
              <Link
                href={lessonUrl(nextLesson.id)}
                className="card card-hover flex items-center justify-end gap-3 p-5 text-end"
              >
                <div className="min-w-0">
                  <span className="label mb-1 block">{tr.courses.nextLesson}</span>
                  <span className="text-small truncate block">{nextLesson.title}</span>
                </div>
                <Icon name="arrowRight" size={16} flipRtl className="shrink-0 text-muted" />
              </Link>
            ) : null}
          </div>
        </div>

        {/* Sidebar / Curriculum */}
        <aside
          className={cn(
            'lg:col-span-4',
            // Mobile: off-canvas overlay
            sidebarOpen
              ? 'fixed inset-0 z-50 overflow-y-auto bg-surface p-5 lg:static lg:p-0'
              : 'hidden lg:block',
          )}
        >
          {sidebarOpen && (
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <h2 className="text-h3">{tr.courses.curriculum}</h2>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="chip"
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          )}

          <div className="card sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto p-5 sm:p-6">
            <h2 className="text-h3 mb-4 hidden lg:block">{tr.courses.curriculum}</h2>
            <nav className="space-y-4">
              {sections.map((section) => (
                <div key={section.id}>
                  <h3 className="label mb-2">{section.title}</h3>
                  <ol className="list-none space-y-1 p-0">
                    {section.lessons.map((sl) => {
                      const isCurrent = sl.id === lesson.id;
                      const isDone = completedLessonIds.includes(sl.id);
                      const canAccess = sl.freePreview || isEnrolled;

                      return (
                        <li key={sl.id}>
                          {canAccess ? (
                            <Link
                              href={lessonUrl(sl.id)}
                              className={cn(
                                'flex items-center gap-2 rounded-xl2 px-3 py-2.5 text-small transition-colors duration-200',
                                isCurrent
                                  ? 'bg-ink text-surface'
                                  : 'hover:bg-sunken',
                              )}
                            >
                              {isDone ? (
                                <Icon name="check" size={12} className="shrink-0 text-green-500" />
                              ) : (
                                <Icon name="play" size={12} className="shrink-0 text-muted" />
                              )}
                              <span className="min-w-0 flex-1 truncate">{sl.title}</span>
                              {sl.duration > 0 && (
                                <span className="numeric shrink-0 text-meta text-faint">
                                  {formatDuration(sl.duration)}
                                </span>
                              )}
                            </Link>
                          ) : (
                            <span className="flex items-center gap-2 rounded-xl2 px-3 py-2.5 text-small text-muted">
                              <Icon name="lock" size={12} className="shrink-0" />
                              <span className="min-w-0 flex-1 truncate">{sl.title}</span>
                              {sl.duration > 0 && (
                                <span className="numeric shrink-0 text-meta text-faint">
                                  {formatDuration(sl.duration)}
                                </span>
                              )}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
