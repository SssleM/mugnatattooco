'use client';
import { useEffect, useRef } from 'react';

/** Floating flash cards that follow the mouse with depth + scroll parallax. */
export default function HeroParallax({ images = [] }) {
  const refs = useRef([]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let mx = 0, my = 0, sy = 0;
    const apply = () => {
      refs.current.forEach((el, i) => {
        if (!el) return;
        const depth = (i + 1) * 14;
        el.style.transform = `translate3d(${mx * depth}px, ${my * depth - sy * (0.15 + i * 0.12)}px, 0)`;
      });
    };
    const onMove = (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; apply(); };
    const onScroll = () => { sy = scrollY; apply(); };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('scroll', onScroll); };
  }, []);
  return images.slice(0, 3).map((src, i) => (
    <div key={src + i} className={`hero-flash f${i + 1}`} ref={(el) => (refs.current[i] = el)} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" />
    </div>
  ));
}
