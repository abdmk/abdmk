import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/icons';
import { FontTester } from '@/components/font/FontTester';
import { Gallery } from '@/components/media/Gallery';
import { SmartImage } from '@/components/media/SmartImage';
import { ProjectGrid } from '@/components/project/ProjectGrid';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { BloomField } from '@/components/ui/Bloom';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  companies as getCompanies,
  getTypeface,
  projectsForFont,
  settings as getSettings,
  typefaces as getTypefaces,
} from '@/lib/content/queries';
import type { Lang } from '@/lib/content/types';
import { LANGS, localePath, t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';

export async function generateStaticParams() {
  const list = await getTypefaces();
  return LANGS.flatMap((lang) => list.map((f) => ({ lang, slug: f.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const font = await getTypeface(slug);
  if (!font) return {};
  const title = t(font.name, lang);
  const description = t(font.description, lang);
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/font/${slug}`,
      languages: { ar: `/ar/font/${slug}`, en: `/en/font/${slug}` },
    },
    openGraph: {
      title,
      description,
      images: [{ url: font.preview.src, alt: t(font.preview.alt, lang) }],
    },
  };
}

export default async function FontPage({
  params,
}: {
  params: Promise<{ lang: Lang; slug: string }>;
}) {
  const { lang, slug } = await params;
  const font = await getTypeface(slug);
  if (!font) notFound();

  const tr = ui(lang);
  const [usedIn, allFonts, companies, settings] = await Promise.all([
    projectsForFont(slug),
    getTypefaces(),
    getCompanies(),
    getSettings(),
  ]);
  const others = allFonts.filter((f) => f.slug !== slug).slice(0, 3);

  return (
    <article className="shell pb-section pt-6 sm:pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: t(font.name, lang),
            description: t(font.description, lang),
            category: 'Typeface',
            image: new URL(font.preview.src, settings.seo.siteUrl).toString(),
            brand: { '@type': 'Person', name: t(settings.name, lang) },
            ...(font.purchaseUrl
              ? { offers: { '@type': 'Offer', url: font.purchaseUrl, availability: 'https://schema.org/InStock' } }
              : {}),
          }),
        }}
      />

      <header className="card relative overflow-hidden p-2.5 sm:p-3">
        <BloomField hues={['lilac', 'sky', 'mint']} />

        <div className="relative px-3.5 pb-8 pt-5 sm:px-6 sm:pb-10 sm:pt-7 lg:px-10 lg:pb-12">
          <Link
            href={localePath(lang, '/fonts')}
            className="chip transition-colors duration-300 hover:bg-ink hover:text-surface"
          >
            <Icon name="arrowLeft" size={13} flipRtl />
            {tr.fonts.title}
          </Link>

          <div className="mt-7 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h1 className="text-display">{t(font.name, lang)}</h1>
              <p className="mt-5 max-w-prose text-lead text-muted">
                {t(font.description, lang)}
              </p>
            </div>

            <div className="flex flex-col gap-5 lg:col-span-5 lg:items-start">
              <div className="flex flex-wrap gap-2">
                <span className="chip">{t(font.type, lang)}</span>
                <span className="chip numeric">
                  {font.weights.length} {tr.fonts.weights}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {font.purchaseUrl ? (
                  <a
                    href={font.purchaseUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn-primary btn-sm"
                  >
                    {tr.fonts.buy}
                    <Icon name="arrowUpRight" size={15} />
                  </a>
                ) : null}
                {font.downloadUrl ? (
                  <a
                    href={font.downloadUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn-secondary btn-sm"
                  >
                    {tr.fonts.download}
                    <Icon name="download" size={15} />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[calc(var(--radius-card)-0.5rem)] bg-sunken">
          <SmartImage
            src={font.preview.src}
            alt={t(font.preview.alt, lang)}
            width={font.preview.width}
            height={font.preview.height}
            sizes="(max-width: 1024px) 100vw, 88vw"
            priority
            className="w-full"
          />
        </div>
      </header>

      {/* -------------------------------------------------------- Type tester */}
      <div className="mt-5 lg:mt-6">
        <FontTester typeface={font} lang={lang} />
      </div>

      {/* ------------------------------------------------- Weights & features */}
      <div className="mt-5 grid gap-5 lg:mt-6 lg:grid-cols-2 lg:gap-6">
        <section className="card p-6 sm:p-8">
          <h2 className="text-h2">{tr.fonts.weights}</h2>
          <ul className="mt-6 list-none space-y-2 p-0">
            {[...font.weights]
              .sort((a, b) => a.weight - b.weight)
              .map((weight) => (
                <li
                  key={weight.weight}
                  className="flex items-baseline justify-between gap-6 rounded-xl2 bg-sunken px-4 py-3.5"
                >
                  {/* Each row is set in its own weight — the list is the specimen. */}
                  <span className="text-h3" style={{ fontWeight: weight.weight }}>
                    {t(font.sample, lang)}
                  </span>
                  <span className="label numeric shrink-0">
                    {t(weight.name, lang)} {weight.weight}
                  </span>
                </li>
              ))}
          </ul>
        </section>

        <section className="card p-6 sm:p-8">
          <h2 className="text-h2">{tr.fonts.features}</h2>
          <ul className="mt-6 list-none space-y-2 p-0">
            {font.features.map((feature, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl2 bg-sunken px-4 py-3.5 text-small"
              >
                <Icon name="check" size={15} className="mt-0.5 shrink-0 text-faint" />
                {t(feature, lang)}
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-line pt-5">
            <h3 className="label mb-2">{tr.fonts.license}</h3>
            <p className="max-w-prose text-small text-muted">{t(font.license, lang)}</p>
          </div>
        </section>
      </div>

      {/* ----------------------------------------------------------- Specimens */}
      {font.specimens.length ? (
        <section className="mt-section">
          <SectionHeader title={tr.fonts.specimens} className="mb-9 md:mb-12" />
          <Gallery media={font.specimens} lang={lang} columns={2} />
        </section>
      ) : null}

      {/* ------------------------------------------------------------- Used in */}
      {usedIn.length ? (
        <section className="mt-section">
          <SectionHeader title={tr.fonts.usedIn} className="mb-9 md:mb-12" />
          <ProjectGrid projects={usedIn} lang={lang} companies={companies} variant="even" priorityCount={0} />
        </section>
      ) : null}

      {/* -------------------------------------------------------- Other fonts */}
      {others.length ? (
        <section className="mt-section">
          <SectionHeader title={tr.fonts.relatedFonts} className="mb-9 md:mb-12" />
          <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {others.map((other) => (
              <li key={other.id}>
                <Link
                  href={localePath(lang, `/font/${other.slug}`)}
                  className="card card-hover group block overflow-hidden p-2.5 sm:p-3"
                >
                  <div
                    className="media-zoom relative overflow-hidden rounded-[calc(var(--radius-card)-0.5rem)] bg-sunken"
                    style={{ aspectRatio: '8 / 5' }}
                  >
                    <SmartImage
                      src={other.preview.src}
                      alt={t(other.preview.alt, lang)}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <h3 className="px-2.5 pb-2 pt-4 text-h3 sm:px-3.5">{t(other.name, lang)}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
