import Link from 'next/link';
import { Icon } from '@/components/icons';
import { BloomField } from '@/components/ui/Bloom';
import type { Lang, Settings } from '@/lib/content/types';
import { localePath, t as tr } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SocialLinks } from './SocialLinks';

const ROUTES = [
  ['work', '/work'],
  ['fonts', '/fonts'],
  ['services', '/services'],
  ['companies', '/companies'],
  ['workshops', '/workshops'],
  ['courses', '/courses'],
  ['about', '/about'],
  ['contact', '/contact'],
] as const;

/**
 * The footer is a single dark rounded slab that floats on the canvas like every
 * other surface, rather than a full-bleed band. Pastel light sits behind the
 * name so the block reads as part of the same system as the cards above it.
 */
export function Footer({ lang, settings }: { lang: Lang; settings: Settings }) {
  const t = ui(lang);
  const year = new Date().getFullYear();

  return (
    <footer className="px-gutter pb-4 pt-section sm:pb-6">
      <div className="surface-invert relative mx-auto w-full max-w-shell overflow-hidden rounded-xl3 sm:rounded-xl4">
        <BloomField hues={['lilac', 'sky', 'peach']} className="opacity-40" />

        <div className="relative px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div className="grid gap-10 md:grid-cols-12 md:gap-8 lg:gap-12">
            <div className="md:col-span-5">
              <p className="text-h2">{tr(settings.name, lang)}</p>
              <p className="mt-4 max-w-prose text-lead text-muted">
                {tr(settings.shortBio, lang)}
              </p>
              <Link
                href={localePath(lang, '/contact')}
                className="btn btn-light mt-7"
              >
                {t.footer.startProject}
                <Icon name="arrowRight" size={17} flipRtl />
              </Link>
            </div>

            <nav aria-label={t.footer.navigation} className="md:col-span-3">
              <h2 className="label mb-5">{t.footer.navigation}</h2>
              <ul className="grid list-none grid-cols-2 gap-x-6 gap-y-2.5 p-0 md:grid-cols-1">
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

            <div className="md:col-span-4">
              <h2 className="label mb-5">{t.footer.connect}</h2>
              <ul className="list-none space-y-3 p-0 text-small">
                <li>
                  <a
                    href={`mailto:${settings.contact.email}`}
                    className="inline-flex items-center gap-2.5 text-muted transition-colors hover:text-ink"
                  >
                    <Icon name="email" size={16} className="text-faint" />
                    <span className="link-underline">{settings.contact.email}</span>
                  </a>
                </li>
                {settings.contact.whatsapp ? (
                  <li>
                    <a
                      href={`https://wa.me/${settings.contact.whatsapp.replace(/[^\d]/g, '')}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2.5 text-muted transition-colors hover:text-ink"
                    >
                      <Icon name="whatsapp" size={16} className="text-faint" />
                      <span className="link-underline numeric">{settings.contact.whatsapp}</span>
                    </a>
                  </li>
                ) : null}
                <li className="inline-flex items-center gap-2.5 text-muted">
                  <Icon name="location" size={16} className="text-faint" />
                  {tr(settings.contact.location, lang)}
                </li>
              </ul>
              <SocialLinks links={settings.social} className="mt-6" />
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-line pt-6">
            <p className="text-small text-faint">
              © <span className="numeric">{year}</span> {tr(settings.name, lang)} — {t.footer.rights}
            </p>
            <div className="flex items-center gap-3">
              <LanguageSwitcher lang={lang} />
              <a
                href="#main"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-small text-ink transition-colors duration-300 hover:bg-white/20"
              >
                {t.footer.backToTop}
                <Icon name="arrowUpRight" size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
