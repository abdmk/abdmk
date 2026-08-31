'use client';

import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/icons';
import { ICON_PATHS } from '@/components/icons';
import type { Localized, Media, Settings, SocialLink } from '@/lib/content/types';
import { FieldInput, FieldLabel } from './Fields';
import { MediaPicker } from './MediaPicker';
import { SortableList } from './Sortable';

const INPUT = 'w-full border-0 border-b border-line bg-transparent py-2 outline-none focus:border-ink';
const ICON_NAMES = Object.keys(ICON_PATHS) as IconName[];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-6">
      <h2 className="mb-6 text-h3 font-medium">{title}</h2>
      <div className="grid max-w-4xl gap-7">{children}</div>
    </section>
  );
}

function LocalizedField({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: Localized;
  onChange: (value: Localized) => void;
  multiline?: boolean;
}) {
  const field = {
    name: label,
    label,
    type: multiline ? ('localizedArea' as const) : ('localized' as const),
  };
  return (
    <div>
      <FieldLabel field={field} />
      <FieldInput
        field={field}
        value={value}
        relations={{}}
        onChange={(v) => onChange(v as Localized)}
      />
    </div>
  );
}

/**
 * Site settings: identity, the About page, contact details, social links and
 * SEO defaults. These are one document rather than a collection, so they get a
 * purpose-built form instead of the schema-driven editor.
 */
