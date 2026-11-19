'use server';
import { db } from '@/lib/db';
import { saveImage } from '@/lib/storage';

export async function submitTestimonial(_prev, formData) {
  try {
    if (formData.get('website')) return { ok: true }; // honeypot
    const name = String(formData.get('name') || '').trim().slice(0, 80);
    const message = String(formData.get('message') || '').trim().slice(0, 1200);
    const rating = Math.min(5, Math.max(1, Number(formData.get('rating')) || 5));
    const artistId = Number(formData.get('artist_id')) || null;
    if (name.length < 2) return { error: 'Please tell us your name.' };
    if (message.length < 10) return { error: 'Please write a slightly longer review.' };
    const photo = await saveImage(formData.get('photo'), 'testimonials');
    const sql = await db();
    await sql`INSERT INTO testimonials (name, rating, message, artist_id, photo_url, approved)
      VALUES (${name}, ${rating}, ${message}, ${artistId}, ${photo}, false)`;
    return { ok: true };
  } catch (e) {
    return { error: e.message || 'Something went wrong.' };
  }
}
