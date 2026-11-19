import { getArtists, getTestimonials } from '@/lib/data';
import ActionForm from '@/components/admin/ActionForm';
import ImageField from '@/components/admin/ImageField';
import { Stars } from '@/components/Icons';
import { addTestimonial, moderateTestimonial } from '../../actions';

export default async function TestimonialsAdmin() {
  const [all, artists] = await Promise.all([getTestimonials({ approved: null, limit: 500 }), getArtists({ all: true })]);
  const pending = all.filter((t) => !t.approved);
  const live = all.filter((t) => t.approved);
  const Item = ({ t }) => (
    <div className="card">
      <div className="spread">
        <div className="row"><strong>{t.name}</strong><Stars n={t.rating} /></div>
        <span className="muted" style={{ fontSize: 13 }}>{new Date(t.created_at).toLocaleDateString('en-PH')} {t.artist_name && `· ${t.artist_name}`}</span>
      </div>
      <p style={{ margin: '12px 0', color: 'var(--bone-2)' }}>{t.message}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {t.photo_url && <a href={t.photo_url} target="_blank" rel="noreferrer"><img src={t.photo_url} alt="" className="thumb" style={{ maxWidth: 140, marginBottom: 12 }} /></a>}
      <ActionForm action={moderateTestimonial} className="row">
        <input type="hidden" name="id" value={t.id} />
        {t.approved ? <button className="btn btn-ghost btn-sm" name="intent" value="hide">Hide</button> : <button className="btn btn-red btn-sm" name="intent" value="approve">Approve & publish</button>}
        <button className="btn btn-danger btn-sm" name="intent" value="delete">Delete</button>
      </ActionForm>
    </div>
  );
  return (
    <>
      <div className="admin-top"><h1 className="display">Reviews</h1></div>
      <h3>Waiting for approval ({pending.length})</h3>
      <div className="stack" style={{ marginBottom: 32 }}>
        {pending.length === 0 && <p className="muted">All caught up.</p>}
        {pending.map((t) => <Item key={t.id} t={t} />)}
      </div>
      <h3>Published ({live.length})</h3>
      <div className="stack" style={{ marginBottom: 32 }}>{live.map((t) => <Item key={t.id} t={t} />)}</div>
      <div className="card">
        <h2>Add a review manually</h2>
        <p className="muted" style={{ marginTop: -8 }}>For reviews you received on Facebook, Google or in person.</p>
        <ActionForm action={addTestimonial} reset className="stack">
          <div className="grid-3">
            <div className="field"><label>Client name</label><input name="name" className="input input-sm" required /></div>
            <div className="field"><label>Rating</label><select name="rating" className="select input-sm" defaultValue="5">{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}</select></div>
            <div className="field"><label>Artist</label><select name="artist_id" className="select input-sm" defaultValue=""><option value="">—</option>{artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
          </div>
          <div className="field"><label>Review</label><textarea name="message" className="textarea input-sm" required /></div>
          <div className="field"><label>Photo (optional)</label><ImageField name="photo" /></div>
          <button className="btn btn-red btn-sm" style={{ justifySelf: 'start' }}>Add review</button>
        </ActionForm>
      </div>
    </>
  );
}
