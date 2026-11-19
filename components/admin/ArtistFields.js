import ImageField from './ImageField';

export default function ArtistFields({ a = {} }) {
  return (
    <>
      <div className="grid-2">
        <div className="field"><label>Name</label><input name="name" className="input input-sm" required defaultValue={a.name} /></div>
        <div className="field"><label>Title / role</label><input name="title" className="input input-sm" placeholder="e.g. Fine Line Specialist" defaultValue={a.title} /></div>
      </div>
      <div className="field"><label>Bio</label><textarea name="bio" className="textarea input-sm" defaultValue={a.bio} /></div>
      <div className="grid-3">
        <div className="field"><label>Specialties (comma separated)</label><input name="specialties" className="input input-sm" placeholder="Blackwork, Fine line" defaultValue={a.specialties} /></div>
        <div className="field"><label>Instagram handle</label><input name="instagram" className="input input-sm" placeholder="mugna.artist" defaultValue={a.instagram} /></div>
        <div className="grid-2" style={{ gap: 10 }}>
          <div className="field"><label>Years</label><input name="years" type="number" min="0" className="input input-sm" defaultValue={a.years ?? 1} /></div>
          <div className="field"><label>Order</label><input name="sort" type="number" className="input input-sm" defaultValue={a.sort ?? 10} /></div>
        </div>
      </div>
      <div className="field"><label>Profile photo</label><ImageField name="photo" current={a.photo_url} /></div>
      <label className="check"><input type="checkbox" name="active" defaultChecked={a.active ?? true} /> Show on website</label>
    </>
  );
}
