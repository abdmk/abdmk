'use client';

import { useEffect, useState } from 'react';
import type { Lang, Testimonial } from '@/lib/content/types';
import { t } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';

/**
 * Client words as a single large quote at a time, not a wall of review cards.
 * A quote set at heading size and read alone carries more weight than five
 * identical boxes competing for attention, and it keeps the section as calm
 * as the rest of the page. Auto-advances slowly; dots give manual control.
 */
export function Testimonials({ items, lang }: { items: Testimonial[]; lang: Lang }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 7000);
    return () => clearInterval(id);
  }, [items.length]);

  if (!items.length) return null;
  const item = items[index];

  return (
    <div className="card relative overflow-hidden px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
      <span aria-hidden className="block text-mega leading-none text-line-strong">
        “
      </span>

      <blockquote className="-mt-4 sm:-mt-8">
        <p className="max-w-3xl text-h2 font-normal leading-snug">{t(item.quote, lang)}</p>
        <footer className="mt-7 sm:mt-9">
          <p className="text-small font-medium">{t(item.author, lang)}</p>
          <p className="meta-line mt-0.5">
            {[t(item.role, lang), t(item.organisation, lang)].filter(Boolean).join('، ')}
          </p>
        </footer>
      </blockquote>

      {items.length > 1 ? (
        <div className="mt-9 flex items-center gap-2 sm:mt-12" role="tablist">
          {items.map((testimonial, i) => (
            <button
              key={testimonial.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-500 ease-editorial',
                i === index ? 'w-7 bg-ink' : 'w-1.5 bg-line-strong hover:bg-faint',
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
