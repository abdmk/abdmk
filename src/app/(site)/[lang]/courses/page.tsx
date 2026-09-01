import type { Metadata } from 'next';
import Link from 'next/link';
import { SmartImage } from '@/components/media/SmartImage';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { courses as getCourses } from '@/lib/content/queries';
import type { Course, Lang } from '@/lib/content/types';
import { localePath, t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const tr = ui(lang);
  return {
    title: tr.courses.title,
    description: tr.courses.intro,
    alternates: {
      canonical: `/${lang}/courses`,
      languages: { ar: '/ar/courses', en: '/en/courses' },
    },
  };
}

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price);
}

function CourseCard({ course, lang }: { course: Course; lang: Lang }) {
  const tr = ui(lang);
  return (
    <Link
      href={localePath(lang, `/course/${course.slug}`)}
      className="card card-hover group flex h-full flex-col overflow-hidden p-2.5 sm:p-3"
    >
      <div
        className="media-zoom relative overflow-hidden rounded-[calc(var(--radius-card)-0.5rem)] bg-sunken"
        style={{ aspectRatio: '8 / 5' }}
      >
        <SmartImage
          src={course.cover.src}
          alt={t(course.cover.alt, lang)}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 34vw"
        />
      </div>
      <div className="flex flex-1 flex-col px-2.5 pb-2 pt-4 sm:px-3.5 sm:pt-5">
        <div className="flex flex-wrap gap-2">
          <span className="chip">{tr.courses.levels[course.level]}</span>
          <span className="chip numeric">{t(course.duration, lang)}</span>
          <span className="chip numeric">
            {course.totalLessons} {tr.courses.lesson}
          </span>
        </div>
        <h3 className="mt-3 text-h3">{t(course.title, lang)}</h3>
        <p className="mt-2 flex-1 max-w-prose text-small text-muted">
          {t(course.shortDescription, lang)}
        </p>
        <div className="mt-4">
          {course.pricing === 'free' ? (
            <span className="chip-solid bg-ink text-paper text-meta px-3 py-1">
              {tr.courses.free}
            </span>
          ) : (
            <span className="numeric text-h3 font-medium">
              {formatPrice(course.price, course.currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default async function Page({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const tr = ui(lang);
  const allCourses = (await getCourses()).filter((c) => c.published);

  return (
    <div className="shell pb-section pt-6 sm:pt-8">
      <PageHeader
        title={tr.courses.title}
        intro={tr.courses.intro}
        hues={['sky', 'lilac', 'mint']}
        meta={
          <span className="chip numeric">
            {allCourses.length} {tr.courses.title}
          </span>
        }
        className="mb-9 md:mb-12"
      />

      {allCourses.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {allCourses.map((course, i) => (
            <Reveal key={course.id} index={i % 3} className="h-full">
              <CourseCard course={course} lang={lang} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <p className="text-lead text-muted">{tr.courses.empty}</p>
        </div>
      )}
    </div>
  );
}
