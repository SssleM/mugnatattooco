import Link from 'next/link';
import { db } from '@/lib/db';
import { fmtDate, fmtTime, manilaToday, peso, PAYMENT_LABELS, STATUS_LABELS } from '@/lib/utils';

export default async function Dashboard() {
  const sql = await db();
  const today = manilaToday();
  const [k] = await sql`SELECT
    (SELECT count(*)::int FROM bookings WHERE status = 'pending') AS pending,
    (SELECT count(*)::int FROM bookings WHERE payment_status = 'pending_verification') AS verify,
    (SELECT count(*)::int FROM bookings WHERE date = ${today} AND status IN ('pending','confirmed')) AS today,
    (SELECT count(*)::int FROM bookings WHERE date >= ${today} AND date < ${today}::date + 7 AND status <> 'cancelled') AS week,
    (SELECT coalesce(sum(deposit),0)::int FROM bookings WHERE payment_status = 'paid' AND created_at > now() - interval '30 days') AS deposits,
    (SELECT count(*)::int FROM testimonials WHERE NOT approved) AS reviews,
    (SELECT count(*)::int FROM artworks) AS works,
    (SELECT count(*)::int FROM bookings WHERE location_type = 'home' AND date >= ${today} AND status <> 'cancelled') AS home`;
  const upcoming = await sql`
    SELECT b.*, a.name AS artist_name FROM bookings b LEFT JOIN artists a ON a.id = b.artist_id
    WHERE b.date >= ${today} AND b.status <> 'cancelled' ORDER BY b.date, b.time LIMIT 8`;
  const recent = await sql`SELECT code, name, service_name, created_at, payment_status FROM bookings ORDER BY created_at DESC LIMIT 6`;

  const kpis = [
    ['Need confirmation', k.pending, '/admin/bookings?status=pending', k.pending > 0],
    ['Payments to verify', k.verify, '/admin/bookings?pay=pending_verification', k.verify > 0],
    ['Sessions today', k.today, '/admin/bookings?when=today'],
    ['Next 7 days', k.week, '/admin/bookings?when=upcoming'],
    ['Deposits (30d)', peso(k.deposits), '/admin/bookings?pay=paid'],
    ['Upcoming home service', k.home, '/admin/bookings?loc=home'],
    ['Reviews to approve', k.reviews, '/admin/testimonials', k.reviews > 0],
    ['Gallery images', k.works, '/admin/gallery'],
  ];

  return (
    <>
      <div className="admin-top">
        <h1 className="display">Dashboard</h1>
        <div className="row">
          <Link href="/admin/gallery" className="btn btn-ghost btn-sm">+ Upload art</Link>
          <Link href="/admin/artists" className="btn btn-ghost btn-sm">+ Add artist</Link>
        </div>
      </div>
      <div className="kpis">
        {kpis.map(([l, v, href, hot]) => (
          <Link key={l} href={href} className={`kpi ${hot ? 'hot' : ''}`}><div className="v">{v}</div><div className="l">{l}</div></Link>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 16 }}>
        <div className="card">
          <h2>Upcoming sessions</h2>
          {upcoming.length === 0 && <p className="muted">No upcoming bookings.</p>}
          <table className="table"><tbody>
            {upcoming.map((b) => (
              <tr key={b.id}>
                <td><strong>{fmtDate(b.date)}</strong><br /><span className="muted">{fmtTime(b.time)}</span></td>
                <td>{b.name}<br /><span className="muted">{b.service_name} · {b.artist_name || 'Any artist'}</span></td>
                <td style={{ textAlign: 'right' }}>
                  <span className={`badge b-${b.status}`}>{STATUS_LABELS[b.status]}</span>
                  {b.location_type === 'home' && <><br /><span className="badge b-home" style={{ marginTop: 6 }}>Home</span></>}
                </td>
              </tr>
            ))}
          </tbody></table>
        </div>
        <div className="card">
          <h2>Latest requests</h2>
          <table className="table"><tbody>
            {recent.map((b) => (
              <tr key={b.code}>
                <td><Link className="link-u" href={`/admin/bookings?q=${b.code}`}>{b.code}</Link><br /><span className="muted">{new Date(b.created_at).toLocaleString('en-PH', { timeZone: 'Asia/Manila', dateStyle: 'medium', timeStyle: 'short' })}</span></td>
                <td>{b.name}<br /><span className="muted">{b.service_name}</span></td>
                <td style={{ textAlign: 'right' }}><span className={`badge b-${b.payment_status}`}>{PAYMENT_LABELS[b.payment_status]}</span></td>
              </tr>
            ))}
          </tbody></table>
          {recent.length === 0 && <p className="muted">No bookings yet. Share your booking link: <Link className="link-u gold" href="/book">/book</Link></p>}
        </div>
      </div>
    </>
  );
}
