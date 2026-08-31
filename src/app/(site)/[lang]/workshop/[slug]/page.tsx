import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WorkshopDetail } from '@/components/workshop/WorkshopIndex';
import {
  getWorkshop,
  getWorkshopsByKind,
  projectsByIds,
  servicesByIds,
} from '@/lib/content/queries';
import type { Lang } from '@/lib/content/types';
import { LANGS, localePath, t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';

export async function generateStaticParams() {
  const list = await getWorkshopsByKind('workshop');
  return LANGS.flatMap((lang) => list.map((w) => ({ lang, slug: w.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const session = await getWorkshop(slug, 'workshop');
  if (!session) return {};
  const title = t(session.title, lang);
  const description = t(session.description, lang);
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/workshop/${slug}`,
      languages: { ar: `/ar/workshop/${slug}`, en: `/en/workshop/${slug}` },
    },
    openGraph: { title, description, images: [{ url: session.cover.src }] },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Lang; slug: string }>;
}) {
  const { lang, slug } = await params;
  const session = await getWorkshop(slug, 'workshop');
  if (!session) notFound();

  const tr = ui(lang);
  const [projects, services] = await Promise.all([
    projectsByIds(session.relatedProjects),
    servicesByIds(session.relatedServices),
  ]);

  const related = [
    ...projects.map((p) => ({
      title: t(p.title, lang),
      href: localePath(lang, `/project/${p.slug}`),
    })),
    ...services.map((s) => ({
      title: t(s.name, lang),
      href: `${localePath(lang, '/services')}#${s.slug}`,
    })),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: t(session.title, lang),
            description: t(session.description, lang),
            startDate: session.date,
            endDate: session.endDate ?? session.date,
            eventAttendanceMode:
              session.mode === 'online'
                ? 'https://schema.org/OnlineEventAttendanceMode'
                : session.mode === 'hybrid'
                  ? 'https://schema.org/MixedEventAttendanceMode'
                  : 'https://schema.org/OfflineEventAttendanceMode',
            location:
              session.mode === 'online'
                ? { '@type': 'VirtualLocation', url: session.registrationUrl }
                : { '@type': 'Place', name: t(session.location, lang) },
            ...(session.registrationUrl ? { url: session.registrationUrl } : {}),
          }),
        }}
      />
      <WorkshopDetail
        session={session}
        related={related}
        lang={lang}
        backHref={localePath(lang, '/workshops')}
        backLabel={tr.workshops.title}
      />
    </>
  );
}
