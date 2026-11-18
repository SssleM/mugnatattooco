import Link from 'next/link';
import SplitTitle from '@/components/SplitTitle';
import Faq from '@/components/Faq';
import VanArt from '@/components/VanArt';
import { Arrow } from '@/components/Icons';
import { getSettings } from '@/lib/data';
import { peso } from '@/lib/utils';

export const metadata = { title: 'Home Service' };

export default async function HomeServicePage() {
  const { booking } = await getSettings();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs"><Link href="/">Home</Link> / Home Service</div>
          <SplitTitle as="h1" className="display" lines={['We come', <em key="e" style={{ color: 'var(--red)', fontStyle: 'normal' }}>to you</em>]} />
          <p className="lead" data-reveal>Get tattooed in the comfort of your home, office, or at your event. Same artists, same sterile standards, zero commute.</p>
          <div style={{ marginTop: 30 }} data-reveal><Link href="/book?location=home" className="btn btn-red" data-magnetic>Book home service <Arrow /></Link></div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="home-service" data-reveal="scale">
            <div className="copy">
              <h2 className="display" style={{ fontSize: 'clamp(36px, 5vw, 64px)', margin: '0 0 10px' }}>How it works</h2>
              <ul className="checks">
                <li>Book online and choose <strong>Home service</strong>, then enter your full address and landmarks.</li>
                <li>Pay your partial deposit through GCash to lock in the date.</li>
                <li>Your artist arrives 30 minutes early to set up a clean, wrapped, single-use station.</li>
                <li>We clean up, pack out all sharps safely, and leave you with aftercare instructions.</li>
              </ul>
            </div>
            <div className="visual" aria-hidden="true"><div className="van"><VanArt /></div><div className="road" /></div>
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container process">
          {[
            ['Coverage', booking.homeServiceAreas],
            ['Transport fee', `From ${peso(booking.homeServiceFee)} depending on distance. Added to your total at checkout.`],
            ['Minimum', booking.homeServiceMinimum],
            ['What you provide', 'A table, a chair, good lighting, and a clean space near an outlet. We bring everything else.'],
          ].map(([h, p], i) => (
            <div className="step" key={h} data-reveal style={{ '--d': `${i * 0.1}s` }}>
              <div className="n display">0{i + 1}</div>
              <h3 className="display">{h}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="section-title display" style={{ marginBottom: 30 }}>Home service <em>FAQ</em></h2>
          <Faq items={[
            ['Is it as safe as the studio?', 'Yes. We use barrier film, single-use cartridges, medical-grade disinfectant and a portable sharps container. The only thing that changes is the view.'],
            ['Can you do a tattoo party?', 'Absolutely. Birthdays, despedidas, barkada flash days. For groups of 4 or more we can bring two artists.'],
            ['How far do you travel?', `We regularly serve ${booking.homeServiceAreas} Message us for anything farther.`],
          ]} />
        </div>
      </section>
    </>
  );
}
