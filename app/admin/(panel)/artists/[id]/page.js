import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import ActionForm from '@/components/admin/ActionForm';
import ArtistFields from '@/components/admin/ArtistFields';
import { deleteArtist, saveArtist } from '../../../actions';

export default async function EditArtist({ params }) {
  const { id } = await params;
  const sql = await db();
  const [a] = await sql`SELECT * FROM artists WHERE id = ${Number(id) || 0}`;
  if (!a) notFound();
  return (
    <>
      <div className="admin-top">
        <div>
          <Link href="/admin/artists" className="muted link-u">← All artists</Link>
          <h1 className="display">{a.name}</h1>
        </div>
        <div className="row">
          <Link className="btn btn-ghost btn-sm" href={`/admin/gallery?artist=${a.id}`}>Manage their gallery</Link>
          <Link className="btn btn-ghost btn-sm" href={`/artists/${a.slug}`} target="_blank">View profile ↗</Link>
        </div>
      </div>
      <div className="card">
        <ActionForm action={saveArtist} className="stack">
          <input type="hidden" name="id" value={a.id} />
          <ArtistFields a={a} />
          <button className="btn btn-red btn-sm" style={{ justifySelf: 'start' }}>Save artist</button>
        </ActionForm>
      </div>
      <div className="card" style={{ marginTop: 16, borderColor: 'rgba(224,74,63,.3)' }}>
        <h3>Danger zone</h3>
        <p className="muted">Deleting an artist keeps their gallery images (unassigned) and past bookings.</p>
        <ActionForm action={deleteArtist} confirm={`Delete ${a.name}? This cannot be undone.`}>
          <input type="hidden" name="id" value={a.id} />
          <button className="btn btn-danger btn-sm">Delete artist</button>
        </ActionForm>
      </div>
    </>
  );
}
