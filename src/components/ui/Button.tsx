import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '@/components/icons';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const VARIANT: Record<Variant, string> = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
};

const SIZE: Record<Size, string> = { sm: 'btn-sm', md: '', lg: 'btn-lg' };

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Trailing icon. Directional names mirror themselves in RTL. */
  icon?: IconName;
  className?: string;
}

function inner(children: ReactNode, icon?: IconName, size?: Size) {
  return (
    <>
      <span>{children}</span>
      {icon ? (
        <Icon
          name={icon}
          size={size === 'lg' ? 18 : 16}
          flipRtl={icon === 'arrowRight' || icon === 'arrowLeft'}
          className="transition-transform duration-500 ease-editorial group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
        />
      ) : null}
    </>
  );
}

/** Pill button. Only two variants exist: the solid ink one, and an outline. */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn('btn group', VARIANT[variant], SIZE[size], className)} {...rest}>
      {inner(children, icon, size)}
    </button>
  );
}

interface ButtonLinkProps extends CommonProps {
  href: string;
  external?: boolean;
}

/** The same pill, as a link. Used for every navigational call to action. */
export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  external,
  className,
}: ButtonLinkProps) {
  const classes = cn('btn group', VARIANT[variant], SIZE[size], className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={classes}>
        {inner(children, icon ?? 'arrowUpRight', size)}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {inner(children, icon, size)}
    </Link>
  );
}
