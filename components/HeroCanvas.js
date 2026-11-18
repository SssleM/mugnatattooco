'use client';
import { useEffect, useRef } from 'react';

/** Ink-smoke particle field that drifts and trails the pointer. */
export default function HeroCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w, h, dpr, raf, particles = [];
    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0 };
    const COLORS = ['200,50,43', '239,229,211', '217,164,65'];

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawn = (x, y, burst = false) => {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * (burst ? 3 : 0.6) + mouse.vx * 0.06,
        vy: (Math.random() - 0.5) * (burst ? 3 : 0.6) - 0.3 + mouse.vy * 0.06,
        r: Math.random() * 26 + 10,
        life: 0,
        max: 120 + Math.random() * 120,
        c: COLORS[Math.random() < 0.72 ? 0 : Math.random() < 0.7 ? 1 : 2],
        a: Math.random() * Math.PI * 2,
      });
    };

    // ambient seeds
    for (let i = 0; i < 40; i++) spawn(Math.random() * w, Math.random() * h);

    const onMove = (e) => {
      const b = canvas.getBoundingClientRect();
      const x = e.clientX - b.left, y = e.clientY - b.top;
      mouse.vx = x - mouse.x; mouse.vy = y - mouse.y;
      mouse.x = x; mouse.y = y;
      if (y < 0 || y > h) return;
      for (let i = 0; i < 2; i++) spawn(x, y);
    };
    const onClick = (e) => {
      const b = canvas.getBoundingClientRect();
      for (let i = 0; i < 30; i++) spawn(e.clientX - b.left, e.clientY - b.top, true);
    };

    let t = 0;
    const draw = () => {
      t += 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(11,9,8,0.16)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      if (t % 8 === 0 && particles.length < 260) spawn(Math.random() * w, h + 20);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.a += 0.02;
        p.vx += Math.cos(p.a + p.y * 0.004) * 0.03;
        p.vy -= 0.004;
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.985; p.vy *= 0.985;
        p.r *= 1.006;
        const k = p.life / p.max;
        const alpha = Math.sin(Math.PI * k) * 0.09;
        if (k >= 1) { particles.splice(i, 1); continue; }
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(${p.c},${alpha})`);
        g.addColorStop(1, `rgba(${p.c},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    if (!reduce) raf = requestAnimationFrame(draw);

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    canvas.parentElement.addEventListener('click', onClick);
    const parent = canvas.parentElement;
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      parent.removeEventListener('click', onClick);
    };
  }, []);
  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
