import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/icons';
import { cn } from '@/lib/utils';

interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
  /** `lead` is the larger, section-ending variant. */
  size?: 'default' | 'lead';
}

/**
 * The site's standard text link: a label carrying a rule that retreats on
 * hover, and an arrow that steps forward — the two halves of one gesture.
 * No circle, no fill: in this system a link is text, not a button.
 */
export function ArrowLink({
  href,
  children,
  external,
  className,
  size = 'default',
}: ArrowLinkProps) {
  const content = (
    <>
      <span className="link-rule">{children}</span>
      <Icon
        name={external ? 'arrowUpRight' : 'arrowRight'}
        size={size === 'lead' ? 20 : 15}
        flipRtl={!external}
        className="shrink-0 transition-transform duration-500 ease-editorial group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5"
      />
    </>
  );

  const classes = cn(
    'group inline-flex items-center gap-2.5 font-medium text-ink',
    size === 'lead' ? 'text-h3' : 'text-small',
    className,
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={classes}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
