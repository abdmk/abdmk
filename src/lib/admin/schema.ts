import type { CollectionName } from '@/lib/content/types';

/**
 * Admin form schemas.
 *
 * Each collection describes its fields once, and one generic renderer builds the
 * editor from that description. Adding a field to the CMS is a line here, not a
 * new form — which is what keeps seven collections from becoming seven bespoke
 * screens that drift apart.
 */

export type FieldType =
  | 'text'
  | 'slug'
  | 'localized'
  | 'localizedArea'
  | 'localizedList'
  | 'number'
  | 'boolean'
  | 'date'
  | 'select'
  | 'stringList'
  | 'media'
  | 'mediaList'
  | 'relation'
  | 'relationSingle'
  | 'objectList'
  | 'blocks';

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  /** For `select`. */
  options?: { value: string; label: string }[];
  /** For `relation` / `relationSingle`: which collection to pick from. */
  collection?: CollectionName | 'categories';
  /** For `objectList`: the shape of each row. */
  fields?: Field[];
  /** Lay the field out in a narrower column. */
  half?: boolean;
}

export interface CollectionSchema {
  name: CollectionName;
  label: string;
  singular: string;
  /** Field whose value titles a row in the list view. */
  titleField: string;
  /** Route segment on the public site, for the "view" link. */
  publicPath?: string;
  fields: Field[];
}

const PUBLISHING: Field[] = [
  { name: 'published', label: 'Published', type: 'boolean', half: true },
  { name: 'featured', label: 'Featured', type: 'boolean', half: true },
  { name: 'order', label: 'Sort order', type: 'number', half: true, help: 'Lower sorts first.' },
];

export const SCHEMAS: Record<CollectionName, CollectionSchema> = {
  projects: {
    name: 'projects',
    label: 'Projects',
    singular: 'Project',
    titleField: 'title',
    publicPath: 'project',
    fields: [
      { name: 'title', label: 'Title', type: 'localized' },
      { name: 'slug', label: 'Slug', type: 'slug', half: true },
      { name: 'year', label: 'Year', type: 'text', half: true },
      { name: 'cover', label: 'Cover', type: 'media' },
      { name: 'shortDescription', label: 'Short description', type: 'localizedArea' },
      { name: 'fullDescription', label: 'Full description', type: 'localizedArea' },
      { name: 'company', label: 'Client / Company', type: 'relationSingle', collection: 'companies' },
      { name: 'role', label: 'Role', type: 'localized' },
      { name: 'categories', label: 'Categories', type: 'relation', collection: 'categories' },
      { name: 'services', label: 'Services', type: 'relation', collection: 'services' },
      { name: 'fonts', label: 'Fonts used', type: 'relation', collection: 'fonts' },
      { name: 'tools', label: 'Tools', type: 'stringList' },
      { name: 'projectUrl', label: 'Project URL', type: 'text' },
      ...PUBLISHING,
      { name: 'blocks', label: 'Case study', type: 'blocks' },
    ],
  },

  companies: {
    name: 'companies',
    label: 'Companies & Clients',
    singular: 'Company',
    titleField: 'name',
    publicPath: 'company',
    fields: [
      { name: 'name', label: 'Name', type: 'localized' },
      { name: 'slug', label: 'Slug', type: 'slug', half: true },
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        half: true,
        options: [
          { value: 'company', label: 'Company' },
          { value: 'studio', label: 'Studio' },
          { value: 'agency', label: 'Agency' },
          { value: 'client', label: 'Client' },
          { value: 'organization', label: 'Organization' },
          { value: 'personal', label: 'Personal client' },
        ],
      },
      { name: 'logo', label: 'Logo', type: 'media' },
      { name: 'description', label: 'Description', type: 'localizedArea' },
      { name: 'role', label: 'My role', type: 'localized' },
      { name: 'period', label: 'Period', type: 'localized', help: 'Free text, e.g. 2024 — Present.' },
      { name: 'services', label: 'Services', type: 'relation', collection: 'services' },
      { name: 'url', label: 'Website', type: 'text' },
      { name: 'images', label: 'Images', type: 'mediaList' },
      { name: 'published', label: 'Published', type: 'boolean', half: true },
      { name: 'featured', label: 'Show on homepage', type: 'boolean', half: true },
      { name: 'showInExperience', label: 'Show in About experience', type: 'boolean', half: true },
      { name: 'order', label: 'Sort order', type: 'number', half: true },
    ],
  },

  fonts: {
    name: 'fonts',
    label: 'Fonts',
    singular: 'Font',
    titleField: 'name',
    publicPath: 'font',
    fields: [
      { name: 'name', label: 'Name', type: 'localized' },
      { name: 'slug', label: 'Slug', type: 'slug', half: true },
      { name: 'type', label: 'Type', type: 'localized', half: true, help: 'e.g. Text, Display, Kufi.' },
      { name: 'preview', label: 'Preview image', type: 'media' },
      { name: 'description', label: 'Description', type: 'localizedArea' },
      { name: 'sample', label: 'Tester sample text', type: 'localized' },
      {
        name: 'weights',
        label: 'Weights',
        type: 'objectList',
        help: 'Upload a font file per weight to make the tester preview the real typeface.',
        fields: [
          { name: 'name', label: 'Name', type: 'localized' },
          { name: 'weight', label: 'Weight', type: 'number', half: true },
          { name: 'file', label: 'Font file URL', type: 'text', half: true },
        ],
      },
      { name: 'features', label: 'Features', type: 'localizedList' },
      { name: 'specimens', label: 'Specimens', type: 'mediaList' },
      { name: 'license', label: 'License', type: 'localizedArea' },
      { name: 'purchaseUrl', label: 'Purchase URL', type: 'text', half: true },
      { name: 'downloadUrl', label: 'Download URL', type: 'text', half: true },
      ...PUBLISHING,
    ],
  },

  services: {
    name: 'services',
    label: 'Services',
    singular: 'Service',
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Name', type: 'localized' },
      { name: 'slug', label: 'Slug', type: 'slug' },
      { name: 'description', label: 'Description', type: 'localizedArea' },
      { name: 'deliverables', label: 'Deliverables', type: 'localizedList' },
      { name: 'image', label: 'Image', type: 'media' },
      ...PUBLISHING,
    ],
  },

  workshops: {
    name: 'workshops',
    label: 'Workshops & Courses',
    singular: 'Session',
    titleField: 'title',
    fields: [
      {
        name: 'kind',
        label: 'Kind',
        type: 'select',
        half: true,
        options: [
          { value: 'workshop', label: 'Workshop' },
          { value: 'course', label: 'Course' },
        ],
      },
      { name: 'slug', label: 'Slug', type: 'slug', half: true },
      { name: 'title', label: 'Title', type: 'localized' },
      { name: 'description', label: 'Description', type: 'localizedArea' },
      { name: 'cover', label: 'Cover', type: 'media' },
      { name: 'date', label: 'Start date', type: 'date', half: true },
      { name: 'endDate', label: 'End date', type: 'date', half: true },
      { name: 'duration', label: 'Duration', type: 'localized', half: true },
      { name: 'location', label: 'Location', type: 'localized', half: true },
      {
        name: 'mode',
        label: 'Mode',
        type: 'select',
        half: true,
        options: [
          { value: 'online', label: 'Online' },
          { value: 'offline', label: 'In person' },
          { value: 'hybrid', label: 'Hybrid' },
        ],
      },
      { name: 'seats', label: 'Seats', type: 'number', half: true },
      { name: 'price', label: 'Price', type: 'localized' },
      { name: 'content', label: 'What we cover', type: 'localizedList' },
      { name: 'media', label: 'Images', type: 'mediaList' },
      { name: 'registrationUrl', label: 'Registration URL', type: 'text' },
      { name: 'relatedProjects', label: 'Related projects', type: 'relation', collection: 'projects' },
      { name: 'relatedServices', label: 'Related services', type: 'relation', collection: 'services' },
      ...PUBLISHING,
    ],
  },
};

