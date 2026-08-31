'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useId, useState } from 'react';
import { Icon } from '@/components/icons';
import type { FaqItem, Lang } from '@/lib/content/types';
import { t } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';

/**
 * The closing FAQ.
 *
 * One row open at a time, because the point is to answer the single objection
 * standing between a reader and the contact form — not to present a document.
 * The rows are hairlines and type only; the plus/minus is the sole affordance.
 */
export function Faq({ items, lang }: { items: FaqItem[]; lang: Lang }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  const reduced = useReducedMotion();
  const uid = useId();

  if (!items.length) return null;

  return (
    <ul className="list-none p-0">
      {items.map((item) => {
        const isOpen = open === item.id;
        const panelId = `${uid}-${item.slug}`;
        return (
          <li key={item.id} className="rule">
            <h3 className="m-0">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="group flex w-full items-start justify-between gap-6 py-6 text-start md:py-8"
              >
                <span
                  className={cn(
                    'text-h2 transition-colors duration-300',
                    isOpen ? 'text-ink' : 'text-muted group-hover:text-ink',
                  )}
                >
                  {t(item.question, lang)}
                </span>
                <span
                  aria-hidden
                  className="mt-1.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-strong text-ink transition-colors duration-300 group-hover:border-ink md:mt-2"
                >
                  <Icon name={isOpen ? 'minus' : 'plus'} size={13} />
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
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="measure pb-8 text-lead text-muted md:pb-10 md:ps-0">
                    {t(item.answer, lang)}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
