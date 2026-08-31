'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/icons';
import type { Lang, Settings } from '@/lib/content/types';
import { localePath, t as tr } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SocialLinks } from './SocialLinks';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  lang: Lang;
  settings: Settings;
}

const ROUTES = [
  ['work', '/work'],
  ['fonts', '/fonts'],
  ['services', '/services'],
  ['companies', '/companies'],
  ['workshops', '/workshops'],
  ['about', '/about'],
] as const;

/**
 * Floating capsule navigation. It rides above the page on a frosted pill, hides
 * on downward scroll so full-bleed imagery is never permanently cropped, and
 * collapses into a rounded sheet below the desktop breakpoint.
 */
export function Navbar({ lang, settings }: NavbarProps) {
  const t = ui(lang);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      setHidden(y > 240 && y > last);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile sheet on navigation, and lock the page while it is open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (path: string) => pathname?.startsWith(localePath(lang, path));

  return (
    <>
      <a
        href="#main"
        className="sr-only bg-ink px-4 py-2 text-surface focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[120] focus:rounded-full"
      >
        {t.nav.skipToContent}
      </a>

      <motion.header
        animate={{ y: hidden && !open ? '-160%' : '0%' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4"
      >
        <div className="mx-auto w-full max-w-shell px-gutter">
          <div
            className={cn(
              'flex items-center justify-between gap-3 rounded-full transition-all duration-500 ease-editorial',
              'h-14 ps-5 pe-2 sm:h-16 sm:ps-6 sm:pe-2.5',
              scrolled && !open
                ? 'glass shadow-soft ring-1 ring-line'
                : 'bg-transparent ring-1 ring-transparent',
            )}
          >
            <Link
              href={localePath(lang)}
              className="text-[1.0625rem] font-semibold leading-none tracking-tight sm:text-h3"
              aria-label={tr(settings.name, lang)}
            >
              {tr(settings.name, lang)}
            </Link>

            <nav aria-label={t.nav.menu} className="hidden items-center gap-1 lg:flex">
              {ROUTES.map(([key, path]) => (
                <Link
                  key={key}
                  href={localePath(lang, path)}
                  aria-current={isActive(path) ? 'page' : undefined}
                  className={cn(
                    'rounded-full px-3.5 py-2 text-small transition-colors duration-300 xl:px-4',
                    isActive(path)
                      ? 'bg-sunken font-medium text-ink'
                      : 'text-muted hover:bg-sunken hover:text-ink',
                  )}
                >
                  {t.nav[key]}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle
                labelToDark={t.nav.switchToDark}
                labelToLight={t.nav.switchToLight}
                className="hidden sm:inline-flex"
              />
              <LanguageSwitcher lang={lang} />
              <Link
                href={localePath(lang, '/contact')}
                className="btn btn-primary btn-sm hidden lg:inline-flex"
              >
                {t.nav.contact}
              </Link>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-nav"
                aria-label={open ? t.nav.close : t.nav.menu}
                className="btn-icon h-11 w-11 lg:hidden"
              >
                <Icon name={open ? 'close' : 'menu'} size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-paper px-gutter pb-8 pt-24 sm:pt-28 lg:hidden"
          >
            <nav aria-label={t.nav.menu} className="mx-auto w-full max-w-shell">
              <ul className="list-none space-y-2 p-0">
                {[...ROUTES, ['contact', '/contact'] as const].map(([key, path], i) => (
                  <motion.li
                    key={key}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={localePath(lang, path)}
                      className="card card-hover flex items-center justify-between px-5 py-4 text-h3 font-medium sm:px-6 sm:py-5"
                    >
                      {t.nav[key]}
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-sunken text-faint">
                        <Icon name="arrowRight" size={15} flipRtl />
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-5 rounded-card bg-surface p-6 shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <a
                    href={`mailto:${settings.contact.email}`}
                    className="link-underline text-small font-medium"
                  >
                    {settings.contact.email}
                  </a>
                  <ThemeToggle
                    labelToDark={t.nav.switchToDark}
                    labelToLight={t.nav.switchToLight}
                    className="sm:hidden"
                  />
                </div>
                <SocialLinks links={settings.social} />
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
