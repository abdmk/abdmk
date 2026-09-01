'use client';

import { useState } from 'react';
import type { Lang, Service } from '@/lib/content/types';
import { Icon } from '@/components/icons';
import { t } from '@/lib/i18n/config';

export function InquiryForm({
  lang,
  services,
  preSelectedService,
  preSelectedPackage,
}: {
  lang: Lang;
  services: Service[];
  preSelectedService?: string;
  preSelectedPackage?: string;
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    serviceSlug: preSelectedService || '',
    packageName: preSelectedPackage || '',
    budget: '',
    deadline: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const tr = {
    ar: {
      title: 'ابدأ مشروعك',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      company: 'الشركة',
      service: 'نوع الخدمة',
      package: 'الباقة',
      budget: 'الميزانية التقريبية',
      deadline: 'موعد التسليم',
      message: 'تفاصيل المشروع',
      send: 'إرسال',
      sending: 'جاري الإرسال...',
      sent: 'تم الإرسال بنجاح!',
      sentDesc: 'شكرًا لتواصلك. سأرد عليك قريبًا.',
      error: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
      selectService: 'اختر الخدمة',
      selectPackage: 'اختر الباقة',
      selectBudget: 'اختر الميزانية',
    },
    en: {
      title: 'Start Your Project',
      name: 'Name',
      email: 'Email',
      company: 'Company',
      service: 'Service type',
      package: 'Package',
      budget: 'Approximate budget',
      deadline: 'Delivery date',
      message: 'Project details',
      send: 'Send',
      sending: 'Sending...',
      sent: 'Successfully sent!',
      sentDesc: 'Thank you for reaching out. I will get back to you soon.',
      error: 'An error occurred. Please try again.',
      selectService: 'Select service',
      selectPackage: 'Select package',
      selectBudget: 'Select budget',
    },
  }[lang];

  const budgets = [
    { ar: 'أقل من ٥٠٠٠ دولار', en: 'Under $5,000' },
    { ar: '٥٬٠٠٠ — ١٥٬٠٠٠ دولار', en: '$5,000 — $15,000' },
    { ar: '١٥٬٠٠٠ — ٤٠٬٠٠٠ دولار', en: '$15,000 — $40,000' },
    { ar: 'أكثر من ٤٠٬٠٠٠ دولار', en: 'Over $40,000' },
    { ar: 'غير محدد بعد', en: 'Not sure yet' },
  ];

  const selectedService = services.find(s => s.slug === form.serviceSlug);
  const packages = selectedService?.packages?.filter(p => p.visible) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) setStatus('sent');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-ink text-paper">
          <Icon name="check" size={20} />
        </div>
        <h3 className="text-h3 font-medium">{tr.sent}</h3>
        <p className="mt-2 text-muted">{tr.sentDesc}</p>
      </div>
    );
  }

  const inputClass = 'w-full border-0 border-b border-line bg-transparent px-0 py-3 text-body outline-none focus:border-ink transition-colors';
  const labelClass = 'label mb-1.5 block';

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
      <h3 className="text-h2 font-medium mb-8">{tr.title}</h3>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass}>{tr.name} *</label>
          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{tr.email} *</label>
          <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{tr.company}</label>
          <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{tr.service}</label>
          <select value={form.serviceSlug} onChange={e => setForm({...form, serviceSlug: e.target.value, packageName: ''})} className={inputClass}>
            <option value="">{tr.selectService}</option>
            {services.map(s => (
              <option key={s.slug} value={s.slug}>{t(s.name, lang)}</option>
            ))}
          </select>
        </div>
        {packages.length > 0 && (
          <div>
            <label className={labelClass}>{tr.package}</label>
            <select value={form.packageName} onChange={e => setForm({...form, packageName: e.target.value})} className={inputClass}>
              <option value="">{tr.selectPackage}</option>
              {packages.map(p => (
                <option key={p.id} value={p.id}>{t(p.name, lang)}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className={labelClass}>{tr.budget}</label>
          <select value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} className={inputClass}>
            <option value="">{tr.selectBudget}</option>
            {budgets.map((b, i) => (
              <option key={i} value={b.en}>{t(b, lang)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>{tr.deadline}</label>
          <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{tr.message} *</label>
          <textarea required rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className={`${inputClass} resize-y`} />
        </div>
      </div>

      {status === 'error' && (
        <p className="mt-4 text-small text-accent">{tr.error}</p>
      )}

      <button type="submit" disabled={status === 'sending'} className="btn btn-primary btn-lg mt-8 w-full sm:w-auto">
        {status === 'sending' ? tr.sending : tr.send}
        <Icon name="arrowRight" size={16} />
      </button>
    </form>
  );
}
