import Link from 'next/link';
import { DEFAULT_LANG, localePath } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';

/**
 * Not-found inside the language shell. It cannot read route params, so it uses
 * the default language — the surrounding layout still supplies nav and footer
 * in whichever language the reader was in.
 */
export default function NotFound() {
  const tr = ui(DEFAULT_LANG);
  return (
    <div className="shell flex min-h-[60vh] flex-col justify-center py-20">
      <p className="label numeric">404</p>
      <h1 className="mt-5 text-display font-light">{tr.common.notFound}</h1>
      <p className="mt-6 max-w-prose text-lead text-muted">{tr.common.notFoundBody}</p>
      <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
        <Link href={localePath(DEFAULT_LANG)} className="link-underline text-h3 font-light">
          {tr.common.goHome}
        </Link>
        <Link href={localePath(DEFAULT_LANG, '/work')} className="link-underline text-h3 font-light">
          {tr.work.title}
        </Link>
      </div>
    </div>
  );
}
