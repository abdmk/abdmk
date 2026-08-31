import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { deleteItem } from '@/lib/content/store';
import { SCHEMAS } from '@/lib/admin/schema';
import type { CollectionName } from '@/lib/content/types';

const isCollection = (name: string): name is CollectionName => name in SCHEMAS;

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ name: string; id: string }> },
) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { name, id } = await params;
  if (!isCollection(name)) return NextResponse.json({ error: 'unknown collection' }, { status: 404 });

  await deleteItem(name, id);
  // Deleting changes listings and any page that linked to the item.
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
