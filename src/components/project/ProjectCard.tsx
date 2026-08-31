import Link from 'next/link';
import { Icon } from '@/components/icons';
import { SmartImage } from '@/components/media/SmartImage';
import type { Category, Company, Lang, Project } from '@/lib/content/types';
import { localePath, t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';
import { cn } from '@/lib/utils';

export type CardScale = 'hero' | 'wide' | 'tall' | 'regular';

interface ProjectCardProps {
  project: Project;
  lang: Lang;
  company?: Company;
  categories?: Category[];
  scale?: CardScale;
  priority?: boolean;
  /** Index in the list, shown as a running number in the caption. */
  index?: number;
}

const RATIO: Record<CardScale, string> = {
  hero: '16 / 9',
  wide: '4 / 3',
  tall: '3 / 4',
  regular: '5 / 4',
};

const SIZES: Record<CardScale, string> = {
  hero: '(max-width: 768px) 100vw, 92vw',
  wide: '(max-width: 768px) 100vw, 58vw',
  tall: '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 38vw',
  regular: '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 46vw',
};

/**
 * A project entry.
 *
 * There is no card: the image is the object and the type sits beneath it, the
 * way a plate is captioned in a printed monograph. The caption carries the four
 * things a prospective client actually looks for — what it is, who it was for,
 * what kind of work it was, and when — because a wall of untitled images tells
 * a visitor nothing about whether this designer has done their kind of job.
 */
export function ProjectCard({
  project,
  lang,
  company,
  categories = [],
  scale = 'regular',
  priority,
  index,
}: ProjectCardProps) {
  const tr = ui(lang);
  const discipline = categories.find((c) => project.categories.includes(c.slug));

  return (
    <article className="group">
      <Link href={localePath(lang, `/project/${project.slug}`)} className="block">
        <div
          className="media-zoom well relative"
          style={{ aspectRatio: RATIO[scale] }}
        >
          <SmartImage
            src={project.cover.src}
            alt={t(project.cover.alt, lang)}
            fill
            sizes={SIZES[scale]}
            priority={priority}
          />

          {/* The "open" affordance only resolves on hover, so at rest the grid
              is nothing but artwork. */}
          <span
            aria-hidden
            className={cn(
              'absolute bottom-4 end-4 hidden items-center gap-2 rounded-full bg-paper px-4 py-2.5',
              'text-small font-medium text-ink opacity-0 transition-all duration-500 ease-editorial',
              'group-hover:translate-y-0 group-hover:opacity-100 md:flex md:translate-y-2',
            )}
          >
            {tr.project.visitProject}
            <Icon name="arrowUpRight" size={14} />
          </span>
        </div>

        <div className="mt-5 flex items-start justify-between gap-6 md:mt-6">
          <div className="min-w-0">
            <h3 className={cn('leading-tight', scale === 'hero' ? 'text-h1' : 'text-h2')}>
              <span className="link-underline">{t(project.title, lang)}</span>
            </h3>

            <p className="meta-line mt-2.5 md:mt-3">
              {[
                company ? t(company.name, lang) : null,
                discipline ? t(discipline.name, lang) : null,
              ]
                .filter(Boolean)
                .join('  ·  ')}
            </p>
          </div>

          <p className="label numeric shrink-0 pt-1">
            {index !== undefined ? `${String(index + 1).padStart(2, '0')} — ` : ''}
            {project.year}
          </p>
        </div>

        {scale === 'hero' ? (
          <p className="measure mt-4 text-lead text-muted">
            {t(project.shortDescription, lang)}
          </p>
        ) : null}
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
      className={cn('group block', align === 'end' && 'text-end')}
    >
      <span className={cn('label inline-flex items-center gap-2', align === 'end' && 'flex-row-reverse')}>
        <Icon name={align === 'start' ? 'arrowLeft' : 'arrowRight'} size={12} flipRtl />
        {label}
      </span>
      <span
        className="media-zoom well relative mt-5 block w-full"
        style={{ aspectRatio: '16 / 10' }}
      >
        <SmartImage
          src={project.cover.src}
          alt={t(project.cover.alt, lang)}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </span>
      <span className="mt-5 block text-h2">
        <span className="link-underline">{t(project.title, lang)}</span>
      </span>
      <span className="meta-line mt-2 block numeric">{project.year}</span>
    </Link>
  );
}
