import Link from 'next/link';
import { Facebook, Instagram, TikTok } from './Icons';
import { Emblem } from './Logo';

export default function Footer({ shop }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Emblem className="footer-emblem" />
            <div className="logo" style={{ marginBottom: 18 }}>
              <span className="display">Mugna</span>
              <span className="gothic">Tattoo Co.</span>
            </div>
            <p className="muted" style={{ maxWidth: '36ch', margin: '0 0 22px' }}>{shop.tagline} Custom tattoos, flash days and home service since {shop.founded}.</p>
            <div className="socials">
              {shop.instagram && <a className="social" href={shop.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a>}
              {shop.facebook && <a className="social" href={shop.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook /></a>}
              {shop.tiktok && <a className="social" href={shop.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok"><TikTok /></a>}
            </div>
          </div>
          <div>
            <h5>Studio</h5>
            <ul>
              <li><Link className="link-u" href="/artists">Artists</Link></li>
              <li><Link className="link-u" href="/gallery">Gallery</Link></li>
              <li><Link className="link-u" href="/testimonials">Reviews</Link></li>
              <li><Link className="link-u" href="/aftercare">Aftercare</Link></li>
            </ul>
          </div>
          <div>
            <h5>Book</h5>
            <ul>
              <li><Link className="link-u" href="/book">Book a session</Link></li>
              <li><Link className="link-u" href="/home-service">Home service</Link></li>
              <li><Link className="link-u" href="/#faq">FAQ</Link></li>
              <li><Link className="link-u" href="/admin">Staff login</Link></li>
            </ul>
          </div>
          <div>
            <h5>Contact</h5>
            <ul>
              <li><a className="link-u" href={`tel:${shop.phone}`}>{shop.phone}</a></li>
              <li><a className="link-u" href={`mailto:${shop.email}`}>{shop.email}</a></li>
              <li className="muted">{shop.address}</li>
            </ul>
          </div>
        </div>
        <div className="footer-big display" aria-hidden="true">MUGNA TATTOO</div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {shop.name} All rights reserved.</span>
          <span>Sterile. Single-use needles. 18+ only.</span>
        </div>
      </div>
    </footer>
  );
}
