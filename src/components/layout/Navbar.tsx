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
  ['contact', '/contact'],
] as const;

/**
 * Sticky navigation. It hides on downward scroll and returns on upward scroll so
 * full-bleed project imagery is never permanently cropped by a bar, and it drops
 * its background until the page has moved.
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
      setScrolled(y > 24);
      setHidden(y > 220 && y > last);
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
        className="sr-only rounded-none bg-ink px-4 py-2 text-paper focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[120]"
      >
        {t.nav.skipToContent}
      </a>

      <motion.header
        animate={{ y: hidden && !open ? '-100%' : '0%' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
          scrolled && !open ? 'bg-paper/85 backdrop-blur-md' : 'bg-transparent',
        )}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-6 md:h-[76px]">
          <Link
            href={localePath(lang)}
            className="text-h3 font-semibold leading-none tracking-tight"
            aria-label={tr(settings.name, lang)}
          >
            {tr(settings.name, lang)}
          </Link>

          <nav aria-label={t.nav.menu} className="hidden items-center gap-7 lg:flex">
            {ROUTES.map(([key, path]) => (
              <Link
                key={key}
                href={localePath(lang, path)}
                aria-current={isActive(path) ? 'page' : undefined}
                className={cn(
                  'link-underline text-small transition-opacity',
                  isActive(path) ? 'font-medium' : 'text-muted hover:text-ink',
                )}
              >
                {t.nav[key]}
              </Link>
            ))}
            <LanguageSwitcher lang={lang} className="ms-1" />
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher lang={lang} />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? t.nav.close : t.nav.menu}
              className="-me-2 grid h-11 w-11 place-items-center"
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
            className="fixed inset-0 z-40 flex flex-col bg-paper pt-[68px] lg:hidden"
          >
            <nav aria-label={t.nav.menu} className="shell flex flex-1 flex-col justify-center">
              <ul className="list-none space-y-1 p-0">
                {ROUTES.map(([key, path], i) => (
                  <motion.li
                    key={key}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.045, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={localePath(lang, path)}
                      className="flex items-baseline justify-between border-b border-line py-4 text-h2 font-medium"
                    >
                      {t.nav[key]}
                      <Icon name="arrowRight" size={20} flipRtl className="text-faint" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="shell flex items-center justify-between py-8">
              <a href={`mailto:${settings.contact.email}`} className="link-underline text-small">
                {settings.contact.email}
              </a>
              <SocialLinks links={settings.social} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
