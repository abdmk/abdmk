import { Reveal } from '@/components/ui/Reveal';
import type { Category, Company, Lang, Project } from '@/lib/content/types';
import { ProjectCard, type CardScale } from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
  lang: Lang;
  companies?: Company[];
  categories?: Category[];
  /** `editorial` art-directs the sizes; `even` keeps a plain uniform grid. */
  variant?: 'editorial' | 'even';
  priorityCount?: number;
  /** Number each entry in its caption. */
  numbered?: boolean;
}

/**
 * The art-directed work grid.
 *
 * Sizes and column offsets repeat on a six-project cycle: a full-width opener,
 * an offset pair that leaves a deliberate gap, a tall/short pair, then a wide
 * one indented from the edge. The variation is what makes the page feel
 * directed rather than generated — a uniform grid of equal thumbnails reads as
 * a catalogue, and a catalogue is not a portfolio.
 *
 * Every rule collapses to a single column below `md`, where art direction has
 * to give way to reading order.
 */
const CYCLE: { span: string; scale: CardScale }[] = [
  { span: 'md:col-span-12', scale: 'hero' },
  { span: 'md:col-span-7', scale: 'wide' },
  { span: 'md:col-span-4 md:col-start-9 md:mt-24', scale: 'tall' },
  { span: 'md:col-span-5', scale: 'tall' },
  { span: 'md:col-span-6 md:col-start-7 md:mt-32', scale: 'regular' },
  { span: 'md:col-span-8 md:col-start-3', scale: 'wide' },
];

export function ProjectGrid({
  projects,
  lang,
  companies = [],
  categories = [],
  variant = 'editorial',
  priorityCount = 1,
  numbered = false,
}: ProjectGridProps) {
  const findCompany = (slug: string | null) =>
    slug ? companies.find((c) => c.slug === slug) : undefined;

  if (variant === 'even') {
    return (
      <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 md:gap-y-20">
        {projects.map((project, i) => (
          <Reveal key={project.id} index={i % 2} as="div">
            <ProjectCard
              project={project}
              lang={lang}
              company={findCompany(project.company)}
              categories={categories}
              scale="regular"
              priority={i < priorityCount}
            />
          </Reveal>
        ))}
      </div>
    );
  }

  return (
    <div className="grid-editorial gap-y-16 md:gap-y-24">
      {projects.map((project, i) => {
        const { span, scale } = CYCLE[i % CYCLE.length];
        return (
          <Reveal key={project.id} className={`col-span-4 ${span}`} as="div">
            <ProjectCard
              project={project}
              lang={lang}
              company={findCompany(project.company)}
              categories={categories}
              scale={scale}
              priority={i < priorityCount}
              index={numbered ? i : undefined}
            />
          </Reveal>
        );
      })}
    </div>
  );
}
