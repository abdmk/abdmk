'use client';

import { useState } from 'react';
import type { Lang, Media } from '@/lib/content/types';
import { t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';
import { cn } from '@/lib/utils';
import { Lightbox } from './Lightbox';
import { SmartImage } from './SmartImage';

interface GalleryProps {
  media: Media[];
  lang: Lang;
  columns?: 2 | 3 | 4;
  className?: string;
}

const COLS: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
};

/** A clickable grid of images that opens into the fullscreen Lightbox. */
export function Gallery({ media, lang, columns = 3, className }: GalleryProps) {
  const tr = ui(lang);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <ul className={cn('grid list-none gap-2 p-0 sm:gap-3', COLS[columns], className)}>
        {media.map((item, i) => (
          <li key={`${item.src}-${i}`} className="m-0">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="media-zoom group relative block w-full overflow-hidden bg-ink/[0.04]"
              style={
                item.width && item.height
                  ? { aspectRatio: String(item.width / item.height) }
                  : { aspectRatio: '4 / 3' }
              }
              aria-label={`${tr.gallery.open}: ${t(item.alt, lang)}`}
            >
              <SmartImage
                src={item.src}
                alt={t(item.alt, lang)}
                fill
                sizes={`(max-width: 640px) 50vw, ${Math.round(100 / columns)}vw`}
                className="object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox media={media} index={open} lang={lang} onClose={() => setOpen(null)} onNavigate={setOpen} />
    </>
  );
}
