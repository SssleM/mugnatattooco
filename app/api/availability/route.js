import { NextResponse } from 'next/server';
import { getArtists, getSettings, getTakenSlots } from '@/lib/data';
import { checkDate, takenSlots } from '@/lib/booking-rules';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date') || '';
  const artistId = Number(searchParams.get('artist')) || null;
  const { booking } = await getSettings();
  const err = checkDate(date, booking);
  if (err) return NextResponse.json({ closed: true, reason: err, taken: [] });
  const [rows, artists] = await Promise.all([getTakenSlots(date), getArtists()]);
  return NextResponse.json({ closed: false, taken: takenSlots(rows, artistId, artists.length) });
}
