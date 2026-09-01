import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Icon } from '@/components/icons';
import { AdminShell } from '@/components/admin/AdminShell';
import { SCHEMAS } from '@/lib/admin/schema';
import { isAuthed } from '@/lib/auth';
import { getCollectionRaw } from '@/lib/content/store';

export default async function AdminHome() {
  if (!(await isAuthed())) redirect('/admin/login');

  const collections = await Promise.all(
    Object.values(SCHEMAS).map(async (schema) => {
      const items = (await getCollectionRaw(schema.name)) as unknown as { published: boolean }[];
      return {
        schema,
        total: items.length,
        drafts: items.filter((item) => !item.published).length,
      };
    }),
  );

  const quickActions = [
    { href: '/admin/projects/new', label: 'New project' },
    { href: '/admin/courses/new', label: 'New course' },
    { href: '/admin/services/new', label: 'New service' },
  ];

  return (
    <AdminShell>
      <h1 className="text-h1 font-light">Dashboard</h1>
      <p className="mt-3 max-w-prose text-small text-muted">
        Welcome back. Here is an overview of your content.
      </p>

      {/* Stats grid */}
      <ul className="mt-10 grid list-none gap-px border border-line bg-line p-0 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map(({ schema, total, drafts }) => (
          <li key={schema.name} className="bg-paper">
            <Link href={`/admin/${schema.name}`} className="group block p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-h3 font-medium">{schema.label}</h2>
                <Icon
                  name="arrowRight"
                  size={17}
                  className="mt-1 text-faint transition-transform duration-300 group-hover:translate-x-1"
                />
              </div>
              <p className="numeric mt-6 text-h2 font-light">{total}</p>
              <p className="mt-1 text-small text-muted">
                {drafts ? `${drafts} draft${drafts === 1 ? '' : 's'}` : 'all published'}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {/* Quick actions */}
      <div className="mt-12">
        <h2 className="text-h3 font-medium">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-small font-medium text-paper"
            >
              <Icon name="plus" size={14} />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
