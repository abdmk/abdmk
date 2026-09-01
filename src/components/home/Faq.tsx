'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useId, useState } from 'react';
import { Icon } from '@/components/icons';
import type { FaqItem, Lang } from '@/lib/content/types';
import { t } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';

/**
 * The closing FAQ: one card, rows separated by hairlines, one row open at a
 * time. The point is to clear the single objection standing between a reader
 * and the contact form, not to present a document.
 */
export function Faq({ items, lang }: { items: FaqItem[]; lang: Lang }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  const reduced = useReducedMotion();
  const uid = useId();

  if (!items.length) return null;

  return (
    <div className="card overflow-hidden">
      <ul className="list-none p-0">
        {items.map((item, i) => {
          const isOpen = open === item.id;
          const panelId = `${uid}-${item.slug}`;
          return (
            <li key={item.id} className={cn(i > 0 && 'rule')}>
              <h3 className="m-0">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-start sm:px-8 sm:py-6"
                >
                  <span className="text-h3 font-medium">{t(item.question, lang)}</span>
                  <span
                    aria-hidden
                    className={cn(
                      'grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sunken text-ink transition-transform duration-300',
                      isOpen && 'rotate-45',
                    )}
                  >
                    <Icon name="plus" size={15} />
                  </span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    id={panelId}
                    key="panel"
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduced ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-prose px-6 pb-6 text-lead text-muted sm:px-8 sm:pb-8">
                      {t(item.answer, lang)}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
