import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Admin session.
 *
 * A single shared password (ADMIN_PASSWORD) exchanged for an HMAC-signed cookie.
 * This is a single-author CMS, so there are no user accounts to manage; the
 * signing means the cookie cannot be forged without ADMIN_SECRET.
 */

const COOKIE = 'admin_session';
const MAX_AGE = 60 * 60 * 12; // 12 hours

function secret(): string {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || 'dev-only-insecure-secret';
}

function sign(expiry: number): string {
  return createHmac('sha256', secret()).update(String(expiry)).digest('hex');
}

/** Constant-time compare that tolerates length differences. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  // Without a configured password the admin is open in development only —
  // a deployment with no ADMIN_PASSWORD set refuses every login instead.
  if (!expected) return process.env.NODE_ENV !== 'production';
  return safeEqual(input, expected);
}

export function makeToken(): { value: string; maxAge: number } {
  const expiry = Date.now() + MAX_AGE * 1000;
  return { value: `${expiry}.${sign(expiry)}`, maxAge: MAX_AGE };
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expiryPart, signature] = token.split('.');
  const expiry = Number(expiryPart);
  if (!expiry || !signature || Number.isNaN(expiry)) return false;
  if (expiry < Date.now()) return false;
  return safeEqual(signature, sign(expiry));
}

export const SESSION_COOKIE = COOKIE;

/** Is the current request authenticated? For server components and route handlers. */
export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(COOKIE)?.value);
}

/** Guard for admin API routes. Returns a 401 Response when not signed in. */
export async function requireAuth(): Promise<Response | null> {
  if (await isAuthed()) return null;
  return new Response(JSON.stringify({ error: 'unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
