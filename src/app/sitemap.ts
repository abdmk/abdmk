import type { MetadataRoute } from 'next';
import {
  companies,
  projects,
  services,
  settings as getSettings,
  typefaces,
  workshops,
} from '@/lib/content/queries';
import { LANGS } from '@/lib/i18n/config';

/**
 * Every published entity, in both languages, with hreflang alternates so search
 * engines pair the Arabic and English versions instead of treating them as
 * duplicates.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [s, projectList, companyList, fontList, serviceList, sessionList] = await Promise.all([
    getSettings(),
    projects(),
    companies(),
    typefaces(),
    services(),
    workshops(),
  ]);

  const base = s.seo.siteUrl.replace(/\/$/, '');
  const entries: MetadataRoute.Sitemap = [];

  const add = (path: string, priority: number, changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
    for (const lang of LANGS) {
      entries.push({
        url: `${base}/${lang}${path}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: {
          languages: Object.fromEntries(LANGS.map((l) => [l, `${base}/${l}${path}`])),
        },
      });
    }
  };

  add('', 1, 'weekly');
  for (const path of ['/work', '/fonts', '/companies', '/services', '/workshops', '/courses', '/about', '/contact']) {
    add(path, 0.8, 'weekly');
  }

  for (const project of projectList) add(`/project/${project.slug}`, 0.9, 'monthly');
  for (const font of fontList) add(`/font/${font.slug}`, 0.8, 'monthly');
  for (const company of companyList) add(`/company/${company.slug}`, 0.6, 'monthly');
  for (const session of sessionList) {
    add(`/${session.kind === 'course' ? 'course' : 'workshop'}/${session.slug}`, 0.7, 'weekly');
  }
  // Services live as anchors on one page, so they are covered by /services above.
  void serviceList;

  return entries;
}
