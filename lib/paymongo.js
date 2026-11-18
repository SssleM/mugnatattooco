import 'server-only';
import crypto from 'node:crypto';

const API = 'https://api.paymongo.com/v1';

export const paymongoEnabled = () => Boolean(process.env.PAYMONGO_SECRET_KEY);

function authHeader() {
  return 'Basic ' + Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64');
}

/** Creates a PayMongo Checkout Session limited to GCash for the booking deposit. */
export async function createGcashCheckout({ booking, baseUrl }) {
  const res = await fetch(`${API}/checkout_sessions`, {
    method: 'POST',
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      data: {
        attributes: {
          line_items: [
            {
              name: `Booking deposit – ${booking.service_name}`,
              amount: booking.deposit * 100, // centavos
              currency: 'PHP',
              quantity: 1,
            },
          ],
          payment_method_types: ['gcash'],
          description: `MUGNA Tattoo Co. booking ${booking.code}`,
          reference_number: booking.code,
          send_email_receipt: Boolean(booking.email),
          billing: booking.email ? { name: booking.name, email: booking.email, phone: booking.phone } : undefined,
          success_url: `${baseUrl}/book/success?code=${booking.code}`,
          cancel_url: `${baseUrl}/book/success?code=${booking.code}&cancelled=1`,
          metadata: { booking_code: booking.code },
        },
      },
    }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.errors?.[0]?.detail || 'Could not start GCash checkout.');
  }
  return { id: json.data.id, url: json.data.attributes.checkout_url };
}

/** Returns true when the checkout session has a paid payment. */
export async function isCheckoutPaid(sessionId) {
  const res = await fetch(`${API}/checkout_sessions/${sessionId}`, {
    headers: { Authorization: authHeader(), Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) return false;
  const json = await res.json();
  const attrs = json?.data?.attributes || {};
  const paid = (attrs.payments || []).some((p) => p?.attributes?.status === 'paid');
  return paid || attrs.payment_intent?.attributes?.status === 'succeeded';
}

/** Verifies the Paymongo-Signature header of a webhook. */
export function verifyWebhook(rawBody, header) {
  const secret = process.env.PAYMONGO_WEBHOOK_SECRET;
  if (!secret || !header) return false;
  const parts = Object.fromEntries(header.split(',').map((kv) => kv.split('=')));
  const expected = crypto.createHmac('sha256', secret).update(`${parts.t}.${rawBody}`).digest('hex');
  const given = parts.li || parts.te;
  return Boolean(given) && given.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}
