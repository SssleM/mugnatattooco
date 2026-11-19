import Link from 'next/link';
import { db } from '@/lib/db';
import { getArtists } from '@/lib/data';
import ActionForm from '@/components/admin/ActionForm';
import ImageField from '@/components/admin/ImageField';
import { updateArtwork, uploadArtworks } from '../../actions';

const STYLES = ['Neo-traditional', 'Traditional', 'Fine line', 'Blackwork', 'Geometric', 'Dotwork', 'Tribal', 'Botanical', 'Script', 'Realism', 'Cover-up'];

export default async function GalleryAdmin({ searchParams }) {
  const sp = await searchParams;
  const artistFilter = Number(sp.artist) || null;
  const sql = await db();
  const [artists, works] = await Promise.all([
    getArtists({ all: true }),
    sql`SELECT w.*, a.name AS artist_name FROM artworks w LEFT JOIN artists a ON a.id = w.artist_id
        WHERE (${artistFilter}::int IS NULL OR w.artist_id = ${artistFilter})
        ORDER BY w.created_at DESC, w.id DESC`,
  ]);
  const styles = Array.from(new Set([...STYLES, ...works.map((w) => w.style).filter(Boolean)]));

  return (
    <>
      <div className="admin-top"><h1 className="display">Gallery</h1></div>
      <datalist id="styles">{styles.map((s) => <option key={s} value={s} />)}</datalist>
      <div className="card" style={{ marginBottom: 24 }}>
        <h2>Upload new art</h2>
        <ActionForm action={uploadArtworks} reset className="stack">
          <div className="field"><label>Images (you can pick several)</label><ImageField name="images" multiple required /></div>
          <div className="grid-3">
            <div className="field"><label>Artist</label>
              <select name="artist_id" className="select input-sm" defaultValue={artistFilter || ''}>
                <option value="">Studio / unassigned</option>
                {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="field"><label>Title</label><input name="title" className="input input-sm" placeholder="e.g. Koi & Peony" /></div>
            <div className="field"><label>Style</label><input name="style" list="styles" className="input input-sm" placeholder="Fine line" /></div>
          </div>
          <label className="check"><input type="checkbox" name="featured" /> Feature on the home page</label>
          <button className="btn btn-red btn-sm" style={{ justifySelf: 'start' }}>Upload</button>
        </ActionForm>
      </div>

      <div className="tabs">
        <Link href="/admin/gallery" className={!artistFilter ? 'on' : ''}>All ({artistFilter ? '…' : works.length})</Link>
        {artists.map((a) => <Link key={a.id} href={`/admin/gallery?artist=${a.id}`} className={artistFilter === a.id ? 'on' : ''}>{a.name}</Link>)}
      </div>

      <div className="admin-grid">
        {works.map((w) => (
          <ActionForm key={w.id} action={updateArtwork} className="tile">
            <input type="hidden" name="id" value={w.id} />
            <div className="img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={w.image_url} alt={w.title} loading="lazy" />
              {w.featured && <span className="badge b-paid star" style={{ background: 'rgba(0,0,0,.6)' }}>Featured</span>}
            </div>
            <div className="pad">
              <input name="title" className="input input-sm" defaultValue={w.title} placeholder="Title" />
              <input name="style" list="styles" className="input input-sm" defaultValue={w.style} placeholder="Style" />
              <select name="artist_id" className="select input-sm" defaultValue={w.artist_id || ''}>
                <option value="">Studio / unassigned</option>
                {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <label className="check"><input type="checkbox" name="featured" defaultChecked={w.featured} /> Featured</label>
              <div className="spread">
                <button className="btn btn-sm" name="intent" value="save">Save</button>
                <button className="btn btn-danger btn-sm" name="intent" value="delete" formNoValidate>Delete</button>
              </div>
            </div>
          </ActionForm>
        ))}
      </div>
      {works.length === 0 && <p className="muted">No images yet.</p>}
    </>
  );
}
