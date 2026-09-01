import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.courseSlug || !body?.priceAmount || !body?.currency) {
    return NextResponse.json({ error: 'missing course data' }, { status: 400 });
  }

  const origin = request.headers.get('origin') || 'http://localhost:3000';

  const params = new URLSearchParams();
  params.set('mode', 'payment');
  params.set('success_url', `${origin}/ar/course/${body.courseSlug}?enrolled=true`);
  params.set('cancel_url', `${origin}/ar/course/${body.courseSlug}`);
  params.set('line_items[0][price_data][currency]', body.currency.toLowerCase());
  params.set('line_items[0][price_data][product_data][name]', body.courseName || body.courseSlug);
  params.set('line_items[0][price_data][unit_amount]', String(body.priceAmount));
  params.set('line_items[0][quantity]', '1');
  if (body.userEmail) params.set('customer_email', body.userEmail);
  params.set('metadata[course_slug]', body.courseSlug);
  if (body.userId) params.set('metadata[user_id]', body.userId);

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const session = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: session.error?.message || 'Stripe error' }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
