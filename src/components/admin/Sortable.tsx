'use client';

import { useState, type ReactNode } from 'react';
import { Icon } from '@/components/icons';

interface SortableListProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  keyOf: (item: T, index: number) => string;
  children: (item: T, index: number) => ReactNode;
  /** Extra controls rendered in the row header, next to the move buttons. */
  actions?: (item: T, index: number) => ReactNode;
  label?: (item: T, index: number) => string;
}

/**
 * Reorderable list.
 *
 * Pointer users drag rows by the handle; keyboard users get move-up/move-down
 * buttons that do the same thing. Both paths are always present — a builder that
 * can only be operated with a mouse is not finished.
 */
export function SortableList<T>({
  items,
  onReorder,
  keyOf,
  children,
  actions,
  label,
}: SortableListProps<T>) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onReorder(next);
  };

  return (
    <ul className="list-none space-y-3 p-0">
      {items.map((item, index) => (
        <li
          key={keyOf(item, index)}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(index);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragging !== null) move(dragging, index);
            setDragging(null);
            setOver(null);
          }}
          className={[
            'border bg-paper transition-colors',
            over === index && dragging !== null ? 'border-ink' : 'border-line',
            dragging === index ? 'opacity-40' : '',
          ].join(' ')}
        >
          <div className="flex items-center gap-2 border-b border-line bg-ink/[0.02] px-3 py-2">
            <span
              draggable
              onDragStart={() => setDragging(index)}
              onDragEnd={() => {
                setDragging(null);
                setOver(null);
              }}
              className="cursor-grab p-1 text-faint active:cursor-grabbing"
              aria-hidden
            >
              <Icon name="dragHandle" size={14} />
            </span>

            <span className="numeric text-meta text-muted">
              {String(index + 1).padStart(2, '0')}
            </span>
            {label ? <span className="text-small font-medium">{label(item, index)}</span> : null}

            <span className="ms-auto flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, index - 1)}
                disabled={index === 0}
                aria-label="Move up"
                className="grid h-7 w-7 place-items-center text-faint hover:text-ink disabled:opacity-30"
              >
                <Icon name="chevronDown" size={13} className="rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => move(index, index + 1)}
                disabled={index === items.length - 1}
                aria-label="Move down"
                className="grid h-7 w-7 place-items-center text-faint hover:text-ink disabled:opacity-30"
              >
                <Icon name="chevronDown" size={13} />
              </button>
              {actions ? actions(item, index) : null}
            </span>
          </div>

          <div className="p-3">{children(item, index)}</div>
        </li>
      ))}
    </ul>
  );
}
