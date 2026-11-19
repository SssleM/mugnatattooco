'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Global motion layer: custom cursor, scroll reveals, magnetic buttons, 3D tilt and text scramble. */
export default function Effects() {
  const ring = useRef(null);
  const dot = useRef(null);
  const label = useRef(null);
  const pathname = usePathname();

  // Cursor + magnetic + tilt (event delegation, set up once)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, raf;

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (dot.current) dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    if (fine) raf = requestAnimationFrame(loop);

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      const t = e.target instanceof Element ? e.target : null;
      const labelled = t?.closest('[data-cursor]');
      const hoverable = t?.closest('a, button, label, summary, [role="button"], input[type="submit"]');
      const r = ring.current;
      if (r) {
        r.classList.toggle('is-label', Boolean(labelled));
        r.classList.toggle('is-hover', !labelled && Boolean(hoverable));
        if (labelled && label.current) label.current.textContent = labelled.getAttribute('data-cursor');
      }
      if (reduce) return;
      // magnetic
      document.querySelectorAll('[data-magnetic].mag-active').forEach((el) => {
        if (!el.contains(t)) { el.classList.remove('mag-active'); el.style.transform = ''; }
      });
      const mag = t?.closest('[data-magnetic]');
      if (mag) {
        const b = mag.getBoundingClientRect();
        const dx = e.clientX - (b.left + b.width / 2);
        const dy = e.clientY - (b.top + b.height / 2);
        mag.classList.add('mag-active');
        mag.style.transform = `translate(${dx * 0.28}px, ${dy * 0.38}px)`;
      }
      // tilt
      const tilt = t?.closest('[data-tilt]');
      document.querySelectorAll('[data-tilt].tilt-active').forEach((el) => {
        if (el !== tilt) { el.classList.remove('tilt-active'); el.style.transform = ''; }
      });
      if (tilt) {
        const b = tilt.getBoundingClientRect();
        const px = (e.clientX - b.left) / b.width;
        const py = (e.clientY - b.top) / b.height;
        const max = Number(tilt.getAttribute('data-tilt')) || 10;
        tilt.classList.add('tilt-active');
        tilt.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateZ(0)`;
        tilt.style.setProperty('--gx', `${px * 100}%`);
        tilt.style.setProperty('--gy', `${py * 100}%`);
      }
    };
    const onLeave = () => ring.current?.classList.add('is-hidden');
    const onEnter = () => ring.current?.classList.remove('is-hidden');
    const onDown = () => ring.current && (ring.current.style.scale = '0.8');
    const onUp = () => ring.current && (ring.current.style.scale = '1');

    // text scramble
    const onOver = (e) => {
      const el = e.target instanceof Element ? e.target.closest('[data-scramble]') : null;
      if (!el || reduce || el.dataset.scrambling) return;
      const final = el.getAttribute('data-scramble') || el.textContent;
      el.dataset.scrambling = '1';
      let frame = 0;
      const total = 18;
      const tick = () => {
        el.textContent = final
          .split('')
          .map((c, i) => (c === ' ' ? ' ' : i < (frame / total) * final.length ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join('');
        if (frame++ < total) requestAnimationFrame(tick);
        else { el.textContent = final; delete el.dataset.scrambling; }
      };
      tick();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('mouseover', onOver);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseover', onOver);
    };
  }, []);

  // Scroll reveals + counters (re-scan on route change and DOM changes)
  useEffect(() => {
    // Elements revealed with a clip-path start fully clipped, and browsers never report a fully
    // clipped element as visible. Watch their parent instead and reveal the element from there.
    const proxies = new Map();
    const SELECTOR = '[data-reveal], .split-line, [data-count]';
    const reveal = (el) => {
      el.classList.add('in');
      if (el.hasAttribute('data-count') && !el.classList.contains('counted')) countUp(el);
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          if (en.target.matches(SELECTOR)) reveal(en.target);
          (proxies.get(en.target) || []).forEach(reveal);
          proxies.delete(en.target);
          io.unobserve(en.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    const scan = () =>
      document.querySelectorAll('[data-reveal]:not(.in), .split-line:not(.in), [data-count]:not(.counted)').forEach((el) => {
        if (el.getAttribute('data-reveal') === 'clip' && el.parentElement) {
          const parent = el.parentElement;
          const list = proxies.get(parent) || [];
          if (!list.includes(el)) list.push(el);
          proxies.set(parent, list);
          io.observe(parent);
        } else {
          io.observe(el);
        }
      });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [pathname]);

  return (
    <>
      <div className="cursor" ref={ring} aria-hidden="true"><span ref={label} /></div>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
    </>
  );
}

function countUp(el) {
  el.classList.add('counted');
  const target = Number(el.getAttribute('data-count')) || 0;
  const start = performance.now();
  const dur = 1800;
  const step = (now) => {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(target * eased).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
