import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/icons';
import { SmartImage } from '@/components/media/SmartImage';
import { ProjectBlocks } from '@/components/project/ProjectBlocks';
import { ProjectCardMini } from '@/components/project/ProjectCard';
import { ProjectGrid } from '@/components/project/ProjectGrid';
import { ShareBar } from '@/components/project/ShareBar';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  categories as getCategories,
  companies as getCompanies,
  getCompany,
  getProject,
  projectNeighbours,
  projects as getProjects,
  relatedProjects,
  servicesByIds,
  settings as getSettings,
  typefacesByIds,
} from '@/lib/content/queries';
import type { Lang } from '@/lib/content/types';
import { LANGS, localePath, t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';

export async function generateStaticParams() {
  const list = await getProjects();
  return LANGS.flatMap((lang) => list.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  const title = t(project.title, lang);
  const description = t(project.shortDescription, lang);
  const path = `/${lang}/project/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: { ar: `/ar/project/${slug}`, en: `/en/project/${slug}` },
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: path,
      images: [{ url: project.cover.src, alt: t(project.cover.alt, lang) }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [project.cover.src] },
  };
}

/** A labelled row in the project meta column. */
function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line py-3.5">
      <dt className="label mb-1.5">{label}</dt>
      <dd className="text-small">{children}</dd>
    </div>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ lang: Lang; slug: string }>;
}) {
  const { lang, slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const tr = ui(lang);
  const [company, allCategories, related, neighbours, projectServices, projectFonts, companies, settings] =
    await Promise.all([
      project.company ? getCompany(project.company) : Promise.resolve(undefined),
      getCategories(),
      relatedProjects(project),
      projectNeighbours(slug),
      servicesByIds(project.services),
      typefacesByIds(project.fonts),
      getCompanies(),
      getSettings(),
    ]);

  const categoryNames = project.categories
    .map((c) => allCategories.find((cat) => cat.slug === c))
    .filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: t(project.title, lang),
    description: t(project.shortDescription, lang),
    inLanguage: lang,
    dateCreated: project.year,
    image: new URL(project.cover.src, settings.seo.siteUrl).toString(),
    url: new URL(`/${lang}/project/${slug}`, settings.seo.siteUrl).toString(),
    creator: { '@type': 'Person', name: t(settings.name, lang) },
    ...(company ? { sourceOrganization: { '@type': 'Organization', name: t(company.name, lang) } } : {}),
    keywords: categoryNames.map((c) => t(c!.name, lang)).join(', '),
  };

  return (
    <article className="shell pb-section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---------------------------------------------------------------- Hero */}
      <header className="pt-14 md:pt-20">
        <Link
          href={localePath(lang, '/work')}
          className="label inline-flex items-center gap-2 hover:text-ink"
        >
          <Icon name="arrowLeft" size={12} flipRtl />
          {tr.project.backToWork}
        </Link>

        <h1 className="mt-8 max-w-[15ch] text-mega md:mt-12">{t(project.title, lang)}</h1>

        <div className="grid-editorial mt-8 md:mt-12">
          <p className="measure col-span-4 text-lead text-muted md:col-span-6">
            {t(project.shortDescription, lang)}
          </p>
          <p className="meta-line col-span-4 md:col-span-3 md:col-start-10 md:justify-self-end md:text-end">
            {company ? t(company.name, lang) : null}
            {company ? <span aria-hidden> · </span> : null}
            <span className="numeric">{project.year}</span>
          </p>
        </div>
      </header>

      <div className="well mt-12 md:mt-16">
        <SmartImage
          src={project.cover.src}
          alt={t(project.cover.alt, lang)}
          width={project.cover.width}
          height={project.cover.height}
          sizes="100vw"
          priority
          className="w-full"
        />
      </div>

      {/* ---------------------------------------------------------------- Meta */}
      <div className="grid-editorial mt-section-sm">
        <div className="col-span-4 md:col-span-4">
          <dl className="m-0">
          <Meta label={tr.project.year}>
              <span className="numeric">{project.year}</span>
            </Meta>

            {company ? (
            <Meta label={tr.project.client}>
                <Link
                  href={localePath(lang, `/company/${company.slug}`)}
                  className="link-underline inline-flex items-center gap-1.5 font-medium"
                >
                  {t(company.name, lang)}
                  <Icon name="arrowUpRight" size={13} />
                </Link>
              </Meta>
            ) : null}

          <Meta label={tr.project.role}>{t(project.role, lang)}</Meta>

            {projectServices.length ? (
            <Meta label={tr.project.services}>
                <ul className="list-none space-y-1 p-0">
                  {projectServices.map((service) => (
                    <li key={service.id}>
                      <Link
                        href={`${localePath(lang, '/services')}#${service.slug}`}
                        className="link-underline"
                      >
                        {t(service.name, lang)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Meta>
            ) : null}

            {categoryNames.length ? (
            <Meta label={tr.project.categories}>
                <ul className="flex list-none flex-wrap gap-x-3 gap-y-1 p-0">
                  {categoryNames.map((category) => (
                    <li key={category!.slug}>
                      <Link
                        href={`${localePath(lang, '/work')}?category=${category!.slug}`}
                        className="link-underline text-muted"
                      >
                        {t(category!.name, lang)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Meta>
            ) : null}

            {projectFonts.length ? (
            <Meta label={tr.project.fontsUsed}>
                <ul className="list-none space-y-1 p-0">
                  {projectFonts.map((font) => (
                    <li key={font.id}>
                      <Link href={localePath(lang, `/font/${font.slug}`)} className="link-underline">
                        {t(font.name, lang)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Meta>
            ) : null}

            {project.tools.length ? (
            <Meta label={tr.project.tools}>{project.tools.join('، ')}</Meta>
            ) : null}
          </dl>

          {/* Actions sit outside the definition list: they are not terms. */}
          <div className="mt-8 border-t border-line pt-6">
            {project.projectUrl ? (
              <ArrowLink href={project.projectUrl} external className="mb-5">
                {tr.project.visitProject}
              </ArrowLink>
            ) : null}
            <ShareBar
              title={t(project.title, lang)}
              path={`/${lang}/project/${slug}`}
              lang={lang}
            />
          </div>
        </div>

        <div className="col-span-4 md:col-span-7 md:col-start-6">
          <p className="text-h1">{t(project.fullDescription, lang)}</p>
        </div>
      </div>

      {/* --------------------------------------------------------- Case study */}
      <div className="mt-section">
        <ProjectBlocks blocks={project.blocks} lang={lang} />
      </div>

      {/* --------------------------------------------------------- Navigation */}
      <nav
        aria-label={tr.project.nextProject}
        className="rule mt-section grid gap-12 pt-10 md:grid-cols-2 md:gap-8"
      >
        {neighbours.previous ? (
          <ProjectCardMini
            project={neighbours.previous}
            lang={lang}
            label={tr.project.previousProject}
          />
        ) : (
          <div />
        )}
        {neighbours.next ? (
          <ProjectCardMini
            project={neighbours.next}
            lang={lang}
            label={tr.project.nextProject}
            align="end"
          />
        ) : null}
      </nav>

      {/* ------------------------------------------------------------ Related */}
      {related.length ? (
        <section className="mt-section">
          <SectionHeader title={tr.project.related} className="mb-9 md:mb-12" />
          <Reveal>
            <ProjectGrid
              projects={related}
              lang={lang}
              companies={companies}
              variant="even"
              priorityCount={0}
            />
          </Reveal>
        </section>
      ) : null}
    </article>
  );
}
