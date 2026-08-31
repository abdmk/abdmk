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
    <div className="py-14 md:py-20">
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
      <header className="shell">
        <h1 className="max-w-[20ch] text-display font-light">{t(about.intro, lang)}</h1>
      </header>

      <div className="shell mt-14 grid gap-12 md:mt-20 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <SmartImage
            src={about.portrait.src}
            alt={t(about.portrait.alt, lang)}
            width={about.portrait.width}
            height={about.portrait.height}
            sizes="(max-width: 768px) 100vw, 40vw"
            priority
            className="w-full"
          />
          <p className="label mt-4">{t(settings.role, lang)}</p>
        </Reveal>

        <Reveal className="md:col-span-6 md:col-start-7">
          {about.body.map((paragraph, i) => (
            <p key={i} className="max-w-prose text-lead text-muted [&+p]:mt-6">
              {t(paragraph, lang)}
            </p>
          ))}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            {about.cvUrl ? (
              <ArrowLink href={about.cvUrl} external>
                {tr.about.downloadCv}
              </ArrowLink>
            ) : null}
            <SocialLinks links={settings.social} className="-ms-2.5" />
          </div>
        </Reveal>
      </div>

      {/* ---------------------------------------------------------- Experience */}
      <section className="shell mt-section">
        <SectionHeader
          label={tr.about.experience}
          title={tr.companies.title}
          action={{ href: localePath(lang, '/companies'), label: tr.home.viewAllCompanies }}
          className="mb-10"
        />
        {/* Experience as an index of places, each opening onto the work done
            there — a CV that leads back into the portfolio rather than away from it. */}
        <ul className="list-none border-t border-line p-0">
          {experience.map((company, i) => {
            const count = projects.filter((p) => p.company === company.slug).length;
            return (
              <Reveal as="li" key={company.id} index={Math.min(i, 4)}>
                <Link
                  href={localePath(lang, `/company/${company.slug}`)}
                  className="group grid items-baseline gap-x-8 gap-y-1 border-b border-line py-7 md:grid-cols-12"
                >
                  <p className="numeric label md:col-span-3">{t(company.period, lang)}</p>
                  <h3 className="text-h3 font-medium md:col-span-4">
                    <span className="link-underline">{t(company.name, lang)}</span>
                  </h3>
                  <p className="text-small text-muted md:col-span-4">{t(company.role, lang)}</p>
                  <span className="hidden items-center justify-end gap-3 md:col-span-1 md:flex">
                    {count ? <span className="numeric text-small text-faint">{count}</span> : null}
                    <Icon
                      name="arrowRight"
                      size={16}
                      flipRtl
                      className="text-faint transition-transform duration-500 ease-editorial group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* ------------------------------------------------------------ Approach */}
      <section className="shell mt-section">
        <SectionHeader title={tr.about.approach} className="mb-10" />
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {about.approach.map((item, i) => (
            <Reveal key={i} index={i}>
              <p className="label numeric mb-4">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="text-h3 font-medium">{t(item.title, lang)}</h3>
              <p className="mt-3 text-small text-muted">{t(item.text, lang)}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------- Tools, interests, awards */}
      <section className="shell mt-section grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <SectionHeader title={tr.about.tools} className="mb-5" />
          <ul className="flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0 text-small text-muted">
            {about.tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>

          <SectionHeader title={tr.about.interests} className="mb-5 mt-12" />
          <ul className="list-none space-y-1.5 p-0 text-small text-muted">
            {about.interests.map((interest, i) => (
              <li key={i}>{t(interest, lang)}</li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <SectionHeader title={tr.about.achievements} className="mb-5" />
          <ul className="list-none p-0">
            {about.achievements.map((item, i) => (
              <li key={i} className="flex items-baseline gap-6 border-b border-line py-4">
                <span className="label numeric shrink-0">{item.year}</span>
                <span className="text-body">{t(item.text, lang)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------------------------------------- CTA */}
      <section className="shell mt-section">
        <div className="rule pt-10">
          <Link href={localePath(lang, '/contact')} className="group block">
            <h2 className="text-h1 font-light">
              <span className="link-underline">{tr.home.ctaTitle}</span>
            </h2>
          </Link>
          <a
            href={`mailto:${settings.contact.email}`}
            className="link-underline mt-5 inline-block text-lead"
          >
            {settings.contact.email}
          </a>
        </div>
      </section>
    </div>
  );
}
