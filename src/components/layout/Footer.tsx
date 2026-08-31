import Link from 'next/link';
import { Icon } from '@/components/icons';
import type { Lang, Settings } from '@/lib/content/types';
import { localePath, t as tr } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SocialLinks } from './SocialLinks';

const ROUTES = [
  ['work', '/work'],
  ['services', '/services'],
  ['courses', '/courses'],
  ['products', '/products'],
  ['workshops', '/workshops'],
  ['fonts', '/fonts'],
  ['companies', '/companies'],
  ['about', '/about'],
] as const;

/**
 * The page ends on a statement, not on a sitemap.
 *
 * The availability line and the invitation are set at display size and given
 * the whole width; the navigation and legal text come after, small and quiet.
 * That order is the point — the last thing a reader sees should be the reason
 * to get in touch, not a column of links.
 */
export function Footer({ lang, settings }: { lang: Lang; settings: Settings }) {
  const t = ui(lang);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-section">
      {/* ------------------------------------------------------ Closing CTA */}
      <section className="shell rule-ink pt-10 md:pt-14">
        <p className="label mb-6 flex items-center gap-3 md:mb-10">
          <span aria-hidden className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
          {tr(settings.contact.availability, lang)}
        </p>

        <Link href={localePath(lang, '/contact')} className="group block max-w-[14ch] text-mega">
          <span className="link-rule">{t.home.contactMe}</span>
          <Icon
            name="arrowUpRight"
            size={40}
            className="ms-3 inline-block transition-transform duration-700 ease-editorial group-hover:-translate-y-2 group-hover:translate-x-2 md:h-14 md:w-14 rtl:group-hover:-translate-x-2"
          />
        </Link>

        <div className="grid-editorial mt-10 md:mt-16">
          <a
            href={`mailto:${settings.contact.email}`}
            className="link-rule col-span-4 text-lead md:col-span-5"
          >
            {settings.contact.email}
          </a>
          <p className="measure col-span-4 text-lead text-muted md:col-span-5 md:col-start-8">
            {tr(settings.shortBio, lang)}
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------- Site meta */}
      <div className="shell mt-section-sm pb-10">
        <div className="grid-editorial rule pt-8">
          <nav aria-label={t.footer.navigation} className="col-span-4 md:col-span-7 xl:col-span-6">
            <ul className="grid list-none grid-cols-2 gap-x-6 gap-y-2 p-0 sm:grid-cols-4">
              {ROUTES.map(([key, path]) => (
                <li key={key}>
                  <Link
                    href={localePath(lang, path)}
                    className="link-underline text-small text-muted transition-colors hover:text-ink"
                  >
                    {t.nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-4 md:col-span-5 md:col-start-8 md:justify-self-end">
            <SocialLinks links={settings.social} />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p className="meta-line">
            © <span className="numeric">{year}</span> {tr(settings.name, lang)} — {t.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            <LanguageSwitcher lang={lang} />
            <a
              href="#main"
              className="meta-line inline-flex items-center gap-2 transition-colors hover:text-ink"
            >
              {t.footer.backToTop}
              <Icon name="arrowUpRight" size={13} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
