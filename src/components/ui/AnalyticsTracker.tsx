'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function AnalyticsTracker({
  entityType,
  entitySlug,
}: {
  entityType?: string;
  entitySlug?: string;
}) {
  const pathname = usePathname();
  const tracked = useRef('');

  useEffect(() => {
    const key = `${pathname}:${entityType}:${entitySlug}`;
    if (tracked.current === key) return;
    tracked.current = key;

    const sid = sessionStorage.getItem('_sid') || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem('_sid', sid);

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sid,
        eventType: 'pageview',
        pagePath: pathname,
        referrer: document.referrer || null,
        language: navigator.language || null,
        screenWidth: window.innerWidth,
        deviceType: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
        entityType: entityType || null,
        entitySlug: entitySlug || null,
      }),
    }).catch(() => {});
  }, [pathname, entityType, entitySlug]);

  return null;
}
