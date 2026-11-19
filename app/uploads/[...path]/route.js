import fs from 'node:fs/promises';
import path from 'node:path';
import { LOCAL_DIR } from '@/lib/storage';

const TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', avif: 'image/avif' };

// Serves images uploaded in local development (production uses Vercel Blob URLs).
export async function GET(_req, { params }) {
  const parts = (await params).path || [];
  const file = path.join(LOCAL_DIR, ...parts);
  if (!file.startsWith(LOCAL_DIR + path.sep)) return new Response('Not found', { status: 404 });
  try {
    const data = await fs.readFile(file);
    const ext = path.extname(file).slice(1).toLowerCase();
    return new Response(data, { headers: { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': 'public, max-age=31536000, immutable' } });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
