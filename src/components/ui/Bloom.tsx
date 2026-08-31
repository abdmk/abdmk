import { cn } from '@/lib/utils';

type Hue = 'peach' | 'mint' | 'lilac' | 'sky' | 'lime';

interface BloomFieldProps {
  /** Which pastel lights to lay down, in order. */
  hues?: Hue[];
  /** `soft` sits behind body content; `strong` carries a hero. */
  intensity?: 'soft' | 'strong';
  className?: string;
}

const HUE_CLASS: Record<Hue, string> = {
  peach: 'bloom-peach',
  mint: 'bloom-mint',
  lilac: 'bloom-lilac',
  sky: 'bloom-sky',
  lime: 'bloom-lime',
};

/** Where each light sits and how big it is, by index. Deliberately off-grid. */
const PLACEMENT = [
  'w-[46%] h-[58%] -top-[16%] -start-[10%]',
  'w-[40%] h-[52%] -bottom-[20%] -end-[6%]',
  'w-[30%] h-[40%] top-[30%] start-[38%]',
];

/**
 * The decorative light layer from the reference set: two or three saturated
 * pastel discs, heavily blurred, clipped by a rounded surface. Purely
 * decorative — it carries no information and is hidden from assistive tech.
 */
export function BloomField({
  hues = ['peach', 'lilac', 'mint'],
  intensity = 'soft',
  className,
}: BloomFieldProps) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {hues.slice(0, 3).map((hue, i) => (
        <span
          key={hue}
          className={cn(
            'bloom',
            HUE_CLASS[hue],
            PLACEMENT[i],
            intensity === 'strong' ? 'opacity-[0.45]' : 'opacity-[0.28]',
          )}
        />
      ))}
    </div>
  );
}
