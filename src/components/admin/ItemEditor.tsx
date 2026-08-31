'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/icons';
import type { CollectionSchema } from '@/lib/admin/schema';
import type { Block, Localized } from '@/lib/content/types';
import { cn } from '@/lib/utils';
import { BlockBuilder } from './BlockBuilder';
import { FieldInput, FieldLabel, type RelationOptions } from './Fields';

type Item = Record<string, unknown>;

/**
 * Editor for one item of any collection.
 *
 * The form is built from the collection's schema, so this component knows
 * nothing about projects or fonts specifically — which is what keeps every
 * collection's editor consistent and makes adding a field a one-line change.
 */
export function ItemEditor({
  schema,
  initial,
  relations,
  isNew,
}: {
  schema: CollectionSchema;
  initial: Item;
  relations: RelationOptions;
  isNew: boolean;
}) {
  const router = useRouter();
  const [item, setItem] = useState<Item>(initial);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');

  const set = (name: string, value: unknown) => {
    setItem((current) => ({ ...current, [name]: value }));
    setStatus('idle');
  };

  async function save(overrides: Item = {}) {
    const payload = { ...item, ...overrides };
    setStatus('saving');
    setError('');

    const response = await fetch(`/api/admin/collection/${schema.name}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setItem(payload);
      setStatus('saved');
      router.refresh();
      if (isNew) router.replace(`/admin/${schema.name}/${payload.id}`);
    } else {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? 'Could not save');
      setStatus('error');
    }
  }

  async function remove() {
    if (!confirm('Delete this permanently?')) return;
    await fetch(`/api/admin/collection/${schema.name}/${item.id}`, { method: 'DELETE' });
    router.replace(`/admin/${schema.name}`);
    router.refresh();
  }

  const title = item[schema.titleField] as Localized | undefined;
  const published = Boolean(item.published);
  const blockField = schema.fields.find((f) => f.type === 'blocks');
  const formFields = schema.fields.filter((f) => f.type !== 'blocks');

  return (
    <div className="pb-24">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <Link
            href={`/admin/${schema.name}`}
            className="label inline-flex items-center gap-2 hover:text-ink"
          >
            <Icon name="arrowLeft" size={13} />
            {schema.label}
          </Link>
          <h1 className="mt-3 truncate text-h2 font-medium">
            {title?.en || title?.ar || `New ${schema.singular}`}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'px-2.5 py-1 text-meta',
              published ? 'bg-ink text-paper' : 'border border-line text-muted',
            )}
          >
            {published ? 'PUBLISHED' : 'DRAFT'}
          </span>

          {schema.publicPath && item.slug && published ? (
            <Link
              href={`/ar/${schema.publicPath}/${item.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-small hover:border-ink"
            >
              View
              <Icon name="arrowUpRight" size={13} />
            </Link>
          ) : null}

          <button
            type="button"
            onClick={() => void save({ published: !published })}
            className="border border-line px-3 py-2 text-small hover:border-ink"
          >
            {published ? 'Unpublish' : 'Publish'}
          </button>

          {!isNew ? (
            <button
              type="button"
              onClick={() => void remove()}
              className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-small text-muted hover:border-accent hover:text-accent"
            >
              <Icon name="trash" size={13} />
              Delete
            </button>
          ) : null}

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
      </div>

      {error ? (
        <p role="alert" className="mb-6 border border-accent px-4 py-3 text-small text-accent">
          {error}
        </p>
      ) : null}

      <div className="grid max-w-4xl gap-7 sm:grid-cols-2">
        {formFields.map((field) => (
          <div key={field.name} className={field.half ? 'sm:col-span-1' : 'sm:col-span-2'}>
            {field.type !== 'boolean' ? <FieldLabel field={field} /> : null}
            <FieldInput
              field={field}
              value={item[field.name]}
              relations={relations}
              titleValue={title}
              onChange={(value) => set(field.name, value)}
            />
          </div>
        ))}
      </div>

      {blockField ? (
        <section className="mt-14">
          <h2 className="text-h3 font-medium">{blockField.label}</h2>
          <p className="mb-5 mt-1 max-w-prose text-small text-muted">
            Compose the project page from blocks. Drag a block by its handle, or use the arrows, to
            reorder.
          </p>
          <BlockBuilder
            blocks={(item[blockField.name] as Block[]) ?? []}
            relations={relations}
            onChange={(blocks) => set(blockField.name, blocks)}
          />
        </section>
      ) : null}

      {/* A second save at the foot: a long case study should not need a scroll back up. */}
      <div className="mt-12 flex items-center gap-3 border-t border-line pt-6">
        <button
          type="button"
          onClick={() => void save()}
          disabled={status === 'saving'}
          className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-small font-medium text-paper disabled:opacity-50"
        >
          {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : 'Save'}
          <Icon name={status === 'saved' ? 'check' : 'download'} size={14} />
        </button>
        {status === 'saved' ? <span className="text-small text-muted">All changes stored.</span> : null}
      </div>
    </div>
  );
}
