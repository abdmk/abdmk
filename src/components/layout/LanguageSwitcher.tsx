'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Icon } from '@/components/icons';
import type { Lang } from '@/lib/content/types';
import { LANG_NAME, otherLang } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';
import { cn } from '@/lib/utils';

/**
 * Swaps the language segment of the current URL, so switching keeps the reader
 * on the same page rather than dropping them at the homepage. Direction,
 * alignment and metrics all follow from the `lang` on <html>.
 */
export function LanguageSwitcher({ lang, className }: { lang: Lang; className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const target = otherLang(lang);
  const t = ui(lang);

  const href = (() => {
    const parts = (pathname || `/${lang}`).split('/');
    parts[1] = target; // /[lang]/rest…
    return parts.join('/') || `/${target}`;
  })();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.push(href))}
      aria-label={t.nav.switchLanguage}
      lang={target}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-sunken px-3.5 py-2 text-small font-medium text-ink',
        'transition-colors duration-300 hover:bg-line-strong',
        pending && 'opacity-50',
        className,
      )}
    >
      <Icon name="globe" size={15} />
      <span>{LANG_NAME[target]}</span>
    </button>
  );
}
