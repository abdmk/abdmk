import { notFound, redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { ItemEditor } from '@/components/admin/ItemEditor';
import { loadRelations } from '@/lib/admin/relations';
import { SCHEMAS, emptyItem } from '@/lib/admin/schema';
import { isAuthed } from '@/lib/auth';
import { getCollectionRaw } from '@/lib/content/store';
import type { CollectionName } from '@/lib/content/types';
import { makeId } from '@/lib/utils';

const isCollection = (name: string): name is CollectionName => name in SCHEMAS;

export default async function EditorPage({
  params,
}: {
  params: Promise<{ collection: string; id: string }>;
}) {
  if (!(await isAuthed())) redirect('/admin/login');

  const { collection, id } = await params;
  if (!isCollection(collection)) notFound();

  const schema = SCHEMAS[collection];
  const relations = await loadRelations();
  const isNew = id === 'new';

  let initial: Record<string, unknown>;
  if (isNew) {
    initial = { ...emptyItem(schema), id: makeId(collection.slice(0, 3)) };
  } else {
    const items = (await getCollectionRaw(collection)) as unknown as Record<string, unknown>[];
    const found = items.find((item) => item.id === id);
    if (!found) notFound();
    // Merge over a blank so a field added to the schema later is never undefined.
    initial = { ...emptyItem(schema), ...found };
  }

  return (
    <AdminShell>
      <ItemEditor schema={schema} initial={initial} relations={relations} isNew={isNew} />
    </AdminShell>
  );
}
