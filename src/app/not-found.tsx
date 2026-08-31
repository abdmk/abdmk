import Link from 'next/link';
import './globals.css';
import { DEFAULT_LANG, DIR, localePath } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';

/**
 * Root 404 — for URLs outside the language shell entirely. The site and the
 * admin each own a root layout, so this page supplies its own document.
 */
export default function RootNotFound() {
  const tr = ui(DEFAULT_LANG);
  return (
    <html lang={DEFAULT_LANG} dir={DIR[DEFAULT_LANG]}>
      <body className="min-h-dvh">
        <div className="shell flex min-h-dvh flex-col justify-center py-20">
          <p className="label numeric">404</p>
          <h1 className="mt-5 text-display font-light">{tr.common.notFound}</h1>
          <p className="mt-6 max-w-prose text-lead text-muted">{tr.common.notFoundBody}</p>
          <Link
            href={localePath(DEFAULT_LANG)}
            className="link-underline mt-10 text-h3 font-light"
          >
            {tr.common.goHome}
          </Link>
        </div>
      </body>
    </html>
  );
}
