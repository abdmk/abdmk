import { ArrowLink } from '@/components/ui/ArrowLink';
import { Figure } from '@/components/media/Figure';
import { Gallery } from '@/components/media/Gallery';
import { BloomField } from '@/components/ui/Bloom';
import { Reveal } from '@/components/ui/Reveal';
import type { Block, Lang } from '@/lib/content/types';
import { t } from '@/lib/i18n/config';

/**
 * Case-study renderer.
 *
 * A project body is an ordered list of blocks, so a case study is composed
 * rather than poured into a template. Text blocks are held to a measure for
 * readability; media blocks are free to break out to the full width. Widths are
 * decided here, not stored per block, so the whole site restyles from one place.
 */

/** Text sits in a centred measure; media can go wider. */
const MEASURE = 'mx-auto w-full max-w-[68ch]';
const PANEL = 'card mx-auto w-full max-w-[80ch] px-6 py-8 sm:px-10 sm:py-10';

function BlockContent({ block, lang }: { block: Block; lang: Lang }) {
  switch (block.type) {
    case 'heading': {
      const Tag = block.level === 2 ? 'h2' : 'h3';
      return (
        <div className={MEASURE}>
          <Tag className={block.level === 2 ? 'text-h2' : 'text-h3'}>{t(block.text, lang)}</Tag>
        </div>
      );
    }

    case 'paragraph':
      return (
        <div className={MEASURE}>
          {t(block.text, lang)
            .split('\n')
            .filter(Boolean)
            .map((para, i) => (
              <p key={i} className="text-lead text-muted [&+p]:mt-5">
                {para}
              </p>
            ))}
        </div>
      );

    case 'image':
      return (
        <div className="mx-auto w-full max-w-[100ch]">
          <Figure media={block.media} lang={lang} sizes="(max-width: 768px) 100vw, 80vw" />
        </div>
      );

    case 'imageFull':
      // "Full" is the full content width — the page is a system of surfaces
      // floating on a canvas, so nothing runs to the physical screen edge.
      return <Figure media={block.media} lang={lang} sizes="(max-width: 1024px) 100vw, 88vw" />;

    case 'imagePair':
      return (
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-5">
          {block.media.map((m, i) => (
            <Figure key={i} media={m} lang={lang} sizes="(max-width: 640px) 100vw, 50vw" />
          ))}
        </div>
      );

    case 'imageTrio':
      return (
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {block.media.map((m, i) => (
            <Figure key={i} media={m} lang={lang} sizes="(max-width: 640px) 100vw, 33vw" />
          ))}
        </div>
      );

    case 'gallery':
      return <Gallery media={block.media} lang={lang} columns={block.columns ?? 3} />;

    case 'video':
    case 'gif':
      return (
        <div className="mx-auto w-full max-w-[100ch]">
          <Figure media={block.media} lang={lang} sizes="(max-width: 768px) 100vw, 80vw" />
        </div>
      );

    case 'quote':
      return (
        <blockquote className={`${PANEL} relative overflow-hidden`}>
          <BloomField hues={['lilac', 'peach']} />
          <p className="relative text-h3 font-normal leading-snug">
            “{t(block.text, lang)}”
          </p>
          {block.attribution ? (
            <cite className="relative mt-4 block text-small not-italic text-faint">
              — {t(block.attribution, lang)}
            </cite>
          ) : null}
        </blockquote>
      );

    case 'divider':
      return <hr className="mx-auto w-full max-w-[80ch] border-0 border-t border-line" />;

    case 'textImage':
    case 'imageText': {
      const textFirst = block.type === 'textImage';
      const text = (
        <div className="flex flex-col justify-center px-3.5 py-4 sm:px-7 sm:py-8">
          {block.heading ? (
            <h3 className="mb-4 text-h3 font-medium">{t(block.heading, lang)}</h3>
          ) : null}
          {t(block.text, lang)
            .split('\n')
            .filter(Boolean)
            .map((para, i) => (
              <p key={i} className="max-w-prose text-lead text-muted [&+p]:mt-4">
                {para}
              </p>
            ))}
        </div>
      );
      const media = <Figure media={block.media} lang={lang} sizes="(max-width: 768px) 100vw, 50vw" />;
      return (
        <div className="card grid items-center gap-6 p-2.5 sm:p-3 md:grid-cols-2">
          {textFirst ? (
            <>
              {text}
              {media}
            </>
          ) : (
            <>
              <div className="md:order-2">{text}</div>
              <div className="md:order-1">{media}</div>
            </>
          )}
        </div>
      );
    }

    case 'button':
      return (
        <div className={MEASURE}>
          <ArrowLink href={block.href} external={block.external} size="lead">
            {t(block.label, lang)}
          </ArrowLink>
        </div>
      );

    case 'embed':
      return (
        <div className="w-full">
          <div
            className="relative w-full overflow-hidden rounded-card bg-sunken"
            style={{ aspectRatio: String(block.ratio ?? 16 / 9) }}
          >
            <iframe
              src={block.url}
              title={t(block.title, lang)}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}

/** Vertical rhythm per block type — media breathes more than running text. */
function spacing(block: Block): string {
  switch (block.type) {
    case 'heading':
      return 'mt-14 md:mt-20';
    case 'paragraph':
    case 'button':
      return 'mt-8';
    case 'divider':
      return 'mt-14 md:mt-20';
    case 'imageFull':
      return 'mt-6 md:mt-8';
    default:
      return 'mt-6 md:mt-8';
  }
}

export function ProjectBlocks({ blocks, lang }: { blocks: Block[]; lang: Lang }) {
  return (
    <div>
      {blocks.map((block, i) => (
        <Reveal key={block.id} className={i === 0 ? '' : spacing(block)}>
          <BlockContent block={block} lang={lang} />
        </Reveal>
      ))}
    </div>
  );
}
