import Link from 'next/link';
import { Faq } from '@/components/home/Faq';
import { ImpactBand } from '@/components/home/ImpactBand';
import { ProductRow } from '@/components/home/ProductRow';
import { Stats } from '@/components/home/Stats';
import { Testimonials } from '@/components/home/Testimonials';
import { Icon } from '@/components/icons';
import { SmartImage } from '@/components/media/SmartImage';
import { ProjectGrid } from '@/components/project/ProjectGrid';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { BloomField } from '@/components/ui/Bloom';
import { ButtonLink } from '@/components/ui/Button';
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
  typefaces as getTypefaces,
  workshops as getWorkshops,
} from '@/lib/content/queries';
import { splitByDate } from '@/lib/content/queries';
import type { Lang } from '@/lib/content/types';
import { formatDate, localePath, t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';

export default async function HomePage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const tr = ui(lang);

  const [
    settings,
    projects,
    typefaces,
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
    getTypefaces(),
    getCompanies(),
    getCategories(),
    getServices(),
    getWorkshops(),
    getProducts(),
    getTestimonials(),
    getFaq(),
  ]);

  const featured = projects.filter((p) => p.featured).slice(0, 5);
  const selectedFonts = typefaces.filter((f) => f.featured).slice(0, 2);
  const clients = companies.filter((c) => c.featured).slice(0, 6);
  const topServices = services.filter((s) => s.featured).slice(0, 6);
  const { upcoming } = splitByDate(workshops);
  const nextSessions = (upcoming.length ? upcoming : workshops).slice(0, 2);

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="shell pt-6 sm:pt-8">
        <div className="card relative overflow-hidden px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <BloomField hues={['peach', 'lilac', 'sky']} intensity="strong" />

          <div className="relative lg:max-w-[68%] xl:max-w-[62%]">
            <span className="chip bg-sunken text-muted">{t(settings.role, lang)}</span>

            <h1 className="mt-6 max-w-[18ch] text-display">{t(settings.tagline, lang)}</h1>

            <p className="mt-6 max-w-prose text-lead text-muted lg:mt-8">
              {t(settings.heroStatement, lang)}
            </p>

            {/* The availability status — a live dot and a short line, read as a
                status rather than a decorative badge. */}
            <p className="mt-6 inline-flex items-center gap-2.5 text-small font-medium">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink opacity-40 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ink" />
              </span>
              {t(settings.contact.availability, lang)}
            </p>

            <div className="mt-7 flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:items-center">
              <ButtonLink
                href={localePath(lang, '/contact')}
                size="lg"
                icon="arrowRight"
                className="w-full xs:w-auto"
              >
                {tr.home.contactMe}
              </ButtonLink>
              <ButtonLink
                href={localePath(lang, '/work')}
                variant="ghost"
                size="lg"
                className="w-full xs:w-auto"
              >
                {tr.home.viewWork}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Stats */}
      <Stats lang={lang} settings={settings} />

      {/* -------------------------------------------------------- Featured work */}
      <section className="shell mt-section">
        <SectionHeader
          label={tr.home.featuredWork}
          title={tr.work.title}
          action={{ href: localePath(lang, '/work'), label: tr.home.viewAllWork }}
          className="mb-9 md:mb-12"
        />
        <ProjectGrid projects={featured} lang={lang} companies={companies} priorityCount={1} />
      </section>

      {/* --------------------------------------------------------- Services */}
      <section className="shell mt-section">
        <SectionHeader
          label={tr.home.services}
          title={tr.services.title}
          action={{ href: localePath(lang, '/services'), label: tr.home.viewAllServices }}
          className="mb-9 md:mb-12"
        />
        <ul className="grid list-none gap-3 p-0 md:grid-cols-2 lg:gap-4">
          {topServices.map((service, i) => (
            <Reveal as="li" key={service.id} index={i % 2} className="h-full">
              <Link
                href={`${localePath(lang, '/services')}#${service.slug}`}
                className="card card-hover group flex h-full items-start gap-4 p-5 sm:gap-5 sm:p-6"
              >
                <span className="numeric grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sunken text-small font-medium text-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-h3">{t(service.name, lang)}</h3>
                  <p className="mt-2 text-small text-muted">{t(service.description, lang)}</p>
                </div>
                <span
                  aria-hidden
                  className="mt-1 hidden h-8 w-8 shrink-0 place-items-center rounded-full bg-sunken text-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-surface sm:grid"
                >
                  <Icon name="arrowRight" size={14} flipRtl />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* --------------------------------------------------- Digital impact */}
      <section className="shell mt-section">
        <ImpactBand categories={categories} lang={lang} />
      </section>

      {/* ------------------------------------------------------- Client words */}
      <section className="shell mt-section">
        <SectionHeader
          label={tr.testimonials.title}
          title={tr.testimonials.intro}
          className="mb-9 md:mb-12"
        />
        <Testimonials items={testimonials} lang={lang} />
      </section>

      {/* ------------------------------------------------------- Selected fonts */}
      <section className="shell mt-section">
        <SectionHeader
          label={tr.home.selectedFonts}
          title={tr.fonts.title}
          intro={tr.fonts.intro}
          action={{ href: localePath(lang, '/fonts'), label: tr.home.viewAllFonts }}
          className="mb-9 md:mb-12"
        />
        <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
          {selectedFonts.map((font, i) => (
            <Reveal key={font.id} index={i} className="h-full">
              <Link
                href={localePath(lang, `/font/${font.slug}`)}
                className="card card-hover group flex h-full flex-col overflow-hidden p-2.5 sm:p-3"
              >
                <div
                  className="media-zoom relative overflow-hidden rounded-[calc(var(--radius-card)-0.5rem)] bg-sunken"
                  style={{ aspectRatio: '8 / 5' }}
                >
                  <SmartImage
                    src={font.preview.src}
                    alt={t(font.preview.alt, lang)}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-1 flex-col px-2.5 pb-2 pt-4 sm:px-3.5 sm:pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-h3">{t(font.name, lang)}</h3>
                    <span className="chip shrink-0">{t(font.type, lang)}</span>
                  </div>
                  <p className="mt-2 max-w-prose text-small text-muted">
                    {t(font.description, lang)}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- Worked with */}
      <section className="shell mt-section">
        <SectionHeader
          label={tr.home.workedWith}
          title={tr.companies.title}
          action={{ href: localePath(lang, '/companies'), label: tr.home.viewAllCompanies }}
          className="mb-9 md:mb-12"
        />
        <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:gap-4">
          {clients.map((company) => (
            <li key={company.id}>
              <Link
                href={localePath(lang, `/company/${company.slug}`)}
                className="card card-hover group flex h-28 items-center justify-center px-6 md:h-32 lg:h-36"
              >
                {company.logo ? (
                  <SmartImage
                    src={company.logo.src}
                    alt={t(company.name, lang)}
                    width={160}
                    height={60}
                    sizes="160px"
                    className="h-8 w-auto opacity-45 transition-opacity duration-500 group-hover:opacity-100 dark:invert md:h-10"
                  />
                ) : (
                  <span className="text-center text-small text-muted transition-colors group-hover:text-ink">
                    {t(company.name, lang)}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* -------------------------------------------------- Workshops & courses */}
      <section className="shell mt-section">
        <SectionHeader
          label={tr.home.workshops}
          title={tr.workshops.coursesTitle}
          action={{ href: localePath(lang, '/courses'), label: tr.home.viewAllWorkshops }}
          className="mb-9 md:mb-12"
        />
        <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
          {nextSessions.map((session, i) => (
            <Reveal key={session.id} index={i} className="h-full">
              <Link
                href={localePath(
                  lang,
                  `/${session.kind === 'course' ? 'course' : 'workshop'}/${session.slug}`,
                )}
                className="card card-hover group flex h-full flex-col overflow-hidden p-2.5 sm:p-3"
              >
                <div
                  className="media-zoom relative overflow-hidden rounded-[calc(var(--radius-card)-0.5rem)] bg-sunken"
                  style={{ aspectRatio: '8 / 5' }}
                >
                  <SmartImage
                    src={session.cover.src}
                    alt={t(session.cover.alt, lang)}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-1 flex-col px-2.5 pb-2 pt-4 sm:px-3.5 sm:pt-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip numeric">{formatDate(session.date, lang)}</span>
                    <span className="chip">{tr.workshops.mode[session.mode]}</span>
                  </div>
                  <h3 className="mt-3 text-h3">{t(session.title, lang)}</h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- Products */}
      <section className="shell mt-section">
        <SectionHeader
          label={tr.products.title}
          title={tr.products.intro}
          action={{ href: localePath(lang, '/products'), label: tr.home.viewAllProducts }}
          className="mb-9 md:mb-12"
        />
        <ProductRow products={products} lang={lang} limit={4} />
      </section>

      {/* --------------------------------------------------------------- About */}
      <section className="shell mt-section">
        <SectionHeader label={tr.home.about} title={t(settings.name, lang)} className="mb-9 md:mb-12" />
        <div className="card overflow-hidden p-2.5 sm:p-3">
          <div className="grid gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-5 xl:col-span-4">
              <div className="relative overflow-hidden rounded-[calc(var(--radius-card)-0.5rem)] bg-sunken">
                <SmartImage
                  src={settings.about.portrait.src}
                  alt={t(settings.about.portrait.alt, lang)}
                  width={settings.about.portrait.width}
                  height={settings.about.portrait.height}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="w-full"
                />
              </div>
            </Reveal>
            <Reveal className="flex flex-col justify-center px-3 pb-4 lg:col-span-7 lg:px-8 lg:py-8 xl:col-span-8 xl:px-12">
              <p className="text-h3 font-normal leading-snug">{t(settings.about.intro, lang)}</p>
              <p className="mt-5 max-w-prose text-lead text-muted">
                {t(settings.about.body[0], lang)}
              </p>
              <ArrowLink href={localePath(lang, '/about')} className="mt-7 self-start">
                {tr.home.readMore}
              </ArrowLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- FAQ */}
      <section className="shell mt-section">
        <SectionHeader label={tr.faq.title} title={tr.faq.intro} className="mb-9 md:mb-12" />
        <Faq items={faq} lang={lang} />
      </section>

      {/* ---------------------------------------------------------- Contact CTA */}
      <section className="shell mt-section">
        <div className="surface-invert relative overflow-hidden rounded-xl3 px-6 py-14 sm:rounded-xl4 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <BloomField hues={['mint', 'lilac', 'peach']} intensity="strong" className="opacity-50" />

          <div className="relative">
            <span className="chip bg-ink/10 text-ink">{tr.contact.title}</span>
            <h2 className="mt-6 max-w-[14ch] text-display">{tr.home.ctaTitle}</h2>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href={localePath(lang, '/contact')} className="btn btn-primary btn-lg">
                {tr.home.contactMe}
                <Icon name="arrowRight" size={19} flipRtl />
              </Link>
              <a
                href={`mailto:${settings.contact.email}`}
                className="btn btn-lg border border-line-strong text-ink hover:bg-ink/10"
              >
                {settings.contact.email}
              </a>
            </div>

            <p className="mt-8 text-small text-muted">{t(settings.contact.availability, lang)}</p>
          </div>
        </div>
      </section>
    </>
  );
}
