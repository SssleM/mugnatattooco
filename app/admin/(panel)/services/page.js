import { getServices } from '@/lib/data';
import ActionForm from '@/components/admin/ActionForm';
import { saveService } from '../../actions';

function Fields({ s = {} }) {
  return (
    <>
      <div className="grid-2">
        <div className="field"><label>Name</label><input name="name" className="input input-sm" required defaultValue={s.name} /></div>
        <div className="field"><label>Duration</label><input name="duration" className="input input-sm" placeholder="2–3 hrs" defaultValue={s.duration} /></div>
      </div>
      <div className="field"><label>Description</label><input name="description" className="input input-sm" defaultValue={s.description} /></div>
      <div className="grid-3">
        <div className="field"><label>Starting price (₱)</label><input name="price_from" type="number" min="0" className="input input-sm" defaultValue={s.price_from ?? 0} /></div>
        <div className="field"><label>Deposit (₱)</label><input name="deposit" type="number" min="1" className="input input-sm" required defaultValue={s.deposit ?? 500} /></div>
        <div className="field"><label>Order</label><input name="sort" type="number" className="input input-sm" defaultValue={s.sort ?? 10} /></div>
      </div>
      <label className="check"><input type="checkbox" name="active" defaultChecked={s.active ?? true} /> Bookable on website</label>
    </>
  );
}

export default async function ServicesAdmin() {
  const services = await getServices({ all: true });
  return (
    <>
      <div className="admin-top"><h1 className="display">Services & deposits</h1></div>
      <p className="muted" style={{ marginTop: -14 }}>The deposit is the partial payment customers send through Maya (or the e-wallet set in Settings) when booking.</p>
      <div className="stack">
        {services.map((s) => (
          <div className="card" key={s.id}>
            <ActionForm action={saveService} className="stack">
              <input type="hidden" name="id" value={s.id} />
              <Fields s={s} />
              <div className="row">
                <button className="btn btn-sm" name="intent" value="save">Save</button>
                <button className="btn btn-danger btn-sm" name="intent" value="delete" formNoValidate>Delete</button>
              </div>
            </ActionForm>
          </div>
        ))}
        <div className="card" style={{ borderStyle: 'dashed' }}>
          <h2>Add a service</h2>
          <ActionForm action={saveService} reset className="stack">
            <Fields />
            <button className="btn btn-red btn-sm" style={{ justifySelf: 'start' }}>Add service</button>
          </ActionForm>
        </div>
      </div>
    </>
  );
}
