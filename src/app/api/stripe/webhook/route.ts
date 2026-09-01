import { NextResponse } from 'next/server';
import { createHmac } from 'node:crypto';
import { insert } from '@/lib/supabase';

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await request.text();

  // Verify webhook signature if secret is configured
  if (webhookSecret) {
    const sig = request.headers.get('stripe-signature') || '';
    const parts = Object.fromEntries(
      sig.split(',').map(p => { const [k, v] = p.split('='); return [k, v]; })
    );
    const timestamp = parts.t;
    const expected = createHmac('sha256', webhookSecret)
      .update(`${timestamp}.${body}`)
      .digest('hex');
    if (parts.v1 !== expected) {
      return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
    }
  }

  const event = JSON.parse(body);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const courseSlug = session.metadata?.course_slug;
    const userId = session.metadata?.user_id;

    if (courseSlug && userId) {
      await insert('enrollments', {
        user_id: userId,
        course_slug: courseSlug,
        payment_status: 'paid',
        stripe_payment_id: session.payment_intent,
        stripe_session_id: session.id,
        amount: session.amount_total,
        currency: session.currency?.toUpperCase() || 'USD',
      });
    }
  }

  return NextResponse.json({ received: true });
}
