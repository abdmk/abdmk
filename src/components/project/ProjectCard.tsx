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
  /** Shown above the title — usually the year or an index. */
  index?: number;
}

const RATIO: Record<CardScale, string> = {
  hero: '16 / 9',
  wide: '3 / 2',
  tall: '4 / 5',
  regular: '4 / 3',
};

const SIZES: Record<CardScale, string> = {
  hero: '100vw',
  wide: '(max-width: 768px) 100vw, 66vw',
  tall: '(max-width: 768px) 100vw, 33vw',
  regular: '(max-width: 768px) 100vw, 50vw',
};

/**
 * A project in the grid. No card chrome — the artwork is the object, and the
 * type sits under it the way a caption sits under a plate in a printed book.
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
    <article className="group">
      <Link href={localePath(lang, `/project/${project.slug}`)} className="block">
        <div
          className="media-zoom relative overflow-hidden bg-ink/[0.04]"
          style={{ aspectRatio: RATIO[scale] }}
        >
          <SmartImage
            src={project.cover.src}
            alt={t(project.cover.alt, lang)}
            fill
            sizes={SIZES[scale]}
            priority={priority}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/[0.06]"
          />
        </div>

        <div className="mt-4 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h3
              className={cn(
                'font-medium leading-tight',
                scale === 'hero' ? 'text-h2' : 'text-h3',
              )}
            >
              <span className="link-underline">{title}</span>
            </h3>
            <p className="mt-1.5 text-small text-muted">
              {company ? t(company.name, lang) : t(project.shortDescription, lang)}
            </p>
          </div>
          <p className="label numeric shrink-0 pt-1.5">
            {index !== undefined ? String(index + 1).padStart(2, '0') : project.year}
          </p>
        </div>
      </Link>

      {scale === 'hero' ? (
        <p className="mt-3 max-w-prose text-lead text-muted">{t(project.shortDescription, lang)}</p>
      ) : null}
    </article>
  );
}

/** A compact horizontal variant used for "next project" and related lists. */
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
      className={cn('group flex flex-col gap-4', align === 'end' && 'items-end text-end')}
    >
      <span className="label inline-flex items-center gap-2">
        {align === 'start' ? <Icon name="arrowLeft" size={13} flipRtl /> : null}
        {label}
        {align === 'end' ? <Icon name="arrowRight" size={13} flipRtl /> : null}
      </span>
      <span className="media-zoom relative block w-full overflow-hidden bg-ink/[0.04]" style={{ aspectRatio: '16 / 10' }}>
        <SmartImage
          src={project.cover.src}
          alt={t(project.cover.alt, lang)}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </span>
      <span className="text-h3 font-medium">
        <span className="link-underline">{t(project.title, lang)}</span>
      </span>
    </Link>
  );
}
