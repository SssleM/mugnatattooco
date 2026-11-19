import Link from 'next/link';
import { notFound } from 'next/navigation';
import Gallery from '@/components/Gallery';
import TestimonialCard from '@/components/TestimonialCard';
import { Arrow, Instagram } from '@/components/Icons';
import { getArtistBySlug, getArtworks, getTestimonials } from '@/lib/data';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = await getArtistBySlug(slug);
  return { title: a ? `${a.name} — ${a.title}` : 'Artist' };
}

export default async function ArtistPage({ params }) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) notFound();
  const [works, reviews] = await Promise.all([getArtworks({ artistId: artist.id }), getTestimonials({ limit: 50 })]);
  const mine = reviews.filter((r) => r.artist_id === artist.id).slice(0, 4);

  return (
    <>
      <section className="page-hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="breadcrumbs"><Link href="/">Home</Link> / <Link href="/artists">Artists</Link> / {artist.name}</div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container profile">
          <div className="profile-photo" data-reveal="clip" data-tilt="6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={artist.photo_url || '/art/artist-paeng.svg'} alt={artist.name} />
          </div>
          <div>
            <span className="eyebrow" data-reveal>{artist.title}</span>
            <h1 className="display" style={{ fontSize: 'clamp(56px, 9vw, 130px)', margin: '14px 0 22px' }}>
              {artist.name.split(' ').map((w, i) => (
                <span className="split-line" key={i}><span style={{ '--d': `${i * 0.1}s` }}>{w}</span></span>
              ))}
            </h1>
            <p className="lead" data-reveal>{artist.bio}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '26px 0' }} data-reveal>
              {artist.specialties.split(',').filter(Boolean).map((s) => <span className="chip" key={s}>{s.trim()}</span>)}
            </div>
            <div className="stats" data-reveal style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div className="stat"><div className="num display"><span data-count={artist.years}>0</span><sup>yrs</sup></div><p>Experience</p></div>
              <div className="stat"><div className="num display"><span data-count={works.length}>0</span></div><p>Pieces in gallery</p></div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }} data-reveal>
              <Link href={`/book?artist=${artist.id}`} className="btn btn-red" data-magnetic>Book with {artist.name.split(' ')[0]} <Arrow /></Link>
              {artist.instagram && (
                <a className="btn btn-ghost" href={`https://instagram.com/${artist.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" data-magnetic>
                  <span style={{ width: 18, height: 18, display: 'inline-block' }}><Instagram /></span> @{artist.instagram.replace('@', '')}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="section" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="section-head">
            <h2 className="section-title display">Portfolio</h2>
          </div>
          <Gallery works={works} />
        </div>
      </section>
      {mine.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head"><h2 className="section-title display">Client <em>love</em></h2></div>
            <div className="t-grid">{mine.map((t) => <TestimonialCard key={t.id} t={t} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
