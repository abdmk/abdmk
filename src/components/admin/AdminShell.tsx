'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { Icon } from '@/components/icons';
import { SCHEMAS } from '@/lib/admin/schema';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/admin', label: 'Overview', icon: 'browser' as const },
  ...Object.values(SCHEMAS).map((schema) => ({
    href: `/admin/${schema.name}`,
    label: schema.label,
    icon: 'list' as const,
  })),
  { href: '/admin/categories', label: 'Categories', icon: 'filter' as const },
  { href: '/admin/settings', label: 'Site settings', icon: 'settings' as const },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[100rem] flex-col lg:flex-row">
      <aside className="shrink-0 border-b border-line lg:w-60 lg:border-b-0 lg:border-e">
        <div className="flex items-center justify-between p-5 lg:block">
          <Link href="/admin" className="block text-h3 font-semibold leading-tight">
            Admin
          </Link>
          <Link
            href="/ar"
            target="_blank"
            className="mt-1 hidden items-center gap-1.5 text-small text-muted hover:text-ink lg:inline-flex"
          >
            View site
            <Icon name="arrowUpRight" size={13} />
          </Link>
        </div>

        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3">
          {LINKS.map((link) => {
            const active =
              link.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap px-3 py-2 text-small transition-colors',
                  active ? 'bg-ink text-paper' : 'text-muted hover:text-ink',
                )}
              >
                <Icon name={link.icon} size={15} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden p-3 lg:block">
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2.5 px-3 py-2 text-small text-muted hover:text-ink"
          >
            <Icon name="signOut" size={15} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-8 lg:p-10">{children}</main>
    </div>
  );
}
