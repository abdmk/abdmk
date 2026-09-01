import { NextResponse } from 'next/server';
import { insert } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.sessionId || !body?.pagePath) {
    return NextResponse.json({ error: 'missing data' }, { status: 400 });
  }

  // Get geo info from headers if available
  const country = request.headers.get('cf-ipcountry') ||
                   request.headers.get('x-vercel-ip-country') || null;
  const city = request.headers.get('x-vercel-ip-city') || null;

  await insert('analytics_events', {
    session_id: body.sessionId,
    event_type: body.eventType || 'pageview',
    page_path: body.pagePath,
    referrer: body.referrer || null,
    country,
    city,
    device_type: body.deviceType || null,
    browser: body.browser || null,
    os: body.os || null,
    language: body.language || null,
    screen_width: body.screenWidth || null,
    entity_type: body.entityType || null,
    entity_slug: body.entitySlug || null,
    utm_source: body.utmSource || null,
    utm_medium: body.utmMedium || null,
    utm_campaign: body.utmCampaign || null,
    meta: body.meta || {},
  });

  return NextResponse.json({ ok: true });
}
