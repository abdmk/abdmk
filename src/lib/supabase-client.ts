'use client';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sid = sessionStorage.getItem('_sid');
  if (!sid) {
    sid = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem('_sid', sid);
  }
  return sid;
}

export async function trackEvent(
  eventType: string,
  pagePath: string,
  extra: Record<string, unknown> = {},
) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/analytics_events`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        session_id: getSessionId(),
        event_type: eventType,
        page_path: pagePath,
        referrer: document.referrer || null,
        language: navigator.language || null,
        screen_width: window.innerWidth,
        device_type:
          window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
        ...extra,
      }),
    });
  } catch {
    // tracking is best-effort
  }
}

export function trackPageView(pagePath: string, entityType?: string, entitySlug?: string) {
  trackEvent('pageview', pagePath, {
    entity_type: entityType || null,
    entity_slug: entitySlug || null,
  });
}

export function trackClick(pagePath: string, action: string, entityType?: string, entitySlug?: string) {
  trackEvent('click', pagePath, {
    entity_type: entityType || null,
    entity_slug: entitySlug || null,
    meta: { action },
  });
}
