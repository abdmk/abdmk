import type { Metadata } from 'next';
import Link from 'next/link';
import { SmartImage } from '@/components/media/SmartImage';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { typefaces as getTypefaces } from '@/lib/content/queries';
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
    title: tr.fonts.title,
    description: tr.fonts.intro,
    alternates: { canonical: `/${lang}/fonts`, languages: { ar: '/ar/fonts', en: '/en/fonts' } },
  };
}

export default async function FontsPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const tr = ui(lang);
  const fonts = await getTypefaces();

  return (
    <div className="shell pb-section pt-6 sm:pt-8">
      <PageHeader
        title={tr.fonts.title}
        intro={tr.fonts.intro}
        hues={['lilac', 'sky', 'mint']}
        meta={
          <span className="chip numeric">
            {fonts.length} {tr.fonts.title}
          </span>
        }
        className="mb-9 md:mb-12"
      />

      {/* Typefaces get a full-width card each — a font is judged at size, not in
          a thumbnail — with the specimen doing the talking. */}
      <ul className="list-none space-y-5 p-0 lg:space-y-6">
        {fonts.map((font, i) => (
          <Reveal as="li" key={font.id} index={i % 2}>
            <Link
              href={localePath(lang, `/font/${font.slug}`)}
              className="card card-hover group block overflow-hidden p-2.5 sm:p-3"
            >
              <div
                className="media-zoom relative overflow-hidden rounded-[calc(var(--radius-card)-0.5rem)] bg-sunken"
                style={{ aspectRatio: '16 / 9' }}
              >
                <SmartImage
                  src={font.preview.src}
                  alt={t(font.preview.alt, lang)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 88vw"
                  priority={i === 0}
                />
              </div>

              <div className="grid gap-x-8 gap-y-4 px-2.5 pb-3 pt-6 sm:px-4 md:grid-cols-12 md:items-start">
                <h2 className="text-h1 md:col-span-4">{t(font.name, lang)}</h2>
                <p className="max-w-prose text-lead text-muted md:col-span-5">
                  {t(font.description, lang)}
                </p>
                <div className="flex flex-wrap gap-2 md:col-span-3 md:justify-end">
                  <span className="chip">{t(font.type, lang)}</span>
                  <span className="chip numeric">
                    {font.weights.length} {tr.fonts.weights}
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
