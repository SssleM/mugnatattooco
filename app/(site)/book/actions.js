'use server';
import crypto from 'node:crypto';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { getArtists, getSettings, getTakenSlots } from '@/lib/data';
import { saveImage } from '@/lib/storage';
import { checkDate, takenSlots } from '@/lib/booking-rules';
import { createGcashCheckout, paymongoEnabled } from '@/lib/paymongo';

const str = (v, max = 500) => String(v ?? '').trim().slice(0, max);

function makeCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(6);
  return 'MUG-' + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

async function baseUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || (host?.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

export async function createBooking(_prev, fd) {
  try {
    if (fd.get('company')) return { error: 'Something went wrong.' }; // honeypot

    const settings = await getSettings();
    const sql = await db();

    const serviceId = Number(fd.get('service_id'));
    const [service] = await sql`SELECT * FROM services WHERE id = ${serviceId} AND active`;
    if (!service) return { error: 'Please choose a service.', step: 0 };

    const locationType = fd.get('location_type') === 'home' ? 'home' : 'studio';
    const address = str(fd.get('address'), 400);
    if (locationType === 'home' && address.length < 10) return { error: 'Please enter your full address for home service.', step: 0 };

    const artistId = Number(fd.get('artist_id')) || null;
    const artists = await getArtists();
    if (artistId && !artists.some((a) => a.id === artistId)) return { error: 'Please choose an artist.', step: 1 };

    const date = str(fd.get('date'), 10);
    const time = str(fd.get('time'), 5);
    const dateErr = checkDate(date, settings.booking);
    if (dateErr) return { error: dateErr, step: 1 };
    if (!settings.booking.timeSlots.includes(time)) return { error: 'Please choose a time slot.', step: 1 };
    const taken = takenSlots(await getTakenSlots(date), artistId, artists.length);
    if (taken.includes(time)) return { error: 'Sorry, that slot was just taken. Please pick another time.', step: 1 };

    const name = str(fd.get('name'), 100);
    const phone = str(fd.get('phone'), 30);
    const email = str(fd.get('email'), 120);
    if (name.length < 2) return { error: 'Please enter your name.', step: 3 };
    if (!/^[+\d][\d\s-]{6,}$/.test(phone)) return { error: 'Please enter a valid mobile number.', step: 3 };
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return { error: 'Please enter a valid email.', step: 3 };
    if (fd.get('agree') !== 'on') return { error: 'Please accept the booking policy.', step: 4 };

    const usePaymongo = fd.get('pay_method') === 'paymongo' && paymongoEnabled();
    const gcashRef = str(fd.get('gcash_ref'), 40);
    if (!usePaymongo && gcashRef.replace(/\s/g, '').length < 6) {
      return { error: 'Please enter the GCash reference number of your deposit.', step: 4 };
    }

    const referenceUrl = await saveImage(fd.get('reference'), 'references');
    const receiptUrl = usePaymongo ? '' : await saveImage(fd.get('receipt'), 'receipts');

    const fee = locationType === 'home' ? Number(settings.booking.homeServiceFee) || 0 : 0;
    const booking = {
      code: makeCode(),
      name,
      email,
      phone,
      service_id: service.id,
      service_name: service.name,
      artist_id: artistId,
      date,
      time,
      location_type: locationType,
      address: locationType === 'home' ? address : '',
      placement: str(fd.get('placement'), 120),
      size: str(fd.get('size'), 60),
      style: str(fd.get('style'), 80),
      description: str(fd.get('description'), 2000),
      reference_url: referenceUrl,
      estimate: service.price_from + fee,
      deposit: service.deposit,
      payment_method: usePaymongo ? 'gcash_paymongo' : 'gcash_manual',
      gcash_ref: usePaymongo ? '' : gcashRef,
      receipt_url: receiptUrl,
      payment_status: usePaymongo ? 'unpaid' : 'pending_verification',
    };
    await sql`INSERT INTO bookings ${sql(booking)}`;

    if (usePaymongo) {
      const checkout = await createGcashCheckout({ booking, baseUrl: await baseUrl() });
      await sql`UPDATE bookings SET paymongo_session_id = ${checkout.id} WHERE code = ${booking.code}`;
      return { redirect: checkout.url, code: booking.code };
    }
    return { code: booking.code };
  } catch (e) {
    console.error(e);
    return { error: e.message || 'Something went wrong. Please try again.' };
  }
}
