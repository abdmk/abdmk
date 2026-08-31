import type { Lang, Localized } from '@/lib/content/types';

export const LANGS = ['ar', 'en'] as const;
/** Arabic is the site's default language. */
export const DEFAULT_LANG: Lang = 'ar';

export const DIR: Record<Lang, 'rtl' | 'ltr'> = { ar: 'rtl', en: 'ltr' };
export const LANG_NAME: Record<Lang, string> = { ar: 'العربية', en: 'English' };
/** Short label for the switcher — always shows the *other* language. */
export const LANG_SHORT: Record<Lang, string> = { ar: 'ع', en: 'EN' };

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

export function otherLang(lang: Lang): Lang {
  return lang === 'ar' ? 'en' : 'ar';
}

/**
 * Read a localized value. Falls back to the other language when a translation
 * is missing, so a half-translated draft still renders something useful.
 */
export function t(value: Localized | undefined, lang: Lang): string {
  if (!value) return '';
  return value[lang]?.trim() || value[lang === 'ar' ? 'en' : 'ar']?.trim() || '';
}

/** Prefix a path with the current language: `/work` → `/ar/work`. */
export function localePath(lang: Lang, path = '/'): string {
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${clean}`;
}

/** Format a date in the reader's language. Arabic uses Latin digits for scanability. */
export function formatDate(iso: string, lang: Lang, opts?: Intl.DateTimeFormatOptions): string {
  const date = new Date(iso);
  if (Number.isNaN(+date)) return iso;
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...opts,
  }).format(date);
}
