import Link from 'next/link';
import SplitTitle from '@/components/SplitTitle';
import { Arrow } from '@/components/Icons';
import { getArtists } from '@/lib/data';

export const metadata = { title: 'Artists' };

export default async function ArtistsPage() {
  const artists = await getArtists();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs"><Link href="/">Home</Link> / Artists</div>
          <SplitTitle as="h1" className="display" lines={['The', <em key="e" style={{ color: 'var(--red)', fontStyle: 'normal' }}>artists</em>]} />
          <p className="lead" data-reveal>Every artist at MUGNA draws custom work in their own voice. Find the one whose style speaks to you, then book straight from their profile.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container artists-grid">
          {artists.map((a, i) => (
            <Link href={`/artists/${a.slug}`} key={a.id} className="artist-card" data-reveal style={{ '--d': `${i * 0.1}s` }} data-cursor="Profile">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.photo_url || '/art/artist-paeng.svg'} alt={a.name} />
              <span className="num">0{i + 1} · {a.work_count} works</span>
              <span className="ring"><Arrow /></span>
              <div className="info">
                <span className="role">{a.title}</span>
                <h3 className="display" data-scramble={a.name}>{a.name}</h3>
                <div className="tags">
                  {a.specialties.split(',').filter(Boolean).map((s) => <span className="chip" key={s}>{s.trim()}</span>)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
