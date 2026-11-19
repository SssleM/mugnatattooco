'use client';
import { startTransition, useActionState, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageDrop from './ImageDrop';
import { Arrow } from './Icons';

const STEPS = ['Service', 'Schedule', 'Design', 'Details', 'Deposit'];
const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH');
const fmtTime = (t) => {
  const [h, m] = t.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

export default function BookingForm({ action, services, artists, booking, gcash, paymongo, initial, minDate }) {
  const router = useRouter();
  const formRef = useRef(null);
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [values, setValues] = useState({
    service_id: initial.service || '',
    artist_id: initial.artist || '',
    location_type: initial.location === 'home' ? 'home' : 'studio',
    date: '',
    time: '',
    pay_method: paymongo ? 'paymongo' : 'manual',
  });
  const [avail, setAvail] = useState({ loading: false, taken: [], closed: false, reason: '' });
  const [state, formAction, pending] = useActionState(action, null);

  const service = services.find((s) => String(s.id) === String(values.service_id));
  const artist = artists.find((a) => String(a.id) === String(values.artist_id));
  const fee = values.location_type === 'home' ? Number(booking.homeServiceFee) : 0;
  const estimate = service ? service.price_from + fee : 0;

  // server result handling
  useEffect(() => {
    if (!state) return;
    if (state.redirect) window.location.href = state.redirect;
    else if (state.code) router.push(`/book/success?code=${state.code}`);
    else if (typeof state.step === 'number') setStep(state.step);
  }, [state, router]);

  // availability
  useEffect(() => {
    if (!values.date) return;
    let cancelled = false;
    setAvail((a) => ({ ...a, loading: true }));
    fetch(`/api/availability?date=${values.date}&artist=${values.artist_id || ''}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setAvail({ loading: false, taken: d.taken || [], closed: d.closed, reason: d.reason || '' });
        if (d.closed || (d.taken || []).includes(values.time)) setValues((v) => ({ ...v, time: '' }));
      })
      .catch(() => !cancelled && setAvail({ loading: false, taken: [], closed: false, reason: '' }));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.date, values.artist_id]);

  const onChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file' || !name) return;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const validateStep = () => {
    const panel = formRef.current?.querySelector(`[data-step="${step}"]`);
    if (!panel) return true;
    for (const el of panel.querySelectorAll('input, select, textarea')) {
      if (!el.checkValidity()) { el.reportValidity(); return false; }
    }
    if (step === 1 && avail.closed) return false;
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    const n = Math.min(step + 1, STEPS.length - 1);
    setStep(n);
    setMaxStep((m) => Math.max(m, n));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    const fd = new FormData(e.currentTarget);
    startTransition(() => formAction(fd));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <form ref={formRef} onSubmit={onSubmit} onChange={onChange} className="wizard" style={{ scrollMarginTop: 100 }}>
      <div className="wizard-main">
        <div className="steps-bar">
          {STEPS.map((s, i) => (
            <button type="button" key={s} disabled={i > maxStep} onClick={() => setStep(i)} className={i === step ? 'current' : i < step ? 'done' : ''}>
              {i + 1}<span>. {s}</span>
            </button>
          ))}
        </div>
        <input type="text" name="company" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />

        {/* STEP 1 — service + location */}
        <div className="step-panel" data-step="0" hidden={step !== 0}>
          <h2 className="display">What are we making?</h2>
          <div className="choices">
            {services.map((s) => (
              <label className="choice" key={s.id}>
                <input type="radio" name="service_id" value={s.id} required defaultChecked={String(s.id) === String(values.service_id)} />
                <span className="box">
                  <strong>{s.name}</strong>
                  <small>{s.description}</small>
                  <span className="price">{s.price_from ? `from ${peso(s.price_from)}` : 'Free'} · {peso(s.deposit)} deposit</span>
                </span>
              </label>
            ))}
          </div>
          <span className="label">Where?</span>
          <div className="choices">
            <label className="choice">
              <input type="radio" name="location_type" value="studio" defaultChecked={values.location_type === 'studio'} />
              <span className="box"><strong>At the studio</strong><small>Come visit us. Free parking nearby.</small></span>
            </label>
            <label className="choice">
              <input type="radio" name="location_type" value="home" defaultChecked={values.location_type === 'home'} />
              <span className="box"><strong>Home service</strong><small>We bring the studio to you.</small><span className="price">+ {peso(booking.homeServiceFee)} transport</span></span>
            </label>
          </div>
          {values.location_type === 'home' && (
            <div className="field" style={{ animation: 'fade-up .5s' }}>
              <label htmlFor="address">Full address & landmarks</label>
              <textarea id="address" name="address" className="textarea" required minLength={10} placeholder="House no., street, barangay, city, landmarks" style={{ minHeight: 90 }} />
              <p className="hint">Coverage: {booking.homeServiceAreas} {booking.homeServiceMinimum}</p>
            </div>
          )}
        </div>

        {/* STEP 2 — artist + schedule */}
        <div className="step-panel" data-step="1" hidden={step !== 1}>
          <h2 className="display">Who & when?</h2>
          <div className="choices">
            <label className="choice artist">
              <input type="radio" name="artist_id" value="" defaultChecked={!values.artist_id} />
              <span className="box"><span style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--red)', display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 22 }}>✦</span><span><strong>Any artist</strong><small>First available</small></span></span>
            </label>
            {artists.map((a) => (
              <label className="choice artist" key={a.id}>
                <input type="radio" name="artist_id" value={a.id} defaultChecked={String(a.id) === String(values.artist_id)} />
                <span className="box">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.photo_url || '/art/artist-paeng.svg'} alt="" />
                  <span><strong>{a.name}</strong><small>{a.specialties.split(',').slice(0, 2).join(', ')}</small></span>
                </span>
              </label>
            ))}
          </div>
          <div className="field" style={{ maxWidth: 320 }}>
            <label htmlFor="date">Date</label>
            <input id="date" type="date" name="date" className="input" required min={minDate} />
          </div>
          {values.date && (
            <div className="field">
              <span className="label">Time {avail.loading && <span className="muted">· checking…</span>}</span>
              {avail.closed ? (
                <div className="alert alert-warn">{avail.reason}</div>
              ) : (
                <div className="choices slots">
                  {booking.timeSlots.map((t) => (
                    <label className="choice" key={t}>
                      <input type="radio" name="time" value={t} required disabled={avail.taken.includes(t)} />
                      <span className="box">{fmtTime(t)}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* STEP 3 — design */}
        <div className="step-panel" data-step="2" hidden={step !== 2}>
          <h2 className="display">Tell us the idea</h2>
          <div className="grid-3">
            <div className="field">
              <label htmlFor="placement">Placement</label>
              <input id="placement" name="placement" className="input" placeholder="e.g. Left forearm" required />
            </div>
            <div className="field">
              <label htmlFor="size">Approx. size</label>
              <select id="size" name="size" className="select" required defaultValue="">
                <option value="" disabled>Select</option>
                <option>Tiny (under 5 cm)</option>
                <option>Small (5–10 cm)</option>
                <option>Medium (10–20 cm)</option>
                <option>Large (20 cm+)</option>
                <option>Sleeve / Back piece</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="style">Style</label>
              <select id="style" name="style" className="select" defaultValue="">
                <option value="">Not sure</option>
                {['Neo-traditional', 'Traditional', 'Fine line', 'Blackwork', 'Geometric', 'Dotwork', 'Tribal', 'Script', 'Realism', 'Cover-up'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="description">Describe your tattoo</label>
            <textarea id="description" name="description" className="textarea" required minLength={5} placeholder="Elements, meaning, colours, anything that helps your artist…" />
          </div>
          <div className="field">
            <span className="label">Reference image (optional)</span>
            <ImageDrop name="reference" label="Upload a reference" hint="Inspo, sketches or a photo of the placement" />
          </div>
        </div>

        {/* STEP 4 — details */}
        <div className="step-panel" data-step="3" hidden={step !== 3}>
          <h2 className="display">Your details</h2>
          <div className="grid-2">
            <div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" className="input" required minLength={2} autoComplete="name" /></div>
            <div className="field"><label htmlFor="phone">Mobile number</label><input id="phone" name="phone" type="tel" className="input" required placeholder="09XX XXX XXXX" pattern="[+\d][\d\s\-]{6,}" autoComplete="tel" /></div>
          </div>
          <div className="field"><label htmlFor="email">Email (for your confirmation)</label><input id="email" name="email" type="email" className="input" autoComplete="email" /></div>
          <p className="hint">We will text or call you to confirm the design and final price. You must be 18+ (or 16–17 with a guardian) on the day of your session.</p>
        </div>

        {/* STEP 5 — deposit */}
        <div className="step-panel" data-step="4" hidden={step !== 4}>
          <h2 className="display">Secure with Maya</h2>
          <p className="muted" style={{ margin: 0 }}>Pay a partial deposit of <strong className="gold">{peso(service?.deposit)}</strong> to lock in your slot. It is deducted from your final price.</p>
          {paymongo && (
            <div className="choices">
              <label className="choice">
                <input type="radio" name="pay_method" value="paymongo" defaultChecked />
                <span className="box"><strong>Pay with Maya app</strong><small>Instant checkout, confirmed automatically.</small></span>
              </label>
              <label className="choice">
                <input type="radio" name="pay_method" value="manual" />
                <span className="box"><strong>Send via Maya QR</strong><small>Send manually, then upload your receipt.</small></span>
              </label>
            </div>
          )}
          {!paymongo && <input type="hidden" name="pay_method" value="manual" />}

          {values.pay_method === 'manual' ? (
            <>
              <div className="gcash-box">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={gcash.qrUrl} alt="Maya QR code" />
                <div>
                  <span className="gcash-logo"><b>G</b> GCash</span>
                  <p style={{ margin: '14px 0 2px', opacity: 0.85 }}>Send exactly</p>
                  <div className="num">{peso(service?.deposit)}</div>
                  <p style={{ margin: '12px 0 2px', opacity: 0.85 }}>to {gcash.accountName}</p>
                  <div className="num" style={{ fontSize: 26 }}>{gcash.number}</div>
                </div>
              </div>
              <div className="grid-2">
                <div className="field">
                  <label htmlFor="gcash_ref">Maya reference no.</label>
                  <input id="gcash_ref" name="gcash_ref" className="input" required minLength={6} placeholder="e.g. 1012 345 678901" inputMode="numeric" />
                </div>
                <div className="field">
                  <span className="label">Receipt screenshot</span>
                  <ImageDrop name="receipt" label="Upload receipt" hint="Screenshot of your Maya confirmation" />
                </div>
              </div>
            </>
          ) : (
            <div className="alert alert-ok">You will be redirected to a secure Maya checkout (via PayMongo) after you confirm. Your slot is held for you while you pay.</div>
          )}
          <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
            <input type="checkbox" name="agree" required style={{ marginTop: 5, accentColor: 'var(--red)' }} />
            <span className="muted" style={{ fontSize: 14 }}>{booking.policy}</span>
          </label>
        </div>

        {state?.error && <div className="alert alert-error" style={{ marginTop: 20 }}>{state.error}</div>}

        <div className="wizard-nav">
          <button type="button" className="btn btn-ghost btn-sm" onClick={back} style={{ visibility: step === 0 ? 'hidden' : 'visible' }}>← Back</button>
          {step < STEPS.length - 1 ? (
            <button type="button" className="btn btn-sm" onClick={next} data-magnetic>Continue <Arrow /></button>
          ) : (
            <button type="submit" className="btn btn-red" disabled={pending} data-magnetic>
              {pending ? 'Booking…' : values.pay_method === 'paymongo' ? 'Pay deposit with Maya' : 'Confirm booking'} <Arrow />
            </button>
          )}
        </div>
      </div>

      <aside className="wizard-side" aria-label="Booking summary">
        <span className="eyebrow">Summary</span>
        <div style={{ marginTop: 18 }}>
          <div className="summary-row"><span>Service</span><span>{service?.name || '—'}</span></div>
          <div className="summary-row"><span>Where</span><span>{values.location_type === 'home' ? 'Home service' : 'Studio'}</span></div>
          <div className="summary-row"><span>Artist</span><span>{artist?.name || 'Any artist'}</span></div>
          <div className="summary-row"><span>Date</span><span>{values.date ? new Date(values.date + 'T00:00').toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' }) : '—'}</span></div>
          <div className="summary-row"><span>Time</span><span>{values.time ? fmtTime(values.time) : '—'}</span></div>
          <div className="summary-row"><span>Starting price</span><span>{service ? peso(service.price_from) : '—'}</span></div>
          {fee > 0 && <div className="summary-row"><span>Transport fee</span><span>{peso(fee)}</span></div>}
          <div className="summary-row"><span>Est. total from</span><span>{service ? peso(estimate) : '—'}</span></div>
        </div>
        <div className="summary-total"><span className="muted">Deposit due now</span><strong>{peso(service?.deposit)}</strong></div>
        <p className="hint" style={{ marginTop: 10 }}>Final price confirmed by your artist based on size and detail.</p>
      </aside>
    </form>
  );
}
