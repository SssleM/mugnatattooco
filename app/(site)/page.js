import Link from 'next/link';
import HeroCanvas from '@/components/HeroCanvas';
import HeroParallax from '@/components/HeroParallax';
import Marquee from '@/components/Marquee';
import Gallery from '@/components/Gallery';
import TestimonialCard from '@/components/TestimonialCard';
import Faq from '@/components/Faq';
import Visit from '@/components/Visit';
import SplitTitle from '@/components/SplitTitle';
import { Arrow } from '@/components/Icons';
import ScooterArt from '@/components/ScooterArt';
import { Emblem } from '@/components/Logo';
import { getArtists, getArtworks, getServices, getSettings, getTestimonials } from '@/lib/data';
import { peso } from '@/lib/utils';
import { getWallet } from '@/lib/wallet';

export default async function Home() {
  const [settings, artists, featured, services, testimonials] = await Promise.all([
    getSettings(),
    getArtists(),
    getArtworks({ featured: true, limit: 9 }),
    getServices(),
    getTestimonials({ limit: 12 }),
  ]);
  const { shop, booking } = settings;
  const wallet = getWallet(settings.gcash).name;
  const heroArt = featured.slice(0, 3).map((w) => w.image_url);
  const years = new Date().getFullYear() - Number(shop.founded || 2014);
  const avg = testimonials.length ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1) : '5.0';

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hero" aria-label="Welcome">
        <HeroCanvas />
        <HeroParallax images={heroArt} />
        <Emblem className="hero-emblem" title="" />
        <div className="hero-vignette" />
        <a href="#work" className="badge-spin hero-anim" style={{ '--d': '2.8s' }} aria-label="See the work" data-cursor="Scroll">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <defs><path id="circle" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" /></defs>
            <text><textPath href="#circle" textLength="236" lengthAdjust="spacing">Mugna • Tattoo Co. • Est {shop.founded} • </textPath></text>
          </svg>
          <span className="core"><Emblem title="" /></span>
        </a>
        <div className="container">
          <h1 className="hero-title display" aria-label="Mugna">
            {'MUGNA'.split('').map((c, i) => (
              <span className="ch" key={i} aria-hidden="true"><span style={{ '--i': i }}>{c}</span></span>
            ))}
          </h1>
          <div className="hero-sub">
            <span className="gothic hero-anim" style={{ '--d': '2.4s' }}>Tattoo Co.</span>
            <p className="hero-anim" style={{ '--d': '2.55s' }}>
              <em className="gold" style={{ fontStyle: 'normal' }}>Mugna</em> — to create. Custom tattoos drawn by hand for you alone. Studio sessions or home service, booked in minutes with a {wallet} deposit.
            </p>
          </div>
          <div className="hero-foot">
            <div className="hero-actions hero-anim" style={{ '--d': '2.7s' }}>
              <Link href="/book" className="btn btn-red" data-magnetic>Book a session <Arrow /></Link>
              <Link href="/gallery" className="btn btn-ghost" data-magnetic>See the work</Link>
            </div>
            <div className="scroll-cue hero-anim" style={{ '--d': '2.9s' }}><i /> Scroll</div>
          </div>
        </div>
      </section>

      <Marquee items={['Neo-traditional', 'Fine line', 'Blackwork', 'Geometric', 'Cover-ups', 'Home service', 'Custom flash']} />

      {/* ================= ABOUT ================= */}
      <section className="section" id="about">
        <div className="container about-grid">
          <div className="about-visual">
            <div className="img a" data-reveal="clip">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={shop.aboutImage1 || featured[3]?.image_url || '/art/rose.svg'} alt="MUGNA Tattoo studio" />
            </div>
            <div className="img b" data-reveal="clip" style={{ '--d': '0.2s' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={shop.aboutImage2 || featured[4]?.image_url || '/art/moth.svg'} alt="MUGNA Tattoo work" />
            </div>
          </div>
          <div>
            <span className="eyebrow" data-reveal>The studio</span>
            <SplitTitle lines={['Made by hand.', <em key="e">Worn for life.</em>]} />
            <p className="lead" data-reveal style={{ '--d': '0.2s' }}>{shop.about}</p>
            <div className="stats" data-reveal style={{ '--d': '0.3s' }}>
              <div className="stat"><div className="num display"><span data-count={years}>0</span><sup>+</sup></div><p>Years inking</p></div>
              <div className="stat"><div className="num display"><span data-count="4800">0</span><sup>+</sup></div><p>Tattoos done</p></div>
              <div className="stat"><div className="num display"><span data-count={artists.length}>0</span></div><p>Resident artists</p></div>
              <div className="stat"><div className="num display">{avg}<sup>★</sup></div><p>Average review</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ARTISTS ================= */}
      <section className="section" id="artists" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow" data-reveal>The hands</span>
              <SplitTitle lines={['Meet the', <em key="e">artists</em>]} />
            </div>
            <Link href="/artists" className="btn btn-ghost" data-reveal data-magnetic>All artists <Arrow /></Link>
          </div>
          <div className="artists-grid">
            {artists.map((a, i) => (
              <Link href={`/artists/${a.slug}`} key={a.id} className="artist-card" data-reveal style={{ '--d': `${i * 0.12}s` }} data-cursor="Profile">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.photo_url || '/art/artist-paeng.svg'} alt={a.name} />
                <span className="num">0{i + 1}</span>
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
        </div>
      </section>

      {/* ================= WORK ================= */}
      <section className="section" id="work" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow" data-reveal>Selected work</span>
              <SplitTitle lines={['Fresh from', <em key="e">the chair</em>]} />
            </div>
            <Link href="/gallery" className="btn btn-ghost" data-reveal data-magnetic>Full gallery <Arrow /></Link>
          </div>
          <Gallery works={featured} />
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow" data-reveal>Services & pricing</span>
              <SplitTitle lines={['What we', <em key="e">do best</em>]} />
            </div>
            <p className="lead" data-reveal style={{ maxWidth: '38ch' }}>Final price depends on size, detail and placement. Your artist will confirm a quote before any needle touches skin.</p>
          </div>
          <div className="services-list">
            {services.map((s, i) => (
              <Link href={`/book?service=${s.id}`} key={s.id} className="service-row" data-reveal style={{ '--d': `${i * 0.06}s` }}>
                <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="display">{s.name}</h3>
                <p className="muted">{s.description}</p>
                <div className="price">
                  <strong>{s.price_from ? `from ${peso(s.price_from)}` : 'Free'}</strong>
                  <small className="muted">{s.duration} · {peso(s.deposit)} deposit</small>
                </div>
                <span className="go" aria-hidden="true"><Arrow /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Marquee variant="red reverse" speed="26s" items={['Book online', `Pay deposit via ${wallet}`, 'Studio or home service', 'Book online', `Pay deposit via ${wallet}`, 'Studio or home service']} />

      {/* ================= PROCESS ================= */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow" data-reveal>How it works</span>
              <SplitTitle lines={['Idea to', <em key="e">ink</em>]} />
            </div>
          </div>
          <div className="process">
            {[
              ['Book online', 'Choose your service, artist, date and time. Studio or home service, it is up to you.'],
              [`Secure via ${wallet}`, `Pay a small partial deposit with ${wallet} to lock in your slot. It goes toward your final price.`],
              ['Design together', 'Your artist sketches a custom design and fine-tunes it with you before the session.'],
              ['Get tattooed', 'Relax in a sterile, chill studio (or your own home) and walk away with aftercare guidance.'],
            ].map(([h, p], i) => (
              <div className="step" key={h} data-reveal style={{ '--d': `${i * 0.1}s` }}>
                <div className="n display">0{i + 1}</div>
                <h3 className="display">{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOME SERVICE ================= */}
      <section className="section" style={{ paddingTop: 0 }} id="home-service">
        <div className="container">
          <div className="home-service" data-reveal="scale">
            <div className="copy">
              <span className="eyebrow">We come to you</span>
              <SplitTitle lines={['Home', <em key="e">service</em>]} />
              <p className="lead">Tattoo parties, barkada sessions, or just the comfort of your own couch. We bring a complete sterile setup wherever you are.</p>
              <ul className="checks">
                <li>Portable, fully sterile station with single-use needles</li>
                <li>Serving {booking.homeServiceAreas}</li>
                <li>Transport fee from {peso(booking.homeServiceFee)} · {booking.homeServiceMinimum}</li>
              </ul>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/book?location=home" className="btn btn-red" data-magnetic>Book home service <Arrow /></Link>
                <Link href="/home-service" className="btn btn-ghost" data-magnetic>Learn more</Link>
              </div>
            </div>
            <div className="visual" aria-hidden="true">
              <div className="van"><ScooterArt /></div>
              <div className="road" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow" data-reveal>Kind words</span>
              <SplitTitle lines={['Inked &', <em key="e">happy</em>]} />
            </div>
            <Link href="/testimonials" className="btn btn-ghost" data-reveal data-magnetic>All reviews <Arrow /></Link>
          </div>
        </div>
        {testimonials.length > 0 && (
          <div className="t-marquee">
            {[0, 1].map((k) => (
              <div className="marquee-track" key={k} aria-hidden={k === 1}>
                {testimonials.map((t) => <TestimonialCard t={t} key={t.id} />)}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= FAQ ================= */}
      <section className="section" id="faq" style={{ paddingTop: 0 }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 48 }}>
          <div>
            <span className="eyebrow" data-reveal>Good to know</span>
            <SplitTitle lines={['Questions,', <em key="e">answered</em>]} />
            <p className="lead" data-reveal>Still unsure? Message us on Facebook or Instagram, or call <a className="link-u gold" href={`tel:${shop.phone}`}>{shop.phone}</a>.</p>
          </div>
          <Faq wallet={wallet} />
        </div>
      </section>

      {/* ================= VISIT ================= */}
      <section className="section" id="visit" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow" data-reveal>Find us</span>
              <SplitTitle lines={['Visit the', <em key="e">studio</em>]} />
            </div>
          </div>
          <Visit shop={shop} />
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="section cta">
        <div className="container">
          <Emblem className="cta-emblem" title="" />
          <span className="eyebrow" data-reveal>Ready when you are</span>
          <Link href="/book" data-cursor="Book">
            <h2 className="display">
              <span className="split-line"><span>Let&apos;s make</span></span>
              <span className="split-line"><span className="stroke" style={{ '--d': '0.1s' }}>something</span></span>
            </h2>
          </Link>
          <div style={{ marginTop: 36 }} data-reveal>
            <Link href="/book" className="btn btn-red" data-magnetic>Book your session <Arrow /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
