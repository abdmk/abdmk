import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LANG, LANGS } from '@/lib/i18n/config';

/**
 * Language routing.
 *
 * Every page lives under /ar or /en. A request without a language prefix is sent
 * to the visitor's preferred one when we support it, and to Arabic — the site's
 * default — otherwise.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLang = LANGS.some(
    (lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`),
  );
  if (hasLang) return NextResponse.next();

  const preferred = request.headers
    .get('accept-language')
    ?.split(',')
    .map((part) => part.split(';')[0].trim().slice(0, 2).toLowerCase())
    .find((code) => (LANGS as readonly string[]).includes(code));

  const url = request.nextUrl.clone();
  url.pathname = `/${preferred ?? DEFAULT_LANG}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except the admin, API routes, static assets and files with an extension.
  matcher: ['/((?!admin|api|_next|favicon|robots.txt|sitemap.xml|.*\\..*).*)'],
};
