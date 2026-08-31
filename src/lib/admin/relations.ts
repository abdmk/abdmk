import 'server-only';
import type { RelationOptions } from '@/components/admin/Fields';
import { getCategories, getCollectionRaw } from '@/lib/content/store';
import type { Localized } from '@/lib/content/types';

const pick = (value: Localized | undefined, fallback: string) =>
  value?.en || value?.ar || fallback;

/**
 * Options for every `relation` field, loaded once per admin page so the editor
 * can offer real choices instead of asking the author to type slugs.
 */
export async function loadRelations(): Promise<RelationOptions> {
  const [projects, companies, fonts, services, workshops, categories] = await Promise.all([
    getCollectionRaw('projects'),
    getCollectionRaw('companies'),
    getCollectionRaw('fonts'),
    getCollectionRaw('services'),
    getCollectionRaw('workshops'),
    getCategories(),
  ]);

  return {
    projects: projects.map((p) => ({ value: p.slug, label: pick(p.title, p.slug) })),
    companies: companies.map((c) => ({ value: c.slug, label: pick(c.name, c.slug) })),
    fonts: fonts.map((f) => ({ value: f.slug, label: pick(f.name, f.slug) })),
    services: services.map((s) => ({ value: s.slug, label: pick(s.name, s.slug) })),
    workshops: workshops.map((w) => ({ value: w.slug, label: pick(w.title, w.slug) })),
    categories: categories.map((c) => ({ value: c.slug, label: pick(c.name, c.slug) })),
  };
}
