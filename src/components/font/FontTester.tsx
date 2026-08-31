'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon, type IconName } from '@/components/icons';
import type { FontFace as FontWeight, Lang, TypefaceItem } from '@/lib/content/types';
import { t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';
import { cn } from '@/lib/utils';

interface FontTesterProps {
  typeface: TypefaceItem;
  lang: Lang;
}

type Align = 'start' | 'center' | 'justify';

const ALIGNMENTS: { value: Align; icon: IconName; key: 'alignStart' | 'alignCenter' | 'alignJustify' }[] = [
  { value: 'start', icon: 'alignLeft', key: 'alignStart' },
  { value: 'center', icon: 'alignCenter', key: 'alignCenter' },
  { value: 'justify', icon: 'alignJustify', key: 'alignJustify' },
];

const LATIN_SAMPLE = 'Typography is what language looks like. 0123456789';

function Slider({
  id,
  label,
  icon,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  /** Stable, language-independent id — labels are translated, ids must not be. */
  id: string;
  label: string;
  icon: IconName;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-center justify-between gap-3 text-small">
        <span className="inline-flex items-center gap-2 text-muted">
          <Icon name={icon} size={14} className="text-faint" />
          {label}
        </span>
        <span className="numeric tabular-nums text-faint">
          {value}
          {suffix}
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-px w-full cursor-pointer appearance-none bg-line-strong accent-ink"
      />
    </div>
  );
}

/**
 * Live type tester.
 *
 * Real controls over the things that actually matter when judging a typeface —
 * size, weight, leading, tracking, alignment — in both scripts, since an Arabic
 * face has to be judged in Arabic. When the release font file has been uploaded
 * the preview uses it; otherwise it falls back to the site typeface and says so
 * rather than silently previewing the wrong letterforms.
 */
export function FontTester({ typeface, lang }: FontTesterProps) {
  const tr = ui(lang);
  const [script, setScript] = useState<Lang>(lang);
  const [text, setText] = useState(() => t(typeface.sample, lang));
  const [size, setSize] = useState(56);
  const [weight, setWeight] = useState(400);
  const [lineHeight, setLineHeight] = useState(1.3);
  const [tracking, setTracking] = useState(0);
  const [align, setAlign] = useState<Align>('start');

  const weights = useMemo<FontWeight[]>(
    () =>
      typeface.weights.length
        ? [...typeface.weights].sort((a, b) => a.weight - b.weight)
        : [{ name: { ar: 'عادي', en: 'Regular' }, weight: 400 }],
    [typeface.weights],
  );

  // Only weights with an uploaded file can actually be rendered in the browser.
  const loadable = useMemo(() => weights.filter((w) => w.file), [weights]);
  const family = loadable.length ? `tester-${typeface.slug}` : 'var(--font-graphik)';

  useEffect(() => {
    if (!loadable.length) return;
    const style = document.createElement('style');
    style.textContent = loadable
      .map(
        (w) =>
          `@font-face{font-family:"tester-${typeface.slug}";src:url("${w.file}");font-weight:${w.weight};font-display:swap}`,
      )
      .join('');
    document.head.appendChild(style);
    return () => style.remove();
  }, [loadable, typeface.slug]);

  // Keep the sample in step with the script being previewed.
  useEffect(() => {
    setText(script === 'ar' ? t(typeface.sample, 'ar') : LATIN_SAMPLE);
  }, [script, typeface.sample]);

  const nearest = weights.reduce((best, w) =>
    Math.abs(w.weight - weight) < Math.abs(best.weight - weight) ? w : best,
  );

  const reset = () => {
    setSize(56);
    setWeight(400);
    setLineHeight(1.3);
    setTracking(0);
    setAlign('start');
    setText(script === 'ar' ? t(typeface.sample, 'ar') : LATIN_SAMPLE);
  };

  return (
    <section aria-labelledby="tester-heading" className="rule pt-6">
      <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
        <h2 id="tester-heading" className="text-h1">
          {tr.tester.title}
        </h2>
        <button
          type="button"
          onClick={reset}
          className="label inline-flex items-center gap-2 transition-colors hover:text-ink"
        >
          <Icon name="settings" size={15} />
          {tr.tester.reset}
        </button>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14">
        <div className="order-2 lg:order-1">
          <label htmlFor="tester-input" className="sr-only">
            {tr.tester.placeholder}
          </label>
          <textarea
            id="tester-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={tr.tester.placeholder}
            rows={3}
            dir={script === 'ar' ? 'rtl' : 'ltr'}
            lang={script}
            spellCheck={false}
            className="min-h-[3.5em] w-full resize-y border-0 bg-transparent p-0 outline-none placeholder:text-faint/60"
            style={{
              fontFamily: family,
              fontSize: `${size}px`,
              fontWeight: nearest.weight,
              lineHeight,
              letterSpacing: `${tracking}em`,
              textAlign: align,
            }}
          />
          {!loadable.length ? (
            <p className="mt-6 max-w-prose text-small text-faint">{tr.tester.previewNote}</p>
          ) : null}
        </div>

        <div className="order-1 space-y-6 lg:order-2">
          <fieldset>
            <legend className="label mb-2">{tr.tester.script}</legend>
            <div className="flex gap-1.5">
              {(['ar', 'en'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setScript(value)}
                  aria-pressed={script === value}
                  className={cn(
                    'flex-1 border border-line px-3 py-2 text-small transition-colors duration-300',
                    script === value
                      ? 'border-ink bg-ink font-medium text-paper'
                      : 'text-muted hover:border-ink hover:text-ink',
                  )}
                >
                  {value === 'ar' ? tr.tester.arabic : tr.tester.latin}
                </button>
              ))}
            </div>
          </fieldset>

          <Slider
            id="tester-size"
            label={tr.tester.size}
            icon="textSize"
            value={size}
            min={14}
            max={180}
            step={1}
            suffix="px"
            onChange={setSize}
          />

          <div>
            <label htmlFor="tester-weight" className="mb-2 flex items-center justify-between gap-3 text-small">
              <span className="inline-flex items-center gap-2 text-muted">
                <Icon name="text" size={14} className="text-faint" />
                {tr.tester.weight}
              </span>
              <span className="text-faint">{t(nearest.name, lang)}</span>
            </label>
            <input
              id="tester-weight"
              type="range"
              min={weights[0].weight}
              max={weights[weights.length - 1].weight}
              step={100}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="h-px w-full cursor-pointer appearance-none bg-line-strong accent-ink"
            />
          </div>

          <Slider
            id="tester-line-height"
            label={tr.tester.lineHeight}
            icon="lineWidth"
            value={lineHeight}
            min={0.8}
            max={2.4}
            step={0.05}
            onChange={setLineHeight}
          />
          <Slider
            id="tester-letter-spacing"
            label={tr.tester.letterSpacing}
            icon="lineWidth"
            value={tracking}
            min={-0.06}
            max={0.4}
            step={0.005}
            suffix="em"
            onChange={setTracking}
          />

          <fieldset>
            <legend className="label mb-2">{tr.tester.alignment}</legend>
            <div className="flex gap-1.5">
              {ALIGNMENTS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setAlign(option.value)}
                  aria-pressed={align === option.value}
                  aria-label={tr.tester[option.key]}
                  className={cn(
                    'grid h-10 flex-1 place-items-center border border-line transition-colors duration-300',
                    align === option.value
                      ? 'border-ink bg-ink text-paper'
                      : 'text-muted hover:border-ink hover:text-ink',
                  )}
                >
                  <Icon name={option.icon} size={15} />
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
    </section>
  );
}
