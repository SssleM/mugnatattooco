'use client';
import { useState } from 'react';
import { compressInput } from '@/lib/compress';

export default function ImageDrop({ name, label = 'Upload an image', hint = 'JPG, PNG or WEBP', multiple = false, required = false, initial = '' }) {
  const [previews, setPreviews] = useState(initial ? [initial] : []);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  const onChange = async (e) => {
    const input = e.currentTarget;
    setBusy(true);
    await compressInput(input);
    setPreviews(Array.from(input.files).map((f) => URL.createObjectURL(f)));
    setBusy(false);
  };

  return (
    <label className={`dropzone ${drag ? 'drag' : ''}`} onDragEnter={() => setDrag(true)} onDragLeave={() => setDrag(false)} onDrop={() => setDrag(false)}>
      <input type="file" name={name} accept="image/*" multiple={multiple} required={required} onChange={onChange} />
      {previews.length > 0 ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {previews.slice(0, 6).map((p) => <img key={p} src={p} alt="Preview" />)}
        </div>
      ) : (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 16V4m0 0l-5 5m5-5l5 5M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" /></svg>
      )}
      <strong style={{ fontSize: 14 }}>{busy ? 'Optimising…' : previews.length ? `${previews.length} selected · tap to change` : label}</strong>
      <span className="hint">{hint}</span>
    </label>
  );
}
