import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  intro?: string;
  /** Small tracked caption above the title. */
  eyebrow?: string;
  /** A single line of context under the copy — a count, a period, a status. */
  meta?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/**
 * The opening of an inner page: caption, one very large title, a lead held to a
 * reading measure, and a hairline to close it. No panel, no background — the
 * title's size is the whole design, which is what keeps eight section pages
 * reading as one publication.
 */
export function PageHeader({
  title,
  intro,
  eyebrow,
  meta,
  className,
  children,
}: PageHeaderProps) {
  return (
    <header className={cn('pt-14 md:pt-20', className)}>
      {eyebrow ? <p className="label mb-5 md:mb-7">{eyebrow}</p> : null}

      <h1 className="max-w-[16ch] text-display">{title}</h1>

      {intro ? <p className="measure mt-7 text-lead text-muted md:mt-10">{intro}</p> : null}
      {meta ? <div className="meta-line mt-7 md:mt-10">{meta}</div> : null}
      {children}
    </header>
  );
}
