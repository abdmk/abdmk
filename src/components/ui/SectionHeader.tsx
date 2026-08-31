import type { ReactNode } from 'react';
import { ArrowLink } from './ArrowLink';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  /** Small tracked label above the title. */
  label?: string;
  title: string;
  intro?: string;
  action?: { href: string; label: string };
  className?: string;
  children?: ReactNode;
}

/** The repeating editorial section opener: rule, label, title, optional link. */
export function SectionHeader({
  label,
  title,
  intro,
  action,
  className,
  children,
}: SectionHeaderProps) {
  return (
    <header className={cn('rule pt-5', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
        <div className="min-w-0">
          {label ? <p className="label mb-3">{label}</p> : null}
          <h2 className="text-h2 font-medium">{title}</h2>
        </div>
        {action ? <ArrowLink href={action.href}>{action.label}</ArrowLink> : null}
      </div>
      {intro ? <p className="mt-5 max-w-prose text-lead text-muted">{intro}</p> : null}
      {children}
    </header>
  );
}
