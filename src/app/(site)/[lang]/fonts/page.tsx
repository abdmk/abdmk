import type { Metadata } from 'next';
import Link from 'next/link';
import { SmartImage } from '@/components/media/SmartImage';
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
    <div className="shell py-14 md:py-20">
      <header className="mb-14 md:mb-20">
        <h1 className="text-display font-light">{tr.fonts.title}</h1>
        <p className="mt-6 max-w-prose text-lead text-muted">{tr.fonts.intro}</p>
      </header>

      {/* Typefaces get a full-width row each — a font is judged at size, not in a
          thumbnail — with the specimen doing the talking. */}
      <ul className="list-none space-y-20 p-0 md:space-y-28">
        {fonts.map((font, i) => (
          <Reveal as="li" key={font.id} index={i % 2}>
            <Link href={localePath(lang, `/font/${font.slug}`)} className="group block">
              <div
                className="media-zoom relative overflow-hidden bg-ink/[0.04]"
                style={{ aspectRatio: '16 / 9' }}
              >
                <SmartImage
                  src={font.preview.src}
                  alt={t(font.preview.alt, lang)}
                  fill
                  sizes="100vw"
                  priority={i === 0}
                />
              </div>

              <div className="mt-6 grid gap-x-8 gap-y-4 md:grid-cols-12">
                <h2 className="text-h1 font-light md:col-span-5">
                  <span className="link-underline">{t(font.name, lang)}</span>
                </h2>
                <p className="max-w-prose text-lead text-muted md:col-span-5">
                  {t(font.description, lang)}
                </p>
                <dl className="m-0 space-y-2 text-small md:col-span-2 md:justify-self-end md:text-end">
                  <div>
                    <dt className="label">{tr.fonts.type}</dt>
                    <dd>{t(font.type, lang)}</dd>
                  </div>
                  <div>
                    <dt className="label">{tr.fonts.weights}</dt>
                    <dd className="numeric">{font.weights.length}</dd>
                  </div>
                </dl>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
