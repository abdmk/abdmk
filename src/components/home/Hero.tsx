import Link from 'next/link';
import { Icon } from '@/components/icons';
import type { Lang, Settings } from '@/lib/content/types';
import { localePath, t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';

/**
 * The opening statement.
 *
 * Five seconds, four answers: who this is (the role caption), what he makes
 * (the display line), the kind of work he takes (the statement), and how to
 * start one (the availability marker and the call to action). Everything is
 * set against the leading edge — nothing is centred — and the display line is
 * given roughly four times the size of anything near it so the eye has a single
 * obvious entry point.
 */
export function Hero({ lang, settings }: { lang: Lang; settings: Settings }) {
  const tr = ui(lang);

  return (
    <section className="shell relative pb-section-sm pt-16 md:pt-24 lg:pt-28">
      {/* One light source, low and behind the type. The only chroma above the
          fold. Both discs stay fully inside the section box: a blurred element
          whose rect pokes out under the fixed navigation is clipped visually
          but still counts as a background layer to contrast checkers, which
          then measure the nav's text against a colour nobody can see. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="bloom bloom-peach top-[2%] end-[2%] h-[34%] w-[30%] opacity-25" />
        <span className="bloom bloom-lilac top-[28%] start-[1%] h-[32%] w-[24%] opacity-[0.18]" />
      </div>

      <div className="relative">
        <p className="label">{t(settings.role, lang)}</p>

        <h1 className="mt-6 max-w-[13ch] text-mega md:mt-10">{t(settings.tagline, lang)}</h1>

        {/* The availability marker is a status, so it reads as one: a live dot
            and a short line, directly under the headline where it is the second
            thing read rather than a badge parked in a corner. */}
        <p className="mt-8 inline-flex items-center gap-3 text-lead font-medium md:mt-10">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink opacity-40 motion-reduce:hidden" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ink" />
          </span>
          {t(settings.contact.availability, lang)}
        </p>

        <div className="grid-editorial mt-10 md:mt-14">
          <p className="measure col-span-4 text-lead text-muted md:col-span-6">
            {t(settings.heroStatement, lang)}
          </p>

          <div className="col-span-4 md:col-span-5 md:col-start-8 md:self-start">
            <div className="flex flex-wrap items-center gap-3">
              <Link href={localePath(lang, '/contact')} className="btn btn-primary group">
                {tr.home.contactMe}
                <Icon
                  name="arrowUpRight"
                  size={16}
                  className="transition-transform duration-500 ease-editorial group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
              <Link href={localePath(lang, '/work')} className="btn btn-ghost">
                {tr.home.viewWork}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
