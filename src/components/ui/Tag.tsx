import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Inline metadata: a discipline, a year, a category. Deliberately not a pill on
 * a filled background — in an editorial layout these sit as small tracked text
 * separated by hairlines, so a row of six of them still reads as one line of
 * information rather than six buttons.
 */
export function Tag({
  children,
  className,
  as: Component = 'span',
}: {
  children: ReactNode;
  className?: string;
  as?: 'span' | 'li';
}) {
  return (
    <Component className={cn('meta-line whitespace-nowrap', className)}>{children}</Component>
  );
}

/** A row of tags separated by thin dividers rather than boxes. */
export function TagRow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ul
      className={cn(
        'flex list-none flex-wrap items-center gap-x-3 gap-y-1 p-0',
        // The divider is drawn by the list itself, so callers just pass items.
        '[&>li+li]:before:me-3 [&>li+li]:before:text-line-strong [&>li+li]:before:content-["/"]',
        className,
      )}
    >
      {children}
    </ul>
  );
}
