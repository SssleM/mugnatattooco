import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import SideNav from '@/components/admin/SideNav';
import Toaster from '@/components/admin/Toaster';
import Logo from '@/components/Logo';
import { logout } from '../actions';

export default async function PanelLayout({ children }) {
  const user = await requireUser();
  const sql = await db();
  const [c] = await sql`SELECT
    (SELECT count(*)::int FROM bookings WHERE status = 'pending' OR payment_status = 'pending_verification') AS bookings,
    (SELECT count(*)::int FROM testimonials WHERE NOT approved) AS reviews`;
  return (
    <div className="admin">
      <aside className="admin-side">
        <Link href="/admin" className="logo"><Logo sub="Staff Admin" /></Link>
        <SideNav counts={{ '/admin/bookings': c.bookings, '/admin/testimonials': c.reviews }} />
        <div className="foot">
          <span className="muted">Signed in as <strong style={{ color: 'var(--bone)' }}>{user.name}</strong></span>
          <div className="row">
            <Link href="/" target="_blank" className="link-u">View site ↗</Link>
            <form action={logout}><button className="link-u" style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--red-2)', padding: 0 }}>Log out</button></form>
          </div>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
      <Toaster />
    </div>
  );
}
