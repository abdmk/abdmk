import Link from 'next/link';
import { Faq } from '@/components/home/Faq';
import { Hero } from '@/components/home/Hero';
import { ImpactBand } from '@/components/home/ImpactBand';
import { ProductRow } from '@/components/home/ProductRow';
import { ServiceList } from '@/components/home/ServiceList';
import { Stats } from '@/components/home/Stats';
import { Testimonials } from '@/components/home/Testimonials';
import { SmartImage } from '@/components/media/SmartImage';
import { ProjectGrid } from '@/components/project/ProjectGrid';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  categories as getCategories,
  companies as getCompanies,
  faq as getFaq,
  products as getProducts,
  projects as getProjects,
  services as getServices,
  settings as getSettings,
  testimonials as getTestimonials,
  workshops as getWorkshops,
} from '@/lib/content/queries';
import { splitByDate } from '@/lib/content/queries';
import type { Lang } from '@/lib/content/types';
import { formatDate, localePath, t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';

/**
 * The homepage is ordered as an argument, not as a menu.
 *
 * Who → proof → the work → what you can hire → what other people say → what you
 * can buy today → the objections → the invitation. Each section is a different
 * size on purpose: the work is the tallest thing on the page, the FAQ is the
 * flattest, and the closing statement carries the largest type on the site.
 */
export default async function HomePage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const tr = ui(lang);

  const [
    settings,
    projects,
    companies,
    categories,
    services,
    workshops,
    products,
    testimonials,
    faq,
  ] = await Promise.all([
    getSettings(),
    getProjects(),
    getCompanies(),
    getCategories(),
    getServices(),
    getWorkshops(),
    getProducts(),
    getTestimonials(),
    getFaq(),
  ]);

  const featured = projects.filter((p) => p.featured).slice(0, 6);
  const clients = companies.filter((c) => c.featured).slice(0, 6);
  const { upcoming } = splitByDate(workshops);
  const nextSessions = (upcoming.length ? upcoming : workshops).slice(0, 3);

  return (
    <>
      <Hero lang={lang} settings={settings} />
      <Stats lang={lang} settings={settings} />

      {/* ------------------------------------------------------------- Work */}
      <section className="shell mt-section">
        <SectionHeader
          label={tr.home.featuredWork}
          title={tr.work.title}
          size="lead"
          action={{ href: localePath(lang, '/work'), label: tr.home.viewAllWork }}
          className="mb-14 md:mb-20"
        />
        <ProjectGrid
          projects={featured}
          lang={lang}
          companies={companies}
          categories={categories}
          priorityCount={1}
          numbered
        />
      </section>

      {/* --------------------------------------------------------- Services */}
      <section className="shell mt-section">
        <SectionHeader
          label={tr.home.services}
          title={tr.services.title}
          intro={tr.services.intro}
          action={{ href: localePath(lang, '/services'), label: tr.home.viewAllServices }}
          className="mb-10 md:mb-16"
        />
        <ServiceList services={services} lang={lang} />
      </section>

      {/* --------------------------------------------------- Digital impact */}
      <ImpactBand categories={categories} lang={lang} />

      {/* ----------------------------------------------------- Client words */}
      <section className="shell mt-section">
        <SectionHeader
          label={tr.testimonials.title}
          title={tr.testimonials.intro}
          className="mb-8 md:mb-12"
        />
        <Testimonials items={testimonials} lang={lang} />
      </section>

      {/* ---------------------------------------------------------- Clients */}
      {clients.length ? (
        <section className="shell mt-section-sm">
          <p className="label rule pt-6">{tr.home.workedWith}</p>
          <ul className="mt-10 grid list-none grid-cols-2 items-center gap-x-6 gap-y-12 p-0 sm:grid-cols-3 md:mt-14">
            {clients.map((company) => (
              <li key={company.id}>
                <Link
                  href={localePath(lang, `/company/${company.slug}`)}
                  className="group flex items-center justify-center"
                >
                  {company.logo ? (
                    <SmartImage
                      src={company.logo.src}
                      alt={t(company.name, lang)}
                      width={160}
                      height={60}
                      sizes="160px"
                      className="h-9 w-auto opacity-50 transition-opacity duration-500 group-hover:opacity-100 dark:invert md:h-11"
                    />
                  ) : (
                    <span className="text-small text-muted transition-colors group-hover:text-ink">
                      {t(company.name, lang)}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* --------------------------------------------------------- Courses */}
      <section className="shell mt-section">
        <SectionHeader
          label={tr.home.workshops}
          title={tr.workshops.coursesTitle}
          action={{ href: localePath(lang, '/courses'), label: tr.home.viewAllWorkshops }}
          className="mb-10 md:mb-16"
        />
        <ul className="list-none p-0">
          {nextSessions.map((session, i) => (
            <Reveal as="li" key={session.id} index={Math.min(i, 2)} className="rule">
              <Link
                href={localePath(
                  lang,
                  `/${session.kind === 'course' ? 'course' : 'workshop'}/${session.slug}`,
                )}
                className="group grid-editorial items-baseline py-7 md:py-9"
              >
                <p className="meta-line numeric col-span-4 mb-2 md:col-span-2 md:mb-0">
                  {formatDate(session.date, lang)}
                </p>
                <h3 className="col-span-4 text-h2 md:col-span-6">
                  <span className="link-underline">{t(session.title, lang)}</span>
                </h3>
                <p className="meta-line col-span-4 mt-2 md:col-span-3 md:mt-0">
                  {tr.workshops.mode[session.mode]}
                  <span aria-hidden> · </span>
                  {t(session.location, lang)}
                </p>
                <span className="meta-line numeric col-span-4 mt-2 md:col-span-1 md:mt-0 md:justify-self-end">
                  {t(session.price, lang)}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* -------------------------------------------------------- Products */}
      <section className="shell mt-section-sm">
        <SectionHeader
          label={tr.products.title}
          title={tr.products.intro}
          action={{ href: localePath(lang, '/products'), label: tr.home.viewAllProducts }}
          className="mb-10 md:mb-16"
        />
        <ProductRow products={products} lang={lang} limit={4} />
      </section>

      {/* ----------------------------------------------------------- About */}
      <section className="shell mt-section">
        <div className="grid-editorial rule pt-6 md:pt-8">
          <Reveal className="col-span-4 md:col-span-5 xl:col-span-4">
            <div className="well relative" style={{ aspectRatio: '4 / 5' }}>
              <SmartImage
                src={settings.about.portrait.src}
                alt={t(settings.about.portrait.alt, lang)}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </Reveal>

          <Reveal className="col-span-4 md:col-span-6 md:col-start-7 md:self-center">
            <p className="label">{tr.home.about}</p>
            <p className="mt-6 text-h1 md:mt-8">{t(settings.about.intro, lang)}</p>
            <p className="measure mt-6 text-lead text-muted">{t(settings.about.body[0], lang)}</p>
            <ArrowLink href={localePath(lang, '/about')} className="mt-8">
              {tr.home.readMore}
            </ArrowLink>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------------------- FAQ */}
      <section className="shell mt-section">
        <SectionHeader title={tr.faq.title} intro={tr.faq.intro} className="mb-8 md:mb-12" />
        <Faq items={faq} lang={lang} />
      </section>
    </>
  );
}
