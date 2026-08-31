'use client';

import { useEffect, useState } from 'react';
import { Icon, type IconName } from '@/components/icons';
import type { Lang } from '@/lib/content/types';
import { ui } from '@/lib/i18n/dictionary';

interface ShareBarProps {
  title: string;
  /** Absolute or root-relative; resolved against the live origin at click time. */
  path: string;
  lang: Lang;
}

const TARGETS: { icon: IconName; label: string; url: (u: string, t: string) => string }[] = [
  { icon: 'x', label: 'X', url: (u, t) => `https://x.com/intent/tweet?url=${u}&text=${t}` },
  {
    icon: 'linkedin',
    label: 'LinkedIn',
    url: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
  },
  { icon: 'whatsapp', label: 'WhatsApp', url: (u, t) => `https://wa.me/?text=${t}%20${u}` },
  { icon: 'telegram', label: 'Telegram', url: (u, t) => `https://t.me/share/url?url=${u}&text=${t}` },
];

/**
 * Share row. Uses the native share sheet where the device offers one (mobile),
 * and falls back to per-network links plus copy-to-clipboard everywhere else.
 */
export function ShareBar({ title, path, lang }: ShareBarProps) {
  const t = ui(lang);
  const [url, setUrl] = useState(path);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setUrl(new URL(path, window.location.origin).toString());
    setCanShare(typeof navigator.share === 'function');
  }, [path]);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard can be blocked; the link is visible in the address bar anyway.
    }
  };

  const e = encodeURIComponent;

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <span className="label">{t.project.share}</span>

      <div className="flex items-center gap-1">
        {canShare ? (
          <button
            type="button"
            onClick={() => void navigator.share({ title, url }).catch(() => undefined)}
            aria-label={t.project.share}
            className="grid h-10 w-10 place-items-center transition-opacity hover:opacity-55"
          >
            <Icon name="share" size={17} />
          </button>
        ) : null}

        {TARGETS.map((target) => (
          <a
            key={target.label}
            href={target.url(e(url), e(title))}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={target.label}
            className="grid h-10 w-10 place-items-center transition-opacity hover:opacity-55"
          >
            <Icon name={target.icon} size={17} />
          </a>
        ))}

        <button
          type="button"
          onClick={copy}
          className="inline-flex h-10 items-center gap-2 px-2 text-small transition-opacity hover:opacity-55"
        >
          <Icon name={copied ? 'check' : 'copy'} size={17} />
          <span>{copied ? t.project.copied : t.project.copyLink}</span>
        </button>
      </div>
    </div>
  );
}
