import type { Metadata } from 'next';
import { WorkshopIndex } from '@/components/workshop/WorkshopIndex';
import { getWorkshopsByKind, splitByDate } from '@/lib/content/queries';
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
    title: tr.workshops.coursesTitle,
    description: tr.workshops.intro,
    alternates: {
      canonical: `/${lang}/courses`,
      languages: { ar: '/ar/courses', en: '/en/courses' },
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const tr = ui(lang);
  const { upcoming, past } = splitByDate(await getWorkshopsByKind('course'));
  return <WorkshopIndex title={tr.workshops.coursesTitle} upcoming={upcoming} past={past} lang={lang} />;
}
