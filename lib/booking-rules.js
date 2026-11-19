import 'server-only';
import { manilaToday } from './utils';

/** Returns an error string if the date can't be booked, else null. */
export function checkDate(date, booking) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'Please pick a valid date.';
  const today = new Date(manilaToday() + 'T00:00:00Z');
  const d = new Date(date + 'T00:00:00Z');
  const diff = Math.round((d - today) / 86400000);
  if (diff < Number(booking.leadDays || 0)) return `Bookings need at least ${booking.leadDays} day(s) notice.`;
  if (diff > 180) return 'Please choose a date within the next 6 months.';
  if ((booking.closedWeekdays || []).map(Number).includes(d.getUTCDay())) return 'The studio is closed on that day.';
  return null;
}

/** Computes taken time slots for a date + (optional) artist. */
export function takenSlots(rows, artistId, activeArtistCount) {
  const taken = new Set();
  if (artistId) {
    for (const r of rows) if (r.artist_id === artistId || r.artist_id === null) taken.add(r.time);
  } else {
    const counts = {};
    for (const r of rows) counts[r.time] = (counts[r.time] || 0) + 1;
    for (const [t, c] of Object.entries(counts)) if (c >= Math.max(1, activeArtistCount)) taken.add(t);
  }
  return [...taken];
}
