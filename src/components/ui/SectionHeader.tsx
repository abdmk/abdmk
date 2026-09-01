import type { ReactNode } from 'react';
import { ArrowLink } from './ArrowLink';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  /** Small pill label above the title. */
  label?: string;
  title: string;
  intro?: string;
  action?: { href: string; label: string };
  className?: string;
  /** Centre the block. Used for full-width feature sections. */
  align?: 'start' | 'center';
  children?: ReactNode;
}

/**
 * The repeating section opener: a quiet pill label, a tight title, an optional
 * lead paragraph and an optional link parked on the far edge.
 */
export function SectionHeader({
  label,
  title,
  intro,
  action,
  className,
  align = 'start',
  children,
}: SectionHeaderProps) {
  const centered = align === 'center';

  return (
    <header className={cn(centered && 'text-center', className)}>
      <div
        className={cn(
          'flex flex-wrap gap-x-8 gap-y-5',
          centered
            ? 'flex-col items-center'
            : 'items-end justify-between',
        )}
      >
        <div className={cn('min-w-0', centered && 'flex flex-col items-center')}>
          {label ? (
            <span className="chip mb-4 bg-surface text-faint shadow-soft">{label}</span>
          ) : null}
          <h2 className="text-h2">{title}</h2>
        </div>
        {action ? (
          <ArrowLink href={action.href} className="shrink-0">
            {action.label}
          </ArrowLink>
        ) : null}
      </div>
      {intro ? (
        <p
          className={cn(
            'mt-5 max-w-prose text-lead text-muted',
            centered && 'mx-auto',
          )}
        >
          {intro}
        </p>
      ) : null}
      {children}
    </header>
  );
}
