import type { ReactNode } from 'react';
import { ArrowLink } from './ArrowLink';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  /** Small tracked caption above the title — the section's name. */
  label?: string;
  title: string;
  intro?: string;
  action?: { href: string; label: string };
  className?: string;
  /** The title's weight in the page. `lead` is for the one section that matters most. */
  size?: 'default' | 'lead';
  children?: ReactNode;
}

/**
 * The repeating section opener: a hairline, a numbered caption, a title, and an
 * optional link parked on the far edge. The rule is what separates sections
 * here — there are no boxes, so the line does the structural work.
 */
export function SectionHeader({
  label,
  title,
  intro,
  action,
  className,
  size = 'default',
  children,
}: SectionHeaderProps) {
  return (
    <header className={cn('rule pt-6 md:pt-8', className)}>
      <div className="grid-editorial items-baseline">
        <div className="col-span-4 md:col-span-8">
          {label ? <p className="label mb-4 md:mb-6">{label}</p> : null}
          <h2 className={size === 'lead' ? 'text-display' : 'text-h1'}>{title}</h2>
        </div>

        {action ? (
          <div className="col-span-4 md:col-span-4 md:justify-self-end md:self-end">
            <ArrowLink href={action.href}>{action.label}</ArrowLink>
          </div>
        ) : null}
      </div>

      {intro ? (
        <p className="measure mt-6 text-lead text-muted md:mt-8">{intro}</p>
      ) : null}
      {children}
    </header>
  );
}
