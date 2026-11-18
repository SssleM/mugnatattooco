'use client';
/** Downscales large images in the browser so uploads stay under serverless body limits. */
export async function compressImage(file, { maxSide = 2000, quality = 0.85, threshold = 1.2 * 1024 * 1024 } = {}) {
  if (!file || !file.type?.startsWith('image/') || file.type === 'image/gif') return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size <= threshold) return file;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch {
    return file;
  }
}

/** Replaces the files in an <input type=file> with compressed versions. */
export async function compressInput(input) {
  if (!input?.files?.length) return;
  const dt = new DataTransfer();
  for (const f of input.files) dt.items.add(await compressImage(f));
  input.files = dt.files;
}
