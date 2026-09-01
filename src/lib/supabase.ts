import 'server-only';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

interface QueryOptions {
  table: string;
  select?: string;
  filters?: Record<string, string | number | boolean>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
}

async function supabaseRequest(
  path: string,
  options: RequestInit = {},
  useServiceKey = true,
): Promise<Response> {
  const key = useServiceKey ? SUPABASE_SERVICE_KEY : SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !key) {
    throw new Error('Supabase credentials not configured');
  }
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: options.method === 'POST' ? 'return=representation' : 'return=minimal',
      ...options.headers,
    },
  });
}

export async function query<T = unknown>(opts: QueryOptions): Promise<T[]> {
  const params = new URLSearchParams();
  if (opts.select) params.set('select', opts.select);
  if (opts.filters) {
    for (const [key, val] of Object.entries(opts.filters)) {
      params.set(key, `eq.${val}`);
    }
  }
  if (opts.order) {
    params.set('order', `${opts.order.column}.${opts.order.ascending ? 'asc' : 'desc'}`);
  }
  if (opts.limit) params.set('limit', String(opts.limit));
  if (opts.offset) params.set('offset', String(opts.offset));

  const res = await supabaseRequest(`${opts.table}?${params}`, { next: { revalidate: 0 } });
  if (!res.ok) return [];
  return res.json();
}

export async function insert<T = unknown>(table: string, data: Record<string, unknown>): Promise<T | null> {
  const res = await supabaseRequest(table, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  const rows = await res.json();
  return Array.isArray(rows) ? rows[0] : rows;
}

export async function update(
  table: string,
  filters: Record<string, string | number>,
  data: Record<string, unknown>,
): Promise<boolean> {
  const params = new URLSearchParams();
  for (const [key, val] of Object.entries(filters)) {
    params.set(key, `eq.${val}`);
  }
  const res = await supabaseRequest(`${table}?${params}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.ok;
}

export async function rpc(fn: string, args: Record<string, unknown> = {}): Promise<unknown> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  if (!res.ok) return null;
  return res.json();
}

export { SUPABASE_URL, SUPABASE_ANON_KEY };
