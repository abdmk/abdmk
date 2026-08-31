import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/icons';
import { SmartImage } from '@/components/media/SmartImage';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { companies as getCompanies, projects as getProjects } from '@/lib/content/queries';
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
    title: tr.companies.title,
    description: tr.companies.intro,
    alternates: {
      canonical: `/${lang}/companies`,
      languages: { ar: '/ar/companies', en: '/en/companies' },
    },
  };
}

export default async function CompaniesPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const tr = ui(lang);
  const [companies, projects] = await Promise.all([getCompanies(), getProjects()]);

  return (
    <div className="shell pb-section">
      <PageHeader
        title={tr.companies.title}
        intro={tr.companies.intro}
        meta={
          <span className="numeric">
            {companies.length} {tr.companies.title}
          </span>
        }
        className="mb-12 md:mb-16"
      />

      {/* An index, not a logo wall: each card carries the role, the period and
          the number of projects, so the list reads as experience. */}
      <ul className="list-none p-0">
        {companies.map((company, i) => {
          const count = projects.filter((p) => p.company === company.slug).length;
          return (
            <Reveal as="li" key={company.id} index={Math.min(i, 4)}>
              <Link
                href={localePath(lang, `/company/${company.slug}`)}
                className="group grid-editorial rule items-baseline py-7 md:py-9"
              >
                <h2 className="col-span-4 text-h2 md:col-span-4">
                  <span className="link-underline">{t(company.name, lang)}</span>
                </h2>

                <p className="col-span-4 mt-2 text-small text-muted md:col-span-3 md:mt-0">
                  {t(company.role, lang)}
                </p>

                <p className="meta-line col-span-4 mt-2 md:col-span-3 md:mt-0">
                  <span className="numeric">{t(company.period, lang)}</span>
                  <span aria-hidden> · </span>
                  {tr.companies.types[company.type]}
                  {count ? (
                    <>
                      <span aria-hidden> · </span>
                      <span className="numeric">
                        {count} {tr.work.projectCount}
                      </span>
                    </>
                  ) : null}
                </p>

                <span aria-hidden className="hidden md:col-span-2 md:block md:justify-self-end">
                  <Icon
                    name="arrowUpRight"
                    size={18}
                    className="text-faint transition-all duration-500 ease-editorial group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ink"
                  />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}
