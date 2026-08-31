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
 * UIcons arrow in a small circular well that mirrors itself in RTL.
 */
export function ArrowLink({
  href,
  children,
  external,
  className,
  size = 'default',
}: ArrowLinkProps) {
  const dim = size === 'lead' ? 'h-9 w-9' : 'h-7 w-7';

  const content = (
    <>
      <span className="link-underline">{children}</span>
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-full bg-sunken text-ink',
          'transition-[background-color,transform] duration-500 ease-editorial',
          'group-hover:bg-ink group-hover:text-surface',
          'group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5',
          dim,
        )}
      >
        <Icon
          name={external ? 'arrowUpRight' : 'arrowRight'}
          size={size === 'lead' ? 17 : 14}
          flipRtl={!external}
        />
      </span>
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
