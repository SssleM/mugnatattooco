import { Stars } from './Icons';

export default function TestimonialCard({ t }) {
  return (
    <article className="t-card">
      <Stars n={t.rating} />
      <p>“{t.message}”</p>
      <div className="who">
        <span className="avatar">
          {t.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={t.photo_url} alt="" />
          ) : (
            t.name.slice(0, 1).toUpperCase()
          )}
        </span>
        <div>
          <strong>{t.name}</strong>
          {t.artist_name && <div className="muted" style={{ fontSize: 13 }}>Tattooed by {t.artist_name}</div>}
        </div>
      </div>
    </article>
  );
}
