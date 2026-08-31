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
    <div className="shell pb-section pt-6 sm:pt-8">
      <PageHeader
        title={tr.companies.title}
        intro={tr.companies.intro}
        hues={['mint', 'sky', 'lilac']}
        meta={
          <span className="chip numeric">
            {companies.length} {tr.companies.title}
          </span>
        }
        className="mb-9 md:mb-12"
      />

      {/* An index, not a logo wall: each card carries the role, the period and
          the number of projects, so the list reads as experience. */}
      <ul className="list-none space-y-3 p-0 lg:space-y-4">
        {companies.map((company, i) => {
          const count = projects.filter((p) => p.company === company.slug).length;
          return (
            <Reveal as="li" key={company.id} index={Math.min(i, 4)}>
              <Link
                href={localePath(lang, `/company/${company.slug}`)}
                className="card card-hover group grid items-center gap-x-6 gap-y-4 p-5 sm:p-6 md:grid-cols-12 lg:px-8"
              >
                <div className="flex items-center gap-4 md:col-span-4">
                  {company.logo ? (
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sunken">
                      <SmartImage
                        src={company.logo.src}
                        alt=""
                        width={100}
                        height={38}
                        sizes="100px"
                        className="h-5 w-auto opacity-50 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    </span>
                  ) : null}
                  <h2 className="text-h3">{t(company.name, lang)}</h2>
                </div>

                <p className="text-small text-muted md:col-span-3">{t(company.role, lang)}</p>

                <div className="flex flex-wrap gap-2 md:col-span-4">
                  <span className="chip numeric">{t(company.period, lang)}</span>
                  <span className="chip">{tr.companies.types[company.type]}</span>
                  {count ? (
                    <span className="chip numeric">
                      {count} {tr.work.projectCount}
                    </span>
                  ) : null}
                </div>

                <span
                  aria-hidden
                  className="hidden justify-self-end md:col-span-1 md:grid md:h-9 md:w-9 md:place-items-center md:rounded-full md:bg-sunken md:text-ink md:transition-colors md:duration-500 md:group-hover:bg-ink md:group-hover:text-surface"
                >
                  <Icon name="arrowRight" size={15} flipRtl />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}
