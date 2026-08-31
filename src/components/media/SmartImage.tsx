import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SmartImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** `sizes` matters: it is what lets the browser pick a smaller file. */
  sizes?: string;
  priority?: boolean;
  className?: string;
  fill?: boolean;
}

const isSvg = (src: string) => src.split('?')[0].toLowerCase().endsWith('.svg');

/**
 * Image primitive.
 *
 * Raster media goes through next/image so it is served as AVIF/WebP at the right
 * size and lazy-loads below the fold. SVGs bypass the optimiser — it cannot
 * resize vector art and Next refuses to process SVG without relaxing its image
 * sandbox, which is not worth doing for artwork that is already tiny.
 */
export function SmartImage({
  src,
  alt,
  width,
  height,
  sizes = '100vw',
  priority,
  className,
  fill,
}: SmartImageProps) {
  if (isSvg(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        className={cn(fill && 'absolute inset-0 h-full w-full object-cover', className)}
      />
    );
  }

  if (fill) {
    return (
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={cn('object-cover', className)} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 1600}
      height={height ?? 1200}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
