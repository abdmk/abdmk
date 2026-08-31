import { Reveal } from '@/components/ui/Reveal';
import type { Company, Lang, Project } from '@/lib/content/types';
import { ProjectCard, type CardScale } from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
  lang: Lang;
  companies?: Company[];
  /** `editorial` varies the sizes; `even` keeps a plain two-column rhythm. */
  variant?: 'editorial' | 'even';
  priorityCount?: number;
}

/**
 * The asymmetric work grid.
 *
 * Sizes repeat on a 5-project cycle — one full-bleed, a 2/3 + 1/3 pair, then a
 * balanced pair — so a long list keeps a deliberate rhythm instead of turning
 * into a uniform wall of thumbnails, and so an author does not have to lay
 * anything out by hand.
 */
const CYCLE: { span: string; scale: CardScale }[] = [
  { span: 'md:col-span-12', scale: 'hero' },
  { span: 'md:col-span-8', scale: 'wide' },
  { span: 'md:col-span-4', scale: 'tall' },
  { span: 'md:col-span-6', scale: 'regular' },
  { span: 'md:col-span-6', scale: 'regular' },
];

export function ProjectGrid({
  projects,
  lang,
  companies = [],
  variant = 'editorial',
  priorityCount = 1,
}: ProjectGridProps) {
  const findCompany = (slug: string | null) =>
    slug ? companies.find((c) => c.slug === slug) : undefined;

  if (variant === 'even') {
    return (
      <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.id} index={i % 2} as="div">
            <ProjectCard
              project={project}
              lang={lang}
              company={findCompany(project.company)}
              scale="regular"
              priority={i < priorityCount}
            />
          </Reveal>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-12 md:gap-y-24">
      {projects.map((project, i) => {
        const { span, scale } = CYCLE[i % CYCLE.length];
        return (
          <Reveal key={project.id} className={span} as="div">
            <ProjectCard
              project={project}
              lang={lang}
              company={findCompany(project.company)}
              scale={scale}
              priority={i < priorityCount}
            />
          </Reveal>
        );
      })}
    </div>
  );
}
