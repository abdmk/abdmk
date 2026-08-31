import { Reveal } from '@/components/ui/Reveal';
import type { Lang, Settings } from '@/lib/content/types';
import { t } from '@/lib/i18n/config';

/**
 * The proof band.
 *
 * The figures are the section — set at display size, aligned on a baseline, and
 * given a hairline above so they read as a single measured row rather than four
 * boxes. The labels stay deliberately small: a number nobody can read at a
 * glance proves nothing.
 */
export function Stats({ lang, settings }: { lang: Lang; settings: Settings }) {
  if (!settings.stats?.length) return null;

  return (
    <section className="shell mt-section-sm">
      <ul className="grid list-none grid-cols-2 gap-x-6 gap-y-10 p-0 md:grid-cols-4 md:gap-x-8">
        {settings.stats.map((stat, i) => (
          <Reveal as="li" key={stat.value + i} index={i} className="rule pt-5 md:pt-7">
            <p className="numeric text-display leading-none">{stat.value}</p>
            <p className="label mt-4 md:mt-6">{t(stat.label, lang)}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
