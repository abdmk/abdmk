import { ArrowLink } from '@/components/ui/ArrowLink';
import { Figure } from '@/components/media/Figure';
import { Gallery } from '@/components/media/Gallery';
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

function BlockContent({ block, lang }: { block: Block; lang: Lang }) {
  switch (block.type) {
    case 'heading': {
      const Tag = block.level === 2 ? 'h2' : 'h3';
      return (
        <div className={MEASURE}>
          <Tag className={block.level === 2 ? 'text-h2 font-medium' : 'text-h3 font-medium'}>
            {t(block.text, lang)}
          </Tag>
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
        <div className="mx-auto w-full max-w-[110ch]">
          <Figure media={block.media} lang={lang} sizes="(max-width: 768px) 100vw, 80vw" />
        </div>
      );

    case 'imageFull':
      // Breaks the shell's gutters to sit edge to edge.
      return (
        <div className="relative left-1/2 w-screen -translate-x-1/2 rtl:translate-x-1/2">
          <Figure media={block.media} lang={lang} sizes="100vw" />
        </div>
      );

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
        <div className="mx-auto w-full max-w-[110ch]">
          <Figure media={block.media} lang={lang} sizes="(max-width: 768px) 100vw, 80vw" />
        </div>
      );

    case 'quote':
      return (
        <blockquote className={`${MEASURE} border-s-2 border-ink ps-6 sm:ps-8`}>
          <p className="text-h3 font-light leading-snug">“{t(block.text, lang)}”</p>
          {block.attribution ? (
            <cite className="mt-4 block text-small not-italic text-faint">
              — {t(block.attribution, lang)}
            </cite>
          ) : null}
        </blockquote>
      );

    case 'divider':
      return <hr className="mx-auto w-full max-w-[110ch] border-0 border-t border-line" />;

    case 'textImage':
    case 'imageText': {
      const textFirst = block.type === 'textImage';
      const text = (
        <div className="flex flex-col justify-center">
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
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
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
        <div className="mx-auto w-full max-w-[110ch]">
          <div
            className="relative w-full overflow-hidden bg-ink/[0.04]"
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
      return 'mt-16 md:mt-24';
    case 'paragraph':
    case 'button':
      return 'mt-8';
    case 'divider':
      return 'mt-16 md:mt-24';
    case 'imageFull':
      return 'mt-14 md:mt-20';
    default:
      return 'mt-10 md:mt-16';
  }
}

export function ProjectBlocks({ blocks, lang }: { blocks: Block[]; lang: Lang }) {
  return (
    <div className="shell">
      {blocks.map((block, i) => (
        <Reveal key={block.id} className={i === 0 ? '' : spacing(block)}>
          <BlockContent block={block} lang={lang} />
        </Reveal>
      ))}
    </div>
  );
}
