'use client';

import { useState } from 'react';
import { Icon } from '@/components/icons';
import { BLOCK_TYPES } from '@/lib/admin/schema';
import type { Block, BlockType, Localized, Media } from '@/lib/content/types';
import { makeId } from '@/lib/utils';
import { FieldInput, FieldLabel, type RelationOptions } from './Fields';
import { BLANK_MEDIA, MediaPicker } from './MediaPicker';
import { SortableList } from './Sortable';

const BLANK_TEXT: Localized = { ar: '', en: '' };

/** How many media slots each block type takes, and what else it carries. */
function newBlock(type: BlockType): Block {
  const id = makeId('b');
  const media = () => ({ ...BLANK_MEDIA });
  switch (type) {
    case 'heading':
      return { id, type, text: { ...BLANK_TEXT }, level: 2 };
    case 'paragraph':
      return { id, type, text: { ...BLANK_TEXT } };
    case 'image':
    case 'imageFull':
      return { id, type, media: media() };
    case 'imagePair':
      return { id, type, media: [media(), media()] };
    case 'imageTrio':
      return { id, type, media: [media(), media(), media()] };
    case 'gallery':
      return { id, type, media: [media()], columns: 3 };
    case 'video':
    case 'gif':
      return { id, type, media: { ...media(), kind: type === 'gif' ? 'gif' : 'video' } };
    case 'quote':
      return { id, type, text: { ...BLANK_TEXT }, attribution: { ...BLANK_TEXT } };
    case 'divider':
      return { id, type };
    case 'textImage':
    case 'imageText':
      return { id, type, heading: { ...BLANK_TEXT }, text: { ...BLANK_TEXT }, media: media() };
    case 'button':
      return { id, type, label: { ...BLANK_TEXT }, href: '', external: true };
    case 'embed':
      return { id, type, url: '', title: { ...BLANK_TEXT }, ratio: 16 / 9 };
    default:
      return { id, type: 'divider' };
  }
}

const label = (type: BlockType) => BLOCK_TYPES.find((b) => b.value === type)?.label ?? type;

/**
 * The case-study builder.
 *
 * A project body is an ordered list of blocks that can be added, reordered and
 * removed — dragged by the handle or moved with the keyboard. Each block type
 * renders only the fields it actually has, so the form never asks for a caption
 * on a divider.
 */
