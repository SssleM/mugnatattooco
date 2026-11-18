'use client';
import { useState } from 'react';
import { compressInput } from '@/lib/compress';

export default function ImageField({ name = 'image', multiple = false, required = false, current = '' }) {
  const [previews, setPreviews] = useState([]);
  return (
    <div className="stack" style={{ gap: 8 }}>
      <div className="row">
        {(previews.length ? previews : current ? [current] : []).slice(0, 8).map((p) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={p} src={p} alt="" style={{ width: 64, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--line)' }} />
        ))}
      </div>
      <input
        type="file"
        name={name}
        accept="image/*"
        multiple={multiple}
        required={required}
        className="input input-sm"
        onChange={async (e) => {
          const input = e.currentTarget;
          await compressInput(input);
          setPreviews(Array.from(input.files).map((f) => URL.createObjectURL(f)));
        }}
      />
    </div>
  );
}
