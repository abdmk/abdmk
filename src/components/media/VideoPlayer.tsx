'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/icons';
import type { Lang, Media } from '@/lib/content/types';
import { ui } from '@/lib/i18n/dictionary';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  media: Media;
  lang: Lang;
  className?: string;
}

/**
 * Video block.
 *
 * Ambient video (autoplay + loop + muted) starts only once it is actually on
 * screen and pauses when it leaves, so a page full of clips does not decode a
 * dozen streams at once. Videos with sound get real controls instead.
 */
export function VideoPlayer({ media, lang, className }: VideoPlayerProps) {
  const t = ui(lang);
  const ref = useRef<HTMLVideoElement>(null);
  const ambient = media.autoplay !== false && media.controls !== true;
  const [playing, setPlaying] = useState(ambient);
  const [muted, setMuted] = useState(media.muted !== false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !ambient) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => undefined);
        else el.pause();
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ambient]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div className={cn('group relative overflow-hidden bg-ink/5', className)}>
      <video
        ref={ref}
        // Ambient clips are decorative motion; the poster carries the meaning
        // until they load, and `preload=metadata` keeps them off the critical path.
        src={media.src}
        poster={media.poster}
        loop={media.loop !== false}
        muted={muted}
        playsInline
        controls={media.controls === true}
        preload="metadata"
        aria-label={media.alt[lang] || media.alt.en}
        className="block h-full w-full object-cover"
      />

      {ambient ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-end gap-2 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            onClick={toggle}
            className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#0F1115] shadow-soft backdrop-blur transition-colors hover:bg-white"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            <Icon name={playing ? 'pause' : 'play'} size={15} />
          </button>
          <button
            type="button"
            onClick={() => {
              const el = ref.current;
              if (!el) return;
              el.muted = !el.muted;
              setMuted(el.muted);
            }}
            className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#0F1115] shadow-soft backdrop-blur transition-colors hover:bg-white"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            <Icon name={muted ? 'mute' : 'unmute'} size={15} />
          </button>
          <button
            type="button"
            onClick={() => void ref.current?.requestFullscreen?.()}
            className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#0F1115] shadow-soft backdrop-blur transition-colors hover:bg-white"
            aria-label={t.gallery.zoom}
          >
            <Icon name="fullscreen" size={15} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
