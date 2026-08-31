/**
 * Content model.
 *
 * Every entity is standalone and referenced by slug, so the graph
 * (company → projects, font → projects, project → services …) can be walked from
 * either end and new relations can be added without reshaping existing data.
 *
 * Every human-readable string is a `Localized` pair — the site is bilingual by
 * construction, not by translating a Latin-first model after the fact.
 */

export type Lang = 'ar' | 'en';

/** A string in both site languages. Either side may be empty; readers fall back. */
export interface Localized {
  ar: string;
  en: string;
}

export type MediaKind = 'image' | 'video' | 'gif';

export interface Media {
  /** Path under /public, or an absolute URL. */
  src: string;
  kind: MediaKind;
  alt: Localized;
  /** Intrinsic size, used to reserve layout space and avoid CLS. */
  width?: number;
  height?: number;
  /** Video-only playback hints. */
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  caption?: Localized;
}

/* -------------------------------------------------------------------------- */
/* Case-study blocks                                                          */
/* -------------------------------------------------------------------------- */

/**
 * A case study is an ordered list of blocks rather than a fixed template, so a
 * project can be composed freely — the way a Behance project is, but typeset.
 */
export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'imageFull'
  | 'imagePair'
  | 'imageTrio'
  | 'gallery'
  | 'video'
  | 'gif'
  | 'quote'
  | 'divider'
  | 'textImage'
  | 'imageText'
  | 'button'
  | 'embed';

interface BlockBase {
  id: string;
  type: BlockType;
}

export interface HeadingBlock extends BlockBase {
  type: 'heading';
  text: Localized;
  level: 2 | 3;
}
export interface ParagraphBlock extends BlockBase {
  type: 'paragraph';
  text: Localized;
}
export interface ImageBlock extends BlockBase {
  type: 'image' | 'imageFull';
  media: Media;
}
export interface ImagePairBlock extends BlockBase {
  type: 'imagePair';
  media: [Media, Media];
}
export interface ImageTrioBlock extends BlockBase {
  type: 'imageTrio';
  media: [Media, Media, Media];
}
export interface GalleryBlock extends BlockBase {
  type: 'gallery';
  media: Media[];
  /** Columns on desktop; the grid collapses to 1–2 on small screens. */
  columns?: 2 | 3 | 4;
}
export interface VideoBlock extends BlockBase {
  type: 'video' | 'gif';
  media: Media;
}
export interface QuoteBlock extends BlockBase {
  type: 'quote';
  text: Localized;
  attribution?: Localized;
}
export interface DividerBlock extends BlockBase {
  type: 'divider';
}
/** Text beside an image; `textImage` puts the text on the leading edge. */
export interface TextImageBlock extends BlockBase {
  type: 'textImage' | 'imageText';
  heading?: Localized;
  text: Localized;
  media: Media;
}
export interface ButtonBlock extends BlockBase {
  type: 'button';
  label: Localized;
  href: string;
  external?: boolean;
}
export interface EmbedBlock extends BlockBase {
  type: 'embed';
  /** An iframe URL (Vimeo, YouTube, Figma …). */
  url: string;
  title: Localized;
  /** width / height, e.g. 1.777 for 16:9. */
  ratio?: number;
}

export type Block =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | ImagePairBlock
  | ImageTrioBlock
  | GalleryBlock
  | VideoBlock
  | QuoteBlock
  | DividerBlock
  | TextImageBlock
  | ButtonBlock
  | EmbedBlock;

/* -------------------------------------------------------------------------- */
/* Entities                                                                   */
/* -------------------------------------------------------------------------- */

export interface Entity {
  id: string;
  slug: string;
  published: boolean;
  /** Lower sorts first within its collection. */
  order?: number;
  updatedAt?: string;
}

export interface Project extends Entity {
  title: Localized;
  cover: Media;
  shortDescription: Localized;
  fullDescription: Localized;
  year: string;
  /** Category slugs — see `categories.json`. Free to grow. */
  categories: string[];
  /** Service slugs. */
  services: string[];
  /** Company slug, or null for self-initiated work. */
  company: string | null;
  role: Localized;
  tools: string[];
  /** Font slugs used in the project. */
  fonts: string[];
  projectUrl?: string;
  links?: { label: Localized; href: string }[];
  featured: boolean;
  blocks: Block[];
}

export type CompanyType =
  | 'company'
  | 'studio'
  | 'agency'
  | 'client'
  | 'organization'
  | 'personal';

