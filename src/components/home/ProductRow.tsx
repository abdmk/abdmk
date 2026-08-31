import Link from 'next/link';
import { SmartImage } from '@/components/media/SmartImage';
import { Reveal } from '@/components/ui/Reveal';
import type { Lang, Product } from '@/lib/content/types';
import { localePath, t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';

/**
 * Products as an extension of the portfolio: the same caption grammar as a
 * project (name, kind, price) so a reader moving down the page does not feel
 * they have walked into a different website with a shop in it.
 */
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
    <ul className="grid list-none grid-cols-2 gap-x-5 gap-y-12 p-0 md:grid-cols-4 md:gap-x-6">
      {list.map((product, i) => (
        <Reveal as="li" key={product.id} index={i % 4}>
          <Link href={localePath(lang, '/products')} className="group block">
            <div className="media-zoom well relative" style={{ aspectRatio: '4 / 3' }}>
              <SmartImage
                src={product.cover.src}
                alt={t(product.cover.alt, lang)}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <h3 className="mt-4 text-h3">
              <span className="link-underline">{t(product.name, lang)}</span>
            </h3>
            <p className="meta-line mt-1.5">
              {tr.products.kinds[product.kind]}
              <span aria-hidden> · </span>
              <span className="numeric">{t(product.price, lang)}</span>
            </p>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
