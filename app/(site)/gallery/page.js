import Link from 'next/link';
import Gallery from '@/components/Gallery';
import SplitTitle from '@/components/SplitTitle';
import { getArtworks } from '@/lib/data';

export const metadata = { title: 'Gallery' };

export default async function GalleryPage() {
  const works = await getArtworks();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs"><Link href="/">Home</Link> / Gallery</div>
          <SplitTitle as="h1" className="display" lines={['The', <em key="e" style={{ color: 'var(--red)', fontStyle: 'normal' }}>work</em>]} />
          <p className="lead" data-reveal>{works.length} pieces and counting. Filter by style, tap any piece to see it up close.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container"><Gallery works={works} /></div>
      </section>
    </>
  );
}