export function SettingsEditor({ initial }: { initial: Settings }) {
  const router = useRouter();
  const [s, setS] = useState<Settings>(initial);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const patch = (next: Partial<Settings>) => {
    setS((current) => ({ ...current, ...next }));
    setStatus('idle');
  };
  const patchAbout = (next: Partial<Settings['about']>) =>
    patch({ about: { ...s.about, ...next } });
  const patchContact = (next: Partial<Settings['contact']>) =>
    patch({ contact: { ...s.contact, ...next } });

  async function save() {
    setStatus('saving');
    await fetch('/api/admin/collection/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s),
    });
    setStatus('saved');
    router.refresh();
  }

  const listField = (
    label: string,
    value: Localized[],
    onChange: (value: Localized[]) => void,
  ) => (
    <div>
      <FieldLabel field={{ name: label, label, type: 'localizedList' }} />
      <FieldInput
        field={{ name: label, label, type: 'localizedList' }}
        value={value}
        relations={{}}
        onChange={(v) => onChange(v as Localized[])}
      />
    </div>
  );

  return (
    <div className="pb-24">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-h1 font-light">Site settings</h1>
        <button
          type="button"
          onClick={() => void save()}
          disabled={status === 'saving'}
          className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-small font-medium text-paper disabled:opacity-50"
        >
          {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : 'Save'}
          <Icon name={status === 'saved' ? 'check' : 'download'} size={14} />
        </button>
      </div>

      <div className="space-y-12">
        <Section title="Identity">
          <LocalizedField label="Name" value={s.name} onChange={(v) => patch({ name: v })} />
          <LocalizedField label="Role" value={s.role} onChange={(v) => patch({ role: v })} />
          <LocalizedField
            label="Tagline (homepage headline)"
            value={s.tagline}
            onChange={(v) => patch({ tagline: v })}
          />
          <LocalizedField
            label="Hero statement"
            value={s.heroStatement}
            onChange={(v) => patch({ heroStatement: v })}
            multiline
          />
          <LocalizedField
            label="Short bio (footer)"
            value={s.shortBio}
            onChange={(v) => patch({ shortBio: v })}
            multiline
          />
        </Section>

        <Section title="About page">
          <div>
            <span className="label mb-1.5 block">Portrait</span>
            <MediaPicker
              value={s.about.portrait}
              onChange={(v) => patchAbout({ portrait: v as Media })}
            />
          </div>
          <LocalizedField
            label="Intro"
            value={s.about.intro}
            onChange={(v) => patchAbout({ intro: v })}
            multiline
          />
          {listField('Body paragraphs', s.about.body, (v) => patchAbout({ body: v }))}

          <div>
            <FieldLabel field={{ name: 'approach', label: 'Approach', type: 'objectList' }} />
            <FieldInput
              field={{
                name: 'approach',
                label: 'Approach',
                type: 'objectList',
                fields: [
                  { name: 'title', label: 'Title', type: 'localized' },
                  { name: 'text', label: 'Text', type: 'localizedArea' },
                ],
              }}
              value={s.about.approach}
              relations={{}}
              onChange={(v) => patchAbout({ approach: v as Settings['about']['approach'] })}
            />
          </div>

          <div>
            <FieldLabel field={{ name: 'tools', label: 'Tools', type: 'stringList' }} />
            <FieldInput
              field={{ name: 'tools', label: 'Tools', type: 'stringList' }}
              value={s.about.tools}
              relations={{}}
              onChange={(v) => patchAbout({ tools: v as string[] })}
            />
          </div>

          {listField('Interests', s.about.interests, (v) => patchAbout({ interests: v }))}

          <div>
            <FieldLabel field={{ name: 'achievements', label: 'Achievements', type: 'objectList' }} />
            <FieldInput
              field={{
                name: 'achievements',
                label: 'Achievements',
                type: 'objectList',
                fields: [
                  { name: 'year', label: 'Year', type: 'text', half: true },
                  { name: 'text', label: 'Text', type: 'localized' },
                ],
              }}
              value={s.about.achievements}
              relations={{}}
              onChange={(v) => patchAbout({ achievements: v as Settings['about']['achievements'] })}
            />
          </div>

          <div>
            <span className="label mb-1.5 block">CV URL</span>
            <input
              value={s.about.cvUrl ?? ''}
              onChange={(e) => patchAbout({ cvUrl: e.target.value || undefined })}
              aria-label="CV URL"
              dir="ltr"
              className={INPUT}
            />
          </div>
        </Section>

        <Section title="Contact">
          <div className="grid gap-6 sm:grid-cols-3">
            {(['email', 'phone', 'whatsapp'] as const).map((key) => (
              <div key={key}>
                <span className="label mb-1.5 block">{key}</span>
                <input
                  value={s.contact[key] ?? ''}
                  onChange={(e) => patchContact({ [key]: e.target.value } as Partial<Settings['contact']>)}
                  aria-label={key}
                  dir="ltr"
                  className={INPUT}
                />
              </div>
            ))}
          </div>
          <LocalizedField
            label="Location"
            value={s.contact.location}
            onChange={(v) => patchContact({ location: v })}
          />
          <LocalizedField
            label="Availability"
            value={s.contact.availability}
            onChange={(v) => patchContact({ availability: v })}
          />
          {listField('Project types (form dropdown)', s.contact.projectTypes, (v) =>
            patchContact({ projectTypes: v }),
          )}
          {listField('Budgets (form dropdown)', s.contact.budgets, (v) =>
            patchContact({ budgets: v }),
          )}
        </Section>

        <Section title="Social links">
          <div>
            <p className="mb-3 text-small text-muted">
              Icons come from the Flaticon UIcons set bundled with the site. Pick one of the
              available names.
            </p>
            <SortableList
              items={s.social}
              onReorder={(social) => patch({ social })}
              keyOf={(item, i) => `${item.href}-${i}`}
              label={(item) => item.label || item.icon}
              actions={(_, index) => (
                <button
                  type="button"
                  onClick={() => patch({ social: s.social.filter((_, k) => k !== index) })}
                  aria-label="Remove"
                  className="grid h-7 w-7 place-items-center text-faint hover:text-accent"
                >
                  <Icon name="trash" size={13} />
                </button>
              )}
            >
              {(item, index) => {
                const set = (next: Partial<SocialLink>) =>
                  patch({
                    social: s.social.map((row, k) => (k === index ? { ...row, ...next } : row)),
                  });
                return (
                  <div className="grid items-end gap-4 sm:grid-cols-3">
                    <div>
                      <span className="label mb-1 block">Icon</span>
                      <select
                        value={item.icon}
                        onChange={(e) => set({ icon: e.target.value })}
                        aria-label={`Social link ${index + 1} icon`}
                        className={INPUT}
                      >
                        {ICON_NAMES.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="label mb-1 block">Label</span>
                      <input
                        value={item.label}
                        onChange={(e) => set({ label: e.target.value })}
                        aria-label={`Social link ${index + 1} label`}
                        className={INPUT}
                      />
                    </div>
                    <div>
                      <span className="label mb-1 block">URL</span>
                      <input
                        value={item.href}
                        onChange={(e) => set({ href: e.target.value })}
                        aria-label={`Social link ${index + 1} URL`}
                        dir="ltr"
                        className={INPUT}
                      />
                    </div>
                  </div>
                );
              }}
            </SortableList>
            <button
              type="button"
              onClick={() =>
                patch({ social: [...s.social, { icon: 'instagram', label: '', href: '' }] })
              }
              className="mt-3 inline-flex items-center gap-2 border border-line px-3 py-2 text-small hover:border-ink"
            >
              <Icon name="plus" size={13} />
              Add link
            </button>
          </div>
        </Section>

        <Section title="SEO">
          <div>
            <span className="label mb-1.5 block">Site URL</span>
            <input
              value={s.seo.siteUrl}
              onChange={(e) => patch({ seo: { ...s.seo, siteUrl: e.target.value } })}
              aria-label="Site URL"
              dir="ltr"
              className={INPUT}
            />
            <p className="mt-1.5 text-meta text-faint">
              Used for canonical URLs, Open Graph images and the sitemap.
            </p>
          </div>
          <LocalizedField
            label="Default title"
            value={s.seo.title}
            onChange={(v) => patch({ seo: { ...s.seo, title: v } })}
          />
          <LocalizedField
            label="Default description"
            value={s.seo.description}
            onChange={(v) => patch({ seo: { ...s.seo, description: v } })}
            multiline
          />
        </Section>
      </div>
    </div>
  );
}
