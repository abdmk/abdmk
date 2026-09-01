import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import type { Lang } from '@/lib/content/types';
import { ui } from '@/lib/i18n/dictionary';
import { AccountView } from './AccountView';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const tr = ui(lang);
  return {
    title: tr.account.title,
    alternates: {
      canonical: `/${lang}/account`,
      languages: { ar: '/ar/account', en: '/en/account' },
    },
  };
}

async function getUser() {
  const jar = await cookies();
  const token = jar.get('user_session')?.value;
  if (!token) return null;

  // Build the absolute URL from the cookie-forwarding internal fetch
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Cookie: `user_session=${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.user as { id: string; name: string; email: string } | null;
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const user = await getUser();

  return (
    <div className="shell pb-section pt-6 sm:pt-8">
      <AccountView lang={lang} initialUser={user} />
    </div>
  );
}
