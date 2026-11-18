'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { createSession, destroySession, requireAdmin, requireUser } from '@/lib/auth';
import { hashPassword, verifyPassword } from '@/lib/password';
import { deleteImage, isFile, saveImage } from '@/lib/storage';
import { getSettings, saveSetting } from '@/lib/data';
import { slugify } from '@/lib/utils';

const str = (v, max = 2000) => String(v ?? '').trim().slice(0, max);
const int = (v, d = 0) => (Number.isFinite(Number(v)) && String(v).trim() !== '' ? Math.round(Number(v)) : d);
const done = (message = 'Saved') => {
  revalidatePath('/', 'layout');
  return { ok: true, message };
};
const fail = (e) => ({ error: e?.message || String(e) });

/* ---------------- Auth ---------------- */
export async function login(_prev, fd) {
  const email = str(fd.get('email'), 200).toLowerCase();
  const password = String(fd.get('password') || '');
  const sql = await db();
  const [user] = await sql`SELECT * FROM users WHERE email = ${email}`;
  if (!user || !verifyPassword(password, user.password_hash)) {
    await new Promise((r) => setTimeout(r, 600));
    return { error: 'Wrong email or password.' };
  }
  await createSession(user.id);
  redirect('/admin');
}

export async function logout() {
  await destroySession();
  redirect('/admin/login');
}

/* ---------------- Bookings ---------------- */
export async function updateBooking(_prev, fd) {
  try {
    await requireUser();
    const sql = await db();
    const id = int(fd.get('id'));
    const status = ['pending', 'confirmed', 'completed', 'cancelled'].includes(fd.get('status')) ? fd.get('status') : 'pending';
    const payment = ['unpaid', 'pending_verification', 'paid', 'refunded'].includes(fd.get('payment_status')) ? fd.get('payment_status') : 'unpaid';
    const quick = fd.get('quick');
    if (quick === 'verify') {
      await sql`UPDATE bookings SET payment_status = 'paid', status = CASE WHEN status = 'pending' THEN 'confirmed' ELSE status END WHERE id = ${id}`;
      return done('Deposit verified & booking confirmed');
    }
    await sql`UPDATE bookings SET status = ${status}, payment_status = ${payment},
      staff_notes = ${str(fd.get('staff_notes'))}, artist_id = ${int(fd.get('artist_id')) || null},
      date = ${str(fd.get('date'), 10)}, time = ${str(fd.get('time'), 5)}
      WHERE id = ${id}`;
    return done('Booking updated');
  } catch (e) { return fail(e); }
}

export async function deleteBooking(_prev, fd) {
  try {
    await requireUser();
    const sql = await db();
    const [b] = await sql`DELETE FROM bookings WHERE id = ${int(fd.get('id'))} RETURNING reference_url, receipt_url`;
    if (b) { await deleteImage(b.reference_url); await deleteImage(b.receipt_url); }
    return done('Booking deleted');
  } catch (e) { return fail(e); }
}

/* ---------------- Artists ---------------- */
export async function saveArtist(_prev, fd) {
  try {
    await requireUser();
    const sql = await db();
    const id = int(fd.get('id'));
    const name = str(fd.get('name'), 100);
    if (!name) return { error: 'Name is required.' };
    const data = {
      name,
      title: str(fd.get('title'), 100),
      bio: str(fd.get('bio'), 3000),
      specialties: str(fd.get('specialties'), 300),
      instagram: str(fd.get('instagram'), 80).replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, ''),
      years: int(fd.get('years')),
      sort: int(fd.get('sort')),
      active: fd.get('active') === 'on',
    };
    const photo = fd.get('photo');
    if (isFile(photo)) data.photo_url = await saveImage(photo, 'artists');

    if (id) {
      const [old] = await sql`SELECT photo_url FROM artists WHERE id = ${id}`;
      await sql`UPDATE artists SET ${sql(data)} WHERE id = ${id}`;
      if (data.photo_url && old?.photo_url !== data.photo_url) await deleteImage(old?.photo_url);
      return done('Artist saved');
    }
    let slug = slugify(name);
    const [exists] = await sql`SELECT 1 FROM artists WHERE slug = ${slug}`;
    if (exists) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    await sql`INSERT INTO artists ${sql({ ...data, slug, photo_url: data.photo_url || '' })}`;
    return done('Artist added');
  } catch (e) { return fail(e); }
}