export function BlockBuilder({
  blocks,
  onChange,
  relations,
}: {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  relations: RelationOptions;
}) {
  const [adding, setAdding] = useState(false);

  const update = (index: number, patch: Partial<Block>) =>
    onChange(blocks.map((b, i) => (i === index ? ({ ...b, ...patch } as Block) : b)));

  const mediaAt = (block: Block, i: number, list: Media[], index: number) => (
    <MediaPicker
      key={i}
      value={list[i]}
      onChange={(next) =>
        update(index, { media: list.map((m, k) => (k === i ? next : m)) } as Partial<Block>)
      }
    />
  );

  function renderBlock(block: Block, index: number) {
    switch (block.type) {
      case 'heading':
        return (
          <div className="space-y-4">
            <div>
              <FieldLabel field={{ name: 'text', label: 'Text', type: 'localized' }} />
              <FieldInput
                field={{ name: 'text', label: 'Text', type: 'localized' }}
                value={block.text}
                relations={relations}
                onChange={(v) => update(index, { text: v as Localized })}
              />
            </div>
            <label className="inline-flex items-center gap-2 text-small">
              Level
              <select
                value={block.level}
                onChange={(e) => update(index, { level: Number(e.target.value) as 2 | 3 })}
                aria-label="Heading level"
                className="border border-line bg-transparent px-2 py-1"
              >
                <option value={2}>H2</option>
                <option value={3}>H3</option>
              </select>
            </label>
          </div>
        );

      case 'paragraph':
        return (
          <FieldInput
            field={{ name: 'text', label: 'Text', type: 'localizedArea' }}
            value={block.text}
            relations={relations}
            onChange={(v) => update(index, { text: v as Localized })}
          />
        );

      case 'image':
      case 'imageFull':
      case 'video':
      case 'gif':
        return (
          <MediaPicker
            value={block.media}
            onChange={(next) => update(index, { media: next } as Partial<Block>)}
          />
        );

      case 'imagePair':
      case 'imageTrio':
        return (
          <div className="space-y-3">
            {block.media.map((_, i) => mediaAt(block, i, block.media as Media[], index))}
          </div>
        );

      case 'gallery':
        return (
          <div>
            <label className="mb-3 inline-flex items-center gap-2 text-small">
              Columns
              <select
                value={block.columns ?? 3}
                onChange={(e) => update(index, { columns: Number(e.target.value) as 2 | 3 | 4 })}
                aria-label="Gallery columns"
                className="border border-line bg-transparent px-2 py-1"
              >
                {[2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <FieldInput
              field={{ name: 'media', label: 'Images', type: 'mediaList' }}
              value={block.media}
              relations={relations}
              onChange={(v) => update(index, { media: v as Media[] })}
            />
          </div>
        );

      case 'quote':
        return (
          <div className="space-y-4">
            <div>
              <FieldLabel field={{ name: 'text', label: 'Quote', type: 'localizedArea' }} />
              <FieldInput
                field={{ name: 'text', label: 'Quote', type: 'localizedArea' }}
                value={block.text}
                relations={relations}
                onChange={(v) => update(index, { text: v as Localized })}
              />
            </div>
            <div>
              <FieldLabel field={{ name: 'attribution', label: 'Attribution', type: 'localized' }} />
              <FieldInput
                field={{ name: 'attribution', label: 'Attribution', type: 'localized' }}
                value={block.attribution}
                relations={relations}
                onChange={(v) => update(index, { attribution: v as Localized })}
              />
            </div>
          </div>
        );

      case 'divider':
        return <p className="text-small text-faint">A horizontal rule. Nothing to configure.</p>;

      case 'textImage':
      case 'imageText':
        return (
          <div className="space-y-4">
            <div>
              <FieldLabel field={{ name: 'heading', label: 'Heading', type: 'localized' }} />
              <FieldInput
                field={{ name: 'heading', label: 'Heading', type: 'localized' }}
                value={block.heading}
                relations={relations}
                onChange={(v) => update(index, { heading: v as Localized })}
              />
            </div>
            <div>
              <FieldLabel field={{ name: 'text', label: 'Text', type: 'localizedArea' }} />
              <FieldInput
                field={{ name: 'text', label: 'Text', type: 'localizedArea' }}
                value={block.text}
                relations={relations}
                onChange={(v) => update(index, { text: v as Localized })}
              />
            </div>
            <MediaPicker
              value={block.media}
              onChange={(next) => update(index, { media: next } as Partial<Block>)}
            />
          </div>
        );

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <FieldLabel field={{ name: 'label', label: 'Label', type: 'localized' }} />
              <FieldInput
                field={{ name: 'label', label: 'Label', type: 'localized' }}
                value={block.label}
                relations={relations}
                onChange={(v) => update(index, { label: v as Localized })}
              />
            </div>
            <div>
              <FieldLabel field={{ name: 'href', label: 'URL', type: 'text' }} />
              <input
                value={block.href}
                onChange={(e) => update(index, { href: e.target.value })}
                aria-label="Button URL"
                dir="ltr"
                className="w-full border-0 border-b border-line bg-transparent py-2 outline-none focus:border-ink"
              />
            </div>
            <label className="inline-flex items-center gap-2 text-small">
              <input
                type="checkbox"
                checked={block.external ?? false}
                onChange={(e) => update(index, { external: e.target.checked })}
                className="accent-ink"
              />
              Opens in a new tab
            </label>
          </div>
        );

      case 'embed':
        return (
          <div className="space-y-4">
            <div>
              <FieldLabel field={{ name: 'url', label: 'Embed URL', type: 'text' }} />
              <input
                value={block.url}
                onChange={(e) => update(index, { url: e.target.value })}
                aria-label="Embed URL"
                dir="ltr"
                placeholder="https://player.vimeo.com/video/…"
                className="w-full border-0 border-b border-line bg-transparent py-2 outline-none focus:border-ink"
              />
            </div>
            <div>
              <FieldLabel field={{ name: 'title', label: 'Title', type: 'localized' }} />
              <FieldInput
                field={{ name: 'title', label: 'Title', type: 'localized' }}
                value={block.title}
                relations={relations}
                onChange={(v) => update(index, { title: v as Localized })}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div>
      <SortableList
        items={blocks}
        onReorder={onChange}
        keyOf={(block) => block.id}
        label={(block) => label(block.type)}
        actions={(_, index) => (
          <button
            type="button"
            onClick={() => onChange(blocks.filter((_, k) => k !== index))}
            aria-label="Delete block"
            className="grid h-7 w-7 place-items-center text-faint hover:text-accent"
          >
            <Icon name="trash" size={13} />
          </button>
        )}
      >
        {renderBlock}
      </SortableList>

      <div className="mt-4">
        {adding ? (
          <div className="border border-line p-4">
            <p className="label mb-3">Add a block</p>
            <ul className="flex list-none flex-wrap gap-2 p-0">
              {BLOCK_TYPES.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange([...blocks, newBlock(option.value as BlockType)]);
                      setAdding(false);
                    }}
                    className="border border-line px-3 py-1.5 text-small hover:border-ink"
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="mt-4 text-small text-muted hover:text-ink"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 bg-ink px-4 py-2.5 text-small font-medium text-paper"
          >
            <Icon name="plus" size={14} />
            Add block
          </button>
        )}
      </div>
    </div>
  );
}
