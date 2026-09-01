import Link from 'next/link';
import { SmartImage } from '@/components/media/SmartImage';
import { Reveal } from '@/components/ui/Reveal';
import type { Lang, Product } from '@/lib/content/types';
import { localePath, t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';

/** Products wear the same card as a project — same rounding, same hover lift —
 * so they read as an extension of the portfolio, not a separate shop bolted on. */
export function ProductRow({
  products,
  lang,
  limit,
}: {
  products: Product[];
  lang: Lang;
  limit?: number;
}) {
  const tr = ui(lang);
  const list = limit ? products.slice(0, limit) : products;
  if (!list.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {list.map((product, i) => (
        <Reveal key={product.id} index={i % 4} className="h-full">
          <Link
            href={localePath(lang, '/products')}
            className="card card-hover group flex h-full flex-col overflow-hidden p-2.5"
          >
            <div
              className="media-zoom relative overflow-hidden rounded-[calc(var(--radius-card)-0.5rem)] bg-sunken"
              style={{ aspectRatio: '4 / 3' }}
            >
              <SmartImage
                src={product.cover.src}
                alt={t(product.cover.alt, lang)}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3.5">
              <h3 className="text-small font-medium leading-snug">
                <span className="link-underline">{t(product.name, lang)}</span>
              </h3>
              <p className="meta-line mt-1.5">
                {tr.products.kinds[product.kind]}
                <span aria-hidden> · </span>
                <span className="numeric">{t(product.price, lang)}</span>
              </p>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
