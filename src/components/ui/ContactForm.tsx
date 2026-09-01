'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { Icon } from '@/components/icons';
import type { Lang, Settings } from '@/lib/content/types';
import { t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'sent' | 'error';

interface ContactFormProps {
  settings: Settings;
  lang: Lang;
  /** Slug → label, so a service page can pre-select what the enquiry is about. */
  serviceLabels: Record<string, string>;
}

const FIELD =
  'w-full rounded-xl2 border border-line bg-sunken px-4 py-3.5 text-body outline-none ' +
  'transition-colors duration-300 placeholder:text-faint/70 ' +
  'hover:border-line-strong focus:border-ink focus:bg-surface';

export function ContactForm({ settings, lang, serviceLabels }: ContactFormProps) {
  const tr = ui(lang);
  const params = useSearchParams();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [projectType, setProjectType] = useState('');

  // Arriving from a service page pre-fills what the enquiry is about.
  useEffect(() => {
    const service = params.get('service');
    if (service && serviceLabels[service]) setProjectType(serviceLabels[service]);
  }, [params, serviceLabels]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const next: Record<string, string> = {};
    if (!data.name?.trim()) next.name = tr.contact.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? '')) next.email = tr.contact.errors.email;
    if (!data.message?.trim()) next.message = tr.contact.errors.message;
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, lang }),
      });
      if (!response.ok) throw new Error('request failed');
      setStatus('sent');
      form.reset();
      setProjectType('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center" role="status">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-sunken text-ink">
          <Icon name="check" size={24} />
        </span>
        <p className="text-h3">{tr.contact.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label htmlFor="name" className="label mb-1 block">
          {tr.contact.name}
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={cn(FIELD, errors.name && 'border-accent')}
        />
        {errors.name ? (
          <p id="name-error" className="mt-2 text-small text-accent">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div className="sm:col-span-1">
        <label htmlFor="email" className="label mb-1 block">
          {tr.contact.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          dir="ltr"
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={cn(FIELD, 'text-start', errors.email && 'border-accent')}
        />
        {errors.email ? (
          <p id="email-error" className="mt-2 text-small text-accent">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="sm:col-span-1">
        <label htmlFor="projectType" className="label mb-1 block">
          {tr.contact.projectType}
        </label>
        <select
          id="projectType"
          name="projectType"
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          className={cn(FIELD, 'appearance-none')}
        >
          <option value="">{tr.contact.select}</option>
          {settings.contact.projectTypes.map((option, i) => (
            <option key={i} value={t(option, lang)}>
              {t(option, lang)}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-1">
        <label htmlFor="budget" className="label mb-1 block">
          {tr.contact.budget}
        </label>
        <select id="budget" name="budget" className={cn(FIELD, 'appearance-none')}>
          <option value="">{tr.contact.select}</option>
          {settings.contact.budgets.map((option, i) => (
            <option key={i} value={t(option, lang)}>
              {t(option, lang)}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="message" className="label mb-1 block">
          {tr.contact.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={cn(FIELD, 'resize-y', errors.message && 'border-accent')}
        />
        {errors.message ? (
          <p id="message-error" className="mt-2 text-small text-accent">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot: a real person never fills this in. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="mt-2 flex flex-wrap items-center gap-5 sm:col-span-2">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn btn-primary btn-lg disabled:opacity-50"
        >
          {status === 'sending' ? tr.contact.sending : tr.contact.send}
          <Icon name="arrowRight" size={16} flipRtl />
        </button>
        {status === 'error' ? (
          <p role="alert" className="text-small text-accent">
            {tr.contact.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
