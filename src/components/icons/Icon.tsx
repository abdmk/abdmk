import type { SVGProps } from 'react';
import { ICON_PATHS, type IconName } from './paths.generated';

export type { IconName };

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  /** Rendered size in px. Icons are drawn on a 24px grid. */
  size?: number;
  /**
   * Accessible label. Omit for icons that sit next to their own text label —
   * those are decorative and get aria-hidden instead.
   */
  label?: string;
  /** Mirror the icon in RTL. Directional icons (arrows, chevrons) opt in. */
  flipRtl?: boolean;
}

/**
 * The single icon primitive for the whole site.
 *
 * Every icon comes from Flaticon UIcons Interface Icons
 * (https://www.flaticon.com/uicons/interface-icons) — no other icon library is
 * used anywhere. Outlines are extracted from the licensed webfont by
 * `scripts/extract-uicons.py` and inlined as SVG paths, so icons inherit
 * `currentColor`, scale cleanly and cost no font download.
 *
 * To add an icon: add it to ICONS in scripts/extract-uicons.py and re-run the
 * script. Never hand-author or paste in an SVG from elsewhere.
 */
export function Icon({ name, size = 20, label, flipRtl, className, ...rest }: IconProps) {
  const d = ICON_PATHS[name];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={[flipRtl ? 'rtl:-scale-x-100' : '', 'shrink-0', className]
        .filter(Boolean)
        .join(' ')}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}
