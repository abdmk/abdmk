import Link from 'next/link';
import { Icon } from '@/components/icons';
import { Reveal } from '@/components/ui/Reveal';
import type { Lang, Service } from '@/lib/content/types';
import { localePath, t } from '@/lib/i18n/config';

/**
 * Six services as a numbered index, not a grid of cards.
 *
 * A short list set large reads as "this is what I do"; twelve tiles read as
 * "I will do anything". The row itself is the target, so the whole line
 * responds on hover rather than a button inside it.
 */
export function ServiceList({ services, lang }: { services: Service[]; lang: Lang }) {
  return (
    <ul className="list-none p-0">
      {services.map((service, i) => (
        <Reveal as="li" key={service.id} index={Math.min(i, 3)} className="rule">
          <Link
            href={`${localePath(lang, '/services')}#${service.slug}`}
            className="group grid-editorial items-baseline py-7 md:py-9"
          >
            <span className="label numeric col-span-4 mb-2 md:col-span-1 md:mb-0">
              {String(i + 1).padStart(2, '0')}
            </span>

            <h3 className="col-span-4 text-h1 md:col-span-5">
              <span className="link-underline">{t(service.name, lang)}</span>
            </h3>

            <p className="measure col-span-4 mt-3 text-small text-muted md:col-span-5 md:mt-0">
              {t(service.description, lang)}
            </p>

            <span
              aria-hidden
              className="hidden md:col-span-1 md:block md:justify-self-end"
            >
              <Icon
                name="arrowUpRight"
                size={20}
                className="text-faint transition-all duration-500 ease-editorial group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ink"
              />
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
