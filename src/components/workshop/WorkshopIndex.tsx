import Link from 'next/link';
import { Icon } from '@/components/icons';
import { SmartImage } from '@/components/media/SmartImage';
import { BloomField } from '@/components/ui/Bloom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { Lang, Workshop } from '@/lib/content/types';
import { formatDate, localePath, t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';

interface WorkshopIndexProps {
  title: string;
  upcoming: Workshop[];
  past: Workshop[];
  lang: Lang;
}

function href(session: Workshop, lang: Lang) {
  return localePath(lang, `/${session.kind === 'course' ? 'course' : 'workshop'}/${session.slug}`);
}

function Card({ session, lang, dim }: { session: Workshop; lang: Lang; dim?: boolean }) {
  const tr = ui(lang);
  return (
    <Link
      href={href(session, lang)}
      className="card card-hover group flex h-full flex-col overflow-hidden p-2.5 sm:p-3"
    >
      <div
        className="media-zoom relative overflow-hidden rounded-[calc(var(--radius-card)-0.5rem)] bg-sunken"
        style={{ aspectRatio: '8 / 5' }}
      >
        <SmartImage
          src={session.cover.src}
          alt={t(session.cover.alt, lang)}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 34vw"
          className={dim ? 'opacity-70 transition-opacity group-hover:opacity-100' : undefined}
        />
      </div>
      <div className="flex flex-1 flex-col px-2.5 pb-2 pt-4 sm:px-3.5 sm:pt-5">
        <div className="flex flex-wrap gap-2">
          <span className="chip numeric">{formatDate(session.date, lang)}</span>
          <span className="chip">{tr.workshops.mode[session.mode]}</span>
          <span className="chip">{t(session.location, lang)}</span>
        </div>
        <h3 className="mt-3 text-h3">{t(session.title, lang)}</h3>
        <p className="mt-2 max-w-prose text-small text-muted">{t(session.description, lang)}</p>
      </div>
    </Link>
  );
}

/** Shared index for both /workshops and /courses — they differ only by content. */
export function WorkshopIndex({ title, upcoming, past, lang }: WorkshopIndexProps) {
  const tr = ui(lang);

  return (
    <div className="shell pb-section pt-6 sm:pt-8">
      <PageHeader
        title={title}
        intro={tr.workshops.intro}
        hues={['lime', 'mint', 'sky']}
        meta={
          <>
            <span className="chip numeric">
              {upcoming.length} {tr.workshops.upcoming}
            </span>
            {past.length ? (
              <span className="chip numeric">
                {past.length} {tr.workshops.past}
              </span>
            ) : null}
          </>
        }
        className="mb-9 md:mb-12"
      />

      <section>
        <SectionHeader title={tr.workshops.upcoming} className="mb-9 md:mb-12" />
        {upcoming.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
            {upcoming.map((session, i) => (
              <Reveal key={session.id} index={i % 2} className="h-full">
                <Card session={session} lang={lang} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="card p-10 text-center">
            <p className="text-lead text-muted">{tr.workshops.noUpcoming}</p>
          </div>
        )}
      </section>

      {past.length ? (
        <section className="mt-section">
          <SectionHeader title={tr.workshops.past} className="mb-9 md:mb-12" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {past.map((session, i) => (
              <Reveal key={session.id} index={i % 3} className="h-full">
                <Card session={session} lang={lang} dim />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

/** Detail view for one workshop or course. */
export function WorkshopDetail({
  session,
  related,
  lang,
  backHref,
  backLabel,
}: {
  session: Workshop;
  related: { title: string; href: string }[];
  lang: Lang;
  backHref: string;
  backLabel: string;
}) {
  const tr = ui(lang);
  const isPast = new Date(session.endDate ?? session.date) < new Date();

  return (
    <article className="shell pb-section pt-6 sm:pt-8">
      <header className="card relative overflow-hidden p-6 sm:p-8 lg:p-12">
        <BloomField hues={['lime', 'sky', 'lilac']} />

        <div className="relative">
          <Link
            href={backHref}
            className="chip transition-colors duration-300 hover:bg-ink hover:text-surface"
          >
            <Icon name="arrowLeft" size={13} flipRtl />
            {backLabel}
          </Link>

          <div className="mt-7 grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <h1 className="text-h1">{t(session.title, lang)}</h1>
              <p className="mt-5 max-w-prose text-lead text-muted">
                {t(session.description, lang)}
              </p>
            </div>

            <div className="lg:col-span-5">
              <dl className="m-0 space-y-2">
                {[
                  { label: tr.workshops.date, value: formatDate(session.date, lang), icon: 'calendar' as const, numeric: true },
                  { label: tr.workshops.duration, value: t(session.duration, lang), icon: 'clock' as const },
                  { label: tr.workshops.location, value: `${t(session.location, lang)} — ${tr.workshops.mode[session.mode]}`, icon: 'location' as const },
                  { label: tr.workshops.price, value: t(session.price, lang), icon: 'browser' as const },
                  ...(session.seats
                    ? [{ label: tr.workshops.seats, value: `${session.seats} ${tr.workshops.seatsLeft}`, icon: 'users' as const, numeric: true }]
                    : []),
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-4 rounded-xl2 bg-sunken px-4 py-3"
                  >
                    <dt className="label mb-0 inline-flex items-center gap-2">
                      <Icon name={row.icon} size={13} />
                      {row.label}
                    </dt>
                    <dd
                      className={`text-small font-medium ${row.numeric ? 'numeric' : ''}`}
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* The registration action is not a term/definition pair. */}
              <div className="mt-5">
                {session.registrationUrl && !isPast ? (
                  <a
                    href={session.registrationUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn-primary w-full"
                  >
                    {tr.workshops.register}
                    <Icon name="arrowUpRight" size={15} />
                  </a>
                ) : (
                  <p className="rounded-full bg-sunken px-5 py-3.5 text-center text-small text-faint">
                    {tr.workshops.registrationClosed}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-5 overflow-hidden rounded-card bg-sunken lg:mt-6">
        <SmartImage
          src={session.cover.src}
          alt={t(session.cover.alt, lang)}
          width={session.cover.width}
          height={session.cover.height}
          sizes="(max-width: 1024px) 100vw, 88vw"
          priority
          className="w-full"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:mt-6 lg:grid-cols-12 lg:gap-6">
        <section className="card p-6 sm:p-8 lg:col-span-7 lg:p-10">
          <h2 className="text-h2">{tr.workshops.content}</h2>
          <ol className="mt-6 list-none space-y-2 p-0">
            {session.content.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-4 rounded-xl2 bg-sunken px-4 py-3.5"
              >
                <span className="numeric shrink-0 text-small font-medium text-faint">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-small">{t(item, lang)}</span>
              </li>
            ))}
          </ol>
        </section>

        {related.length ? (
          <aside className="card p-6 sm:p-8 lg:col-span-5 lg:p-10">
            <h2 className="text-h2">{tr.project.related}</h2>
            <ul className="mt-6 list-none space-y-2 p-0">
              {related.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between gap-4 rounded-xl2 bg-sunken px-4 py-3.5 text-small transition-colors duration-300 hover:bg-ink hover:text-surface"
                  >
                    {item.title}
                    <Icon name="arrowRight" size={14} flipRtl className="shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </article>
  );
}
