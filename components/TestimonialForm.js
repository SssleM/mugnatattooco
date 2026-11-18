'use client';
import { startTransition, useActionState } from 'react';
import ImageDrop from './ImageDrop';

export default function TestimonialForm({ action, artists }) {
  const [state, formAction, pending] = useActionState(action, null);
  if (state?.ok) {
    return (
      <div className="alert alert-ok" style={{ fontSize: 16, padding: 24 }}>
        <strong>Salamat!</strong> Your review was sent and will appear once our team approves it.
      </div>
    );
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); startTransition(() => formAction(fd)); }} style={{ display: 'grid', gap: 18 }}>
      {state?.error && <div className="alert alert-error">{state.error}</div>}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
      <div className="field">
        <span className="label">Your rating</span>
        <div className="rating-input">
          {[5, 4, 3, 2, 1].map((n) => (
            <span key={n} style={{ display: 'contents' }}>
              <input type="radio" id={`r${n}`} name="rating" value={n} defaultChecked={n === 5} />
              <label htmlFor={`r${n}`} aria-label={`${n} stars`}>★</label>
            </span>
          ))}
        </div>
      </div>
      <div className="grid-2">
        <div className="field"><label htmlFor="t-name">Name</label><input id="t-name" className="input" name="name" required maxLength={80} placeholder="Juan D." /></div>
        <div className="field">
          <label htmlFor="t-artist">Your artist</label>
          <select id="t-artist" className="select" name="artist_id" defaultValue="">
            <option value="">Not sure / other</option>
            {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
      </div>
      <div className="field"><label htmlFor="t-msg">Your experience</label><textarea id="t-msg" className="textarea" name="message" required minLength={10} maxLength={1200} placeholder="How was your session, the vibe, the healing…" /></div>
      <div className="field"><span className="label">Photo of your tattoo (optional)</span><ImageDrop name="photo" label="Add a photo" /></div>
      <button className="btn btn-red" disabled={pending} style={{ justifySelf: 'start' }}>{pending ? 'Sending…' : 'Submit review'}</button>
    </form>
  );
}
