import Link from 'next/link';
import BookingForm from '@/components/BookingForm';
import SplitTitle from '@/components/SplitTitle';
import { getArtists, getServices, getSettings } from '@/lib/data';
import { paymongoEnabled } from '@/lib/paymongo';
import { getWallet } from '@/lib/wallet';
import { manilaToday } from '@/lib/utils';
import { createBooking } from './actions';

export const metadata = { title: 'Book a Session' };

export default async function BookPage({ searchParams }) {
  const sp = await searchParams;
  const [settings, services, artists] = await Promise.all([getSettings(), getServices(), getArtists()]);
  const wallet = getWallet(settings.gcash);
  const min = new Date(manilaToday() + 'T00:00:00Z');
  min.setUTCDate(min.getUTCDate() + Number(settings.booking.leadDays || 0));
  return (
    <>
      <section className="page-hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="breadcrumbs"><Link href="/">Home</Link> / Book</div>
          <SplitTitle as="h1" className="display" lines={['Book your', <em key="e" style={{ color: 'var(--red)', fontStyle: 'normal' }}>session</em>]} />
          <p className="lead" data-reveal>Five quick steps. Secure your slot with a small partial deposit through {wallet.name}.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <BookingForm
            action={createBooking}
            services={services.map(({ id, name, description, price_from, deposit }) => ({ id, name, description, price_from, deposit }))}
            artists={artists.map(({ id, name, photo_url, specialties }) => ({ id, name, photo_url, specialties }))}
            booking={settings.booking}
            wallet={wallet}
            paymongo={paymongoEnabled()}
            minDate={min.toISOString().slice(0, 10)}
            initial={{ service: sp.service || '', artist: sp.artist || '', location: sp.location || '' }}
          />
        </div>
      </section>
    </>
  );
}
