import type { ReactNode } from 'react';
import { BloomField } from './Bloom';
import { cn } from '@/lib/utils';

type Hue = 'peach' | 'mint' | 'lilac' | 'sky' | 'lime';

interface PageHeaderProps {
  title: string;
  intro?: string;
  /** Small pill above the title — a section name or a count. */
  eyebrow?: string;
  /** Pills under the copy: counts, taxonomy, availability. */
  meta?: ReactNode;
  hues?: Hue[];
  className?: string;
  children?: ReactNode;
}

/**
 * The opening slab every index page wears: one rounded surface, a pastel light
 * behind it, a title and a lead. Keeping it in one component is what makes the
 * section pages read as one family rather than eight separate designs.
 */
export function PageHeader({
  title,
  intro,
  eyebrow,
  meta,
  hues = ['peach', 'lilac', 'sky'],
  className,
  children,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'card relative overflow-hidden px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16',
        className,
      )}
    >
      <BloomField hues={hues} />

      <div className="relative lg:max-w-[72%]">
        {eyebrow ? <span className="chip mb-5 bg-sunken text-muted">{eyebrow}</span> : null}
        <h1 className="text-display">{title}</h1>
        {intro ? <p className="mt-5 max-w-prose text-lead text-muted">{intro}</p> : null}
        {meta ? <div className="mt-7 flex flex-wrap items-center gap-2">{meta}</div> : null}
        {children}
      </div>
    </header>
  );
}
