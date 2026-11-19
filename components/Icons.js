export const Arrow = (p) => (
  <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const Star4 = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>
);
export const Instagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
);
export const Facebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z" /></svg>
);
export const TikTok = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 2h-3.4v13.4a3 3 0 1 1-3-3c.3 0 .6 0 .9.1V9a6.5 6.5 0 1 0 5.5 6.4V8.7a8 8 0 0 0 4.4 1.4V6.7a4.6 4.6 0 0 1-4.4-4.7z" /></svg>
);
export const Pin = (p) => (
  <svg width="44" height="56" viewBox="0 0 24 30" {...p}><path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.3 12 30 12 30s12-9.7 12-18.3C24 5.2 18.6 0 12 0z" fill="#c8322b" /><circle cx="12" cy="11.5" r="4.5" fill="#efe5d3" /></svg>
);
export function Stars({ n = 5 }) {
  return (
    <span className="stars" aria-label={`${n} out of 5 stars`}>
      {'★★★★★'.split('').map((s, i) => <span key={i} className={i < n ? '' : 'off'}>{s}</span>)}
    </span>
  );
}
