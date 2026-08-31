import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/icons';
import { SmartImage } from '@/components/media/SmartImage';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { BloomField } from '@/components/ui/Bloom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import {
  projects as getProjects,
  services as getServices,
  settings as getSettings,
} from '@/lib/content/queries';
import type { Lang } from '@/lib/content/types';
import { localePath, t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const tr = ui(lang);
  return {
    title: tr.services.title,
    description: tr.services.intro,
    alternates: {
      canonical: `/${lang}/services`,
      languages: { ar: '/ar/services', en: '/en/services' },
    },
  };
}

export default async function ServicesPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const tr = ui(lang);
  const [services, projects, settings] = await Promise.all([
    getServices(),
    getProjects(),
    getSettings(),
  ]);

  return (
    <div className="shell pb-section">
      <PageHeader
        title={tr.services.title}
        intro={tr.services.intro}
        meta={
          <span className="numeric">
            {services.length} {tr.services.title}
          </span>
        }
        className="mb-16 md:mb-24"
      />

      {/* Each service is a card with an anchor, so a project's service links and
          the homepage list can point straight at one. */}
      <div className="space-y-section-sm">
        {services.map((service, i) => {
          const related = projects.filter((p) => p.services.includes(service.slug)).slice(0, 3);
          return (
            <Reveal as="section" key={service.id}>
              <div id={service.slug} className="rule scroll-mt-24 pt-6 md:pt-8">
                <div className="grid-editorial">
                  <p className="label numeric col-span-4 md:col-span-1">
                    {String(i + 1).padStart(2, '0')}
                  </p>

                  <div className="col-span-4 md:col-span-6">
                    <h2 className="text-display">{t(service.name, lang)}</h2>
                    <p className="measure mt-6 text-lead text-muted">
                      {t(service.description, lang)}
                    </p>

                    <h3 className="label mb-4 mt-10">{tr.services.deliverables}</h3>
                    <ul className="grid list-none gap-x-8 p-0 sm:grid-cols-2">
                      {service.deliverables.map((item, k) => (
                        <li
                          key={k}
                          className="flex items-start gap-3 border-t border-line py-3 text-small"
                        >
                          <Icon name="arrowSmallRight" size={13} flipRtl className="mt-1.5 shrink-0 text-faint" />
                          {t(item, lang)}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-9">
                      <ArrowLink href={`${localePath(lang, '/contact')}?service=${service.slug}`}>
                        {tr.services.enquire}
                      </ArrowLink>
                    </div>
                  </div>

                  {service.image ? (
                    <div className="col-span-4 md:col-span-4 md:col-start-9">
                      <div className="well">
                        <SmartImage
                          src={service.image.src}
                          alt={t(service.image.alt, lang)}
                          width={service.image.width}
                          height={service.image.height}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="w-full"
                        />
                      </div>

                      {related.length ? (
                        <div className="mt-8">
                          <h3 className="label mb-3">{tr.services.relatedWork}</h3>
                          <ul className="list-none p-0">
                            {related.map((project) => (
                              <li key={project.id} className="border-t border-line py-2.5">
                                <Link
                                  href={localePath(lang, `/project/${project.slug}`)}
                                  className="link-underline text-small"
                                >
                                  {t(project.title, lang)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

    </div>
  );
}
