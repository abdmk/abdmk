import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/icons';
import { SmartImage } from '@/components/media/SmartImage';
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
    <div className="shell py-14 md:py-20">
      <header className="mb-12 md:mb-16">
        <h1 className="text-display font-light">{tr.companies.title}</h1>
        <p className="mt-6 max-w-prose text-lead text-muted">{tr.companies.intro}</p>
      </header>

      {/* An index, not a logo wall: each row carries the role, the period and the
          number of projects, so the list reads as experience rather than decoration. */}
      <ul className="list-none border-t border-line p-0">
        {companies.map((company, i) => {
          const count = projects.filter((p) => p.company === company.slug).length;
          return (
            <Reveal as="li" key={company.id} index={Math.min(i, 4)}>
              <Link
                href={localePath(lang, `/company/${company.slug}`)}
                className="group grid items-center gap-x-8 gap-y-3 border-b border-line py-7 md:grid-cols-12 md:py-9"
              >
                <div className="flex items-center gap-5 md:col-span-4">
                  {company.logo ? (
                    <SmartImage
                      src={company.logo.src}
                      alt=""
                      width={100}
                      height={38}
                      sizes="100px"
                      className="h-8 w-auto opacity-40 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  ) : null}
                  <h2 className="text-h3 font-medium">
                    <span className="link-underline">{t(company.name, lang)}</span>
                  </h2>
                </div>

                <p className="text-small text-muted md:col-span-3">{t(company.role, lang)}</p>
                <p className="numeric text-small text-faint md:col-span-2">
                  {t(company.period, lang)}
                </p>
                <p className="text-small text-faint md:col-span-2">
                  {tr.companies.types[company.type]}
                </p>

                <span className="hidden items-center justify-end gap-3 md:col-span-1 md:flex">
                  {count ? <span className="numeric text-small text-faint">{count}</span> : null}
                  <Icon
                    name="arrowRight"
                    size={17}
                    flipRtl
                    className="text-faint transition-transform duration-500 ease-editorial group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
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
