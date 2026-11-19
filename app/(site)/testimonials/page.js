import Link from 'next/link';
import SplitTitle from '@/components/SplitTitle';
import TestimonialCard from '@/components/TestimonialCard';
import TestimonialForm from '@/components/TestimonialForm';
import { Stars } from '@/components/Icons';
import { getArtists, getTestimonials } from '@/lib/data';
import { submitTestimonial } from './actions';

export const metadata = { title: 'Reviews & Testimonials' };

export default async function TestimonialsPage() {
  const [list, artists] = await Promise.all([getTestimonials(), getArtists()]);
  const avg = list.length ? list.reduce((s, t) => s + t.rating, 0) / list.length : 5;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs"><Link href="/">Home</Link> / Reviews</div>
          <SplitTitle as="h1" className="display" lines={['Client', <em key="e" style={{ color: 'var(--red)', fontStyle: 'normal' }}>stories</em>]} />
          <div data-reveal style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span className="display" style={{ fontSize: 64 }}>{avg.toFixed(1)}</span>
            <div><Stars n={Math.round(avg)} /><div className="muted">from {list.length} reviews</div></div>
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container t-grid">
          {list.map((t, i) => (
            <div key={t.id} data-reveal style={{ '--d': `${(i % 6) * 0.06}s`, breakInside: 'avoid' }}>
              <TestimonialCard t={t} />
            </div>
          ))}
        </div>
      </section>
      <section className="section" id="write" style={{ background: 'var(--bg-2)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 48 }}>
          <div>
            <span className="eyebrow" data-reveal>Got inked with us?</span>
            <SplitTitle lines={['Leave a', <em key="e">review</em>]} />
            <p className="lead" data-reveal>Your words help other first-timers feel at ease. Reviews show up after a quick check by our team.</p>
          </div>
          <div className="visit-card"><TestimonialForm action={submitTestimonial} artists={artists} /></div>
        </div>
      </section>
    </>
  );
}
