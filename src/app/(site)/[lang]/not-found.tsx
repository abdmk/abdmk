import Link from 'next/link';
import { BloomField } from '@/components/ui/Bloom';
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
    <div className="shell pb-section pt-6 sm:pt-8">
      <div className="card relative flex min-h-[56vh] flex-col justify-center overflow-hidden px-6 py-16 sm:px-10 lg:px-16">
        <BloomField hues={['peach', 'lilac', 'sky']} intensity="strong" />
        <div className="relative">
          <span className="chip numeric bg-sunken text-muted">404</span>
          <h1 className="mt-6 text-display">{tr.common.notFound}</h1>
          <p className="mt-5 max-w-prose text-lead text-muted">{tr.common.notFoundBody}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={localePath(DEFAULT_LANG)} icon="arrowRight">
              {tr.common.goHome}
            </ButtonLink>
            <ButtonLink href={localePath(DEFAULT_LANG, '/work')} variant="ghost">
              {tr.work.title}
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
