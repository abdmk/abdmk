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

/**
 * Six destinations, no dropdowns. Fonts, companies and workshops still have
 * pages — they are reached from the work they belong to and from the footer —
 * but a portfolio's top bar should answer "what, who, how much, who are you,
 * how do I reach you" and nothing else.
 */
const ROUTES = [
  ['work', '/work'],
  ['services', '/services'],
  ['courses', '/courses'],
  ['products', '/products'],
  ['about', '/about'],
] as const;

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
      setScrolled(y > 8);
      // Only hide well past the fold, and only while travelling down — a bar
      // that flickers on every small scroll is worse than one that stays.
      setHidden(y > 320 && y > last + 4);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        className="sr-only bg-ink px-4 py-2 text-paper focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[120] focus:rounded-full"
      >
        {t.nav.skipToContent}
      </a>

      <motion.header
        animate={{ y: hidden && !open ? '-110%' : '0%' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
          scrolled && !open ? 'glass border-b border-line' : 'border-b border-transparent',
        )}
      >
        <div className="shell flex h-16 items-center justify-between gap-6 md:h-20">
          <Link
            href={localePath(lang)}
            className="text-h3 font-medium leading-none"
            aria-label={tr(settings.name, lang)}
          >
            {tr(settings.name, lang)}
          </Link>

          <nav aria-label={t.nav.menu} className="hidden items-center gap-8 lg:flex xl:gap-10">
            {ROUTES.map(([key, path]) => (
              <Link
                key={key}
                href={localePath(lang, path)}
                aria-current={isActive(path) ? 'page' : undefined}
                className={cn(
                  'text-small transition-colors duration-300',
                  isActive(path)
                    ? 'link-rule font-medium text-ink'
                    : 'link-underline text-muted hover:text-ink',
                )}
              >
                {t.nav[key]}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle
              labelToDark={t.nav.switchToDark}
              labelToLight={t.nav.switchToLight}
              className="hidden sm:grid"
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
              className="-me-2 grid h-11 w-11 place-items-center text-ink lg:hidden"
            >
              <Icon name={open ? 'close' : 'menu'} size={20} />
            </button>
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
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-paper pt-16 md:pt-20 lg:hidden"
          >
            <nav aria-label={t.nav.menu} className="shell flex flex-1 flex-col justify-center py-10">
              <ul className="list-none p-0">
                {[...ROUTES, ['contact', '/contact'] as const].map(([key, path], i) => (
                  <motion.li
                    key={key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.04 + i * 0.05,
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="rule"
                  >
                    <Link
                      href={localePath(lang, path)}
                      className="flex items-baseline justify-between gap-4 py-5 text-h1"
                    >
                      {t.nav[key]}
                      <span className="label">{String(i + 1).padStart(2, '0')}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="shell rule flex flex-wrap items-center justify-between gap-5 py-7">
              <a href={`mailto:${settings.contact.email}`} className="link-rule text-small">
                {settings.contact.email}
              </a>
              <div className="flex items-center gap-4">
                <ThemeToggle
                  labelToDark={t.nav.switchToDark}
                  labelToLight={t.nav.switchToLight}
                  className="sm:hidden"
                />
                <SocialLinks links={settings.social} />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
