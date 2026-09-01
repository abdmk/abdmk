'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/icons';
import type { NavLink } from '@/lib/content/types';

const INPUT =
  'w-full border-0 border-b border-line bg-transparent py-2 outline-none focus:border-ink';

function makeId() {
  return `nav_${Date.now().toString(36)}`;
}

function emptyLink(order: number): NavLink {
  return {
    id: makeId(),
    label: { ar: '', en: '' },
    href: '/',
    order,
    visible: true,
  };
}

export function NavigationEditor({ initial }: { initial: NavLink[] }) {
  const router = useRouter();
  const [items, setItems] = useState<NavLink[]>(initial);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const update = (index: number, patch: Partial<NavLink>) => {
    setItems(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
    setStatus('idle');
  };

  const updateLabel = (index: number, lang: 'ar' | 'en', value: string) => {
    setItems(
      items.map((item, i) =>
        i === index ? { ...item, label: { ...item.label, [lang]: value } } : item,
      ),
    );
    setStatus('idle');
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setItems(next);
    setStatus('idle');
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setItems(next);
    setStatus('idle');
  };

  const addLink = () => {
    setItems([...items, emptyLink(items.length)]);
    setStatus('idle');
  };

  const removeLink = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    setStatus('idle');
  };

  async function save() {
    setStatus('saving');
    const payload = items.map((item, i) => ({ ...item, order: i }));
    await fetch('/api/admin/collection/navigation', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ main: payload }),
    });
    setItems(payload);
    setStatus('saved');
    router.refresh();
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 font-light">Navigation</h1>
          <p className="mt-2 max-w-prose text-small text-muted">
            Manage the main site navigation links. Reorder with the arrows.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void save()}
          disabled={status === 'saving'}
          className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-small font-medium text-paper disabled:opacity-50"
        >
          {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved' : 'Save'}
          <Icon name={status === 'saved' ? 'check' : 'download'} size={14} />
        </button>
      </div>

      <div className="max-w-3xl space-y-px border border-line bg-line">
        {items.map((item, index) => (
          <div key={item.id} className="bg-paper p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-meta text-muted">Label (EN)</label>
                    <input
                      type="text"
                      value={item.label.en}
                      onChange={(e) => updateLabel(index, 'en', e.target.value)}
                      className={INPUT}
                    />
                  </div>
                  <div>
                    <label className="text-meta text-muted">Label (AR)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={item.label.ar}
                      onChange={(e) => updateLabel(index, 'ar', e.target.value)}
                      className={INPUT}
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-meta text-muted">Href</label>
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => update(index, { href: e.target.value })}
                      className={INPUT}
                    />
                  </div>
                  <div className="flex items-end gap-4 pb-2">
                    <label className="inline-flex items-center gap-2 text-small">
                      <input
                        type="checkbox"
                        checked={item.visible}
                        onChange={(e) => update(index, { visible: e.target.checked })}
                      />
                      Visible
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="p-1 text-muted hover:text-ink disabled:opacity-30"
                  title="Move up"
                >
                  <Icon name="arrowLeft" size={14} className="rotate-90" />
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(index)}
                  disabled={index === items.length - 1}
                  className="p-1 text-muted hover:text-ink disabled:opacity-30"
                  title="Move down"
                >
                  <Icon name="arrowRight" size={14} className="rotate-90" />
                </button>
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="p-1 text-muted hover:text-ink"
                  title="Remove"
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addLink}
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-small text-muted hover:text-ink"
      >
        <Icon name="plus" size={14} />
        Add link
      </button>
    </div>
  );
}
