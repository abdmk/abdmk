'use client';

import { Icon } from '@/components/icons';
import type { Field } from '@/lib/admin/schema';
import type { Localized, Media } from '@/lib/content/types';
import { slugify } from '@/lib/utils';
import { BLANK_MEDIA, MediaPicker } from './MediaPicker';
import { SortableList } from './Sortable';

/** Options offered by a `relation` field, supplied by the page. */
export type RelationOptions = Record<string, { value: string; label: string }[]>;

const INPUT =
  'w-full border-0 border-b border-line bg-transparent px-0 py-2 text-body outline-none transition-colors focus:border-ink';

export function FieldLabel({ field }: { field: Field }) {
  return (
    <>
      <span className="label mb-1.5 block">{field.label}</span>
      {field.help ? <span className="mb-2 block text-meta text-faint">{field.help}</span> : null}
    </>
  );
}

/** A localized value: the two scripts side by side, each in its own direction. */
function LocalizedInput({
  label,
  value,
  onChange,
  multiline,
}: {
  /** Names the pair for screen readers; each side adds its own script. */
  label: string;
  value: Localized | undefined;
  onChange: (value: Localized) => void;
  multiline?: boolean;
}) {
  const val = value ?? { ar: '', en: '' };
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <Tag
          value={val.ar}
          onChange={(e: { target: { value: string } }) => onChange({ ...val, ar: e.target.value })}
          dir="rtl"
          rows={multiline ? 4 : undefined}
          className={`${INPUT} ${multiline ? 'resize-y' : ''}`}
          aria-label={`${label} — العربية`}
        />
        <span className="text-meta text-faint">العربية</span>
      </div>
      <div>
        <Tag
          value={val.en}
          onChange={(e: { target: { value: string } }) => onChange({ ...val, en: e.target.value })}
          dir="ltr"
          rows={multiline ? 4 : undefined}
          className={`${INPUT} ${multiline ? 'resize-y' : ''}`}
          aria-label={`${label} — English`}
        />
        <span className="text-meta text-faint">English</span>
      </div>
    </div>
  );
}

/** Comma-free tag input: one value per chip, added with Enter. */
function StringList({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <div>
      <ul className="mb-2 flex list-none flex-wrap gap-2 p-0">
        {value.map((entry, i) => (
          <li key={`${entry}-${i}`} className="inline-flex items-center gap-1.5 border border-line px-2.5 py-1 text-small">
            {entry}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, k) => k !== i))}
              aria-label={`Remove ${entry}`}
              className="text-faint hover:text-accent"
            >
              <Icon name="closeSmall" size={12} />
            </button>
          </li>
        ))}
      </ul>
      <input
        aria-label={`${label} — add entry`}
        placeholder="Type and press Enter"
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return;
          e.preventDefault();
          const entry = e.currentTarget.value.trim();
          if (entry) onChange([...value, entry]);
          e.currentTarget.value = '';
        }}
        className={INPUT}
      />
    </div>
  );
}

