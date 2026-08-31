'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Icon } from '@/components/icons';
import { ProjectGrid } from '@/components/project/ProjectGrid';
import type { Category, Company, Lang, Project } from '@/lib/content/types';
import { t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';
import { cn } from '@/lib/utils';

interface WorkFiltersProps {
  projects: Project[];
  categories: (Category & { count: number })[];
  companies: Company[];
  lang: Lang;
}

/**
 * Category filtering for the work index.
 *
 * The filter lives in the URL (`?category=branding`) so a filtered view can be
 * linked and shared, and so the back button behaves. Filtering happens on the
 * client over an already-loaded list — the whole index is a handful of KB of
 * metadata, and this keeps switching instant.
 */
export function WorkFilters({ projects, categories, companies, lang }: WorkFiltersProps) {
  const tr = ui(lang);
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get('category') ?? 'all';
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () => (active === 'all' ? projects : projects.filter((p) => p.categories.includes(active))),
    [projects, active],
  );

  const select = (slug: string) => {
    const query = slug === 'all' ? '' : `?category=${slug}`;
    router.replace(`${window.location.pathname}${query}`, { scroll: false });
    setOpen(false);
  };

  const options = [{ slug: 'all', name: { ar: 'الكل', en: 'All' }, count: projects.length }, ...categories];
  const activeLabel = options.find((o) => o.slug === active)?.name;

  return (
    <>
      <div className="mb-10 md:mb-14">
        {/* Mobile: a disclosure, so a long taxonomy does not push the work down. */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex w-full items-center justify-between border-y border-line py-3.5"
          >
            <span className="inline-flex items-center gap-2.5 text-small font-medium">
              <Icon name="filter" size={15} />
              {tr.work.filter}: {t(activeLabel, lang)}
            </span>
            <Icon
              name="chevronDown"
              size={16}
              className={cn('transition-transform duration-300', open && 'rotate-180')}
            />
          </button>
          {open ? (
            <ul className="list-none border-b border-line p-0 py-2">
              {options.map((option) => (
                <li key={option.slug}>
                  <button
                    type="button"
                    onClick={() => select(option.slug)}
                    aria-current={active === option.slug ? 'true' : undefined}
                    className={cn(
                      'flex w-full items-center justify-between py-2 text-small',
                      active === option.slug ? 'font-medium' : 'text-muted',
                    )}
                  >
                    {t(option.name, lang)}
                    <span className="numeric text-faint">{option.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Desktop: the whole taxonomy on one line, scrollable if it overflows. */}
        <ul
          className="no-scrollbar hidden list-none gap-x-5 gap-y-2 overflow-x-auto border-y border-line p-0 py-3.5 md:flex md:flex-wrap"
          aria-label={tr.work.filter}
        >
          {options.map((option) => (
            <li key={option.slug}>
              <button
                type="button"
                onClick={() => select(option.slug)}
                aria-current={active === option.slug ? 'true' : undefined}
                className={cn(
                  'group inline-flex items-baseline gap-1.5 whitespace-nowrap text-small transition-colors',
                  active === option.slug ? 'font-medium text-ink' : 'text-muted hover:text-ink',
                )}
              >
                <span className={cn(active === option.slug && 'link-underline !bg-[length:100%_1px]')}>
                  {t(option.name, lang)}
                </span>
                <span className="numeric text-meta text-faint">{option.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {filtered.length ? (
        <ProjectGrid
          key={active}
          projects={filtered}
          lang={lang}
          companies={companies}
          priorityCount={2}
        />
      ) : (
        <p className="py-20 text-center text-lead text-muted">{tr.work.empty}</p>
      )}
    </>
  );
}
