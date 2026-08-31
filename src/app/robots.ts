import type { MetadataRoute } from 'next';
import { settings as getSettings } from '@/lib/content/queries';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const s = await getSettings();
  const base = s.seo.siteUrl.replace(/\/$/, '');
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The admin and its API are private and must never be indexed.
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
