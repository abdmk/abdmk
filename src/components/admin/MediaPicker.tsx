'use client';

import { useRef, useState } from 'react';
import { Icon } from '@/components/icons';
import type { Media } from '@/lib/content/types';

const BLANK: Media = { src: '', kind: 'image', alt: { ar: '', en: '' } };

/**
 * One media slot: upload a file or paste a path, then caption it in both
 * languages. Uploads post to /api/admin/upload, which writes into
 * /public/uploads and returns the path stored here.
 */
export function MediaPicker({
  value,
  onChange,
  onRemove,
  compact,
}: {
  value: Media | null | undefined;
  onChange: (value: Media) => void;
  onRemove?: () => void;
  compact?: boolean;
}) {
  const media = value ?? BLANK;
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function upload(file: File) {
    setBusy(true);
    setError('');
    const body = new FormData();
    body.append('file', file);
    const response = await fetch('/api/admin/upload', { method: 'POST', body });
    const data = await response.json().catch(() => ({}));
    setBusy(false);

    if (!response.ok) {
      setError(data.error ?? 'Upload failed');
      return;
    }

    // Read back the intrinsic size so the grid can reserve space for it.
    const dims = await new Promise<{ width?: number; height?: number }>((resolve) => {
      if (data.kind === 'video') return resolve({ width: 1600, height: 900 });
      const probe = new Image();
      probe.onload = () => resolve({ width: probe.naturalWidth, height: probe.naturalHeight });
      probe.onerror = () => resolve({});
      probe.src = data.src;
    });

    onChange({ ...media, src: data.src, kind: data.kind, ...dims });
  }

  return (
    <div className="border border-line p-3">
      <div className="flex gap-3">
        <div className="grid h-20 w-28 shrink-0 place-items-center overflow-hidden bg-ink/[0.05]">
          {media.src ? (
            media.kind === 'video' ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video src={media.src} muted className="h-full w-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={media.src} alt="" className="h-full w-full object-cover" />
            )
          ) : (
            <Icon name="image" size={20} className="text-faint" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            value={media.src}
            onChange={(e) => onChange({ ...media, src: e.target.value })}
            placeholder="/media/… or https://…"
            aria-label="Media path or URL"
            dir="ltr"
            className="w-full border-b border-line bg-transparent py-1.5 text-small outline-none focus:border-ink"
          />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => input.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 text-small text-muted hover:text-ink disabled:opacity-50"
            >
              <Icon name="download" size={13} />
              {busy ? 'Uploading…' : 'Upload'}
            </button>

            <select
              value={media.kind}
              onChange={(e) => onChange({ ...media, kind: e.target.value as Media['kind'] })}
              aria-label="Media type"
              className="border border-line bg-transparent px-2 py-1 text-meta"
            >
              <option value="image">image</option>
              <option value="gif">gif</option>
              <option value="video">video</option>
            </select>

            {onRemove ? (
              <button
                type="button"
                onClick={onRemove}
                className="ms-auto inline-flex items-center gap-1.5 text-small text-muted hover:text-accent"
              >
                <Icon name="trash" size={13} />
                Remove
              </button>
            ) : null}
          </div>
          {error ? <p className="mt-2 text-meta text-accent">{error}</p> : null}
        </div>
      </div>

      <input
        ref={input}
        type="file"
        accept="image/*,video/mp4,video/webm,.woff,.woff2,.otf,.ttf"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.target.value = '';
        }}
      />

      {!compact ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <input
            value={media.alt.ar}
            onChange={(e) => onChange({ ...media, alt: { ...media.alt, ar: e.target.value } })}
            placeholder="Alt text (Arabic)"
            aria-label="Alt text — العربية"
            dir="rtl"
            className="border-b border-line bg-transparent py-1.5 text-small outline-none focus:border-ink"
          />
          <input
            value={media.alt.en}
            onChange={(e) => onChange({ ...media, alt: { ...media.alt, en: e.target.value } })}
            placeholder="Alt text (English)"
            aria-label="Alt text — English"
            dir="ltr"
            className="border-b border-line bg-transparent py-1.5 text-small outline-none focus:border-ink"
          />
        </div>
      ) : null}

      {media.kind === 'video' ? (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-small text-muted">
          {(['autoplay', 'loop', 'muted', 'controls'] as const).map((flag) => (
            <label key={flag} className="inline-flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={media[flag] ?? flag !== 'controls'}
                onChange={(e) => onChange({ ...media, [flag]: e.target.checked })}
                className="accent-ink"
              />
              {flag}
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export { BLANK as BLANK_MEDIA };
