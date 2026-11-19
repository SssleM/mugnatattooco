import Link from 'next/link';
import { db } from '@/lib/db';
import { getArtists, getSettings } from '@/lib/data';
import ActionForm from '@/components/admin/ActionForm';
import { fmtDate, fmtTime, isoDate, manilaToday, peso, PAYMENT_LABELS, STATUS_LABELS } from '@/lib/utils';
import { deleteBooking, updateBooking } from '../../actions';

const TABS = [
  ['All', {}],
  ['Pending', { status: 'pending' }],
  ['Verify payment', { pay: 'pending_verification' }],
  ['Confirmed', { status: 'confirmed' }],
  ['Today', { when: 'today' }],
  ['Upcoming', { when: 'upcoming' }],
  ['Home service', { loc: 'home' }],
  ['Completed', { status: 'completed' }],
  ['Cancelled', { status: 'cancelled' }],
];

export default async function BookingsPage({ searchParams }) {
  const sp = await searchParams;
  const sql = await db();
  const today = manilaToday();
  const q = sp.q ? `%${String(sp.q).trim()}%` : null;
  const rows = await sql`
    SELECT b.*, a.name AS artist_name FROM bookings b LEFT JOIN artists a ON a.id = b.artist_id
    WHERE (${sp.status ?? null}::text IS NULL OR b.status = ${sp.status ?? null})
      AND (${sp.pay ?? null}::text IS NULL OR b.payment_status = ${sp.pay ?? null})
      AND (${sp.loc ?? null}::text IS NULL OR b.location_type = ${sp.loc ?? null})
      AND (${sp.when ?? null}::text IS NULL
           OR (${sp.when ?? null} = 'today' AND b.date = ${today})
           OR (${sp.when ?? null} = 'upcoming' AND b.date >= ${today} AND b.status <> 'cancelled'))
      AND (${q}::text IS NULL OR b.code ILIKE ${q} OR b.name ILIKE ${q} OR b.phone ILIKE ${q} OR b.gcash_ref ILIKE ${q})
    ORDER BY ${sp.when ? sql`b.date ASC, b.time ASC` : sql`b.created_at DESC`}
    LIMIT 200`;
  const [artists, settings] = await Promise.all([getArtists({ all: true }), getSettings()]);
  const current = JSON.stringify(Object.fromEntries(Object.entries(sp).filter(([k]) => k !== 'q')));

  return (
    <>
      <div className="admin-top">
        <h1 className="display">Bookings</h1>
        <form className="row" action="/admin/bookings">
          <input name="q" className="input input-sm" placeholder="Search code, name, phone, reference no." defaultValue={sp.q || ''} style={{ width: 280 }} />
          <button className="btn btn-ghost btn-sm">Search</button>
        </form>
      </div>
      <div className="tabs">
        {TABS.map(([label, params]) => {
          const href = '/admin/bookings' + (Object.keys(params).length ? '?' + new URLSearchParams(params) : '');
          return <Link key={label} href={href} className={JSON.stringify(params) === current ? 'on' : ''}>{label}</Link>;
        })}
      </div>
      {rows.length === 0 && <div className="card muted">No bookings found.</div>}
      <div className="stack">
        {rows.map((b) => (
          <details className="booking" key={b.id} open={rows.length === 1}>
            <summary>
              <div><strong>{b.name}</strong> <span className="muted" style={{ fontFamily: 'monospace', fontSize: 13 }}>· {b.code}</span><br /><span className="muted" style={{ fontSize: 13 }}>{b.service_name} · {b.artist_name || 'Any artist'}</span></div>
              <div style={{ fontSize: 14 }}>{fmtDate(b.date)}<br /><span className="muted">{fmtTime(b.time)}</span></div>
              <div className="row" style={{ gap: 6 }}>
                <span className={`badge b-${b.status}`}>{STATUS_LABELS[b.status]}</span>
                <span className={`badge b-${b.payment_status}`}>{PAYMENT_LABELS[b.payment_status]}</span>
                {b.location_type === 'home' && <span className="badge b-home">Home</span>}
              </div>
              <span className="muted" aria-hidden="true">▾</span>
            </summary>
            <div className="body">
              <div className="stack">
                <dl className="kv">
                  <dt>Phone</dt><dd><a className="link-u" href={`tel:${b.phone}`}>{b.phone}</a></dd>
                  <dt>Email</dt><dd>{b.email ? <a className="link-u" href={`mailto:${b.email}`}>{b.email}</a> : '—'}</dd>
                  <dt>Location</dt><dd>{b.location_type === 'home' ? <>Home service<br /><a className="link-u gold" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.address)}`}>{b.address}</a></> : 'Studio'}</dd>
                  <dt>Placement</dt><dd>{b.placement || '—'}</dd>
                  <dt>Size / style</dt><dd>{[b.size, b.style].filter(Boolean).join(' · ') || '—'}</dd>
                  <dt>Idea</dt><dd style={{ whiteSpace: 'pre-wrap' }}>{b.description || '—'}</dd>
                  <dt>Estimate</dt><dd>from {peso(b.estimate)}</dd>
                  <dt>Deposit</dt><dd><strong className="gold">{peso(b.deposit)}</strong> · {b.payment_method === 'gcash_paymongo' ? 'Online checkout (PayMongo)' : 'QR transfer + receipt'}</dd>
                  {b.gcash_ref && <><dt>Reference no.</dt><dd style={{ fontFamily: 'monospace' }}>{b.gcash_ref}</dd></>}
                  <dt>Requested</dt><dd>{new Date(b.created_at).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}</dd>
                </dl>
                <div className="row" style={{ alignItems: 'flex-start' }}>
                  {b.reference_url && <a href={b.reference_url} target="_blank" rel="noreferrer"><span className="label">Reference</span>{/* eslint-disable-next-line @next/next/no-img-element */}<img className="thumb" src={b.reference_url} alt="Reference" /></a>}
                  {b.receipt_url && <a href={b.receipt_url} target="_blank" rel="noreferrer"><span className="label">Payment receipt</span>{/* eslint-disable-next-line @next/next/no-img-element */}<img className="thumb" src={b.receipt_url} alt="Receipt" /></a>}
                </div>
              </div>
              <div className="stack">
                {b.payment_status === 'pending_verification' && (
                  <ActionForm action={updateBooking}>
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="quick" value="verify" />
                    <button className="btn btn-red btn-sm" style={{ width: '100%' }}>✓ Mark deposit received & confirm</button>
                  </ActionForm>
                )}
                <ActionForm action={updateBooking} className="stack">
                  <input type="hidden" name="id" value={b.id} />
                  <div className="grid-2">
                    <div className="field"><label>Status</label>
                      <select name="status" className="select input-sm" defaultValue={b.status}>
                        {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                    <div className="field"><label>Payment</label>
                      <select name="payment_status" className="select input-sm" defaultValue={b.payment_status}>
                        {Object.entries(PAYMENT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                    <div className="field"><label>Date</label><input type="date" name="date" className="input input-sm" defaultValue={isoDate(b.date)} /></div>
                    <div className="field"><label>Time</label>
                      <select name="time" className="select input-sm" defaultValue={b.time}>
                        {Array.from(new Set([...settings.booking.timeSlots, b.time])).sort().map((t) => <option key={t} value={t}>{fmtTime(t)}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="field"><label>Artist</label>
                    <select name="artist_id" className="select input-sm" defaultValue={b.artist_id || ''}>
                      <option value="">Any / unassigned</option>
                      {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                  <div className="field"><label>Staff notes (private)</label><textarea name="staff_notes" className="textarea input-sm" style={{ minHeight: 80 }} defaultValue={b.staff_notes} /></div>
                  <button className="btn btn-sm" type="submit">Save changes</button>
                </ActionForm>
                <div className="row">
                  {b.phone && <a className="btn btn-ghost btn-sm" href={`sms:${b.phone}?body=${encodeURIComponent(`Hi ${b.name.split(' ')[0]}! This is MUGNA Tattoo Co. Your booking ${b.code} on ${fmtDate(b.date)} at ${fmtTime(b.time)} is confirmed. See you!`)}`}>Text client</a>}
                  <ActionForm action={deleteBooking} confirm={`Delete booking ${b.code}? This cannot be undone.`}>
                    <input type="hidden" name="id" value={b.id} />
                    <button className="btn btn-danger btn-sm">Delete</button>
                  </ActionForm>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
