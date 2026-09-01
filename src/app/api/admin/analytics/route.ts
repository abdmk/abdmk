import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/supabase';

export async function GET(request: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get('days') || 30);

  const since = new Date();
  since.setDate(since.getDate() - days);

  // Get all events in the period
  const events = await query<{
    id: number;
    session_id: string;
    event_type: string;
    page_path: string;
    entity_type: string | null;
    entity_slug: string | null;
    device_type: string | null;
    browser: string | null;
    country: string | null;
    language: string | null;
    created_at: string;
    meta: Record<string, unknown> | null;
  }>({
    table: 'analytics_events',
    select: '*',
    order: { column: 'created_at', ascending: false },
    limit: 10000,
  });

  // Filter by date client-side (Supabase REST doesn't support gt/lt in our simple wrapper)
  const filtered = events.filter(e => new Date(e.created_at) >= since);

  const pageviews = filtered.filter(e => e.event_type === 'pageview');
  const clicks = filtered.filter(e => e.event_type === 'click');
  const uniqueSessions = new Set(pageviews.map(e => e.session_id)).size;

  // Top pages
  const pageCounts: Record<string, number> = {};
  for (const e of pageviews) {
    pageCounts[e.page_path] = (pageCounts[e.page_path] || 0) + 1;
  }
  const topPages = Object.entries(pageCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([path, views]) => ({ path, views }));

  // Top projects
  const projectViews: Record<string, number> = {};
  for (const e of pageviews) {
    if (e.entity_type === 'project' && e.entity_slug) {
      projectViews[e.entity_slug] = (projectViews[e.entity_slug] || 0) + 1;
    }
  }
  const topProjects = Object.entries(projectViews)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([slug, views]) => ({ slug, views }));

  // Top services
  const serviceViews: Record<string, number> = {};
  for (const e of pageviews) {
    if (e.entity_type === 'service' && e.entity_slug) {
      serviceViews[e.entity_slug] = (serviceViews[e.entity_slug] || 0) + 1;
    }
  }
  const topServices = Object.entries(serviceViews)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([slug, views]) => ({ slug, views }));

  // Devices
  const devices: Record<string, number> = {};
  for (const e of pageviews) {
    const d = e.device_type || 'unknown';
    devices[d] = (devices[d] || 0) + 1;
  }

  // Countries
  const countries: Record<string, number> = {};
  for (const e of pageviews) {
    const c = e.country || 'Unknown';
    countries[c] = (countries[c] || 0) + 1;
  }
  const topCountries = Object.entries(countries)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([country, views]) => ({ country, views }));

  // CTA clicks
  const ctaClicks = clicks.filter(e => e.meta && (e.meta as Record<string, unknown>).action === 'cta').length;
  const contactClicks = clicks.filter(e => e.meta && (e.meta as Record<string, unknown>).action === 'contact').length;

  return NextResponse.json({
    totalViews: pageviews.length,
    uniqueVisitors: uniqueSessions,
    ctaClicks,
    contactClicks,
    topPages,
    topProjects,
    topServices,
    devices,
    topCountries,
  });
}