/** Blank record for a new item, derived from the schema. */
export function emptyItem(schema: CollectionSchema): Record<string, unknown> {
  const item: Record<string, unknown> = { published: false };
  for (const field of schema.fields) {
    switch (field.type) {
      case 'localized':
      case 'localizedArea':
        item[field.name] = { ar: '', en: '' };
        break;
      case 'localizedList':
      case 'stringList':
      case 'mediaList':
      case 'relation':
      case 'objectList':
      case 'blocks':
        item[field.name] = [];
        break;
      case 'boolean':
        item[field.name] = false;
        break;
      case 'number':
        item[field.name] = 0;
        break;
      case 'media':
        item[field.name] = { src: '', kind: 'image', alt: { ar: '', en: '' } };
        break;
      case 'relationSingle':
        item[field.name] = null;
        break;
      case 'select':
        item[field.name] = field.options?.[0]?.value ?? '';
        break;
      default:
        item[field.name] = '';
    }
  }
  return item;
}

export const BLOCK_TYPES = [
  { value: 'heading', label: 'Heading' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'image', label: 'Image' },
  { value: 'imageFull', label: 'Full-width image' },
  { value: 'imagePair', label: 'Two images' },
  { value: 'imageTrio', label: 'Three images' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'video', label: 'Video' },
  { value: 'gif', label: 'GIF' },
  { value: 'quote', label: 'Quote' },
  { value: 'divider', label: 'Divider' },
  { value: 'textImage', label: 'Text + image' },
  { value: 'imageText', label: 'Image + text' },
  { value: 'button', label: 'Button / link' },
  { value: 'embed', label: 'Embed' },
] as const;
