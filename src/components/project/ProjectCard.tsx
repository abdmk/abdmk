import Link from 'next/link';
import { Icon } from '@/components/icons';
import { SmartImage } from '@/components/media/SmartImage';
import type { Company, Lang, Project } from '@/lib/content/types';
import { localePath, t } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';

export type CardScale = 'hero' | 'wide' | 'tall' | 'regular';

interface ProjectCardProps {
  project: Project;
  lang: Lang;
  company?: Company;
  scale?: CardScale;
  priority?: boolean;
  /** Shown as a chip beside the year — usually the position in the list. */
  index?: number;
}

const RATIO: Record<CardScale, string> = {
  hero: '16 / 9',
  wide: '3 / 2',
  tall: '4 / 5',
  regular: '4 / 3',
};

const SIZES: Record<CardScale, string> = {
  hero: '(max-width: 768px) 100vw, 90vw',
  wide: '(max-width: 768px) 100vw, 60vw',
  tall: '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 34vw',
  regular: '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 44vw',
};

/**
 * A project as a floating white card: the artwork sits in a rounded well inside
 * the surface, the title and client sit under it, and the whole card lifts a few
 * pixels on hover. One card shape, four aspect ratios.
 */
export function ProjectCard({
  project,
  lang,
  company,
  scale = 'regular',
  priority,
  index,
}: ProjectCardProps) {
  const title = t(project.title, lang);

  return (
    <article className="group h-full">
      <Link
        href={localePath(lang, `/project/${project.slug}`)}
        className="card card-hover flex h-full flex-col overflow-hidden p-2.5 sm:p-3"
      >
        <div
          className="media-zoom relative overflow-hidden rounded-[calc(var(--radius-card)-0.5rem)] bg-sunken"
          style={{ aspectRatio: RATIO[scale] }}
        >
          <SmartImage
            src={project.cover.src}
            alt={t(project.cover.alt, lang)}
            fill
            sizes={SIZES[scale]}
            priority={priority}
          />
        </div>

        <div className="flex flex-1 flex-col px-2.5 pb-2 pt-4 sm:px-3.5 sm:pt-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className={cn('leading-tight', scale === 'hero' ? 'text-h2' : 'text-h3')}>
              {title}
            </h3>
            <span className="chip numeric shrink-0 text-faint">
              {index !== undefined ? String(index + 1).padStart(2, '0') : project.year}
            </span>
          </div>

          <p className="mt-2 text-small text-muted">
            {company ? t(company.name, lang) : t(project.shortDescription, lang)}
          </p>

          {scale === 'hero' ? (
            <p className="mt-3 max-w-prose text-lead text-muted">
              {t(project.shortDescription, lang)}
            </p>
          ) : null}

          <span
            aria-hidden
            className={cn(
              'mt-4 inline-flex h-9 w-9 items-center justify-center self-start rounded-full',
              'bg-sunken text-ink transition-colors duration-500 ease-editorial',
              'group-hover:bg-ink group-hover:text-surface',
            )}
          >
            <Icon name="arrowRight" size={15} flipRtl />
          </span>
        </div>
      </Link>
    </article>
  );
}

/** A compact variant used for "previous / next project" and related lists. */
export function ProjectCardMini({
  project,
  lang,
  label,
  align = 'start',
}: {
  project: Project;
  lang: Lang;
  label: string;
  align?: 'start' | 'end';
}) {
  return (
    <Link
      href={localePath(lang, `/project/${project.slug}`)}
      className={cn(
        'card card-hover group flex flex-col gap-4 p-2.5 sm:p-3',
        align === 'end' && 'items-end text-end',
      )}
    >
      <span className="label inline-flex items-center gap-2 px-2 pt-2">
        {align === 'start' ? <Icon name="arrowLeft" size={13} flipRtl /> : null}
        {label}
        {align === 'end' ? <Icon name="arrowRight" size={13} flipRtl /> : null}
      </span>
      <span
        className="media-zoom relative block w-full overflow-hidden rounded-[calc(var(--radius-card)-0.5rem)] bg-sunken"
        style={{ aspectRatio: '16 / 10' }}
      >
        <SmartImage
          src={project.cover.src}
          alt={t(project.cover.alt, lang)}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </span>
      <span className="px-2 pb-2 text-h3">{t(project.title, lang)}</span>
    </Link>
  );
}
