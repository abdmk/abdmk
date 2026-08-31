'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@/components/icons';
import type { Lang, Media } from '@/lib/content/types';
import { t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';
import { SmartImage } from './SmartImage';

interface LightboxProps {
  media: Media[];
  index: number | null;
  lang: Lang;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Fullscreen media viewer.
 *
 * Keyboard (arrows / escape), swipe on touch, and click-to-zoom. Focus is moved
 * into the dialog on open and the page behind it is locked, so the viewer is
 * usable without a pointer.
 */
export function Lightbox({ media, index, lang, onClose, onNavigate }: LightboxProps) {
  const tr = ui(lang);
  const open = index !== null;
  const [zoomed, setZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      setZoomed(false);
      onNavigate((index + delta + media.length) % media.length);
    },
    [index, media.length, onNavigate],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // Arrow semantics follow reading order, so they flip in RTL.
      if (e.key === 'ArrowRight') go(lang === 'ar' ? -1 : 1);
      if (e.key === 'ArrowLeft') go(lang === 'ar' ? 1 : -1);
    };
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, go, onClose, lang]);

  const current = index !== null ? media[index] : null;

  return (
    <AnimatePresence>
      {open && current ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={tr.gallery.open}
          className="fixed inset-0 z-[100] flex flex-col bg-[#0B0B0B]/[0.97] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStart === null) return;
            const dx = e.changedTouches[0].clientX - touchStart;
            if (Math.abs(dx) > 50) go(dx > 0 ? -1 : 1);
            setTouchStart(null);
          }}
        >
          <div className="flex items-center justify-between px-gutter py-4 text-[#F2EFE8]">
            <p className="label !text-[#B4AEA4]">
              <span className="numeric">
                {index + 1} {tr.gallery.counter} {media.length}
              </span>
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                aria-label={tr.gallery.zoom}
                aria-pressed={zoomed}
                className="grid h-11 w-11 place-items-center transition-opacity hover:opacity-60"
              >
                <Icon name="fullscreen" size={18} />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label={tr.gallery.close}
                className="grid h-11 w-11 place-items-center transition-opacity hover:opacity-60"
              >
                <Icon name="close" size={18} />
              </button>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-4 sm:px-16">
            {media.length > 1 ? (
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={tr.gallery.previous}
                className="absolute start-1 z-10 hidden h-12 w-12 place-items-center text-[#F2EFE8] transition-opacity hover:opacity-60 sm:grid"
              >
                <Icon name="chevronLeft" size={22} flipRtl />
              </button>
            ) : null}

            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`flex h-full w-full items-center justify-center ${
                zoomed ? 'overflow-auto' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                className={`block ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                aria-label={tr.gallery.zoom}
              >
                <SmartImage
                  src={current.src}
                  alt={t(current.alt, lang)}
                  width={current.width}
                  height={current.height}
                  sizes="100vw"
                  priority
                  className={
                    zoomed
                      ? 'max-w-none'
                      : 'max-h-[78vh] w-auto max-w-full object-contain'
                  }
                />
              </button>
            </motion.div>

            {media.length > 1 ? (
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={tr.gallery.next}
                className="absolute end-1 z-10 hidden h-12 w-12 place-items-center text-[#F2EFE8] transition-opacity hover:opacity-60 sm:grid"
              >
                <Icon name="chevronRight" size={22} flipRtl />
              </button>
            ) : null}
          </div>

          {t(current.caption, lang) ? (
            <p className="px-gutter pb-6 text-center text-small text-[#B4AEA4]">
              {t(current.caption, lang)}
            </p>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
