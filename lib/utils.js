export const peso = (n) =>
  '₱' + Number(n || 0).toLocaleString('en-PH', { maximumFractionDigits: 0 });

export const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .slice(0, 60) || 'artist';

export const fmtDate = (d) => {
  if (!d) return '';
  const date = d instanceof Date ? d : new Date(String(d).slice(0, 10) + 'T00:00:00');
  return date.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Manila' });
};

export const fmtTime = (t) => {
  const [h, m] = String(t).split(':').map(Number);
  if (Number.isNaN(h)) return t;
  const ap = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:${String(m || 0).padStart(2, '0')} ${ap}`;
};

export const isoDate = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d).slice(0, 10));

/** Today's date in Manila as YYYY-MM-DD */
export const manilaToday = () =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });

export const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
export const PAYMENT_LABELS = {
  unpaid: 'Unpaid',
  pending_verification: 'Verify GCash',
  paid: 'Deposit paid',
  refunded: 'Refunded',
};