export interface Company extends Entity {
  name: Localized;
  logo?: Media;
  description: Localized;
  role: Localized;
  /** Free text so open-ended periods ("2024 — Present") work in both languages. */
  period: Localized;
  type: CompanyType;
  services: string[];
  url?: string;
  images: Media[];
  /** Show in the homepage "Worked with" strip. */
  featured: boolean;
  /** Show in the About page experience list. */
  showInExperience: boolean;
}

export interface FontFace {
  name: Localized;
  weight: number;
  /** Optional specimen file under /public, for the live tester. */
  file?: string;
}

export interface TypefaceItem extends Entity {
  name: Localized;
  preview: Media;
  description: Localized;
  /** e.g. "Display", "Text", "Kufi". */
  type: Localized;
  weights: FontFace[];
  features: Localized[];
  specimens: Media[];
  license: Localized;
  purchaseUrl?: string;
  downloadUrl?: string;
  /**
   * Family name to preview in the tester. When the family is not actually
   * loadable in the browser the tester falls back to the site typeface and says so.
   */
  testerFamily?: string;
  /** Sample text seeded into the tester. */
  sample: Localized;
  featured: boolean;
}

export interface Service extends Entity {
  name: Localized;
  description: Localized;
  deliverables: Localized[];
  image?: Media;
  featured: boolean;
}

export interface Workshop extends Entity {
  /** Workshops and courses share a shape and differ by `kind`. */
  kind: 'workshop' | 'course';
  title: Localized;
  description: Localized;
  cover: Media;
  /** ISO date; used to split upcoming from past. */
  date: string;
  endDate?: string;
  duration: Localized;
  location: Localized;
  mode: 'online' | 'offline' | 'hybrid';
  price: Localized;
  seats?: number;
  /** Syllabus / what is covered. */
  content: Localized[];
  media: Media[];
  registrationUrl?: string;
  relatedProjects: string[];
  relatedServices: string[];
  featured: boolean;
}

/**
 * A client's own words. Displayed as large set type rather than a review card,
 * so the quote reads as part of the site's voice.
 */
export interface Testimonial extends Entity {
  quote: Localized;
  author: Localized;
  /** The person's title — kept separate so it can be set smaller than the name. */
  role: Localized;
  organisation: Localized;
  /** Optional company slug, to link the quote back to the work. */
  company: string | null;
  avatar?: Media;
  featured: boolean;
}

export type ProductKind = 'font' | 'template' | 'preset' | 'ebook' | 'other';

/** Something readers can buy or download — the shop side of the portfolio. */
export interface Product extends Entity {
  name: Localized;
  kind: ProductKind;
  description: Localized;
  cover: Media;
  price: Localized;
  purchaseUrl?: string;
  highlights: Localized[];
  featured: boolean;
}

/** One row of the closing FAQ. `slug` doubles as the anchor id. */
export interface FaqItem extends Entity {
  question: Localized;
  answer: Localized;
}

export interface Category {
  slug: string;
  name: Localized;
  order?: number;
}

export interface SocialLink {
  /** Must match an icon name in the UIcons registry. */
  icon: string;
  label: string;
  href: string;
}

export interface Settings {
  name: Localized;
  role: Localized;
  tagline: Localized;
  heroStatement: Localized;
  shortBio: Localized;
  /** The proof band under the hero — a figure and what it counts. */
  stats: { value: string; label: Localized }[];
  about: {
    portrait: Media;
    intro: Localized;
    body: Localized[];
    approach: { title: Localized; text: Localized }[];
    tools: string[];
    interests: Localized[];
    achievements: { year: string; text: Localized }[];
    cvUrl?: string;
  };
  contact: {
    email: string;
    phone?: string;
    whatsapp?: string;
    location: Localized;
    availability: Localized;
    projectTypes: Localized[];
    budgets: Localized[];
  };
  social: SocialLink[];
  seo: {
    siteUrl: string;
    title: Localized;
    description: Localized;
  };
}

/** The whole content graph, as loaded from disk. */
export interface ContentData {
  settings: Settings;
  categories: Category[];
  projects: Project[];
  companies: Company[];
  fonts: TypefaceItem[];
  services: Service[];
  workshops: Workshop[];
  products: Product[];
  testimonials: Testimonial[];
  faq: FaqItem[];
}

export type CollectionName =
  | 'projects'
  | 'companies'
  | 'fonts'
  | 'services'
  | 'workshops'
  | 'products'
  | 'testimonials'
  | 'faq';
