import { Reveal } from '@/components/ui/Reveal';
import type { Company, Lang, Project } from '@/lib/content/types';
import { ProjectCard, type CardScale } from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
  lang: Lang;
  companies?: Company[];
  /** `editorial` varies the card widths; `even` keeps a plain uniform grid. */
  variant?: 'editorial' | 'even';
  priorityCount?: number;
}

/**
 * The work grid.
 *
 * Every project wears the same card; only the width and aspect ratio vary. Sizes
 * repeat on a 5-project cycle — one wide feature, a 2/3 + 1/3 pair, then a
 * balanced pair — so a long list keeps a deliberate rhythm without an author
 * having to lay anything out by hand. Below `lg` the cycle collapses to one or
 * two columns and every card falls back to the same ratio.
 */
const CYCLE: { span: string; scale: CardScale }[] = [
  { span: 'sm:col-span-2 lg:col-span-12', scale: 'hero' },
  { span: 'sm:col-span-1 lg:col-span-7', scale: 'wide' },
  { span: 'sm:col-span-1 lg:col-span-5', scale: 'tall' },
  { span: 'sm:col-span-1 lg:col-span-6', scale: 'regular' },
  { span: 'sm:col-span-1 lg:col-span-6', scale: 'regular' },
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
      <div className="grid gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.id} index={i % 3} as="div" className="h-full">
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
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
      {projects.map((project, i) => {
        const { span, scale } = CYCLE[i % CYCLE.length];
        return (
          <Reveal
            key={project.id}
            className={`${span} h-full`}
            index={i % 2}
            as="div"
          >
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
