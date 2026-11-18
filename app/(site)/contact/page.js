import Link from 'next/link';
import SplitTitle from '@/components/SplitTitle';
import Visit from '@/components/Visit';
import { getSettings } from '@/lib/data';

export const metadata = { title: 'Visit & Contact' };

export default async function ContactPage() {
  const { shop } = await getSettings();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs"><Link href="/">Home</Link> / Visit</div>
          <SplitTitle as="h1" className="display" lines={['Come', <em key="e" style={{ color: 'var(--red)', fontStyle: 'normal' }}>through</em>]} />
          <p className="lead" data-reveal>Walk-ins welcome when a chair is free, but booking ahead guarantees your spot.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container"><Visit shop={shop} /></div>
      </section>
    </>
  );
}
