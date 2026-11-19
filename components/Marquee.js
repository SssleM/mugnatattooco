import { Star4 } from './Icons';

export default function Marquee({ items, variant = '', speed = '32s' }) {
  const row = (
    <div className="marquee-track display" style={{ '--speed': speed }} aria-hidden="true">
      {items.map((t, i) => (
        <span className="marquee-item" key={i}>
          <span className={i % 2 ? 'outline' : ''}>{t}</span>
          <Star4 />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee ${variant}`}>
      {row}
      {row}
    </div>
  );
}
