import type { Metadata } from 'next';
import { Icon } from '@/components/icons';
import { SmartImage } from '@/components/media/SmartImage';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { products as getProducts } from '@/lib/content/queries';
import type { Lang } from '@/lib/content/types';
import { t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const tr = ui(lang);
  return {
    title: tr.products.title,
    description: tr.products.intro,
    alternates: {
      canonical: `/${lang}/products`,
      languages: { ar: '/ar/products', en: '/en/products' },
    },
  };
}

/**
 * Products get the same card as everything else in the portfolio — same
 * radius, same hover lift — so buying a typeface feels like the same site
 * that made the case studies, not a separate storefront bolted on.
 */
export default async function ProductsPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const tr = ui(lang);
  const products = await getProducts();

  return (
    <div className="shell pb-section pt-6 sm:pt-8">
      <PageHeader
        title={tr.products.title}
        intro={tr.products.intro}
        hues={['lilac', 'sky', 'mint']}
        meta={
          <span className="chip numeric">
            {products.length} {tr.products.title}
          </span>
        }
        className="mb-9 md:mb-12"
      />

      {products.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
          {products.map((product, i) => (
            <Reveal key={product.id} index={i % 2} className="h-full">
              <div className="card flex h-full flex-col overflow-hidden p-2.5 sm:p-3">
                <div
                  className="relative overflow-hidden rounded-[calc(var(--radius-card)-0.5rem)] bg-sunken"
                  style={{ aspectRatio: '4 / 3' }}
                >
                  <SmartImage
                    src={product.cover.src}
                    alt={t(product.cover.alt, lang)}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={i === 0}
                  />
                </div>

                <div className="flex flex-1 flex-col px-2.5 pb-2 pt-5 sm:px-3.5">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-h2">{t(product.name, lang)}</h2>
                    <span className="chip shrink-0">{tr.products.kinds[product.kind]}</span>
                  </div>

                  <p className="mt-3 max-w-prose text-small text-muted">
                    {t(product.description, lang)}
                  </p>

                  {product.highlights.length ? (
                    <ul className="mt-5 list-none space-y-2 p-0">
                      {product.highlights.map((item, k) => (
                        <li key={k} className="flex items-start gap-2.5 text-small text-muted">
                          <Icon name="check" size={14} className="mt-1 shrink-0 text-faint" />
                          {t(item, lang)}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="mt-6 flex flex-1 items-end justify-between gap-4">
                    <p className="numeric text-h3">{t(product.price, lang)}</p>
                    {product.purchaseUrl ? (
                      <a
                        href={product.purchaseUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="btn btn-primary btn-sm"
                      >
                        {tr.products.buy}
                        <Icon name="arrowUpRight" size={14} />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <p className="text-lead text-muted">{tr.products.empty}</p>
        </div>
      )}
    </div>
  );
}