/** Multi-select over another collection, rendered as toggleable chips. */
function RelationPicker({
  value,
  options,
  onChange,
}: {
  value: string[];
  options: { value: string; label: string }[];
  onChange: (value: string[]) => void;
}) {
  return (
    <ul className="flex list-none flex-wrap gap-2 p-0">
      {options.map((option) => {
        const on = value.includes(option.value);
        return (
          <li key={option.value}>
            <button
              type="button"
              aria-pressed={on}
              onClick={() =>
                onChange(
                  on ? value.filter((v) => v !== option.value) : [...value, option.value],
                )
              }
              className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-small transition-colors ${
                on ? 'border-ink bg-ink text-paper' : 'border-line text-muted hover:border-ink'
              }`}
            >
              {on ? <Icon name="check" size={12} /> : null}
              {option.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

interface FieldInputProps {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
  relations: RelationOptions;
  /** Used by the slug field to offer a generated value. */
  titleValue?: Localized;
}

/** Renders one schema field. `blocks` is handled by BlockBuilder, not here. */
export function FieldInput({ field, value, onChange, relations, titleValue }: FieldInputProps) {
  switch (field.type) {
    case 'text':
      return (
        <input
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          aria-label={field.label}
          dir="ltr"
          className={INPUT}
        />
      );

    case 'slug':
      return (
        <div className="flex items-end gap-3">
          <input
            value={(value as string) ?? ''}
            onChange={(e) => onChange(slugify(e.target.value))}
            aria-label={field.label}
            dir="ltr"
            className={INPUT}
          />
          {titleValue ? (
            <button
              type="button"
              onClick={() => onChange(slugify(titleValue.en || titleValue.ar))}
              className="shrink-0 whitespace-nowrap pb-2 text-small text-muted hover:text-ink"
            >
              Generate
            </button>
          ) : null}
        </div>
      );

    case 'localized':
      return <LocalizedInput label={field.label} value={value as Localized} onChange={onChange} />;

    case 'localizedArea':
      return (
        <LocalizedInput label={field.label} value={value as Localized} onChange={onChange} multiline />
      );

    case 'number':
      return (
        <input
          type="number"
          value={(value as number) ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={field.label}
          className={INPUT}
        />
      );

    case 'date':
      return (
        <input
          type="date"
          value={((value as string) ?? '').slice(0, 10)}
          onChange={(e) => onChange(e.target.value)}
          aria-label={field.label}
          className={INPUT}
        />
      );

    case 'boolean':
      return (
        <label className="inline-flex items-center gap-2.5 py-2 text-small">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 accent-ink"
          />
          {field.label}
        </label>
      );

    case 'select':
      return (
        <select
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          aria-label={field.label}
          className={INPUT}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case 'stringList':
      return <StringList label={field.label} value={(value as string[]) ?? []} onChange={onChange} />;

    case 'relation':
      return (
        <RelationPicker
          value={(value as string[]) ?? []}
          options={relations[field.collection ?? ''] ?? []}
          onChange={onChange}
        />
      );

    case 'relationSingle':
      return (
        <select
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
          aria-label={field.label}
          className={INPUT}
        >
          <option value="">— none —</option>
          {(relations[field.collection ?? ''] ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case 'media':
      return <MediaPicker value={value as Media} onChange={onChange} />;

    case 'mediaList': {
      const list = (value as Media[]) ?? [];
      return (
        <div>
          <SortableList
            items={list}
            onReorder={onChange}
            keyOf={(item, i) => `${item.src}-${i}`}
            label={(item) => item.src.split('/').pop() ?? 'media'}
            actions={(_, i) => (
              <button
                type="button"
                onClick={() => onChange(list.filter((_, k) => k !== i))}
                aria-label="Remove"
                className="grid h-7 w-7 place-items-center text-faint hover:text-accent"
              >
                <Icon name="trash" size={13} />
              </button>
            )}
          >
            {(item, i) => (
              <MediaPicker
                value={item}
                onChange={(next) => onChange(list.map((m, k) => (k === i ? next : m)))}
              />
            )}
          </SortableList>
          <button
            type="button"
            onClick={() => onChange([...list, { ...BLANK_MEDIA }])}
            className="mt-3 inline-flex items-center gap-2 border border-line px-3 py-2 text-small hover:border-ink"
          >
            <Icon name="plus" size={13} />
            Add media
          </button>
        </div>
      );
    }

    case 'localizedList': {
      const list = (value as Localized[]) ?? [];
      return (
        <div>
          <SortableList
            items={list}
            onReorder={onChange}
            keyOf={(_, i) => `entry-${i}`}
            label={(item) => item.en || item.ar || '—'}
            actions={(_, i) => (
              <button
                type="button"
                onClick={() => onChange(list.filter((_, k) => k !== i))}
                aria-label="Remove"
                className="grid h-7 w-7 place-items-center text-faint hover:text-accent"
              >
                <Icon name="trash" size={13} />
              </button>
            )}
          >
            {(item, i) => (
              <LocalizedInput
                label={`${field.label} ${i + 1}`}
                value={item}
                onChange={(next) => onChange(list.map((entry, k) => (k === i ? next : entry)))}
              />
            )}
          </SortableList>
          <button
            type="button"
            onClick={() => onChange([...list, { ar: '', en: '' }])}
            className="mt-3 inline-flex items-center gap-2 border border-line px-3 py-2 text-small hover:border-ink"
          >
            <Icon name="plus" size={13} />
            Add entry
          </button>
        </div>
      );
    }

    case 'objectList': {
      const list = (value as Record<string, unknown>[]) ?? [];
      const shape = field.fields ?? [];
      return (
        <div>
          <SortableList
            items={list}
            onReorder={onChange}
            keyOf={(_, i) => `row-${i}`}
            label={(item) => {
              const first = item[shape[0]?.name ?? ''];
              if (first && typeof first === 'object' && 'en' in (first as Localized)) {
                return (first as Localized).en || (first as Localized).ar || '—';
              }
              return String(first ?? '—');
            }}
            actions={(_, i) => (
              <button
                type="button"
                onClick={() => onChange(list.filter((_, k) => k !== i))}
                aria-label="Remove"
                className="grid h-7 w-7 place-items-center text-faint hover:text-accent"
              >
                <Icon name="trash" size={13} />
              </button>
            )}
          >
            {(item, i) => (
              <div className="grid gap-4 sm:grid-cols-2">
                {shape.map((sub) => (
                  <div key={sub.name} className={sub.half ? '' : 'sm:col-span-2'}>
                    <FieldLabel field={sub} />
                    <FieldInput
                      field={sub}
                      value={item[sub.name]}
                      relations={relations}
                      onChange={(next) =>
                        onChange(
                          list.map((row, k) => (k === i ? { ...row, [sub.name]: next } : row)),
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </SortableList>
          <button
            type="button"
            onClick={() =>
              onChange([
                ...list,
                Object.fromEntries(
                  shape.map((sub) => [
                    sub.name,
                    sub.type === 'localized' ? { ar: '', en: '' } : sub.type === 'number' ? 400 : '',
                  ]),
                ),
              ])
            }
            className="mt-3 inline-flex items-center gap-2 border border-line px-3 py-2 text-small hover:border-ink"
          >
            <Icon name="plus" size={13} />
            Add row
          </button>
        </div>
      );
    }

    default:
      return null;
  }
}
