import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyWebhook } from '@/lib/paymongo';

export async function POST(req) {
  const raw = await req.text();
  if (!verifyWebhook(raw, req.headers.get('paymongo-signature'))) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }
  const event = JSON.parse(raw);
  const type = event?.data?.attributes?.type;
  const resource = event?.data?.attributes?.data;
  if (type === 'checkout_session.payment.paid' && resource?.id) {
    const sql = await db();
    await sql`UPDATE bookings SET payment_status = 'paid',
      status = CASE WHEN status = 'pending' THEN 'confirmed' ELSE status END
      WHERE paymongo_session_id = ${resource.id}`;
  }
  return NextResponse.json({ received: true });
}
