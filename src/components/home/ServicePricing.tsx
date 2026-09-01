'use client';

import { useState } from 'react';
import type { Lang, Service } from '@/lib/content/types';
import { Icon } from '@/components/icons';
import { t } from '@/lib/i18n/config';

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price);
}

export function ServicePricing({
  service,
  lang,
}: {
  service: Service;
  lang: Lang;
}) {
  const [expanded, setExpanded] = useState(false);
  const packages = (service.packages || [])
    .filter(p => p.visible)
    .sort((a, b) => a.order - b.order);

  if (packages.length === 0) return null;

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="inline-flex items-center gap-2 text-small font-medium text-muted hover:text-ink transition-colors"
      >
        <Icon name={expanded ? 'close' : 'plus'} size={14} />
        {lang === 'ar' ? 'عرض الباقات والأسعار' : 'View packages & pricing'}
      </button>

      {expanded && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`card relative flex flex-col p-5 sm:p-6 ${
                pkg.recommended
                  ? 'ring-2 ring-ink'
                  : ''
              }`}
            >
              {pkg.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 chip-solid bg-ink text-paper text-meta px-3 py-0.5">
                  {lang === 'ar' ? 'الأكثر طلبًا' : 'Most Popular'}
                </span>
              )}

              <h4 className="text-h3 font-medium">{t(pkg.name, lang)}</h4>
              <p className="mt-1 text-small text-muted">{t(pkg.description, lang)}</p>

              <p className="mt-4 numeric text-h2 font-medium">
                {formatPrice(pkg.price, pkg.currency)}
              </p>

              <div className="mt-1 flex gap-3 text-meta text-faint">
                <span>{t(pkg.duration, lang)}</span>
                <span>·</span>
                <span>{t(pkg.revisions, lang)}</span>
              </div>

              <ul className="mt-5 flex-1 space-y-2.5">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-small">
                    <Icon name="check" size={14} className="mt-0.5 shrink-0 text-ink" />
                    <span>{t(feature, lang)}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`/${lang}/contact?service=${service.slug}&package=${pkg.id}`}
                className={`mt-6 btn text-center ${
                  pkg.recommended ? 'btn-primary' : 'btn-secondary border border-line'
                }`}
              >
                {t(pkg.cta, lang)}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