export async function deleteArtist(_prev, fd) {
  try {
    await requireUser();
    const sql = await db();
    const [a] = await sql`DELETE FROM artists WHERE id = ${int(fd.get('id'))} RETURNING photo_url`;
    if (a) await deleteImage(a.photo_url);
  } catch (e) { return fail(e); }
  revalidatePath('/', 'layout');
  redirect('/admin/artists');
}

/* ---------------- Gallery ---------------- */
export async function uploadArtworks(_prev, fd) {
  try {
    await requireUser();
    const sql = await db();
    const files = fd.getAll('images').filter(isFile);
    if (!files.length) return { error: 'Choose at least one image.' };
    const base = {
      artist_id: int(fd.get('artist_id')) || null,
      title: str(fd.get('title'), 120),
      style: str(fd.get('style'), 60),
      featured: fd.get('featured') === 'on',
    };
    let n = 0;
    for (const f of files) {
      const url = await saveImage(f, 'gallery');
      const title = base.title ? (files.length > 1 ? `${base.title} ${++n}` : base.title) : '';
      await sql`INSERT INTO artworks ${sql({ ...base, title, image_url: url })}`;
    }
    return done(`${files.length} image${files.length > 1 ? 's' : ''} uploaded`);
  } catch (e) { return fail(e); }
}

export async function updateArtwork(_prev, fd) {
  try {
    await requireUser();
    const sql = await db();
    const id = int(fd.get('id'));
    if (fd.get('intent') === 'delete') {
      const [w] = await sql`DELETE FROM artworks WHERE id = ${id} RETURNING image_url`;
      if (w) await deleteImage(w.image_url);
      return done('Image deleted');
    }
    await sql`UPDATE artworks SET title = ${str(fd.get('title'), 120)}, style = ${str(fd.get('style'), 60)},
      artist_id = ${int(fd.get('artist_id')) || null}, featured = ${fd.get('featured') === 'on'} WHERE id = ${id}`;
    return done('Image updated');
  } catch (e) { return fail(e); }
}

/* ---------------- Services ---------------- */
export async function saveService(_prev, fd) {
  try {
    await requireUser();
    const sql = await db();
    const id = int(fd.get('id'));
    if (fd.get('intent') === 'delete') {
      await sql`DELETE FROM services WHERE id = ${id}`;
      return done('Service deleted');
    }
    const data = {
      name: str(fd.get('name'), 100),
      description: str(fd.get('description'), 500),
      price_from: Math.max(0, int(fd.get('price_from'))),
      deposit: Math.max(1, int(fd.get('deposit'), 500)),
      duration: str(fd.get('duration'), 60),
      sort: int(fd.get('sort')),
      active: fd.get('active') === 'on',
    };
    if (!data.name) return { error: 'Service name is required.' };
    if (id) await sql`UPDATE services SET ${sql(data)} WHERE id = ${id}`;
    else await sql`INSERT INTO services ${sql(data)}`;
    return done(id ? 'Service saved' : 'Service added');
  } catch (e) { return fail(e); }
}

/* ---------------- Testimonials ---------------- */
export async function moderateTestimonial(_prev, fd) {
  try {
    await requireUser();
    const sql = await db();
    const id = int(fd.get('id'));
    const intent = fd.get('intent');
    if (intent === 'delete') {
      const [t] = await sql`DELETE FROM testimonials WHERE id = ${id} RETURNING photo_url`;
      if (t) await deleteImage(t.photo_url);
      return done('Review deleted');
    }
    await sql`UPDATE testimonials SET approved = ${intent === 'approve'} WHERE id = ${id}`;
    return done(intent === 'approve' ? 'Review published' : 'Review hidden');
  } catch (e) { return fail(e); }
}

export async function addTestimonial(_prev, fd) {
  try {
    await requireUser();
    const sql = await db();
    const name = str(fd.get('name'), 80);
    const message = str(fd.get('message'), 1200);
    if (!name || !message) return { error: 'Name and message are required.' };
    const photo = await saveImage(fd.get('photo'), 'testimonials');
    await sql`INSERT INTO testimonials (name, rating, message, artist_id, photo_url, approved)
      VALUES (${name}, ${Math.min(5, Math.max(1, int(fd.get('rating'), 5)))}, ${message}, ${int(fd.get('artist_id')) || null}, ${photo}, true)`;
    return done('Review added');
  } catch (e) { return fail(e); }
}

