import Link from 'next/link';
import { Icon } from '@/components/icons';
import { SmartImage } from '@/components/media/SmartImage';
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
    <Link href={href(session, lang)} className="group block">
      <div
        className="media-zoom relative overflow-hidden bg-ink/[0.04]"
        style={{ aspectRatio: '8 / 5' }}
      >
        <SmartImage
          src={session.cover.src}
          alt={t(session.cover.alt, lang)}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={dim ? 'opacity-70 transition-opacity group-hover:opacity-100' : undefined}
        />
      </div>
      <p className="label mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="numeric">{formatDate(session.date, lang)}</span>
        <span aria-hidden>·</span>
        <span>{tr.workshops.mode[session.mode]}</span>
        <span aria-hidden>·</span>
        <span>{t(session.location, lang)}</span>
      </p>
      <h3 className="mt-2 text-h3 font-medium">
        <span className="link-underline">{t(session.title, lang)}</span>
      </h3>
      <p className="mt-2 max-w-prose text-small text-muted">{t(session.description, lang)}</p>
    </Link>
  );
}

/** Shared index for both /workshops and /courses — they differ only by content. */
export function WorkshopIndex({ title, upcoming, past, lang }: WorkshopIndexProps) {
  const tr = ui(lang);

  return (
    <div className="shell py-14 md:py-20">
      <header className="mb-14 md:mb-20">
        <h1 className="text-display font-light">{title}</h1>
        <p className="mt-6 max-w-prose text-lead text-muted">{tr.workshops.intro}</p>
      </header>

      <section>
        <SectionHeader title={tr.workshops.upcoming} className="mb-10" />
        {upcoming.length ? (
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
            {upcoming.map((session, i) => (
              <Reveal key={session.id} index={i % 2}>
                <Card session={session} lang={lang} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="py-10 text-lead text-muted">{tr.workshops.noUpcoming}</p>
        )}
      </section>

      {past.length ? (
        <section className="mt-section">
          <SectionHeader title={tr.workshops.past} className="mb-10" />
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">
            {past.map((session, i) => (
              <Reveal key={session.id} index={i % 3}>
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
    <article className="py-14 md:py-20">
      <header className="shell">
        <Link href={backHref} className="label inline-flex items-center gap-2 hover:text-ink">
          <Icon name="arrowLeft" size={13} flipRtl />
          {backLabel}
        </Link>

        <div className="mt-8 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <h1 className="text-display font-light">{t(session.title, lang)}</h1>
            <p className="mt-6 max-w-prose text-lead text-muted">
              {t(session.description, lang)}
            </p>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <dl className="m-0">
            {[
              { label: tr.workshops.date, value: formatDate(session.date, lang), icon: 'calendar' as const, numeric: true },
              { label: tr.workshops.duration, value: t(session.duration, lang), icon: 'clock' as const },
              { label: tr.workshops.location, value: `${t(session.location, lang)} — ${tr.workshops.mode[session.mode]}`, icon: 'location' as const },
              { label: tr.workshops.price, value: t(session.price, lang), icon: 'browser' as const },
              ...(session.seats
                ? [{ label: tr.workshops.seats, value: `${session.seats} ${tr.workshops.seatsLeft}`, icon: 'users' as const, numeric: true }]
                : []),
            ].map((row) => (
              <div key={row.label} className="border-t border-line py-3.5">
                <dt className="label mb-1.5 inline-flex items-center gap-2">
                  <Icon name={row.icon} size={13} />
                  {row.label}
                </dt>
                <dd className={`text-small ${row.numeric ? 'numeric' : ''}`}>{row.value}</dd>
              </div>
            ))}

            </dl>

            {/* The registration action is not a term/definition pair. */}
            <div className="border-t border-line pt-5">
              {session.registrationUrl && !isPast ? (
                <a
                  href={session.registrationUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2.5 bg-ink px-6 py-3.5 text-small font-medium text-paper transition-opacity hover:opacity-85"
                >
                  {tr.workshops.register}
                  <Icon name="arrowUpRight" size={15} />
                </a>
              ) : (
                <p className="text-small text-faint">{tr.workshops.registrationClosed}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mt-12 md:mt-16">
        <SmartImage
          src={session.cover.src}
          alt={t(session.cover.alt, lang)}
          width={session.cover.width}
          height={session.cover.height}
          sizes="100vw"
          priority
          className="w-full"
        />
      </div>

      <div className="shell mt-section grid gap-12 md:grid-cols-12">
        <section className="md:col-span-7">
          <SectionHeader title={tr.workshops.content} className="mb-6" />
          <ol className="list-none p-0">
            {session.content.map((item, i) => (
              <li key={i} className="flex items-start gap-4 border-b border-line py-4">
                <span className="label numeric mt-1">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-body">{t(item, lang)}</span>
              </li>
            ))}
          </ol>
        </section>

        {related.length ? (
          <aside className="md:col-span-4 md:col-start-9">
            <SectionHeader title={tr.project.related} className="mb-6" />
            <ul className="list-none p-0">
              {related.map((item) => (
                <li key={item.href} className="border-b border-line py-3">
                  <Link href={item.href} className="link-underline text-small">
                    {item.title}
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
