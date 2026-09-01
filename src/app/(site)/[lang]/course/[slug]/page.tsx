import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Faq } from '@/components/home/Faq';
import { Icon } from '@/components/icons';
import { SmartImage } from '@/components/media/SmartImage';
import { BloomField } from '@/components/ui/Bloom';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { courses as getCourses, getCourse } from '@/lib/content/queries';
import type { Course, Lang } from '@/lib/content/types';
import { LANGS, localePath, t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';

export async function generateStaticParams() {
  const list = await getCourses();
  return LANGS.flatMap((lang) => list.map((c) => ({ lang, slug: c.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const course = await getCourse(slug);
  if (!course) return {};
  const title = t(course.seoTitle, lang) || t(course.title, lang);
  const description = t(course.metaDescription, lang) || t(course.shortDescription, lang);
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/course/${slug}`,
      languages: { ar: `/ar/course/${slug}`, en: `/en/course/${slug}` },
    },
    openGraph: { title, description, images: [{ url: course.cover.src }] },
  };
}

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price);
}

function formatDuration(seconds: number): string {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Lang; slug: string }>;
}) {
  const { lang, slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const tr = ui(lang);
  const allCourses = await getCourses();
  const related = course.relatedCourses
    .map((id) => allCourses.find((c) => c.slug === id || c.id === id))
    .filter(Boolean) as Course[];

  const sortedSections = [...course.sections].sort((a, b) => a.order - b.order);

  return (
    <article className="shell pb-section pt-6 sm:pt-8">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: t(course.title, lang),
            description: t(course.shortDescription, lang),
            provider: {
              '@type': 'Person',
              name: t(course.instructor, lang),
            },
            ...(course.pricing === 'paid'
              ? {
                  offers: {
                    '@type': 'Offer',
                    price: course.price,
                    priceCurrency: course.currency,
                  },
                }
              : { isAccessibleForFree: true }),
          }),
        }}
      />

      {/* Header */}
      <header className="card relative overflow-hidden p-6 sm:p-8 lg:p-12">
        <BloomField hues={['sky', 'lilac', 'mint']} />

        <div className="relative">
          <Link
            href={localePath(lang, '/courses')}
            className="chip transition-colors duration-300 hover:bg-ink hover:text-surface"
          >
            <Icon name="arrowLeft" size={13} flipRtl />
            {tr.courses.viewAllCourses}
          </Link>

          <div className="mt-7 grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <h1 className="text-h1">{t(course.title, lang)}</h1>
              <p className="mt-5 max-w-prose text-lead text-muted">
                {t(course.shortDescription, lang)}
              </p>
            </div>

            <div className="lg:col-span-5">
              <dl className="m-0 space-y-2">
                {[
                  { label: tr.courses.instructor, value: t(course.instructor, lang) },
                  { label: tr.courses.level, value: tr.courses.levels[course.level] },
                  { label: tr.courses.duration, value: t(course.duration, lang) },
                  { label: tr.courses.lessons, value: `${course.totalLessons} ${tr.courses.lesson}` },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-4 rounded-xl2 bg-sunken px-4 py-3"
                  >
                    <dt className="label mb-0">{row.label}</dt>
                    <dd className="text-small font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>

              {/* Pricing / enroll CTA */}
              <div className="mt-5 rounded-xl2 bg-sunken p-4 text-center">
                {course.pricing === 'free' ? (
                  <p className="text-h2 font-medium">{tr.courses.free}</p>
                ) : (
                  <p className="numeric text-h2 font-medium">
                    {formatPrice(course.price, course.currency)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cover */}
      <div className="mt-5 overflow-hidden rounded-card bg-sunken lg:mt-6">
        <SmartImage
          src={course.cover.src}
          alt={t(course.cover.alt, lang)}
          width={course.cover.width}
          height={course.cover.height}
          sizes="(max-width: 1024px) 100vw, 88vw"
          priority
          className="w-full"
        />
      </div>

      {/* Body grid */}
      <div className="mt-5 grid gap-5 lg:mt-6 lg:grid-cols-12 lg:gap-6">
        {/* Main column */}
        <div className="space-y-5 lg:col-span-7 lg:space-y-6">
          {/* Description */}
          <Reveal>
            <section className="card p-6 sm:p-8 lg:p-10">
              <h2 className="text-h2">{tr.courses.description}</h2>
              <p className="mt-5 max-w-prose text-lead text-muted">
                {t(course.fullDescription, lang)}
              </p>
            </section>
          </Reveal>

          {/* Learning outcomes */}
          {course.learningOutcomes.length > 0 && (
            <Reveal>
              <section className="card p-6 sm:p-8 lg:p-10">
                <h2 className="text-h2">{tr.courses.outcomes}</h2>
                <ul className="mt-6 list-none space-y-2 p-0">
                  {course.learningOutcomes.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-xl2 bg-sunken px-4 py-3.5"
                    >
                      <Icon name="check" size={14} className="mt-1 shrink-0 text-ink" />
                      <span className="text-small">{t(item, lang)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          )}

          {/* Requirements */}
          {course.requirements.length > 0 && (
            <Reveal>
              <section className="card p-6 sm:p-8 lg:p-10">
                <h2 className="text-h2">{tr.courses.requirements}</h2>
                <ul className="mt-6 list-none space-y-2 p-0">
                  {course.requirements.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-xl2 bg-sunken px-4 py-3.5 text-small"
                    >
                      <span className="numeric shrink-0 text-faint">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{t(item, lang)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          )}

          {/* Curriculum */}
          {sortedSections.length > 0 && (
            <Reveal>
              <section className="card p-6 sm:p-8 lg:p-10">
                <h2 className="text-h2">{tr.courses.curriculum}</h2>
                <div className="mt-6 space-y-4">
                  {sortedSections.map((section) => {
                    const sortedLessons = [...section.lessons].sort(
                      (a, b) => a.order - b.order,
                    );
                    return (
                      <div key={section.id}>
                        <h3 className="label mb-3">{t(section.title, lang)}</h3>
                        <ol className="list-none space-y-1.5 p-0">
                          {sortedLessons.map((lesson, li) => (
                            <li
                              key={lesson.id}
                              className="flex items-center justify-between gap-4 rounded-xl2 bg-sunken px-4 py-3"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="numeric shrink-0 text-small text-faint">
                                  {String(li + 1).padStart(2, '0')}
                                </span>
                                <span className="text-small truncate">
                                  {t(lesson.title, lang)}
                                </span>
                                {lesson.freePreview && (
                                  <span className="chip-solid bg-ink text-paper text-meta px-2 py-0.5 shrink-0">
                                    {tr.courses.freePreview}
                                  </span>
                                )}
                              </div>
                              {lesson.videoDuration > 0 && (
                                <span className="numeric shrink-0 text-meta text-faint">
                                  {formatDuration(lesson.videoDuration)}
                                </span>
                              )}
                            </li>
                          ))}
                        </ol>
                      </div>
                    );
                  })}
                </div>
              </section>
            </Reveal>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:col-span-5 lg:space-y-6">
          {/* Tags */}
          {course.tags.length > 0 && (
            <div className="card p-6 sm:p-8">
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related courses */}
          {related.length > 0 && (
            <div className="card p-6 sm:p-8">
              <h2 className="text-h2">{tr.courses.relatedCourses}</h2>
              <ul className="mt-6 list-none space-y-2 p-0">
                {related.map((rc) => (
                  <li key={rc.id}>
                    <Link
                      href={localePath(lang, `/course/${rc.slug}`)}
                      className="group flex items-center justify-between gap-4 rounded-xl2 bg-sunken px-4 py-3.5 text-small transition-colors duration-300 hover:bg-ink hover:text-surface"
                    >
                      {t(rc.title, lang)}
                      <Icon name="arrowRight" size={14} flipRtl className="shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* FAQ */}
      {course.faq.length > 0 && (
        <section className="mt-section">
          <SectionHeader
            title={tr.faq.title}
            className="mb-9 md:mb-12"
          />
          <Faq
            items={course.faq.map((item, i) => ({
              id: `faq-${i}`,
              slug: `faq-${i}`,
              published: true,
              question: item.question,
              answer: item.answer,
            }))}
            lang={lang}
          />
        </section>
      )}
    </article>
  );
}
