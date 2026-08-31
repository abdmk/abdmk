import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/icons';
import { SmartImage } from '@/components/media/SmartImage';
import { SocialLinks } from '@/components/layout/SocialLinks';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { BloomField } from '@/components/ui/Bloom';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  companies as getCompanies,
  projects as getProjects,
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
  const s = await getSettings();
  return {
    title: ui(lang).about.title,
    description: t(s.shortBio, lang),
    alternates: { canonical: `/${lang}/about`, languages: { ar: '/ar/about', en: '/en/about' } },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const tr = ui(lang);
  const [settings, companies, projects] = await Promise.all([
    getSettings(),
    getCompanies(),
    getProjects(),
  ]);
  const { about } = settings;
  const experience = companies.filter((c) => c.showInExperience);

  return (
    <div className="shell pb-section pt-6 sm:pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: t(settings.name, lang),
            jobTitle: t(settings.role, lang),
            description: t(settings.shortBio, lang),
            email: `mailto:${settings.contact.email}`,
            url: settings.seo.siteUrl,
            sameAs: settings.social.map((s) => s.href),
            knowsAbout: ['Arabic typography', 'Type design', 'Brand identity'],
          }),
        }}
      />

      {/* --------------------------------------------------------------- Intro */}
      <header className="card relative overflow-hidden p-2.5 sm:p-3">
        <BloomField hues={['peach', 'lilac', 'sky']} />
        <div className="relative grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-5 xl:col-span-4">
            <div className="overflow-hidden rounded-[calc(var(--radius-card)-0.5rem)] bg-sunken">
              <SmartImage
                src={about.portrait.src}
                alt={t(about.portrait.alt, lang)}
                width={about.portrait.width}
                height={about.portrait.height}
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
                className="w-full"
              />
            </div>
          </Reveal>

          <Reveal className="flex flex-col justify-center px-3 pb-5 lg:col-span-7 lg:px-8 lg:py-10 xl:col-span-8 xl:px-12">
            <span className="chip mb-5 self-start bg-sunken text-muted">
              {t(settings.role, lang)}
            </span>
            <h1 className="max-w-[22ch] text-h1">{t(about.intro, lang)}</h1>
            {about.body.map((paragraph, i) => (
              <p key={i} className="mt-5 max-w-prose text-lead text-muted">
                {t(paragraph, lang)}
              </p>
            ))}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              {about.cvUrl ? (
                <ArrowLink href={about.cvUrl} external>
                  {tr.about.downloadCv}
                </ArrowLink>
              ) : null}
              <SocialLinks links={settings.social} />
            </div>
          </Reveal>
        </div>
      </header>

      {/* ---------------------------------------------------------- Experience */}
      <section className="mt-section">
        <SectionHeader
          label={tr.about.experience}
          title={tr.companies.title}
          action={{ href: localePath(lang, '/companies'), label: tr.home.viewAllCompanies }}
          className="mb-9 md:mb-12"
        />
        {/* Experience as an index of places, each opening onto the work done
            there — a CV that leads back into the portfolio rather than away from it. */}
        <ul className="list-none space-y-3 p-0 lg:space-y-4">
          {experience.map((company, i) => {
            const count = projects.filter((p) => p.company === company.slug).length;
            return (
              <Reveal as="li" key={company.id} index={Math.min(i, 4)}>
                <Link
                  href={localePath(lang, `/company/${company.slug}`)}
                  className="card card-hover group grid items-center gap-x-6 gap-y-3 p-5 sm:p-6 md:grid-cols-12 lg:px-8"
                >
                  <span className="chip numeric self-start md:col-span-3">
                    {t(company.period, lang)}
                  </span>
                  <h3 className="text-h3 md:col-span-4">{t(company.name, lang)}</h3>
                  <p className="text-small text-muted md:col-span-4">{t(company.role, lang)}</p>
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
      </section>

      {/* ------------------------------------------------------------ Approach */}
      <section className="mt-section">
        <SectionHeader title={tr.about.approach} className="mb-9 md:mb-12" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {about.approach.map((item, i) => (
            <Reveal key={i} index={i} className="h-full">
              <div className="card h-full p-6 sm:p-7">
                <span className="numeric grid h-10 w-10 place-items-center rounded-full bg-sunken text-small font-medium text-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 text-h3">{t(item.title, lang)}</h3>
                <p className="mt-3 text-small text-muted">{t(item.text, lang)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------- Tools, interests, awards */}
      <section className="mt-section grid gap-4 lg:grid-cols-12 lg:gap-5">
        <div className="flex flex-col gap-4 lg:col-span-5 lg:gap-5">
          <div className="card p-6 sm:p-7">
            <h2 className="text-h3">{tr.about.tools}</h2>
            <ul className="mt-5 flex list-none flex-wrap gap-2 p-0">
              {about.tools.map((tool) => (
                <li key={tool}>
                  <span className="chip">{tool}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6 sm:p-7">
            <h2 className="text-h3">{tr.about.interests}</h2>
            <ul className="mt-5 flex list-none flex-wrap gap-2 p-0">
              {about.interests.map((interest, i) => (
                <li key={i}>
                  <span className="chip">{t(interest, lang)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card p-6 sm:p-7 lg:col-span-7">
          <h2 className="text-h3">{tr.about.achievements}</h2>
          <ul className="mt-5 list-none space-y-2 p-0">
            {about.achievements.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-4 rounded-xl2 bg-sunken px-4 py-3.5"
              >
                <span className="numeric shrink-0 text-small font-medium text-faint">
                  {item.year}
                </span>
                <span className="text-small">{t(item.text, lang)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------------------------------------- CTA */}
      <section className="mt-section">
        <div className="surface-invert relative overflow-hidden rounded-xl3 px-6 py-12 sm:rounded-xl4 sm:px-10 sm:py-16 lg:px-14">
          <BloomField hues={['lilac', 'mint', 'peach']} intensity="strong" className="opacity-50" />
          <div className="relative">
            <h2 className="max-w-[16ch] text-h1">{tr.home.ctaTitle}</h2>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href={localePath(lang, '/contact')}
                className="btn btn-light"
              >
                {tr.home.contactMe}
                <Icon name="arrowRight" size={17} flipRtl />
              </Link>
              <a
                href={`mailto:${settings.contact.email}`}
                className="btn border border-line-strong text-ink hover:bg-white/10"
              >
                {settings.contact.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
