import 'server-only';
import { put, del } from '@vercel/blob';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_BYTES = 8 * 1024 * 1024;
/** Local-development upload folder (served by app/uploads/[...path]/route.js). */
export const LOCAL_DIR = path.join(process.cwd(), '.uploads');

export function isFile(f) {
  return f && typeof f === 'object' && typeof f.arrayBuffer === 'function' && f.size > 0;
}

/** Saves an uploaded image and returns its public URL. */
export async function saveImage(file, folder = 'uploads') {
  if (!isFile(file)) return '';
  if (!ALLOWED.includes(file.type)) throw new Error('Please upload a JPG, PNG, WEBP or GIF image.');
  if (file.size > MAX_BYTES) throw new Error('Image is too large (max 8 MB).');
  const ext = (file.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
  const name = `${folder}/${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(name, file, { access: 'public', contentType: file.type });
    return blob.url;
  }
  if (process.env.VERCEL) {
    throw new Error('Image uploads need Vercel Blob. Add a Blob store to this project (BLOB_READ_WRITE_TOKEN).');
  }
  // Local development fallback
  const dest = path.join(LOCAL_DIR, name);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function deleteImage(url) {
  try {
    if (!url) return;
    if (url.includes('blob.vercel-storage.com') && process.env.BLOB_READ_WRITE_TOKEN) {
      await del(url);
    } else if (url.startsWith('/uploads/')) {
      await fs.unlink(path.join(LOCAL_DIR, url.replace(/^\/uploads\//, '')));
    }
  } catch {
    /* ignore missing files */
  }
}
