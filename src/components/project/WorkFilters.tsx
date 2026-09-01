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
      <div className="mb-8 md:mb-12">
        {/* Mobile: a disclosure card, so a long taxonomy does not push work down. */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="card flex w-full items-center justify-between px-5 py-4"
          >
            <span className="inline-flex items-center gap-2.5 text-small font-medium">
              <Icon name="filter" size={15} className="text-faint" />
              {tr.work.filter}: {t(activeLabel, lang)}
            </span>
            <Icon
              name="chevronDown"
              size={16}
              className={cn('text-faint transition-transform duration-300', open && 'rotate-180')}
            />
          </button>
          {open ? (
            <ul className="card mt-2 list-none p-2">
              {options.map((option) => (
                <li key={option.slug}>
                  <button
                    type="button"
                    onClick={() => select(option.slug)}
                    aria-current={active === option.slug ? 'true' : undefined}
                    className={cn(
                      'flex w-full items-center justify-between rounded-full px-4 py-2.5 text-small transition-colors',
                      active === option.slug
                        ? 'bg-ink font-medium text-surface'
                        : 'text-muted hover:bg-sunken',
                    )}
                  >
                    {t(option.name, lang)}
                    <span className="numeric opacity-70">{option.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Desktop: the taxonomy as a wrapping row of pills. */}
        <ul
          className="hidden list-none flex-wrap gap-2 p-0 md:flex"
          aria-label={tr.work.filter}
        >
          {options.map((option) => (
            <li key={option.slug}>
              <button
                type="button"
                onClick={() => select(option.slug)}
                aria-current={active === option.slug ? 'true' : undefined}
                className={cn(
                  'inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-small',
                  'transition-colors duration-300',
                  active === option.slug
                    ? 'bg-ink font-medium text-surface shadow-pill'
                    : 'bg-surface text-muted shadow-soft hover:text-ink',
                )}
              >
                {t(option.name, lang)}
                <span
                  className={cn(
                    'numeric text-meta',
                    active === option.slug ? 'opacity-70' : 'text-faint',
                  )}
                >
                  {option.count}
                </span>
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
