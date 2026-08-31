import { NextResponse } from 'next/server';

/**
 * Contact form endpoint.
 *
 * Validates and logs the enquiry. There is no mail provider wired up — that is a
 * deployment decision (Resend, Postmark, SES, a webhook into a CRM), so the
 * hand-off point is marked below and the rest of the flow is finished around it.
 */

interface Enquiry {
  name?: string;
  email?: string;
  projectType?: string;
  budget?: string;
  message?: string;
  lang?: string;
  /** Honeypot — populated only by bots. */
  company?: string;
}

const MAX = { name: 120, email: 200, message: 5000 };

export async function POST(request: Request) {
  let body: Enquiry;
  try {
    body = (await request.json()) as Enquiry;
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  // Silently accept honeypot hits so bots get no signal from the response.
  if (body.company) return NextResponse.json({ ok: true });

  const name = body.name?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const message = body.message?.trim() ?? '';

  const invalid =
    !name ||
    name.length > MAX.name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > MAX.email ||
    !message ||
    message.length > MAX.message;

  if (invalid) {
    return NextResponse.json({ error: 'validation failed' }, { status: 422 });
  }

  // ---------------------------------------------------------------------------
  // Wire a mail provider in here, e.g.
  //   await resend.emails.send({ to: OWNER, replyTo: email, subject, text });
  // Until then the enquiry is logged so nothing is lost while testing locally.
  // ---------------------------------------------------------------------------
  console.info('[contact] new enquiry', {
    name,
    email,
    projectType: body.projectType ?? '—',
    budget: body.budget ?? '—',
    lang: body.lang ?? '—',
    message: message.slice(0, 400),
  });

  return NextResponse.json({ ok: true });
}
