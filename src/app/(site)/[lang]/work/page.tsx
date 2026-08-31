import type { Metadata } from 'next';
import { Suspense } from 'react';
import { WorkFilters } from '@/components/project/WorkFilters';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  activeCategories,
  companies as getCompanies,
  projects as getProjects,
} from '@/lib/content/queries';
import type { Lang } from '@/lib/content/types';
import { ui } from '@/lib/i18n/dictionary';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const tr = ui(lang);
  return {
    title: tr.work.title,
    description: tr.fonts.intro,
    alternates: { canonical: `/${lang}/work`, languages: { ar: '/ar/work', en: '/en/work' } },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const tr = ui(lang);
  const [projects, categories, companies] = await Promise.all([
    getProjects(),
    activeCategories(),
    getCompanies(),
  ]);

  return (
    <div className="shell pb-section pt-6 sm:pt-8">
      <PageHeader
        title={tr.work.title}
        meta={
          <span className="chip numeric">
            {projects.length} {tr.work.projectCount}
          </span>
        }
        className="mb-9 md:mb-12"
      />

      <Suspense fallback={<div className="py-20 text-center text-muted">{tr.common.loading}</div>}>
        <WorkFilters projects={projects} categories={categories} companies={companies} lang={lang} />
      </Suspense>
    </div>
  );
}
