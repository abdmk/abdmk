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
 * Products get the same editorial row as a project rather than a shop grid: a
 * large image, the name at heading size, and the price as metadata. What is for
 * sale here is the same craft the portfolio is showing — packaging it as a
 * store would make it read as a different, lesser thing.
 */
export default async function ProductsPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const tr = ui(lang);
  const products = await getProducts();

  return (
    <div className="shell pb-section">
      <PageHeader
        title={tr.products.title}
        intro={tr.products.intro}
        eyebrow={tr.nav.products}
        meta={
          <span className="numeric">
            {products.length} {tr.products.title}
          </span>
        }
        className="mb-16 md:mb-24"
      />

      {products.length ? (
        <ul className="list-none space-y-20 p-0 md:space-y-28">
          {products.map((product, i) => (
            <Reveal as="li" key={product.id} index={i % 2}>
              <div className="grid-editorial items-center">
                <div
                  className={
                    i % 2 === 0
                      ? 'col-span-4 md:col-span-6'
                      : 'col-span-4 md:col-span-6 md:order-2 md:col-start-7'
                  }
                >
                  <div className="media-zoom well relative" style={{ aspectRatio: '4 / 3' }}>
                    <SmartImage
                      src={product.cover.src}
                      alt={t(product.cover.alt, lang)}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={i === 0}
                    />
                  </div>
                </div>

                <div
                  className={
                    i % 2 === 0
                      ? 'col-span-4 md:col-span-5 md:col-start-8'
                      : 'col-span-4 md:order-1 md:col-span-5'
                  }
                >
                  <p className="label">{tr.products.kinds[product.kind]}</p>
                  <h2 className="mt-4 text-h1">{t(product.name, lang)}</h2>
                  <p className="measure mt-5 text-lead text-muted">
                    {t(product.description, lang)}
                  </p>

                  {product.highlights.length ? (
                    <ul className="mt-8 list-none p-0">
                      {product.highlights.map((item, k) => (
                        <li
                          key={k}
                          className="flex items-start gap-3 border-t border-line py-3 text-small"
                        >
                          <Icon
                            name="arrowSmallRight"
                            size={13}
                            flipRtl
                            className="mt-1.5 shrink-0 text-faint"
                          />
                          {t(item, lang)}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="mt-8 flex flex-wrap items-center gap-6">
                    {product.purchaseUrl ? (
                      <a
                        href={product.purchaseUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="btn btn-primary"
                      >
                        {tr.products.buy}
                        <Icon name="arrowUpRight" size={15} />
                      </a>
                    ) : null}
                    <p className="numeric text-h3">{t(product.price, lang)}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      ) : (
        <p className="rule py-20 text-lead text-muted">{tr.products.empty}</p>
      )}
    </div>
  );
}
