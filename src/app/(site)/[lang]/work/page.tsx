import type { Metadata } from 'next';
import { Suspense } from 'react';
import { WorkFilters } from '@/components/project/WorkFilters';
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
    <div className="shell py-14 md:py-20">
      <header className="mb-12 md:mb-16">
        <h1 className="text-display font-light">{tr.work.title}</h1>
        <p className="label numeric mt-6">
          {projects.length} {tr.work.projectCount}
        </p>
      </header>

      <Suspense fallback={<div className="py-20 text-center text-muted">{tr.common.loading}</div>}>
        <WorkFilters projects={projects} categories={categories} companies={companies} lang={lang} />
      </Suspense>
    </div>
  );
}
