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
 * The site's standard text link: a label, a rule that draws in on hover, and a
 * UIcons arrow that mirrors itself in RTL. Used instead of buttons almost
 * everywhere — buttons are reserved for actual form actions.
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
      <span className="link-underline">{children}</span>
      <Icon
        name={external ? 'arrowUpRight' : 'arrowRight'}
        size={size === 'lead' ? 22 : 18}
        flipRtl={!external}
        className="transition-transform duration-500 ease-editorial group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
      />
    </>
  );

  const classes = cn(
    'group inline-flex items-center gap-2 font-medium text-ink',
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
