import Link from 'next/link';
import SplitTitle from '@/components/SplitTitle';

export const metadata = { title: 'Aftercare' };

export default function AftercarePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs"><Link href="/">Home</Link> / Aftercare</div>
          <SplitTitle as="h1" className="display" lines={['Heal it', <em key="e" style={{ color: 'var(--red)', fontStyle: 'normal' }}>right</em>]} />
          <p className="lead" data-reveal>Half of a great tattoo is how it heals. Follow these steps and your ink will stay crisp for years.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container prose" data-reveal>
          <h2>First 24 hours</h2>
          <ul>
            <li>Keep the wrap or second-skin on for the time your artist recommends (usually 2–4 hours for wrap, 3–5 days for second-skin).</li>
            <li>Wash your hands, then gently wash the tattoo with lukewarm water and unscented soap. Pat dry with a clean paper towel.</li>
          </ul>
          <h2>Days 2 – 14</h2>
          <ul>
            <li>Wash 2–3 times a day and apply a <strong>very thin</strong> layer of unscented moisturiser or tattoo balm.</li>
            <li>It will peel and itch. That is normal. <strong>Do not pick or scratch.</strong></li>
            <li>No swimming pools, beaches, saunas or long soaks in the bath.</li>
            <li>Keep it out of direct sun and wear loose, clean clothes over it.</li>
          </ul>
          <h2>Long term</h2>
          <ul>
            <li>Use SPF 50 sunscreen on healed tattoos. The sun is the number one thing that fades ink.</li>
            <li>Keep your skin hydrated. Free touch-ups within 3 months for studio work if needed.</li>
          </ul>
          <h2>When to call us</h2>
          <p>Some redness and swelling for a few days is expected. If you notice spreading redness, heat, pus, or fever, see a doctor and message us right away.</p>
        </div>
      </section>
    </>
  );
}
