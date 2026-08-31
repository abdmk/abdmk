import type { Lang, Media } from '@/lib/content/types';
import { t } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { SmartImage } from './SmartImage';
import { VideoPlayer } from './VideoPlayer';

interface FigureProps {
  media: Media;
  lang: Lang;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Render the caption below the media. */
  showCaption?: boolean;
}

/**
 * Renders any Media by kind — image, gif or video — with its intrinsic aspect
 * ratio reserved so nothing reflows as it loads.
 */
export function Figure({ media, lang, sizes, priority, className, showCaption = true }: FigureProps) {
  const alt = t(media.alt, lang);
  const ratio = media.width && media.height ? media.width / media.height : undefined;

  const inner =
    media.kind === 'video' ? (
      <VideoPlayer media={media} lang={lang} className="h-full w-full" />
    ) : (
      // GIFs are images: the optimiser would strip their animation, so they take
      // the same SVG path — straight <img>, lazily loaded.
      <SmartImage
        src={media.src}
        alt={alt}
        width={media.width}
        height={media.height}
        sizes={sizes}
        priority={priority}
        className="block h-full w-full object-cover"
      />
    );

  return (
    <figure className={cn('m-0', className)}>
      <div
        className="well relative"
        style={ratio ? { aspectRatio: String(ratio) } : undefined}
      >
        {inner}
      </div>
      {showCaption && media.caption && t(media.caption, lang) ? (
        <figcaption className="mt-3 px-1 text-small text-faint">{t(media.caption, lang)}</figcaption>
      ) : null}
    </figure>
  );
}
