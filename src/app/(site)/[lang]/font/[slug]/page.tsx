import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/icons';
import { FontTester } from '@/components/font/FontTester';
import { Gallery } from '@/components/media/Gallery';
import { SmartImage } from '@/components/media/SmartImage';
import { ProjectGrid } from '@/components/project/ProjectGrid';
import { ArrowLink } from '@/components/ui/ArrowLink';
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
    <article className="py-14 md:py-20">
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

      <header className="shell">
        <Link
          href={localePath(lang, '/fonts')}
          className="label inline-flex items-center gap-2 hover:text-ink"
        >
          <Icon name="arrowLeft" size={13} flipRtl />
          {tr.fonts.title}
        </Link>

        <div className="mt-8 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <h1 className="text-display font-light">{t(font.name, lang)}</h1>
            <p className="mt-6 max-w-prose text-lead text-muted">{t(font.description, lang)}</p>
          </div>

          <div className="flex flex-col gap-6 md:col-span-4 md:col-start-9">
            <dl className="m-0 grid grid-cols-2 gap-y-4 text-small">
              <div>
                <dt className="label mb-1">{tr.fonts.type}</dt>
                <dd>{t(font.type, lang)}</dd>
              </div>
              <div>
                <dt className="label mb-1">{tr.fonts.weights}</dt>
                <dd className="numeric">{font.weights.length}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {font.purchaseUrl ? (
                <ArrowLink href={font.purchaseUrl} external>
                  {tr.fonts.buy}
                </ArrowLink>
              ) : null}
              {font.downloadUrl ? (
                <ArrowLink href={font.downloadUrl} external>
                  {tr.fonts.download}
                </ArrowLink>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="mt-12 md:mt-16">
        <SmartImage
          src={font.preview.src}
          alt={t(font.preview.alt, lang)}
          width={font.preview.width}
          height={font.preview.height}
          sizes="100vw"
          priority
          className="w-full"
        />
      </div>

      {/* -------------------------------------------------------- Type tester */}
      <div className="shell mt-section">
        <FontTester typeface={font} lang={lang} />
      </div>

      {/* ------------------------------------------------- Weights & features */}
      <div className="shell mt-section grid gap-12 md:grid-cols-2 md:gap-16">
        <section>
          <SectionHeader title={tr.fonts.weights} className="mb-6" />
          <ul className="list-none p-0">
            {[...font.weights]
              .sort((a, b) => a.weight - b.weight)
              .map((weight) => (
                <li
                  key={weight.weight}
                  className="flex items-baseline justify-between gap-6 border-b border-line py-4"
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

        <section>
          <SectionHeader title={tr.fonts.features} className="mb-6" />
          <ul className="list-none p-0">
            {font.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 border-b border-line py-4 text-small">
                <Icon name="check" size={15} className="mt-1 text-faint" />
                {t(feature, lang)}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <h3 className="label mb-2">{tr.fonts.license}</h3>
            <p className="max-w-prose text-small text-muted">{t(font.license, lang)}</p>
          </div>
        </section>
      </div>

      {/* ----------------------------------------------------------- Specimens */}
      {font.specimens.length ? (
        <section className="shell mt-section">
          <SectionHeader title={tr.fonts.specimens} className="mb-10" />
          <Gallery media={font.specimens} lang={lang} columns={2} />
        </section>
      ) : null}

      {/* ------------------------------------------------------------- Used in */}
      {usedIn.length ? (
        <section className="shell mt-section">
          <SectionHeader title={tr.fonts.usedIn} className="mb-10" />
          <ProjectGrid projects={usedIn} lang={lang} companies={companies} variant="even" priorityCount={0} />
        </section>
      ) : null}

      {/* -------------------------------------------------------- Other fonts */}
      {others.length ? (
        <section className="shell mt-section">
          <SectionHeader title={tr.fonts.relatedFonts} className="mb-10" />
          <ul className="grid list-none gap-x-6 gap-y-10 p-0 sm:grid-cols-3">
            {others.map((other) => (
              <li key={other.id}>
                <Link href={localePath(lang, `/font/${other.slug}`)} className="group block">
                  <div
                    className="media-zoom relative overflow-hidden bg-ink/[0.04]"
                    style={{ aspectRatio: '8 / 5' }}
                  >
                    <SmartImage
                      src={other.preview.src}
                      alt={t(other.preview.alt, lang)}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <h3 className="mt-3 text-h3 font-medium">
                    <span className="link-underline">{t(other.name, lang)}</span>
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
