import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Admin',
  // The admin must never be indexed, whatever robots.txt says.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The admin has its own root layout: it is always LTR and English, regardless of
 * which language the public site is being read in.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-dvh bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
