import 'server-only';
import { db } from './db';
import { DEFAULT_SETTINGS } from './defaults';

export async function getSettings() {
  const sql = await db();
  const rows = await sql`SELECT key, value FROM settings`;
  const out = structuredClone(DEFAULT_SETTINGS);
  for (const r of rows) {
    if (out[r.key] && typeof r.value === 'object') out[r.key] = { ...out[r.key], ...r.value };
  }
  return out;
}

export async function saveSetting(key, value) {
  const sql = await db();
  await sql`INSERT INTO settings (key, value) VALUES (${key}, ${sql.json(value)})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
}

export async function getArtists({ all = false } = {}) {
  const sql = await db();
  return all
    ? sql`SELECT a.*, (SELECT count(*)::int FROM artworks w WHERE w.artist_id = a.id) AS work_count
          FROM artists a ORDER BY sort, id`
    : sql`SELECT a.*, (SELECT count(*)::int FROM artworks w WHERE w.artist_id = a.id) AS work_count
          FROM artists a WHERE active ORDER BY sort, id`;
}

export async function getArtistBySlug(slug) {
  const sql = await db();
  const [a] = await sql`SELECT * FROM artists WHERE slug = ${slug} AND active`;
  return a || null;
}

export async function getArtworks({ artistId, featured, limit = 500 } = {}) {
  const sql = await db();
  return sql`
    SELECT w.*, a.name AS artist_name, a.slug AS artist_slug
    FROM artworks w LEFT JOIN artists a ON a.id = w.artist_id
    WHERE (${artistId ?? null}::int IS NULL OR w.artist_id = ${artistId ?? null})
      AND (${featured ?? null}::boolean IS NULL OR w.featured = ${featured ?? null})
      AND (a.id IS NULL OR a.active)
    ORDER BY w.featured DESC, w.created_at DESC, w.id DESC
    LIMIT ${limit}`;
}

export async function getServices({ all = false } = {}) {
  const sql = await db();
  return all
    ? sql`SELECT * FROM services ORDER BY sort, id`
    : sql`SELECT * FROM services WHERE active ORDER BY sort, id`;
}

export async function getTestimonials({ approved = true, limit = 200 } = {}) {
  const sql = await db();
  return sql`
    SELECT t.*, a.name AS artist_name FROM testimonials t
    LEFT JOIN artists a ON a.id = t.artist_id
    WHERE (${approved}::boolean IS NULL OR t.approved = ${approved})
    ORDER BY t.created_at DESC LIMIT ${limit}`;
}

export async function getTakenSlots(date, artistId) {
  const sql = await db();
  const rows = await sql`
    SELECT time, artist_id FROM bookings
    WHERE date = ${date} AND status <> 'cancelled'
      AND (${artistId ?? null}::int IS NULL OR artist_id = ${artistId ?? null})`;
  return rows;
}
