import type { Category, Lang } from '@/lib/content/types';
import { t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';

/** The range of disciplines the work actually lands in, as a quiet chip cloud
 * inside a card — proof of range without competing with the work itself. */
export function ImpactBand({ categories, lang }: { categories: Category[]; lang: Lang }) {
  const tr = ui(lang);
  if (!categories.length) return null;

  return (
    <div className="card px-6 py-10 sm:px-10 sm:py-12">
      <p className="label">{tr.impact.title}</p>
      <p className="mt-4 max-w-2xl text-lead text-muted">{tr.impact.intro}</p>
      <ul className="mt-7 flex list-none flex-wrap gap-2 p-0 sm:mt-9">
        {categories.map((category) => (
          <li key={category.slug}>
            <span className="chip">{t(category.name, lang)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
