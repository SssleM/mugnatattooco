'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function Gallery({ works, showFilters = true, filterBy = 'style' }) {
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(-1);

  const options = useMemo(() => {
    const key = filterBy === 'artist' ? 'artist_name' : 'style';
    return ['All', ...Array.from(new Set(works.map((w) => w[key]).filter(Boolean)))];
  }, [works, filterBy]);

  const list = useMemo(() => {
    if (filter === 'All') return works;
    return works.filter((w) => (filterBy === 'artist' ? w.artist_name : w.style) === filter);
  }, [works, filter, filterBy]);

  const close = useCallback(() => setOpen(-1), []);
  const go = useCallback((d) => setOpen((i) => (i + d + list.length) % list.length), [list.length]);

  useEffect(() => {
    if (open < 0) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, close, go]);

  const current = list[open];

  return (
    <>
      {showFilters && options.length > 2 && (
        <div className="filters" role="tablist" aria-label="Filter artwork">
          {options.map((o) => (
            <button key={o} role="tab" aria-selected={filter === o} className={`filter-btn ${filter === o ? 'active' : ''}`} onClick={() => setFilter(o)}>
              {o}
            </button>
          ))}
        </div>
      )}
      <div className="masonry" key={filter}>
        {list.map((w, i) => (
          <button key={w.id} className="art-card" style={{ '--i': i % 12 }} onClick={() => setOpen(i)} data-tilt="8" data-cursor="View" aria-label={`View ${w.title || 'artwork'}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={w.image_url} alt={w.title || 'Tattoo artwork'} loading="lazy" />
            <span className="glare" />
            <span className="overlay">
              <h4 className="display">{w.title || 'Untitled'}</h4>
              <span>{[w.style, w.artist_name].filter(Boolean).join(' · ')}</span>
            </span>
          </button>
        ))}
      </div>
      {list.length === 0 && <p className="muted">No artwork here yet.</p>}

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.title} onClick={(e) => e.target === e.currentTarget && close()}>
          <button className="lb-btn lb-prev" onClick={() => go(-1)} aria-label="Previous">←</button>
          <figure key={current.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.image_url} alt={current.title} />
            <figcaption>
              <h4 className="display">{current.title}</h4>
              <span className="muted">{[current.style, current.artist_name && `by ${current.artist_name}`].filter(Boolean).join(' · ')}</span>
            </figcaption>
          </figure>
          <button className="lb-btn lb-next" onClick={() => go(1)} aria-label="Next">→</button>
          <button className="lb-btn lb-close" onClick={close} aria-label="Close">✕</button>
        </div>
      )}
    </>
  );
}
