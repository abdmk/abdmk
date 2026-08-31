'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/icons';
import type { Category } from '@/lib/content/types';
import { slugify } from '@/lib/utils';
import { SortableList } from './Sortable';

const INPUT = 'w-full border-0 border-b border-line bg-transparent py-2 outline-none focus:border-ink';

/**
 * The work taxonomy. New categories can be added freely; the work page picks
 * them up automatically and only shows the ones that have published projects.
 */
export function CategoriesEditor({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Category[]>(initial);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const update = (index: number, patch: Partial<Category>) => {
    setItems(items.map((c, i) => (i === index ? { ...c, ...patch } : c)));
    setStatus('idle');
  };

  async function save() {
    setStatus('saving');
    // Persist the visible order as the sort order.
    const payload = items.map((item, i) => ({ ...item, order: i }));
    await fetch('/api/admin/collection/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setItems(payload);
    setStatus('saved');
    router.refresh();
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 font-light">Categories</h1>
          <p className="mt-2 max-w-prose text-small text-muted">
            The filters on the work page. Drag to reorder.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void save()}
          disabled={status === 'saving'}
          className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-small font-medium text-paper disabled:opacity-50"
        >
          {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : 'Save'}
          <Icon name={status === 'saved' ? 'check' : 'download'} size={14} />
        </button>
      </div>

      <div className="max-w-3xl">
        <SortableList
          items={items}
          onReorder={(next) => {
            setItems(next);
            setStatus('idle');
          }}
          keyOf={(item, i) => `${item.slug}-${i}`}
          label={(item) => item.name.en || item.slug}
          actions={(_, index) => (
            <button
              type="button"
              onClick={() => setItems(items.filter((_, k) => k !== index))}
              aria-label="Remove category"
              className="grid h-7 w-7 place-items-center text-faint hover:text-accent"
            >
              <Icon name="trash" size={13} />
            </button>
          )}
        >
          {(item, index) => (
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <span className="label mb-1 block">Slug</span>
                <input
                  value={item.slug}
                  onChange={(e) => update(index, { slug: slugify(e.target.value) })}
                  aria-label={`Category ${index + 1} slug`}
                  dir="ltr"
                  className={INPUT}
                />
              </div>
              <div>
                <span className="label mb-1 block">العربية</span>
                <input
                  value={item.name.ar}
                  onChange={(e) => update(index, { name: { ...item.name, ar: e.target.value } })}
                  aria-label={`Category ${index + 1} name — العربية`}
                  dir="rtl"
                  className={INPUT}
                />
              </div>
              <div>
                <span className="label mb-1 block">English</span>
                <input
                  value={item.name.en}
                  onChange={(e) => update(index, { name: { ...item.name, en: e.target.value } })}
                  aria-label={`Category ${index + 1} name — English`}
                  dir="ltr"
                  className={INPUT}
                />
              </div>
            </div>
          )}
        </SortableList>

        <button
          type="button"
          onClick={() =>
            setItems([...items, { slug: '', name: { ar: '', en: '' }, order: items.length }])
          }
          className="mt-4 inline-flex items-center gap-2 border border-line px-3 py-2 text-small hover:border-ink"
        >
          <Icon name="plus" size={13} />
          Add category
        </button>
      </div>
    </div>
  );
}
