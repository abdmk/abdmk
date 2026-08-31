# Personal Creative Platform

A bilingual (Arabic / English) portfolio, case-study platform and personal brand
site for a graphic and Arabic type designer. It is a running Next.js application
with a built-in CMS, not a mockup: content is edited at `/admin`, stored as JSON,
and rendered by the same code that serves the public site.

```bash
npm install
npm run dev        # http://localhost:3000 — redirects to /ar
```

The admin lives at [`/admin`](http://localhost:3000/admin). In development any
password works; see [Admin & security](#admin--security) before deploying.

---

## The two hard constraints

### 1. Typography — Graphik Arabic, and nothing else

The site has exactly one typeface, used for both scripts, across the whole
interface. The five supplied weights are all present and all real — no synthetic
bolds:

| Weight | Style      | File                                       |
| -----: | ---------- | ------------------------------------------ |
|    200 | Extralight | `public/fonts/GraphikArabic-200.woff`      |
|    300 | Light      | `public/fonts/GraphikArabic-300.woff`      |
|    400 | Regular    | `public/fonts/GraphikArabic-400.woff`      |
|    500 | Medium     | `public/fonts/GraphikArabic-500.woff`      |
|    600 | Semibold   | `public/fonts/GraphikArabic-600.woff`      |

The supplied TTFs are ~280 KB each, which is a lot to ship five times over on a
media-heavy site. `scripts/ttf-to-woff.py` converts them to WOFF 1.0 — a plain
sfnt with each table deflated — which is self-compressing regardless of server
configuration and lands at ~95 KB per weight. The `@font-face` rules in
`src/app/globals.css` list WOFF first and the original TTF as a fallback source,
and the two weights used above the fold are preloaded.

Re-run after replacing anything in `fonts-src/`:

```bash
npm run fonts
```

The type system built on it is in `tailwind.config.ts` and `globals.css`: a
fluid display scale, an `.label` style for metadata, and per-language
adjustments — Arabic sets slightly larger and looser, because its letterforms
are wider and its diacritics need vertical air, and `.numeric` keeps Latin
figures LTR inside Arabic copy.

### 2. Icons — Flaticon UIcons only

Every icon on the site comes from
[Flaticon UIcons Interface Icons](https://www.flaticon.com/uicons/interface-icons),
via the official `@flaticon/flaticon-uicons` package. No other icon library is
installed or used.

Rather than shipping a ~300 KB icon webfont, `scripts/extract-uicons.py` reads
the licensed WOFF, extracts the outlines for exactly the icons in its `ICONS`
registry, and emits them as 24×24 SVG paths
(`src/components/icons/paths.generated.ts` — 58 icons, ~29 KB). They inherit
`currentColor`, scale cleanly, and cost no font download.

Everything renders through one primitive:

```tsx
import { Icon } from '@/components/icons';

<Icon name="arrowRight" size={18} flipRtl />       // mirrors in RTL
<Icon name="share" label="Share this project" />   // labelled; otherwise aria-hidden
```

To add an icon, add a line to `ICONS` in `scripts/extract-uicons.py` and run
`npm run icons`. Never hand-author or paste an SVG in from elsewhere — that is
the one rule that keeps the icon set consistent.

---

## Architecture

```
src/
  app/
    (site)/[lang]/        Public site. Arabic and English, RTL and LTR.
    (admin)/admin/        CMS. Its own root layout: always English, always LTR.
    api/                  Admin CRUD, uploads, contact form.
    sitemap.ts robots.ts  SEO endpoints, generated from content.
  components/
    icons/                The single icon system.
    layout/               Navbar, Footer, LanguageSwitcher, SocialLinks.
    media/                SmartImage, Figure, VideoPlayer, Gallery, Lightbox.
    project/              Cards, grid, filters, case-study renderer, sharing.
    font/                 FontTester.
    workshop/  admin/  ui/
  lib/
    content/              types.ts (model), store.ts (I/O), queries.ts (graph).
    i18n/                 config.ts, dictionary.ts.
    admin/                schema.ts (form schemas), relations.ts.
content/                  The content itself, as JSON.
public/                   fonts/ media/ uploads/
scripts/                  Icon extraction, font conversion, seeding, placeholders.
```

The site and the admin are **separate root layouts** under route groups, because
they need different `<html lang>` and `dir`. There is no shared root layout;
`src/app/not-found.tsx` supplies its own document for the same reason.

### Data model

Every entity is standalone and referenced by slug, so the graph can be walked
from either end. Every human-readable string is a `{ ar, en }` pair — the site is
bilingual by construction, not by translating a Latin-first model afterwards.

```
Company ─┬─ Projects            Project ─┬─ Company / Client
Font ────┼─ Projects                     ├─ Services
Service ─┼─ Projects                     ├─ Categories
Workshop ┴─ Projects, Services           ├─ Fonts used
                                         └─ Related projects (scored)
```

Related projects are not hand-picked: `relatedProjects()` in
`src/lib/content/queries.ts` scores candidates by how much of the graph they
share — same company scores highest, then categories, services and fonts — and
falls back to recent work so the slot is never empty.

### Case studies

A project body is an **ordered list of blocks**, not a fixed template, so each
case study is composed rather than poured into a mould:

`heading` · `paragraph` · `image` · `imageFull` · `imagePair` · `imageTrio` ·
`gallery` · `video` · `gif` · `quote` · `divider` · `textImage` · `imageText` ·
`button` · `embed`

Widths are decided in the renderer (`ProjectBlocks.tsx`), not stored per block —
text is held to a measure, media is free to break out to full bleed — so the
whole site can be restyled from one place.

---

## The CMS

Content is JSON on disk under `/content`, edited at `/admin`.

**Why not Sanity or Payload.** Both were considered. Both need an external
service or a database before the first page renders, and this is a single-author
site whose content is a few hundred KB of text. A file-backed store means the
whole thing runs with `npm install && npm run dev` and nothing else, and the
content is diffable and version-controlled alongside the code. The read API in
`src/lib/content/store.ts` is the only thing pages touch, so moving to a hosted
CMS later means reimplementing that one module — not rewriting the pages.

**The trade-off you need to know about:** the admin writes to the filesystem, so
it needs a **persistent writable disk**. That is fine on a VPS, a container with
a volume, or any long-running Node host. It does *not* work on read-only
serverless filesystems (Vercel, Netlify functions), where saves would be lost.
Deploy to a persistent host, or swap `store.ts` for a hosted backend.

Writes call `revalidatePath('/', 'layout')`, so edits appear immediately even
though pages are statically generated.

### What you can edit

| Screen                  | What it covers                                                        |
| ----------------------- | --------------------------------------------------------------------- |
| `/admin/projects`       | Projects and their case studies                                       |
| `/admin/companies`      | Companies, studios, agencies, clients, organisations                  |
| `/admin/fonts`          | Typefaces, weights, features, specimens, licence                      |
| `/admin/services`       | Services and deliverables                                             |
| `/admin/workshops`      | Workshops and courses (one collection, split by `kind`)               |
| `/admin/products`       | Typefaces, templates and guides for sale                              |
| `/admin/testimonials`   | Client quotes shown as pull quotes on the homepage                    |
| `/admin/faq`            | The closing "questions you might have" accordion                      |
| `/admin/categories`     | The work taxonomy                                                     |
| `/admin/settings`       | Identity, About page, contact, social links, SEO defaults             |

Every editor is generated from a **field schema** in `src/lib/admin/schema.ts`.
Adding a field to the CMS is a line there, not a new form — which is what keeps
ten collections from drifting into ten bespoke screens.

The case-study builder supports drag-and-drop reordering **and** move-up/-down
buttons, because a builder that only works with a mouse is not finished.

Uploads (`/api/admin/upload`) accept JPG, PNG, WebP, AVIF, SVG, GIF, MP4, WebM
and font files, and land in `/public/uploads`. The extension allowlist decides
what may be written — the browser-supplied MIME type is not trusted.

### Admin & security

- Set **`ADMIN_PASSWORD`** and **`ADMIN_SECRET`** in production (see
  `.env.example`). With no `ADMIN_PASSWORD` set, production **refuses every
  login**; development accepts any password so the CMS is usable out of the box.
- The session is an HMAC-signed, `httpOnly`, 12-hour cookie.
- `/admin` and `/api/` are excluded from `robots.txt` and the admin sends
  `noindex`.

---

## Bilingual behaviour

Arabic is the default. `src/middleware.ts` sends an unprefixed request to the
visitor's preferred language when it is one we support, and to Arabic otherwise.

Switching language keeps the reader on the same page — the switcher swaps the
language segment of the current URL rather than dropping them at the homepage.

Direction is a real concern, not a `dir` attribute: layouts use logical
properties (`ps-*`, `me-*`, `start-*`), directional icons mirror via `flipRtl`,
the underline on links grows from the leading edge, and the lightbox's arrow
keys follow reading order — `←` advances in Arabic.

`generateMetadata` emits `hreflang` alternates on every page, and the sitemap
pairs the two languages so they are not read as duplicates.

---

## Performance

- Static generation for all 87 public pages; ~103 KB of shared JS.
- `next/image` for raster media with AVIF/WebP and per-breakpoint `sizes`. SVG
  and GIF bypass the optimiser deliberately — it cannot resize vector art and it
  would strip a GIF's animation.
- Ambient video starts only when it scrolls into view and pauses when it leaves,
  so a page of clips does not decode a dozen streams at once.
- Every media slot reserves its aspect ratio, so nothing reflows as it loads.
- Fonts are preloaded (two weights), `font-display: swap`, immutable cache
  headers.

## Accessibility

Audited with axe-core (WCAG 2.1 A + AA) across the public pages, the admin, and
the lightbox in its open state: **0 violations**. Re-run any time — the audit
scripts are small and worth keeping.

Text colours are held at 4.5:1 against their own surface, in both the light and
inverted palettes; hierarchy is carried by size, weight and tracking rather than
by fading text out. Scroll reveals animate from `opacity: 0`, so a `<noscript>`
rule shows them outright when JS never runs. `prefers-reduced-motion` disables
motion throughout.

## SEO

Per-page dynamic titles and descriptions, Open Graph and Twitter cards,
canonical URLs, `hreflang`, a generated sitemap and `robots.txt`, and JSON-LD:
`CreativeWork` for projects, `Organization` for companies, `Product` for fonts,
`Event` for workshops and courses, `Person` for About.

---

## Demo content

The repository ships with realistic bilingual demo content — 10 projects with
full case studies, 8 companies, 4 typefaces, 6 services, 4 products,
5 testimonials, 6 workshops and courses — so the layouts can be judged at real density.

The artwork is generated, not stock: `scripts/generate-placeholders.py` draws
abstract editorial compositions in the site palette at the aspect ratios the grid
actually uses. There is a real `.webm`, a real animated `.gif` and a poster
still, so all three media paths are exercised.

```bash
npm run seed          # rewrites /content — do NOT run once you have real work in
npm run placeholders  # regenerates the demo artwork
```

Nothing in the code references demo files by name outside the content JSON:
replace them by uploading real work from `/admin`.

## Commands

```bash
npm run dev           # development server
npm run build         # production build
npm run start         # serve the production build
npm run typecheck     # tsc --noEmit
npm run lint          # next lint
npm run icons         # re-extract UIcons SVG paths
npm run fonts         # re-convert fonts-src/*.ttf to WOFF
npm run seed          # re-seed demo content (destructive)
npm run placeholders  # regenerate demo artwork
```

## Deployment

To deploy to **Netlify** (recommended for free hosting):

1. Push this repository to GitHub
2. Connect it to [netlify.com](https://netlify.com)
3. Set environment variables `ADMIN_PASSWORD` and `ADMIN_SECRET`
4. Site builds and deploys automatically

When you edit content in `/admin`, changes are committed to GitHub and Netlify
redeploys automatically (takes ~1-2 minutes).

**Full deployment guide**: See [`DEPLOYMENT.md`](./DEPLOYMENT.md)

## Adding real content

1. `/admin/settings` — your name, role, tagline, contact details, social links,
   and the site URL (canonical URLs, OG images and the sitemap all read it).
2. `/admin/companies` — add clients first, so projects can be attached to them.
3. `/admin/projects` — create a project, then compose its case study from blocks.
4. `/admin/fonts` — upload a font file per weight to make the type tester preview
   the real typeface instead of falling back to the site face.
5. Wire a mail provider into `src/app/api/contact/route.ts`; the hand-off point
   is marked. Until then enquiries are validated and logged, not emailed.
