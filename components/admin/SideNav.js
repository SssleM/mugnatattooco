'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  ['/admin', 'Dashboard', '◎'],
  ['/admin/bookings', 'Bookings', '▤'],
  ['/admin/artists', 'Artists', '✦'],
  ['/admin/gallery', 'Gallery', '▦'],
  ['/admin/services', 'Services', '◈'],
  ['/admin/testimonials', 'Reviews', '★'],
  ['/admin/settings', 'Settings', '⚙'],
  ['/admin/staff', 'Staff', '☺'],
];

export default function SideNav({ counts = {} }) {
  const path = usePathname();
  return ITEMS.map(([href, label, icon]) => {
    const active = href === '/admin' ? path === '/admin' : path.startsWith(href);
    const c = counts[href];
    return (
      <Link key={href} href={href} className={`item ${active ? 'active' : ''}`}>
        <span aria-hidden="true" style={{ width: 18, textAlign: 'center' }}>{icon}</span>
        {label}
        {c > 0 && <span className="count">{c}</span>}
      </Link>
    );
  });
}
