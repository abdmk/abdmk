import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Icon } from '@/components/icons';
import { AdminShell } from '@/components/admin/AdminShell';
import { SCHEMAS } from '@/lib/admin/schema';
import { isAuthed } from '@/lib/auth';
import { getCollectionRaw } from '@/lib/content/store';
import type { CollectionName, Localized } from '@/lib/content/types';
import { cn } from '@/lib/utils';

const isCollection = (name: string): name is CollectionName => name in SCHEMAS;

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  if (!(await isAuthed())) redirect('/admin/login');

  const { collection } = await params;
  // `categories` and `settings` have their own screens.
  if (!isCollection(collection)) notFound();

  const schema = SCHEMAS[collection];
  const items = (await getCollectionRaw(collection)) as unknown as Record<string, unknown>[];

  return (
    <AdminShell>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 font-light">{schema.label}</h1>
          <p className="numeric mt-2 text-small text-muted">{items.length} items</p>
        </div>
        <Link
          href={`/admin/${collection}/new`}
          className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-small font-medium text-paper"
        >
          <Icon name="plus" size={14} />
          New {schema.singular}
        </Link>
      </div>

      <ul className="list-none border-t border-line p-0">
        {items.map((item) => {
          const title = item[schema.titleField] as Localized | undefined;
          return (
            <li key={String(item.id)}>
              <Link
                href={`/admin/${collection}/${item.id}`}
                className="group flex items-center gap-4 border-b border-line py-4"
              >
                <span
                  className={cn(
                    'h-2 w-2 shrink-0 rounded-full',
                    item.published ? 'bg-ink' : 'bg-line',
                  )}
                  aria-label={item.published ? 'Published' : 'Draft'}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-body font-medium">
                    {title?.en || title?.ar || String(item.slug ?? item.id)}
                  </span>
                  <span className="block truncate text-meta text-faint" dir="ltr">
                    /{String(item.slug ?? '')}
                  </span>
                </span>

                {item.featured ? (
                  <span className="hidden shrink-0 border border-line px-2 py-0.5 text-meta text-muted sm:inline">
                    FEATURED
                  </span>
                ) : null}

                <Icon
                  name="arrowRight"
                  size={16}
                  className="shrink-0 text-faint transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </li>
          );
        })}
      </ul>

      {!items.length ? (
        <p className="py-16 text-center text-muted">
          Nothing here yet. Create your first {schema.singular.toLowerCase()}.
        </p>
      ) : null}
    </AdminShell>
  );
}
