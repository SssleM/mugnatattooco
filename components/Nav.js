'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Arrow } from './Icons';
import Logo from './Logo';

const LINKS = [
  { href: '/artists', label: 'Artists' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/home-service', label: 'Home Service' },
  { href: '/testimonials', label: 'Reviews' },
  { href: '/aftercare', label: 'Aftercare' },
  { href: '/contact', label: 'Visit' },
];

export default function Nav({ phone, email }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      setScrolled(y > 40);
      setHidden(y > 400 && y > last);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled ? 'scrolled' : ''} ${hidden && !open ? 'hide' : ''}`}>
        <div className="container nav-inner">
          <Link href="/" className="logo" aria-label="MUGNA Tattoo Co. home" data-magnetic>
            <Logo />
          </Link>
          <nav aria-label="Main">
            <ul className="nav-links">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={pathname.startsWith(l.href) ? 'active' : ''}>
                    <span className="roll"><span data-text={l.label}>{l.label}</span></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="nav-cta">
            <Link href="/book" className="btn btn-red btn-sm" data-magnetic>
              Book now <Arrow />
            </Link>
            <button className={`burger ${open ? 'open' : ''}`} aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
              <span /><span />
            </button>
          </div>
        </div>
      </header>
      <div className={`mobile-menu ${open ? 'open' : ''}`} aria-hidden={!open}>
        {[{ href: '/', label: 'Home' }, ...LINKS, { href: '/book', label: 'Book now' }].map((l, i) => (
          <Link key={l.href} href={l.href} className="big display" style={{ '--i': i }} tabIndex={open ? 0 : -1}>
            <span>{l.label}</span>
          </Link>
        ))}
        <div className="meta">
          <a href={`tel:${phone}`}>{phone}</a>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
      </div>
    </>
  );
}
