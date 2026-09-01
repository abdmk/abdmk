import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/icons';
import { ServicePricing } from '@/components/home/ServicePricing';
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
    <div className="shell pb-section pt-6 sm:pt-8">
      <PageHeader
        title={tr.services.title}
        intro={tr.services.intro}
        hues={['sky', 'mint', 'peach']}
        meta={
          <span className="chip numeric">
            {services.length} {tr.services.title}
          </span>
        }
        className="mb-9 md:mb-12"
      />

      {/* Each service is a card with an anchor, so a project's service links and
          the homepage list can point straight at one. */}
      <div className="space-y-5 lg:space-y-6">
        {services.map((service, i) => {
          const related = projects.filter((p) => p.services.includes(service.slug)).slice(0, 3);
          return (
            <Reveal as="section" key={service.id}>
              <div
                id={service.slug}
                className="card scroll-mt-28 p-6 sm:p-8 lg:p-10 xl:p-12"
              >
                <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                  <div className="lg:col-span-7 xl:col-span-6">
                    <div className="flex items-center gap-3">
                      <span className="numeric grid h-10 w-10 place-items-center rounded-full bg-sunken text-small font-medium text-muted">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h2 className="text-h1">{t(service.name, lang)}</h2>
                    </div>

                    <p className="mt-5 max-w-prose text-lead text-muted">
                      {t(service.description, lang)}
                    </p>

                    <h3 className="label mb-3 mt-8">{tr.services.deliverables}</h3>
                    <ul className="grid list-none gap-2 p-0 sm:grid-cols-2">
                      {service.deliverables.map((item, k) => (
                        <li
                          key={k}
                          className="flex items-start gap-2.5 rounded-xl2 bg-sunken px-4 py-3 text-small"
                        >
                          <Icon
                            name="check"
                            size={14}
                            className="mt-1 shrink-0 text-faint"
                          />
                          {t(item, lang)}
                        </li>
                      ))}
                    </ul>

                    <ServicePricing service={service} lang={lang} />

                    <div className="mt-8">
                      <ArrowLink href={`${localePath(lang, '/contact')}?service=${service.slug}`}>
                        {tr.services.enquire}
                      </ArrowLink>
                    </div>
                  </div>

                  {service.image ? (
                    <div className="lg:col-span-5">
                      <div className="overflow-hidden rounded-xl3 bg-sunken">
                        <SmartImage
                          src={service.image.src}
                          alt={t(service.image.alt, lang)}
                          width={service.image.width}
                          height={service.image.height}
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          className="w-full"
                        />
                      </div>
                    </div>
                  ) : null}
                </div>

                {related.length ? (
                  <div className="mt-9 border-t border-line pt-6">
                    <h3 className="label mb-3">{tr.services.relatedWork}</h3>
                    <ul className="flex list-none flex-wrap gap-2 p-0">
                      {related.map((project) => (
                        <li key={project.id}>
                          <Link
                            href={localePath(lang, `/project/${project.slug}`)}
                            className="chip transition-colors duration-300 hover:bg-ink hover:text-surface"
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

      <section className="mt-section">
        <div className="surface-invert relative overflow-hidden rounded-xl3 px-6 py-12 sm:rounded-xl4 sm:px-10 sm:py-16 lg:px-14">
          <BloomField hues={['peach', 'lilac', 'mint']} intensity="strong" className="opacity-50" />
          <div className="relative">
            <span className="chip bg-ink/10 text-ink">{tr.contact.title}</span>
            <h2 className="mt-5 max-w-[16ch] text-h1">{tr.home.ctaTitle}</h2>
            <p className="mt-4 text-small text-muted">{t(settings.contact.availability, lang)}</p>
            <Link
              href={localePath(lang, '/contact')}
              className="btn btn-primary mt-7"
            >
              {tr.home.contactMe}
              <Icon name="arrowRight" size={17} flipRtl />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
