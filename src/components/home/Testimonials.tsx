import { Reveal } from '@/components/ui/Reveal';
import type { Lang, Testimonial } from '@/lib/content/types';
import { t } from '@/lib/i18n/config';

/**
 * Client words, set as editorial pull quotes rather than review cards.
 *
 * Each quote gets a full row and display-size type, with the attribution
 * demoted to a caption on the opposite edge. Nobody reads five identical
 * boxes of praise — but a sentence set at 40px in the middle of a page is
 * read whether the visitor meant to or not.
 */
export function Testimonials({
  items,
  lang,
}: {
  items: Testimonial[];
  lang: Lang;
}) {
  if (!items.length) return null;

  return (
    <ul className="list-none p-0">
      {items.map((item, i) => (
        <Reveal as="li" key={item.id} index={Math.min(i, 2)} className="rule py-10 md:py-16">
          <figure className="grid-editorial m-0">
            <blockquote className="col-span-4 m-0 md:col-span-8 xl:col-span-9">
              <p className="text-h1 font-normal">
                <span aria-hidden className="text-faint">“</span>
                {t(item.quote, lang)}
                <span aria-hidden className="text-faint">”</span>
              </p>
            </blockquote>

            <figcaption className="col-span-4 mt-6 md:col-span-3 md:col-start-10 md:mt-2">
              <p className="text-small font-medium">{t(item.author, lang)}</p>
              <p className="meta-line mt-1.5">
                {[t(item.role, lang), t(item.organisation, lang)].filter(Boolean).join('، ')}
              </p>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </ul>
  );
}
