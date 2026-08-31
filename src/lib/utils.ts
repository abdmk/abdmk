/** Join class names, dropping falsy values. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

/** Stable id for new content items created in the admin. */
export function makeId(prefix = 'item'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

/**
 * URL-safe slug. Keeps Arabic letters as-is so Arabic-titled entries get a
 * readable slug instead of an empty one.
 */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Split a list into `n` roughly equal columns, preserving order down each column. */
export function distribute<T>(items: T[], columns: number): T[][] {
  const out: T[][] = Array.from({ length: columns }, () => []);
  items.forEach((item, i) => out[i % columns].push(item));
  return out;
}
