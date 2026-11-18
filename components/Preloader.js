'use client';
import { useEffect, useState } from 'react';
import { Emblem } from './Logo';

export default function Preloader() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('mugna-intro') === '1'; sessionStorage.setItem('mugna-intro', '1'); } catch {}
    if (seen) { setShow(false); document.documentElement.classList.add('no-intro'); return; }
    const t = setTimeout(() => setShow(false), 3200);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="preloader" aria-hidden="true">
      <div className="preloader-inner">
        <Emblem className="preloader-emblem" title="" />
        <div className="preloader-word display">
          {'MUGNA'.split('').map((c, i) => <span key={i} style={{ '--i': i + 5 }}>{c}</span>)}
        </div>
      </div>
      <div className="preloader-bar" />
    </div>
  );
}
