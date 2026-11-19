import { getSettings } from '@/lib/data';
import { paymongoEnabled } from '@/lib/paymongo';
import ActionForm from '@/components/admin/ActionForm';
import ImageField from '@/components/admin/ImageField';
import { saveSettings } from '../../actions';
import { getWallet } from '@/lib/wallet';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default async function SettingsAdmin() {
  const { shop, booking, gcash } = await getSettings();
  const wallet = getWallet(gcash);
  const blob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  return (
    <>
      <div className="admin-top"><h1 className="display">Settings</h1></div>
      <div className="stack" style={{ gap: 20 }}>
        <div className="card">
          <h2>{wallet.name} deposit</h2>
          <div className="alert" style={{ marginBottom: 16, borderColor: 'var(--line-2)' }}>
            Instant {wallet.name} checkout (PayMongo): <strong className={paymongoEnabled() ? 'gold' : 'muted'}>{paymongoEnabled() ? 'ON' : 'OFF'}</strong>.{' '}
            {paymongoEnabled() ? 'Customers can pay in-app and bookings are confirmed automatically.' : `Customers scan your ${wallet.name} QR and upload a receipt; you verify it in Bookings. Add PAYMONGO_SECRET_KEY on Vercel to enable instant checkout.`}
          </div>
          <ActionForm action={saveSettings} className="stack">
            <input type="hidden" name="section" value="gcash" />
            <div className="field"><label>E-wallet customers pay with</label>
              <select name="provider" className="select input-sm" defaultValue={wallet.key}>
                <option value="maya">Maya</option>
                <option value="gcash">GCash</option>
              </select>
            </div>
            <div className="grid-2">
              <div className="field"><label>Account name</label><input name="accountName" className="input input-sm" defaultValue={gcash.accountName} /></div>
              <div className="field"><label>Mobile number</label><input name="number" className="input input-sm" defaultValue={gcash.number} /></div>
            </div>
            <div className="field"><label>QR code (Maya app → Receive money → save your QR as an image)</label><ImageField name="qr" current={wallet.qrUrl} /></div>
            <button className="btn btn-red btn-sm" style={{ justifySelf: 'start' }}>Save payment details</button>
          </ActionForm>
        </div>

        <div className="card">
          <h2>Booking rules & home service</h2>
          <ActionForm action={saveSettings} className="stack">
            <input type="hidden" name="section" value="booking" />
            <div className="grid-2">
              <div className="field"><label>Time slots (24h, comma separated)</label><input name="timeSlots" className="input input-sm" defaultValue={booking.timeSlots.join(', ')} /></div>
              <div className="field"><label>Minimum days notice</label><input name="leadDays" type="number" min="0" className="input input-sm" defaultValue={booking.leadDays} /></div>
            </div>
            <div className="field"><span className="label">Closed days (no bookings)</span>
              <div className="row">{DAYS.map((d, i) => <label key={d} className="check"><input type="checkbox" name="closedWeekdays" value={i} defaultChecked={booking.closedWeekdays?.map(Number).includes(i)} /> {d.slice(0, 3)}</label>)}</div>
            </div>
            <div className="grid-2">
              <div className="field"><label>Home service transport fee (₱)</label><input name="homeServiceFee" type="number" min="0" className="input input-sm" defaultValue={booking.homeServiceFee} /></div>
              <div className="field"><label>Home service minimum</label><input name="homeServiceMinimum" className="input input-sm" defaultValue={booking.homeServiceMinimum} /></div>
            </div>
            <div className="field"><label>Home service coverage areas</label><input name="homeServiceAreas" className="input input-sm" defaultValue={booking.homeServiceAreas} /></div>
            <div className="field"><label>Deposit policy (shown at checkout)</label><textarea name="policy" className="textarea input-sm" style={{ minHeight: 80 }} defaultValue={booking.policy} /></div>
            <button className="btn btn-red btn-sm" style={{ justifySelf: 'start' }}>Save booking rules</button>
          </ActionForm>
        </div>

        <div className="card">
          <h2>Shop info & map location</h2>
          <ActionForm action={saveSettings} className="stack">
            <input type="hidden" name="section" value="shop" />
            <div className="grid-3">
              <div className="field"><label>Shop name</label><input name="name" className="input input-sm" defaultValue={shop.name} /></div>
              <div className="field"><label>Tagline</label><input name="tagline" className="input input-sm" defaultValue={shop.tagline} /></div>
              <div className="field"><label>Year founded</label><input name="founded" className="input input-sm" defaultValue={shop.founded} /></div>
            </div>
            <div className="field"><label>About the studio</label><textarea name="about" className="textarea input-sm" defaultValue={shop.about} /></div>
            <div className="grid-2">
              <div className="field"><label>Phone</label><input name="phone" className="input input-sm" defaultValue={shop.phone} /></div>
              <div className="field"><label>Email</label><input name="email" className="input input-sm" defaultValue={shop.email} /></div>
            </div>
            <div className="field"><label>Address</label><input name="address" className="input input-sm" defaultValue={shop.address} /></div>
            <div className="grid-2">
              <div className="field"><label>Map latitude</label><input name="lat" className="input input-sm" defaultValue={shop.lat} /></div>
              <div className="field"><label>Map longitude</label><input name="lng" className="input input-sm" defaultValue={shop.lng} /></div>
            </div>
            <p className="hint">Tip: in Google Maps, right-click your shop&apos;s pin and click the coordinates to copy them (e.g. 10.3157, 123.8854).</p>
            <span className="label">Opening hours</span>
            {Array.from({ length: 5 }, (_, i) => (
              <div className="grid-2" key={i}>
                <input name={`hours_day_${i}`} className="input input-sm" placeholder="Day(s)" defaultValue={shop.hours[i]?.day} />
                <input name={`hours_time_${i}`} className="input input-sm" placeholder="Hours" defaultValue={shop.hours[i]?.time} />
              </div>
            ))}
            <div className="grid-3">
              <div className="field"><label>Instagram URL</label><input name="instagram" className="input input-sm" defaultValue={shop.instagram} /></div>
              <div className="field"><label>Facebook URL</label><input name="facebook" className="input input-sm" defaultValue={shop.facebook} /></div>
              <div className="field"><label>TikTok URL</label><input name="tiktok" className="input input-sm" defaultValue={shop.tiktok} /></div>
            </div>
            <span className="label">Home page “The studio” photos</span>
            <p className="hint" style={{ marginTop: -8 }}>Shown beside “Made by hand. Worn for life.” Use a studio shot, your artist at work, or a favourite tattoo. Tall (portrait) photos look best. Leave empty to use featured gallery images.</p>
            <div className="grid-2">
              {[1, 2].map((n) => (
                <div className="field" key={n}>
                  <label>{n === 1 ? 'Large photo' : 'Small photo'}</label>
                  <ImageField name={`aboutImage${n}`} current={shop[`aboutImage${n}`]} />
                  {shop[`aboutImage${n}`] && <label className="check"><input type="checkbox" name={`aboutImage${n}_remove`} /> Remove this photo</label>}
                </div>
              ))}
            </div>
            <button className="btn btn-red btn-sm" style={{ justifySelf: 'start' }}>Save shop info</button>
          </ActionForm>
        </div>

        <div className="card">
          <h2>System status</h2>
          <dl className="kv">
            <dt>Database</dt><dd className="gold">Connected</dd>
            <dt>Image storage</dt><dd>{blob ? <span className="gold">Vercel Blob</span> : process.env.VERCEL ? <span className="red">Missing: add a Blob store in Vercel → Storage</span> : 'Local folder (development)'}</dd>
            <dt>Deposit payments</dt><dd>{wallet.name} · {paymongoEnabled() ? 'PayMongo (automatic)' : 'Manual QR + receipt'}</dd>
          </dl>
        </div>
      </div>
    </>
  );
}
