import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Icon, type IconName } from '@/components/icons';
import { ContactForm } from '@/components/ui/ContactForm';
import { InquiryForm } from '@/components/ui/InquiryForm';
import { SocialLinks } from '@/components/layout/SocialLinks';
import { PageHeader } from '@/components/ui/PageHeader';
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
    <div className="shell pb-section pt-6 sm:pt-8">
      <PageHeader
        title={tr.contact.title}
        intro={tr.contact.intro}
        hues={['mint', 'peach', 'lilac']}
        className="mb-9 md:mb-12"
      />

      <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7 space-y-5 lg:space-y-6">
          <InquiryForm lang={lang} services={services} />
          <div className="card p-6 sm:p-8 lg:p-10">
            <Suspense fallback={<p className="text-muted">{tr.common.loading}</p>}>
              <ContactForm settings={settings} lang={lang} serviceLabels={serviceLabels} />
            </Suspense>
          </div>
        </div>

        <aside className="flex flex-col gap-4 lg:col-span-5 lg:gap-5">
          <div className="card p-6 sm:p-7">
            <h2 className="text-h3">{tr.contact.elsewhere}</h2>
            <ul className="mt-5 list-none space-y-2 p-0">
              {direct.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                    className="group flex items-center gap-3.5 rounded-xl2 bg-sunken px-4 py-3.5 transition-colors duration-300 hover:bg-ink"
                  >
                    <Icon
                      name={item.icon}
                      size={17}
                      className="text-faint transition-colors group-hover:text-surface"
                    />
                    <span
                      className="text-small transition-colors group-hover:text-surface"
                      dir="ltr"
                    >
                      {item.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <SocialLinks links={settings.social} className="mt-5" />
          </div>

          <div className="card p-6 sm:p-7">
            <h2 className="label mb-2">{tr.contact.availability}</h2>
            <p className="text-small text-muted">{t(settings.contact.availability, lang)}</p>

            <h2 className="label mb-2 mt-6 inline-flex items-center gap-2">
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
