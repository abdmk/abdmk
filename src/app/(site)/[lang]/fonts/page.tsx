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
    <div className="shell pb-section">
      <PageHeader
        title={tr.fonts.title}
        intro={tr.fonts.intro}
        meta={
          <span className="numeric">
            {fonts.length} {tr.fonts.title}
          </span>
        }
        className="mb-12 md:mb-16"
      />

      {/* Typefaces get a full-width card each — a font is judged at size, not in
          a thumbnail — with the specimen doing the talking. */}
      <ul className="list-none space-y-20 p-0 md:space-y-28">
        {fonts.map((font, i) => (
          <Reveal as="li" key={font.id} index={i % 2}>
            <Link href={localePath(lang, `/font/${font.slug}`)} className="group block">
              <div className="media-zoom well relative" style={{ aspectRatio: '16 / 9' }}>
                <SmartImage
                  src={font.preview.src}
                  alt={t(font.preview.alt, lang)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 88vw"
                  priority={i === 0}
                />
              </div>

              <div className="grid-editorial mt-6 items-baseline md:mt-8">
                <h2 className="col-span-4 text-h1 md:col-span-4">
                  <span className="link-underline">{t(font.name, lang)}</span>
                </h2>
                <p className="measure col-span-4 text-lead text-muted md:col-span-5">
                  {t(font.description, lang)}
                </p>
                <p className="meta-line col-span-4 md:col-span-3 md:justify-self-end md:text-end">
                  {t(font.type, lang)}
                  <span aria-hidden> · </span>
                  <span className="numeric">
                    {font.weights.length} {tr.fonts.weights}
                  </span>
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
