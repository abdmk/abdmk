import 'server-only';
import { cache } from 'react';
import { getCategories, getCollection, getNavigation, getSettings } from './store';
import type { Company, Course, Project, Service, TypefaceItem, Workshop } from './types';

/**
 * Read helpers for pages. Each is wrapped in React's `cache` so a single render
 * pass reads each JSON file once no matter how many components ask for it.
 */

export const projects = cache(() => getCollection('projects'));
export const companies = cache(() => getCollection('companies'));
export const typefaces = cache(() => getCollection('fonts'));
export const services = cache(() => getCollection('services'));
export const workshops = cache(() => getCollection('workshops'));
export const products = cache(() => getCollection('products'));
export const testimonials = cache(() => getCollection('testimonials'));
export const faq = cache(() => getCollection('faq'));
export const courses = cache(() => getCollection('courses'));
export const categories = cache(() => getCategories());
export const settings = cache(() => getSettings());
export const navigation = cache(() => getNavigation());

const bySlug = <T extends { slug: string }>(list: T[], slug: string) =>
  list.find((item) => item.slug === slug);

export async function getProject(slug: string): Promise<Project | undefined> {
  return bySlug(await projects(), slug);
}
export async function getCompany(slug: string): Promise<Company | undefined> {
  return bySlug(await companies(), slug);
}
export async function getTypeface(slug: string): Promise<TypefaceItem | undefined> {
  return bySlug(await typefaces(), slug);
}
export async function getWorkshop(
  slug: string,
  kind?: Workshop['kind'],
): Promise<Workshop | undefined> {
  const all = await workshops();
  return all.find((w) => w.slug === slug && (!kind || w.kind === kind));
}

export async function getWorkshopsByKind(kind: Workshop['kind']): Promise<Workshop[]> {
  return (await workshops()).filter((w) => w.kind === kind);
}

/** Upcoming first (soonest first), then past (most recent first). */
export function splitByDate(list: Workshop[], now = new Date()) {
  const upcoming = list
    .filter((w) => new Date(w.endDate ?? w.date) >= now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const past = list
    .filter((w) => new Date(w.endDate ?? w.date) < now)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return { upcoming, past };
}

/* -------------------------------------------------------------------------- */
/* Relationships                                                              */
/* -------------------------------------------------------------------------- */

export async function projectsForCompany(slug: string): Promise<Project[]> {
  return (await projects()).filter((p) => p.company === slug);
}

export async function projectsForFont(slug: string): Promise<Project[]> {
  return (await projects()).filter((p) => p.fonts.includes(slug));
}

export async function projectsForService(slug: string): Promise<Project[]> {
  return (await projects()).filter((p) => p.services.includes(slug));
}

export async function projectsByIds(ids: string[]): Promise<Project[]> {
  const all = await projects();
  return ids.map((id) => all.find((p) => p.id === id || p.slug === id)).filter(Boolean) as Project[];
}

export async function servicesByIds(ids: string[]): Promise<Service[]> {
  const all = await services();
  return ids
    .map((id) => all.find((s) => s.slug === id || s.id === id))
    .filter(Boolean) as Service[];
}

export async function typefacesByIds(ids: string[]): Promise<TypefaceItem[]> {
  const all = await typefaces();
  return all.filter((f) => ids.includes(f.slug) || ids.includes(f.id));
}

/**
 * Related projects, chosen by how much of the graph they share with `project`:
 * same company scores highest, then shared categories, services and fonts.
 * Falls back to recent work so the slot is never empty.
 */
export async function relatedProjects(project: Project, limit = 3): Promise<Project[]> {
  const all = (await projects()).filter((p) => p.id !== project.id);
  const scored = all.map((p) => {
    let score = 0;
    if (p.company && p.company === project.company) score += 4;
    score += p.categories.filter((c) => project.categories.includes(c)).length * 2;
    score += p.services.filter((s) => project.services.includes(s)).length;
    score += p.fonts.filter((f) => project.fonts.includes(f)).length;
    return { p, score };
  });
  return scored
    .sort((a, b) => b.score - a.score || +b.p.year - +a.p.year)
    .slice(0, limit)
    .map((s) => s.p);
}

/** Previous/next in the published work order, wrapping at the ends. */
export async function projectNeighbours(slug: string) {
  const all = await projects();
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return { previous: undefined, next: undefined };
  return {
    previous: all[(i - 1 + all.length) % all.length],
    next: all[(i + 1) % all.length],
  };
}

/** Categories that actually have published projects, with counts. */
export async function activeCategories() {
  const [cats, list] = await Promise.all([categories(), projects()]);
  return cats
    .map((c) => ({ ...c, count: list.filter((p) => p.categories.includes(c.slug)).length }))
    .filter((c) => c.count > 0);
}

export async function getCourse(slug: string): Promise<Course | undefined> {
  return bySlug(await courses(), slug);
}

export async function getCoursesByPricing(pricing: 'free' | 'paid'): Promise<Course[]> {
  return (await courses()).filter((c) => c.pricing === pricing);
}

export async function getService(slug: string): Promise<Service | undefined> {
  const all = await services();
  return all.find((s) => s.slug === slug);
}
