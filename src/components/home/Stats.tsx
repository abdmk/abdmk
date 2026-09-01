import { Reveal } from '@/components/ui/Reveal';
import type { Lang, Settings } from '@/lib/content/types';
import { t } from '@/lib/i18n/config';

/**
 * The proof band. Four figures on one card, each on its own quiet tile —
 * the number carries the section, so it is set at display size and the
 * label stays small and muted underneath it.
 */
export function Stats({ lang, settings }: { lang: Lang; settings: Settings }) {
  if (!settings.stats?.length) return null;

  return (
    <section className="shell mt-section">
      <div className="card grid grid-cols-2 gap-px overflow-hidden bg-line md:grid-cols-4">
        {settings.stats.map((stat, i) => (
          <Reveal
            as="div"
            key={stat.value + i}
            index={i}
            className="bg-surface px-6 py-9 sm:px-8 sm:py-11"
          >
            <p className="numeric text-display leading-none">{stat.value}</p>
            <p className="label mt-3">{t(stat.label, lang)}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
