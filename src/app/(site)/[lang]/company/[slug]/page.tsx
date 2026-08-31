import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/icons';
import { Gallery } from '@/components/media/Gallery';
import { SmartImage } from '@/components/media/SmartImage';
import { ProjectGrid } from '@/components/project/ProjectGrid';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  companies as getCompanies,
  getCompany,
  projectsForCompany,
  servicesByIds,
  settings as getSettings,
} from '@/lib/content/queries';
import type { Lang } from '@/lib/content/types';
import { LANGS, localePath, t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';

export async function generateStaticParams() {
  const list = await getCompanies();
  return LANGS.flatMap((lang) => list.map((c) => ({ lang, slug: c.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const company = await getCompany(slug);
  if (!company) return {};
  const title = t(company.name, lang);
  const description = t(company.description, lang);
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/company/${slug}`,
      languages: { ar: `/ar/company/${slug}`, en: `/en/company/${slug}` },
    },
    openGraph: { title, description },
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ lang: Lang; slug: string }>;
}) {
  const { lang, slug } = await params;
  const company = await getCompany(slug);
  if (!company) notFound();

  const tr = ui(lang);
  const [projects, companies, companyServices, settings] = await Promise.all([
    projectsForCompany(slug),
    getCompanies(),
    servicesByIds(company.services),
    getSettings(),
  ]);

  return (
    <article className="shell pb-section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: t(company.name, lang),
            description: t(company.description, lang),
            ...(company.url ? { url: company.url } : {}),
            ...(company.logo
              ? { logo: new URL(company.logo.src, settings.seo.siteUrl).toString() }
              : {}),
          }),
        }}
      />

      <header className="pt-14 md:pt-20">
        <Link
          href={localePath(lang, '/companies')}
          className="label inline-flex items-center gap-2 hover:text-ink"
        >
          <Icon name="arrowLeft" size={12} flipRtl />
          {tr.companies.title}
        </Link>

        {company.logo ? (
          <SmartImage
            src={company.logo.src}
            alt={`${t(company.name, lang)} logo`}
            width={160}
            height={60}
            sizes="160px"
            className="mt-8 h-9 w-auto dark:invert"
          />
        ) : null}

        <h1 className="mt-6 max-w-[14ch] text-mega md:mt-8">{t(company.name, lang)}</h1>

        <div className="grid-editorial mt-8 md:mt-12">
          <p className="measure col-span-4 text-lead text-muted md:col-span-6">
            {t(company.description, lang)}
          </p>

          <div className="col-span-4 md:col-span-4 md:col-start-9">
            <dl className="m-0">
              <div className="border-t border-line py-3">
                <dt className="label mb-1.5">{tr.companies.role}</dt>
                <dd className="text-small">{t(company.role, lang)}</dd>
              </div>
              <div className="border-t border-line py-3">
                <dt className="label mb-1.5">{tr.companies.period}</dt>
                <dd className="numeric text-small">{t(company.period, lang)}</dd>
              </div>
              <div className="border-t border-line py-3">
                <dt className="label mb-1.5">{tr.companies.type}</dt>
                <dd className="text-small">{tr.companies.types[company.type]}</dd>
              </div>
              {companyServices.length ? (
                <div className="border-t border-line py-3">
                  <dt className="label mb-1.5">{tr.project.services}</dt>
                  <dd>
                    <ul className="list-none space-y-1 p-0 text-small">
                      {companyServices.map((service) => (
                        <li key={service.id}>
                          <Link
                            href={`${localePath(lang, '/services')}#${service.slug}`}
                            className="link-underline"
                          >
                            {t(service.name, lang)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ) : null}
            </dl>

            {company.url ? (
              <a
                href={company.url}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-ghost btn-sm mt-6"
              >
                {tr.companies.visitSite}
                <Icon name="arrowUpRight" size={14} />
              </a>
            ) : null}
          </div>
        </div>
      </header>

      {company.images.length ? (
        <div className="mt-14 md:mt-20">
          <Gallery media={company.images} lang={lang} columns={2} />
        </div>
      ) : null}

      <section className="mt-section">
        <SectionHeader title={tr.companies.selectedProjects} className="mb-10 md:mb-16" />
        {projects.length ? (
          <ProjectGrid projects={projects} lang={lang} companies={companies} priorityCount={1} />
        ) : (
          <p className="rule py-12 text-lead text-muted">{tr.companies.noProjects}</p>
        )}
      </section>
    </article>
  );
}
