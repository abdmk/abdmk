import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/icons';
import { SmartImage } from '@/components/media/SmartImage';
import { SocialLinks } from '@/components/layout/SocialLinks';
import { ArrowLink } from '@/components/ui/ArrowLink';
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
    <div className="shell pb-section">
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
      <header className="pt-14 md:pt-20">
        <p className="label">{t(settings.role, lang)}</p>
        <h1 className="mt-6 max-w-[18ch] text-display md:mt-10">{t(about.intro, lang)}</h1>
      </header>

      <div className="grid-editorial mt-14 md:mt-20">
        <Reveal className="col-span-4 md:col-span-5">
          <div className="well relative" style={{ aspectRatio: '4 / 5' }}>
            <SmartImage
              src={about.portrait.src}
              alt={t(about.portrait.alt, lang)}
              fill
              sizes="(max-width: 768px) 100vw, 42vw"
              priority
            />
          </div>
        </Reveal>

        <Reveal className="col-span-4 md:col-span-6 md:col-start-7 md:self-center">
          {about.body.map((paragraph, i) => (
            <p key={i} className="measure text-lead text-muted [&+p]:mt-6">
              {t(paragraph, lang)}
            </p>
          ))}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            {about.cvUrl ? (
              <ArrowLink href={about.cvUrl} external>
                {tr.about.downloadCv}
              </ArrowLink>
            ) : null}
            <SocialLinks links={settings.social} />
          </div>
        </Reveal>
      </div>

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
        <ul className="list-none p-0">
          {experience.map((company, i) => {
            const count = projects.filter((p) => p.company === company.slug).length;
            return (
              <Reveal as="li" key={company.id} index={Math.min(i, 4)}>
                <Link
                  href={localePath(lang, `/company/${company.slug}`)}
                  className="group grid-editorial rule items-baseline py-6 md:py-8"
                >
                  <p className="label numeric col-span-4 mb-2 md:col-span-3 md:mb-0">
                    {t(company.period, lang)}
                  </p>
                  <h3 className="col-span-4 text-h2 md:col-span-5">
                    <span className="link-underline">{t(company.name, lang)}</span>
                  </h3>
                  <p className="col-span-4 mt-2 text-small text-muted md:col-span-3 md:mt-0">
                    {t(company.role, lang)}
                  </p>
                  <span aria-hidden className="hidden md:col-span-1 md:block md:justify-self-end">
                    <Icon
                      name="arrowUpRight"
                      size={17}
                      className="text-faint transition-all duration-500 ease-editorial group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ink"
                    />
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
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
          {about.approach.map((item, i) => (
            <Reveal key={i} index={i}>
              <p className="label numeric rule pt-5">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-5 text-h2">{t(item.title, lang)}</h3>
              <p className="mt-4 text-small text-muted">{t(item.text, lang)}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------- Tools, interests, awards */}
      <section className="grid-editorial mt-section">
        <div className="col-span-4 md:col-span-4">
          <h2 className="label rule pt-5">{tr.about.tools}</h2>
          <ul className="mt-5 list-none p-0 text-small text-muted">
            {about.tools.map((tool) => (
              <li key={tool} className="border-b border-line py-2.5">
                {tool}
              </li>
            ))}
          </ul>

          <h2 className="label rule mt-12 pt-5">{tr.about.interests}</h2>
          <ul className="mt-5 list-none p-0 text-small text-muted">
            {about.interests.map((interest, i) => (
              <li key={i} className="border-b border-line py-2.5">
                {t(interest, lang)}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-4 md:col-span-7 md:col-start-6">
          <h2 className="label rule pt-5">{tr.about.achievements}</h2>
          <ul className="mt-5 list-none p-0">
            {about.achievements.map((item, i) => (
              <li key={i} className="flex items-baseline gap-6 border-b border-line py-4">
                <span className="label numeric shrink-0">{item.year}</span>
                <span className="text-body">{t(item.text, lang)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
