import 'server-only';
import { promises as fs } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import type {
  Category,
  CollectionName,
  Company,
  ContentData,
  Course,
  FaqItem,
  Navigation,
  Product,
  Project,
  Service,
  Settings,
  Testimonial,
  TypefaceItem,
  Workshop,
} from './types';

/**
 * Content store.
 *
 * Content lives as JSON on disk under /content and is edited through the admin
 * at /admin. That keeps the whole site runnable with `npm run dev` and no
 * external service, while the read API below is the only thing pages touch — so
 * swapping the backing store for Sanity/Payload later means reimplementing this
 * one module, not rewriting the pages.
 */

const CONTENT_DIR = path.join(process.cwd(), 'content');

const FILES = {
  settings: 'settings.json',
  categories: 'categories.json',
  projects: 'projects.json',
  companies: 'companies.json',
  fonts: 'fonts.json',
  services: 'services.json',
  workshops: 'workshops.json',
  products: 'products.json',
  testimonials: 'testimonials.json',
  faq: 'faq.json',
  courses: 'courses.json',
  navigation: 'navigation.json',
} as const;

type FileKey = keyof typeof FILES;

function gitCommitAndPush(filePath: string, collectionName: string): void {
  try {
    const cwd = process.cwd();
    const relativePath = path.relative(cwd, filePath);

    // Stage the file
    execSync(`git add "${relativePath}"`, { cwd, stdio: 'pipe' });

    // Create a commit
    const timestamp = new Date().toISOString();
    const message = `Content update: ${collectionName} - ${timestamp}`;
    execSync(`git commit -m "${message}"`, { cwd, stdio: 'pipe' });

    // Push to current branch
    execSync('git push', { cwd, stdio: 'pipe' });
  } catch (error) {
    console.error('Git commit/push failed:', error);
    // Don't throw — the file was written successfully, git push failure shouldn't break the admin
  }
}

async function readFile<T>(key: FileKey): Promise<T> {
  const raw = await fs.readFile(path.join(CONTENT_DIR, FILES[key]), 'utf8');
  return JSON.parse(raw) as T;
}

async function writeFile(key: FileKey, value: unknown): Promise<void> {
  const file = path.join(CONTENT_DIR, FILES[key]);
  const tmp = `${file}.${process.pid}.tmp`;
  // Write-then-rename so a crash mid-write cannot leave truncated JSON behind.
  await fs.writeFile(tmp, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await fs.rename(tmp, file);

  // Commit and push to GitHub (non-blocking, failures logged but don't break the save)
  gitCommitAndPush(file, key);
}

/** Read the entire content graph. */
export async function getContent(): Promise<ContentData> {
  const [
    settings,
    categories,
    projects,
    companies,
    fonts,
    services,
    workshops,
    products,
    testimonials,
    faq,
    courses,
    navigation,
  ] = await Promise.all([
    readFile<Settings>('settings'),
    readFile<Category[]>('categories'),
    readFile<Project[]>('projects'),
    readFile<Company[]>('companies'),
    readFile<TypefaceItem[]>('fonts'),
    readFile<Service[]>('services'),
    readFile<Workshop[]>('workshops'),
    readFile<Product[]>('products'),
    readFile<Testimonial[]>('testimonials'),
    readFile<FaqItem[]>('faq'),
    readFile<Course[]>('courses'),
    readFile<Navigation>('navigation'),
  ]);
  return {
    settings,
    categories,
    projects,
    companies,
    fonts,
    services,
    workshops,
    products,
    testimonials,
    faq,
    courses,
    navigation,
  };
}

export async function getNavigation(): Promise<Navigation> {
  return readFile<Navigation>('navigation');
}

export async function saveNavigation(navigation: Navigation): Promise<void> {
  await writeFile('navigation', navigation);
}

export async function getSettings(): Promise<Settings> {
  return readFile<Settings>('settings');
}

export async function getCategories(): Promise<Category[]> {
  const cats = await readFile<Category[]>('categories');
  return [...cats].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** Read one collection. Drafts are excluded unless `includeDrafts` is set. */
export async function getCollection<K extends CollectionName>(
  name: K,
  includeDrafts = false,
): Promise<ContentData[K]> {
  const items = await readFile<ContentData[K]>(name);
  const list = (items as { published: boolean; order?: number }[])
    .filter((item) => includeDrafts || item.published)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return list as ContentData[K];
}

/* -------------------------------------------------------------------------- */
/* Writes — used only by the admin API routes                                 */
/* -------------------------------------------------------------------------- */

export async function saveCollection<K extends CollectionName>(
  name: K,
  items: ContentData[K],
): Promise<void> {
  await writeFile(name, items);
}

export async function saveSettings(settings: Settings): Promise<void> {
  await writeFile('settings', settings);
}

export async function saveCategories(categories: Category[]): Promise<void> {
  await writeFile('categories', categories);
}

/** Insert or replace a single item by id, appending when it is new. */
export async function upsertItem<K extends CollectionName>(
  name: K,
  item: ContentData[K][number],
): Promise<void> {
  const items = (await readFile<ContentData[K]>(name)) as ContentData[K][number][];
  const i = items.findIndex((existing) => existing.id === item.id);
  const next = { ...item, updatedAt: new Date().toISOString() };
  if (i === -1) items.push(next);
  else items[i] = next;
  await writeFile(name, items);
}

export async function deleteItem(name: CollectionName, id: string): Promise<void> {
  const items = await readFile<{ id: string }[]>(name);
  await writeFile(
    name,
    items.filter((item) => item.id !== id),
  );
}

/** Read a collection raw — including drafts and in stored order. For the admin. */
export async function getCollectionRaw<K extends CollectionName>(
  name: K,
): Promise<ContentData[K]> {
  return readFile<ContentData[K]>(name);
}
