import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import '@/app/globals.css';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { THEME_INIT_SCRIPT } from '@/components/layout/ThemeToggle';
import type { Lang } from '@/lib/content/types';
import { settings as getSettings } from '@/lib/content/queries';
import { DIR, LANGS, isLang, t } from '@/lib/i18n/config';

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F4F5F7' },
    { media: '(prefers-color-scheme: dark)', color: '#0C0D10' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const s = await getSettings();
  const title = t(s.seo.title, lang);
  const description = t(s.seo.description, lang);

  return {
    metadataBase: new URL(s.seo.siteUrl),
    title: { default: title, template: `%s — ${t(s.name, lang)}` },
    description,
    alternates: {
      canonical: `/${lang}`,
      languages: { ar: '/ar', en: '/en', 'x-default': '/ar' },
    },
    openGraph: {
      type: 'website',
      siteName: t(s.name, lang),
      locale: lang === 'ar' ? 'ar_AR' : 'en_US',
      title,
      description,
      images: [{ url: '/media/og/default.svg', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
  };
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const typed = lang as Lang;
  const s = await getSettings();

  return (
    <html lang={typed} dir={DIR[typed]} suppressHydrationWarning>
      <head>
        {/* Applies a saved or OS-level dark preference before first paint, so
            there is no flash of the light theme for dark-mode visitors. Must
            run before hydration — hence a plain inline script, not an effect. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {/* Scroll reveals start at opacity 0 and are animated in by JS. Without
            JS there is nothing to animate them, so show them outright. */}
        <noscript>
          <style>{'[data-reveal]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        {/* The two weights used above the fold. The rest load on demand. */}
        <link
          rel="preload"
          href="/fonts/GraphikArabic-400.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/GraphikArabic-500.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-dvh antialiased">
        <Navbar lang={typed} settings={s} />
        <main id="main" className="pt-[76px] sm:pt-[88px]">
          {children}
        </main>
        <Footer lang={typed} settings={s} />
      </body>
    </html>
  );
}
