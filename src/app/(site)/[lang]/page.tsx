import Link from 'next/link';
import { Icon } from '@/components/icons';
import { SmartImage } from '@/components/media/SmartImage';
import { ProjectGrid } from '@/components/project/ProjectGrid';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  companies as getCompanies,
  projects as getProjects,
  services as getServices,
  settings as getSettings,
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

  const [settings, projects, typefaces, companies, services, workshops] = await Promise.all([
    getSettings(),
    getProjects(),
    getTypefaces(),
    getCompanies(),
    getServices(),
    getWorkshops(),
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
      <section className="shell pb-20 pt-14 md:pb-28 md:pt-24">
        <h1 className="max-w-[16ch] text-display font-light">
          {t(settings.tagline, lang)}
        </h1>
        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12">
          <p className="text-lead text-muted md:col-span-7 md:col-start-1">
            {t(settings.heroStatement, lang)}
          </p>
          <div className="flex flex-wrap items-start gap-x-8 gap-y-4 md:col-span-4 md:col-start-9 md:justify-end">
            <ArrowLink href={localePath(lang, '/work')} size="lead">
              {tr.home.viewWork}
            </ArrowLink>
            <ArrowLink href={localePath(lang, '/contact')} size="lead">
              {tr.home.contactMe}
            </ArrowLink>
          </div>
        </div>
        <p className="label mt-12 md:mt-16">{t(settings.role, lang)}</p>
      </section>

      {/* -------------------------------------------------------- Featured work */}
      <section className="shell">
        <SectionHeader
          label={tr.home.featuredWork}
          title={tr.work.title}
          action={{ href: localePath(lang, '/work'), label: tr.home.viewAllWork }}
          className="mb-12 md:mb-16"
        />
        <ProjectGrid projects={featured} lang={lang} companies={companies} priorityCount={1} />
      </section>

      {/* ------------------------------------------------------- Selected fonts */}
      <section className="shell mt-section">
        <SectionHeader
          label={tr.home.selectedFonts}
          title={tr.fonts.title}
          intro={tr.fonts.intro}
          action={{ href: localePath(lang, '/fonts'), label: tr.home.viewAllFonts }}
          className="mb-12 md:mb-16"
        />
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
          {selectedFonts.map((font, i) => (
            <Reveal key={font.id} index={i}>
              <Link href={localePath(lang, `/font/${font.slug}`)} className="group block">
                <div
                  className="media-zoom relative overflow-hidden bg-ink/[0.04]"
                  style={{ aspectRatio: '8 / 5' }}
                >
                  <SmartImage
                    src={font.preview.src}
                    alt={t(font.preview.alt, lang)}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="text-h3 font-medium">
                    <span className="link-underline">{t(font.name, lang)}</span>
                  </h3>
                  <span className="label">{t(font.type, lang)}</span>
                </div>
                <p className="mt-2 max-w-prose text-small text-muted">{t(font.description, lang)}</p>
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
          className="mb-10 md:mb-14"
        />
        <ul className="grid list-none grid-cols-2 gap-px border border-line bg-line p-0 sm:grid-cols-3">
          {clients.map((company) => (
            <li key={company.id} className="bg-paper">
              <Link
                href={localePath(lang, `/company/${company.slug}`)}
                className="group flex h-28 items-center justify-center px-6 md:h-36"
              >
                {company.logo ? (
                  <SmartImage
                    src={company.logo.src}
                    alt={t(company.name, lang)}
                    width={160}
                    height={60}
                    sizes="160px"
                    className="h-9 w-auto opacity-45 transition-opacity duration-500 group-hover:opacity-100 md:h-11"
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

      {/* ------------------------------------------------------------ Services */}
      <section className="shell mt-section">
        <SectionHeader
          label={tr.home.services}
          title={tr.services.title}
          action={{ href: localePath(lang, '/services'), label: tr.home.viewAllServices }}
          className="mb-8 md:mb-12"
        />
        <ul className="list-none p-0">
          {topServices.map((service, i) => (
            <Reveal as="li" key={service.id} index={i}>
              <Link
                href={`${localePath(lang, '/services')}#${service.slug}`}
                className="group grid items-baseline gap-x-8 gap-y-1 border-b border-line py-6 md:grid-cols-12"
              >
                <span className="label numeric md:col-span-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-h3 font-medium md:col-span-4">
                  <span className="link-underline">{t(service.name, lang)}</span>
                </h3>
                <p className="text-small text-muted md:col-span-6">{t(service.description, lang)}</p>
                <span className="hidden justify-self-end md:col-span-1 md:block">
                  <Icon
                    name="arrowRight"
                    size={18}
                    flipRtl
                    className="text-faint transition-transform duration-500 ease-editorial group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* -------------------------------------------------- Workshops & courses */}
      <section className="shell mt-section">
        <SectionHeader
          label={tr.home.workshops}
          title={tr.workshops.title}
          action={{ href: localePath(lang, '/workshops'), label: tr.home.viewAllWorkshops }}
          className="mb-12 md:mb-16"
        />
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
          {nextSessions.map((session, i) => (
            <Reveal key={session.id} index={i}>
              <Link
                href={localePath(
                  lang,
                  `/${session.kind === 'course' ? 'course' : 'workshop'}/${session.slug}`,
                )}
                className="group block"
              >
                <div
                  className="media-zoom relative overflow-hidden bg-ink/[0.04]"
                  style={{ aspectRatio: '8 / 5' }}
                >
                  <SmartImage
                    src={session.cover.src}
                    alt={t(session.cover.alt, lang)}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <p className="label mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="numeric">{formatDate(session.date, lang)}</span>
                  <span aria-hidden>·</span>
                  <span>{tr.workshops.mode[session.mode]}</span>
                </p>
                <h3 className="mt-2 text-h3 font-medium">
                  <span className="link-underline">{t(session.title, lang)}</span>
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- About */}
      <section className="shell mt-section">
        <SectionHeader label={tr.home.about} title={t(settings.name, lang)} className="mb-12" />
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <Reveal className="md:col-span-4">
            <SmartImage
              src={settings.about.portrait.src}
              alt={t(settings.about.portrait.alt, lang)}
              width={settings.about.portrait.width}
              height={settings.about.portrait.height}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="w-full"
            />
          </Reveal>
          <Reveal className="md:col-span-7 md:col-start-6">
            <p className="text-h3 font-light leading-snug">{t(settings.about.intro, lang)}</p>
            <p className="mt-6 max-w-prose text-lead text-muted">
              {t(settings.about.body[0], lang)}
            </p>
            <ArrowLink href={localePath(lang, '/about')} className="mt-8">
              {tr.home.readMore}
            </ArrowLink>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------------- Contact CTA */}
      <section className="shell mt-section">
        <div className="rule pt-10 md:pt-14">
          <p className="label">{tr.contact.title}</p>
          <Link href={localePath(lang, '/contact')} className="group mt-6 block">
            <h2 className="text-mega font-light">
              <span className="link-underline">{tr.home.ctaTitle}</span>
            </h2>
          </Link>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
            <a
              href={`mailto:${settings.contact.email}`}
              className="link-underline text-h3 font-light"
            >
              {settings.contact.email}
            </a>
            <p className="text-small text-muted">{t(settings.contact.availability, lang)}</p>
          </div>
        </div>
      </section>
    </>
  );
}