/* ---------------- Settings ---------------- */
export async function saveSettings(_prev, fd) {
  try {
    await requireUser();
    const section = fd.get('section');
    const current = await getSettings();
    if (section === 'shop') {
      const hours = [];
      for (let i = 0; i < 7; i++) {
        const day = str(fd.get(`hours_day_${i}`), 40);
        const time = str(fd.get(`hours_time_${i}`), 60);
        if (day) hours.push({ day, time });
      }
      const lat = Number(fd.get('lat'));
      const lng = Number(fd.get('lng'));
      await saveSetting('shop', {
        ...current.shop,
        name: str(fd.get('name'), 80) || current.shop.name,
        tagline: str(fd.get('tagline'), 140),
        about: str(fd.get('about'), 2000),
        founded: str(fd.get('founded'), 4),
        phone: str(fd.get('phone'), 40),
        email: str(fd.get('email'), 120),
        address: str(fd.get('address'), 300),
        lat: Number.isFinite(lat) ? lat : current.shop.lat,
        lng: Number.isFinite(lng) ? lng : current.shop.lng,
        hours,
        instagram: str(fd.get('instagram'), 200),
        facebook: str(fd.get('facebook'), 200),
        tiktok: str(fd.get('tiktok'), 200),
      });
    } else if (section === 'booking') {
      const slots = str(fd.get('timeSlots'), 300)
        .split(/[,\s]+/)
        .map((s) => s.trim())
        .filter((s) => /^\d{1,2}:\d{2}$/.test(s))
        .map((s) => s.padStart(5, '0'))
        .sort();
      if (!slots.length) return { error: 'Add at least one time slot, e.g. 11:00, 14:00' };
      await saveSetting('booking', {
        ...current.booking,
        timeSlots: slots,
        closedWeekdays: fd.getAll('closedWeekdays').map(Number),
        homeServiceFee: Math.max(0, int(fd.get('homeServiceFee'))),
        homeServiceAreas: str(fd.get('homeServiceAreas'), 400),
        homeServiceMinimum: str(fd.get('homeServiceMinimum'), 200),
        leadDays: Math.max(0, int(fd.get('leadDays'), 1)),
        policy: str(fd.get('policy'), 800),
      });
    } else if (section === 'gcash') {
      const qr = fd.get('qr');
      const next = { ...current.gcash, accountName: str(fd.get('accountName'), 80), number: str(fd.get('number'), 30) };
      if (isFile(qr)) {
        next.qrUrl = await saveImage(qr, 'gcash');
        if (current.gcash.qrUrl !== next.qrUrl) await deleteImage(current.gcash.qrUrl);
      }
      await saveSetting('gcash', next);
    }
    return done('Settings saved');
  } catch (e) { return fail(e); }
}

/* ---------------- Staff ---------------- */
export async function addStaff(_prev, fd) {
  try {
    await requireAdmin();
    const sql = await db();
    const email = str(fd.get('email'), 200).toLowerCase();
    const name = str(fd.get('name'), 80);
    const password = String(fd.get('password') || '');
    if (!/^\S+@\S+\.\S+$/.test(email)) return { error: 'Enter a valid email.' };
    if (password.length < 8) return { error: 'Password must be at least 8 characters.' };
    const role = fd.get('role') === 'admin' ? 'admin' : 'staff';
    const rows = await sql`INSERT INTO users (email, name, password_hash, role)
      VALUES (${email}, ${name || email}, ${hashPassword(password)}, ${role}) ON CONFLICT (email) DO NOTHING RETURNING id`;
    if (!rows.length) return { error: 'That email already has an account.' };
    return done('Staff account created');
  } catch (e) { return fail(e); }
}

export async function removeStaff(_prev, fd) {
  try {
    const me = await requireAdmin();
    const id = int(fd.get('id'));
    if (id === me.id) return { error: 'You cannot remove your own account.' };
    const sql = await db();
    await sql`DELETE FROM users WHERE id = ${id}`;
    return done('Staff removed');
  } catch (e) { return fail(e); }
}

export async function changePassword(_prev, fd) {
  try {
    const me = await requireUser();
    const sql = await db();
    const [u] = await sql`SELECT password_hash FROM users WHERE id = ${me.id}`;
    if (!verifyPassword(String(fd.get('current') || ''), u.password_hash)) return { error: 'Current password is wrong.' };
    const next = String(fd.get('next') || '');
    if (next.length < 8) return { error: 'New password must be at least 8 characters.' };
    await sql`UPDATE users SET password_hash = ${hashPassword(next)} WHERE id = ${me.id}`;
    return { ok: true, message: 'Password changed' };
  } catch (e) { return fail(e); }
}
