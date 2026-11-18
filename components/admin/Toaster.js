'use client';
import { useEffect, useState } from 'react';

export function toast(message, type = 'ok') {
  window.dispatchEvent(new CustomEvent('mugna-toast', { detail: { message, type, id: Date.now() + Math.random() } }));
}

export default function Toaster() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const on = (e) => {
      setItems((list) => [...list, e.detail]);
      setTimeout(() => setItems((list) => list.filter((t) => t.id !== e.detail.id)), 3300);
    };
    window.addEventListener('mugna-toast', on);
    return () => window.removeEventListener('mugna-toast', on);
  }, []);
  return items.map((t, i) => (
    <div key={t.id} className={`toast ${t.type === 'err' ? 'err' : 'ok'}`} role="status" style={{ bottom: 24 + i * 60 }}>
      {t.message}
    </div>
  ));
}
