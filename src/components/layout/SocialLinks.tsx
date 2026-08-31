import { Icon, type IconName } from '@/components/icons';
import { ICON_PATHS } from '@/components/icons';
import type { SocialLink } from '@/lib/content/types';
import { cn } from '@/lib/utils';

interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
  size?: number;
}

const isKnownIcon = (name: string): name is IconName => name in ICON_PATHS;

/**
 * Social row. Every glyph comes from the UIcons brand set via the central Icon
 * component; an unrecognised icon name degrades to a text label rather than
 * pulling in a foreign SVG.
 */
export function SocialLinks({ links, className, size = 18 }: SocialLinksProps) {
  if (!links.length) return null;
  return (
    <ul className={cn('-mx-1.5 flex list-none flex-wrap items-center gap-1 p-0', className)}>
      {links.map((link) => (
        <li key={link.href} className="m-0">
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer noopener me"
            className="grid h-9 w-9 place-items-center text-muted transition-colors duration-300 hover:text-ink"
            aria-label={link.label}
            title={link.label}
          >
            {isKnownIcon(link.icon) ? (
              <Icon name={link.icon} size={size} />
            ) : (
              <span className="text-meta">{link.label.slice(0, 2)}</span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
