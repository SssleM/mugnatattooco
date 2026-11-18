import { Pin } from './Icons';

export default function Visit({ shop }) {
  const q = `${shop.lat},${shop.lng}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
  return (
    <div className="visit">
      <div className="visit-card" data-reveal="left">
        <h4>Address</h4>
        <p style={{ margin: 0, fontSize: 20 }}>{shop.address}</p>
        <h4>Hours</h4>
        <table className="hours">
          <tbody>
            {shop.hours.map((h) => (
              <tr key={h.day}><td>{h.day}</td><td>{h.time}</td></tr>
            ))}
          </tbody>
        </table>
        <h4>Talk to us</h4>
        <p style={{ margin: 0 }}>
          <a className="link-u" href={`tel:${shop.phone}`}>{shop.phone}</a><br />
          <a className="link-u" href={`mailto:${shop.email}`}>{shop.email}</a>
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
          <a className="btn btn-sm" href={directions} target="_blank" rel="noreferrer" data-magnetic>Get directions</a>
          <a className="btn btn-ghost btn-sm" href="/book" data-magnetic>Book a visit</a>
        </div>
      </div>
      <div className="map-wrap" data-reveal="clip">
        <iframe
          title={`Map to ${shop.name}`}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <span className="map-pin"><Pin /></span>
      </div>
    </div>
  );
}
