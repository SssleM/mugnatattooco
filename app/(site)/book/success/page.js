import Link from 'next/link';
import { db } from '@/lib/db';
import { getSettings } from '@/lib/data';
import { getWallet } from '@/lib/wallet';
import { isCheckoutPaid, paymongoEnabled } from '@/lib/paymongo';
import { fmtDate, fmtTime, peso } from '@/lib/utils';
import { Arrow } from '@/components/Icons';

export const metadata = { title: 'Booking received' };

export default async function SuccessPage({ searchParams }) {
  const { code = '', cancelled } = await searchParams;
  const sql = await db();
  let [b] = await sql`
    SELECT b.*, a.name AS artist_name FROM bookings b LEFT JOIN artists a ON a.id = b.artist_id
    WHERE b.code = ${String(code).toUpperCase()}`;

  if (b && b.payment_method === 'gcash_paymongo' && b.payment_status !== 'paid' && b.paymongo_session_id && paymongoEnabled()) {
    if (await isCheckoutPaid(b.paymongo_session_id)) {
      await sql`UPDATE bookings SET payment_status = 'paid', status = CASE WHEN status = 'pending' THEN 'confirmed' ELSE status END WHERE id = ${b.id}`;
      b = { ...b, payment_status: 'paid', status: b.status === 'pending' ? 'confirmed' : b.status };
    }
  }

  if (!b) {
    return (
      <section className="page-hero"><div className="container success-card">
        <h1 className="display" style={{ fontSize: 60 }}>Booking not found</h1>
        <p className="muted">Double-check your booking code or contact us.</p>
        <Link href="/book" className="btn btn-red">Book a session</Link>
      </div></section>
    );
  }

  const paid = b.payment_status === 'paid';
  const unpaidOnline = b.payment_method === 'gcash_paymongo' && !paid;
  const wallet = getWallet((await getSettings()).gcash);

  return (
    <section className="page-hero">
      <div className="container">
        <div className="success-card">
          <div className="success-icon">
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#efe5d3" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          </div>
          <h1 className="display" style={{ fontSize: 'clamp(46px, 7vw, 84px)', margin: 0 }}>
            {unpaidOnline ? (cancelled ? 'Payment cancelled' : 'Almost there') : 'Slot requested!'}
          </h1>
          <p className="muted">Your booking code</p>
          <div className="code-pill">{b.code}</div>
          {paid && <div className="alert alert-ok" style={{ marginBottom: 20 }}>Deposit of {peso(b.deposit)} received via {wallet.name}. Your slot is confirmed!</div>}
          {b.payment_status === 'pending_verification' && (
            <div className="alert alert-warn" style={{ marginBottom: 20 }}>We received your {wallet.name} reference <strong>{b.gcash_ref}</strong>. Our team will verify your {peso(b.deposit)} deposit and confirm by text shortly.</div>
          )}
          {unpaidOnline && (
            <div className="alert alert-error" style={{ marginBottom: 20 }}>Your deposit has not been paid yet, so the slot is not confirmed. You can try again by booking once more, or contact us.</div>
          )}
          <div style={{ textAlign: 'left', margin: '10px 0 30px' }}>
            <div className="summary-row"><span>Service</span><span>{b.service_name}</span></div>
            <div className="summary-row"><span>Artist</span><span>{b.artist_name || 'First available'}</span></div>
            <div className="summary-row"><span>When</span><span>{fmtDate(b.date)} · {fmtTime(b.time)}</span></div>
            <div className="summary-row"><span>Where</span><span>{b.location_type === 'home' ? `Home service · ${b.address}` : 'MUGNA Studio'}</span></div>
          </div>
          <p className="muted" style={{ fontSize: 14 }}>Screenshot this page for reference. Please eat well, stay hydrated and avoid alcohol 24 hours before your session.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
            <Link href="/" className="btn btn-ghost">Back home</Link>
            <Link href="/aftercare" className="btn btn-red">Read aftercare <Arrow /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
