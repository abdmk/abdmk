import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Icon, type IconName } from '@/components/icons';
import { ContactForm } from '@/components/ui/ContactForm';
import { SocialLinks } from '@/components/layout/SocialLinks';
import { services as getServices, settings as getSettings } from '@/lib/content/queries';
import type { Lang } from '@/lib/content/types';
import { t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const tr = ui(lang);
  return {
    title: tr.contact.title,
    description: tr.contact.intro,
    alternates: {
      canonical: `/${lang}/contact`,
      languages: { ar: '/ar/contact', en: '/en/contact' },
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const tr = ui(lang);
  const [settings, services] = await Promise.all([getSettings(), getServices()]);

  const serviceLabels = Object.fromEntries(
    services.map((service) => [service.slug, t(service.name, lang)]),
  );

  const direct: { icon: IconName; label: string; value: string; href: string }[] = [
    {
      icon: 'email',
      label: tr.contact.email,
      value: settings.contact.email,
      href: `mailto:${settings.contact.email}`,
    },
    ...(settings.contact.whatsapp
      ? [
          {
            icon: 'whatsapp' as IconName,
            label: 'WhatsApp',
            value: settings.contact.whatsapp,
            href: `https://wa.me/${settings.contact.whatsapp.replace(/[^\d]/g, '')}`,
          },
        ]
      : []),
    ...(settings.contact.phone
      ? [
          {
            icon: 'phone' as IconName,
            label: tr.contact.title,
            value: settings.contact.phone,
            href: `tel:${settings.contact.phone.replace(/\s/g, '')}`,
          },
        ]
      : []),
  ];

  return (
    <div className="shell py-14 md:py-20">
      <header className="mb-14 md:mb-20">
        <h1 className="text-display font-light">{tr.contact.title}</h1>
        <p className="mt-6 max-w-prose text-lead text-muted">{tr.contact.intro}</p>
      </header>

      <div className="grid gap-14 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          <Suspense fallback={<p className="text-muted">{tr.common.loading}</p>}>
            <ContactForm settings={settings} lang={lang} serviceLabels={serviceLabels} />
          </Suspense>
        </div>

        <aside className="md:col-span-4 md:col-start-9">
          <h2 className="label mb-4">{tr.contact.elsewhere}</h2>
          <ul className="list-none border-t border-line p-0">
            {direct.map((item) => (
              <li key={item.href} className="border-b border-line">
                <a
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                  className="flex items-center gap-3.5 py-3.5 transition-opacity hover:opacity-60"
                >
                  <Icon name={item.icon} size={17} className="text-faint" />
                  <span className="text-small" dir="ltr">
                    {item.value}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <SocialLinks links={settings.social} className="-ms-2.5 mt-5" />

          <div className="mt-10 border-t border-line pt-5">
            <h2 className="label mb-2">{tr.contact.availability}</h2>
            <p className="text-small text-muted">{t(settings.contact.availability, lang)}</p>
          </div>

          <div className="mt-8 border-t border-line pt-5">
            <h2 className="label mb-2 inline-flex items-center gap-2">
              <Icon name="location" size={13} />
              {tr.companies.type}
            </h2>
            <p className="text-small text-muted">{t(settings.contact.location, lang)}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
