import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/icons';
import { SmartImage } from '@/components/media/SmartImage';
import { ArrowLink } from '@/components/ui/ArrowLink';
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
    <div className="py-14 md:py-20">
      <header className="shell mb-16 md:mb-24">
        <h1 className="text-display font-light">{tr.services.title}</h1>
        <p className="mt-6 max-w-prose text-lead text-muted">{tr.services.intro}</p>
      </header>

      {/* Each service is a full section with an anchor, so a project's service
          links and the homepage list can point straight at one. */}
      <div className="shell space-y-24 md:space-y-32">
        {services.map((service, i) => {
          const related = projects.filter((p) => p.services.includes(service.slug)).slice(0, 3);
          return (
            <Reveal as="section" key={service.id}>
              <div id={service.slug} className="scroll-mt-28">
                <div className="grid gap-8 border-t border-line pt-6 md:grid-cols-12 md:gap-12">
                  <div className="md:col-span-1">
                    <p className="label numeric">{String(i + 1).padStart(2, '0')}</p>
                  </div>

                  <div className="md:col-span-6">
                    <h2 className="text-h1 font-light">{t(service.name, lang)}</h2>
                    <p className="mt-5 max-w-prose text-lead text-muted">
                      {t(service.description, lang)}
                    </p>

                    <h3 className="label mb-3 mt-9">{tr.services.deliverables}</h3>
                    <ul className="list-none p-0">
                      {service.deliverables.map((item, k) => (
                        <li
                          key={k}
                          className="flex items-start gap-3 border-b border-line py-2.5 text-small"
                        >
                          <Icon name="arrowSmallRight" size={14} flipRtl className="mt-1 text-faint" />
                          {t(item, lang)}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                      <ArrowLink
                        href={`${localePath(lang, '/contact')}?service=${service.slug}`}
                      >
                        {tr.services.enquire}
                      </ArrowLink>
                    </div>
                  </div>

                  {service.image ? (
                    <div className="md:col-span-4 md:col-start-9">
                      <SmartImage
                        src={service.image.src}
                        alt={t(service.image.alt, lang)}
                        width={service.image.width}
                        height={service.image.height}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="w-full"
                      />
                    </div>
                  ) : null}
                </div>

                {related.length ? (
                  <div className="mt-10 md:ms-[8.333%]">
                    <h3 className="label mb-4">{tr.services.relatedWork}</h3>
                    <ul className="flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
                      {related.map((project) => (
                        <li key={project.id}>
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
            </Reveal>
          );
        })}
      </div>

      <section className="shell mt-section">
        <div className="rule pt-10">
          <p className="label">{tr.contact.title}</p>
          <Link href={localePath(lang, '/contact')} className="group mt-5 block">
            <h2 className="text-h1 font-light">
              <span className="link-underline">{tr.home.ctaTitle}</span>
            </h2>
          </Link>
          <p className="mt-4 text-small text-muted">{t(settings.contact.availability, lang)}</p>
        </div>
      </section>
    </div>
  );
}
