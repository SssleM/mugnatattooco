import Link from 'next/link';
import { getArtists } from '@/lib/data';
import ActionForm from '@/components/admin/ActionForm';
import ArtistFields from '@/components/admin/ArtistFields';
import { saveArtist } from '../../actions';

export default async function ArtistsAdmin() {
  const artists = await getArtists({ all: true });
  return (
    <>
      <div className="admin-top"><h1 className="display">Artists</h1></div>
      <div className="admin-grid" style={{ marginBottom: 28 }}>
        {artists.map((a) => (
          <Link href={`/admin/artists/${a.id}`} key={a.id} className="tile">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="img"><img src={a.photo_url || '/art/artist-paeng.svg'} alt="" /></div>
            <div className="pad">
              <div className="spread"><strong>{a.name}</strong>{!a.active && <span className="badge b-cancelled">Hidden</span>}</div>
              <span className="muted" style={{ fontSize: 13 }}>{a.title} · {a.work_count} works</span>
              <span className="link-u gold" style={{ fontSize: 13, justifySelf: 'start' }}>Edit profile →</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="card">
        <h2>Add a new artist</h2>
        <ActionForm action={saveArtist} reset className="stack">
          <ArtistFields />
          <button className="btn btn-red btn-sm" style={{ justifySelf: 'start' }}>Add artist</button>
        </ActionForm>
      </div>
    </>
  );
}
