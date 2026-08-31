import { ButtonLink } from '@/components/ui/Button';
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
    <div className="shell flex min-h-[60vh] flex-col justify-center py-section">
      <p className="label numeric">404</p>
      <h1 className="mt-6 max-w-[14ch] text-mega">{tr.common.notFound}</h1>
      <p className="measure mt-7 text-lead text-muted">{tr.common.notFoundBody}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href={localePath(DEFAULT_LANG)} icon="arrowRight">
          {tr.common.goHome}
        </ButtonLink>
        <ButtonLink href={localePath(DEFAULT_LANG, '/work')} variant="ghost">
          {tr.work.title}
        </ButtonLink>
      </div>
    </div>
  );
}
