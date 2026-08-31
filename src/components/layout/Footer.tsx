import Link from 'next/link';
import { Icon } from '@/components/icons';
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

export function Footer({ lang, settings }: { lang: Lang; settings: Settings }) {
  const t = ui(lang);
  const year = new Date().getFullYear();

  return (
    <footer className="surface-invert mt-section">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-h2 font-medium">{tr(settings.name, lang)}</p>
            <p className="mt-4 max-w-prose text-lead text-muted">{tr(settings.shortBio, lang)}</p>
          </div>

          <nav aria-label={t.footer.navigation} className="md:col-span-3">
            <h2 className="label mb-5">{t.footer.navigation}</h2>
            <ul className="list-none space-y-2.5 p-0">
              {ROUTES.map(([key, path]) => (
                <li key={key}>
                  <Link href={localePath(lang, path)} className="link-underline text-small text-muted hover:text-ink">
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
                <a href={`mailto:${settings.contact.email}`} className="inline-flex items-center gap-2.5 hover:opacity-60">
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
                    className="inline-flex items-center gap-2.5 hover:opacity-60"
                  >
                    <Icon name="whatsapp" size={16} className="text-faint" />
                    <span className="link-underline">{settings.contact.whatsapp}</span>
                  </a>
                </li>
              ) : null}
              <li className="inline-flex items-center gap-2.5 text-muted">
                <Icon name="location" size={16} className="text-faint" />
                {tr(settings.contact.location, lang)}
              </li>
            </ul>
            <SocialLinks links={settings.social} className="-ms-2.5 mt-5" />
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="text-small text-faint">
            © <span className="numeric">{year}</span> {tr(settings.name, lang)} — {t.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            <LanguageSwitcher lang={lang} />
            <a href="#main" className="inline-flex items-center gap-2 text-small text-muted hover:text-ink">
              {t.footer.backToTop}
              <Icon name="arrowUpRight" size={15} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
