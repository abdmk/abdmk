import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import {
  getCollectionRaw,
  getNavigation,
  getSettings,
  saveCategories,
  saveNavigation,
  saveSettings,
  upsertItem,
} from '@/lib/content/store';
import { SCHEMAS } from '@/lib/admin/schema';
import type { Category, CollectionName, ContentData, Navigation, Settings } from '@/lib/content/types';
import { getCategories } from '@/lib/content/store';

const isCollection = (name: string): name is CollectionName => name in SCHEMAS;

/**
 * Pages are statically generated from the JSON, so a write has to invalidate
 * them or the site would keep serving the version built at deploy time. The
 * content graph is cross-linked (a company edit changes project pages, settings
 * change every page), so the whole tree is revalidated rather than guessing.
 */
function revalidateSite() {
  revalidatePath('/', 'layout');
}

/** Read a collection (including drafts), or the settings / categories singletons. */
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { name } = await params;
  if (name === 'settings') return NextResponse.json(await getSettings());
  if (name === 'categories') return NextResponse.json(await getCategories());
  if (name === 'navigation') return NextResponse.json(await getNavigation());
  if (!isCollection(name)) return NextResponse.json({ error: 'unknown collection' }, { status: 404 });

  return NextResponse.json(await getCollectionRaw(name));
}

/** Create or update one item; for the singletons, replace the whole document. */
export async function PUT(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { name } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'invalid json' }, { status: 400 });

  if (name === 'settings') {
    await saveSettings(body as Settings);
    revalidateSite();
    return NextResponse.json({ ok: true });
  }
  if (name === 'categories') {
    await saveCategories(body as Category[]);
    revalidateSite();
    return NextResponse.json({ ok: true });
  }
  if (name === 'navigation') {
    await saveNavigation(body as Navigation);
    revalidateSite();
    return NextResponse.json({ ok: true });
  }
  if (!isCollection(name)) return NextResponse.json({ error: 'unknown collection' }, { status: 404 });

  const item = body as ContentData[CollectionName][number];
  if (!item.id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  if (!item.slug) return NextResponse.json({ error: 'missing slug' }, { status: 400 });

  // Slugs are the public URL, so they have to stay unique within a collection.
  const existing = (await getCollectionRaw(name)) as { id: string; slug: string }[];
  if (existing.some((other) => other.slug === item.slug && other.id !== item.id)) {
    return NextResponse.json({ error: 'slug already in use' }, { status: 409 });
  }

  await upsertItem(name, item);
  revalidateSite();
  return NextResponse.json({ ok: true });
}
