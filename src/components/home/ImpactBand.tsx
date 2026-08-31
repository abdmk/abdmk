import type { Category, Lang } from '@/lib/content/types';
import { t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';

/**
 * Digital impact.
 *
 * A statement about where the work actually lands, followed by the disciplines
 * it lands in, running as a single continuous line. The marquee earns its
 * motion: the list is longer than the viewport, and moving it is the honest way
 * to say "there is more here than fits" without stacking twenty tags into a
 * block. It holds still for anyone who asks for reduced motion.
 */
export function ImpactBand({
  categories,
  lang,
}: {
  categories: Category[];
  lang: Lang;
}) {
  const tr = ui(lang);
  const names = categories.map((c) => t(c.name, lang));
  if (!names.length) return null;

  return (
    <section className="surface-invert mt-section overflow-hidden py-section-sm">
      <div className="shell">
        <p className="label">{tr.impact.title}</p>
        <p className="measure mt-6 text-h1 md:mt-10">{tr.impact.intro}</p>
      </div>

      <div
        aria-hidden
        className="relative mt-12 flex overflow-hidden md:mt-16"
      >
        {/* Two identical tracks: the first scrolls out exactly as the second
            scrolls in, so the loop has no seam. */}
        {[0, 1].map((track) => (
          <ul
            key={track}
            className="flex shrink-0 list-none items-center gap-10 p-0 pe-10 motion-safe:animate-marquee md:gap-16 md:pe-16"
          >
            {names.map((name, i) => (
              <li key={`${track}-${i}`} className="flex shrink-0 items-center gap-10 md:gap-16">
                <span className="whitespace-nowrap text-h1 text-muted">{name}</span>
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-line-strong" />
              </li>
            ))}
          </ul>
        ))}
      </div>

      {/* The same list, readable and static, for assistive technology. */}
      <p className="sr-only">{names.join('، ')}</p>
    </section>
  );
}
