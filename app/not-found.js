import Link from 'next/link';
export default function NotFound() {
  return (
    <div style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 20 }}>
      <div>
        <h1 className="display" style={{ fontSize: 'clamp(100px, 25vw, 260px)', margin: 0, color: 'transparent', WebkitTextStroke: '2px var(--red)' }}>404</h1>
        <p className="lead" style={{ margin: '0 auto 30px' }}>This page got lost in the ink.</p>
        <Link href="/" className="btn btn-red">Back home</Link>
      </div>
    </div>
  );
}
