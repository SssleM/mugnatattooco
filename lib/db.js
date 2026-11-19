import postgres from 'postgres';
import { hashPassword } from './password';

const globalForDb = globalThis;

function createClient() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Add a Postgres database (e.g. Neon from the Vercel Marketplace) and set DATABASE_URL.'
    );
  }
  const local = /localhost|127\.0\.0\.1/.test(url);
  return postgres(url, {
    max: process.env.VERCEL ? 1 : 5,
    prepare: false, // works with pooled (pgbouncer) connections
    ssl: local ? false : 'require',
    idle_timeout: 20,
    onnotice: () => {},
  });
}

export function getSql() {
  if (!globalForDb.__mugnaSql) globalForDb.__mugnaSql = createClient();
  return globalForDb.__mugnaSql;
}

/** Ensures tables exist and seed data is present. Runs once per server instance. */
export async function db() {
  const sql = getSql();
  if (!globalForDb.__mugnaReady) {
    globalForDb.__mugnaReady = migrate(sql).catch((e) => {
      globalForDb.__mugnaReady = null;
      throw e;
    });
  }
  await globalForDb.__mugnaReady;
  return sql;
}

async function migrate(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key text PRIMARY KEY,
      value jsonb NOT NULL
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id serial PRIMARY KEY,
      email text UNIQUE NOT NULL,
      name text NOT NULL,
      password_hash text NOT NULL,
      role text NOT NULL DEFAULT 'staff',
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS artists (
      id serial PRIMARY KEY,
      slug text UNIQUE NOT NULL,
      name text NOT NULL,
      title text NOT NULL DEFAULT '',
      bio text NOT NULL DEFAULT '',
      specialties text NOT NULL DEFAULT '',
      instagram text NOT NULL DEFAULT '',
      photo_url text NOT NULL DEFAULT '',
      years integer NOT NULL DEFAULT 0,
      sort integer NOT NULL DEFAULT 0,
      active boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS artworks (
      id serial PRIMARY KEY,
      artist_id integer REFERENCES artists(id) ON DELETE SET NULL,
      title text NOT NULL DEFAULT '',
      style text NOT NULL DEFAULT '',
      image_url text NOT NULL,
      featured boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS services (
      id serial PRIMARY KEY,
      name text NOT NULL,
      description text NOT NULL DEFAULT '',
      price_from integer NOT NULL DEFAULT 0,
      deposit integer NOT NULL DEFAULT 500,
      duration text NOT NULL DEFAULT '',
      sort integer NOT NULL DEFAULT 0,
      active boolean NOT NULL DEFAULT true
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id serial PRIMARY KEY,
      code text UNIQUE NOT NULL,
      name text NOT NULL,
      email text NOT NULL DEFAULT '',
      phone text NOT NULL,
      service_id integer REFERENCES services(id) ON DELETE SET NULL,
      service_name text NOT NULL DEFAULT '',
      artist_id integer REFERENCES artists(id) ON DELETE SET NULL,
      date date NOT NULL,
      time text NOT NULL,
      location_type text NOT NULL DEFAULT 'studio',
      address text NOT NULL DEFAULT '',
      placement text NOT NULL DEFAULT '',
      size text NOT NULL DEFAULT '',
      style text NOT NULL DEFAULT '',
      description text NOT NULL DEFAULT '',
      reference_url text NOT NULL DEFAULT '',
      estimate integer NOT NULL DEFAULT 0,
      deposit integer NOT NULL DEFAULT 0,
      payment_method text NOT NULL DEFAULT 'gcash_manual',
      gcash_ref text NOT NULL DEFAULT '',
      receipt_url text NOT NULL DEFAULT '',
      payment_status text NOT NULL DEFAULT 'unpaid',
      status text NOT NULL DEFAULT 'pending',
      paymongo_session_id text NOT NULL DEFAULT '',
      staff_notes text NOT NULL DEFAULT '',
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id serial PRIMARY KEY,
      name text NOT NULL,
      rating integer NOT NULL DEFAULT 5,
      message text NOT NULL,
      artist_id integer REFERENCES artists(id) ON DELETE SET NULL,
      photo_url text NOT NULL DEFAULT '',
      approved boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
  await sql`CREATE INDEX IF NOT EXISTS bookings_slot_idx ON bookings (date, artist_id)`;

  // Seed once (atomic claim so parallel cold starts don't double-seed)
  const claimed = await sql`
    INSERT INTO settings (key, value) VALUES ('seeded', 'true'::jsonb)
    ON CONFLICT (key) DO NOTHING RETURNING key`;
  if (claimed.length) await seed(sql);

  // Make sure there is at least one admin account
  const [{ count }] = await sql`SELECT count(*)::int AS count FROM users`;
  if (count === 0) {
    let email = process.env.ADMIN_EMAIL;
    let password = process.env.ADMIN_PASSWORD;
    if ((!email || !password) && process.env.NODE_ENV !== 'production') {
      email = 'admin@mugna.local';
      password = 'admin12345';
    }
    if (email && password) {
      await sql`
        INSERT INTO users (email, name, password_hash, role)
        VALUES (${email.toLowerCase()}, 'Owner', ${hashPassword(password)}, 'admin')
        ON CONFLICT (email) DO NOTHING`;
    }
  }
}

async function seed(sql) {
  const { DEFAULT_SETTINGS } = await import('./defaults');
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await sql`INSERT INTO settings (key, value) VALUES (${key}, ${sql.json(value)}) ON CONFLICT (key) DO NOTHING`;
  }

  const artists = [
    {
      slug: 'paeng-villanueva',
      name: 'Paeng Villanueva',
      title: 'Founder · Lead Artist',
      bio: 'Paeng started MUGNA with one chair, one machine and a sketchbook full of flash. Twelve years in, he is known for bold neo-traditional pieces with heavy black, clean saturation and a little Visayan folklore in every line. Every tattoo begins as a hand-drawn sketch made only for you.',
      specialties: 'Neo-traditional, Blackwork, Custom flash',
      instagram: 'mugna.paeng',
      photo_url: '/art/artist-paeng.svg',
      years: 12,
      sort: 1,
    },
    {
      slug: 'kaye-solis',
      name: 'Kaye Solis',
      title: 'Fine Line Specialist',
      bio: 'Kaye works in whisper-thin lines, botanicals and micro script. Calm hands, calm studio, perfect for first tattoos and delicate placements.',
      specialties: 'Fine line, Botanical, Script, Micro',
      instagram: 'mugna.kaye',
      photo_url: '/art/artist-kaye.svg',
      years: 6,
      sort: 2,
    },
    {
      slug: 'migs-abellana',
      name: 'Migs Abellana',
      title: 'Blackwork & Geometric',
      bio: 'Migs builds sacred geometry, dotwork mandalas and tribal patterns inspired by Philippine textiles. Big pieces, sleeves and back work are his playground.',
      specialties: 'Geometric, Dotwork, Tribal, Sleeves',
      instagram: 'mugna.migs',
      photo_url: '/art/artist-migs.svg',
      years: 8,
      sort: 3,
    },
  ];
  const ids = {};
  for (const a of artists) {
    const [row] = await sql`INSERT INTO artists ${sql(a)} ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id`;
    ids[a.slug] = row.id;
  }

  const works = [
    ['paeng-villanueva', 'Serpent & Dagger', 'Neo-traditional', 'dagger-snake', true],
    ['paeng-villanueva', 'Sacred Heart', 'Traditional', 'sacred-heart', true],
    ['paeng-villanueva', 'Grinning Skull', 'Blackwork', 'skull', false],
    ['paeng-villanueva', 'Swallow', 'Traditional', 'swallow', true],
    ['paeng-villanueva', 'Tiger Rose', 'Neo-traditional', 'rose', true],
    ['kaye-solis', 'Moon Moth', 'Fine line', 'moth', true],
    ['kaye-solis', 'Wild Stem', 'Botanical', 'botanical', false],
    ['kaye-solis', 'All-Seeing Eye', 'Fine line', 'eye', true],
    ['kaye-solis', 'Sun & Moon', 'Fine line', 'sun-moon', false],
    ['migs-abellana', 'Lotus Mandala', 'Geometric', 'mandala-1', true],
    ['migs-abellana', 'Dot Sun', 'Dotwork', 'mandala-2', false],
    ['migs-abellana', 'Metatron', 'Geometric', 'sacred-geo', true],
    ['migs-abellana', 'Alon (Wave) Band', 'Tribal', 'wave-band', false],
    ['migs-abellana', 'Star Compass', 'Geometric', 'compass', true],
  ];
  for (const [slug, title, style, file, featured] of works) {
    await sql`INSERT INTO artworks (artist_id, title, style, image_url, featured)
      VALUES (${ids[slug]}, ${title}, ${style}, ${'/art/' + file + '.svg'}, ${featured})`;
  }

  const services = [
    { name: 'Flash Tattoo', description: 'Pick a ready-made design from our flash wall. Fast, fun and affordable.', price_from: 1500, deposit: 500, duration: '1–2 hrs', sort: 1 },
    { name: 'Custom Tattoo', description: 'A one-of-one design drawn by your artist from your idea and references.', price_from: 3500, deposit: 1000, duration: '2–5 hrs', sort: 2 },
    { name: 'Fine Line & Minimal', description: 'Delicate lines, script, micro tattoos and small symbols.', price_from: 1200, deposit: 500, duration: '1 hr', sort: 3 },
    { name: 'Sleeve / Large Piece', description: 'Multi-session work: sleeves, back pieces, chest panels.', price_from: 15000, deposit: 3000, duration: 'Multi-session', sort: 4 },
    { name: 'Cover-up & Rework', description: 'Turn an old tattoo you regret into something you love.', price_from: 4000, deposit: 1000, duration: '2–6 hrs', sort: 5 },
    { name: 'Consultation', description: 'Talk through your idea, placement and pricing with an artist.', price_from: 0, deposit: 300, duration: '30 min', sort: 6 },
  ];
  for (const s of services) await sql`INSERT INTO services ${sql(s)}`;

  const testimonials = [
    ['Andrea M.', 5, 'Paeng turned my rough idea into the most beautiful neo-trad piece. The studio is spotless and the vibe is so chill. Healing was super smooth too!', 'paeng-villanueva'],
    ['Joshua R.', 5, 'Booked the home service for my barkada. Four tattoos in one afternoon, all clean and professional. Sulit kaayo!', 'migs-abellana'],
    ['Bea L.', 5, 'First tattoo and I was so nervous. Kaye explained everything and the fine line work is perfect. Already planning my next one.', 'kaye-solis'],
    ['Carlo D.', 5, 'Migs did my half-sleeve over three sessions. The geometry is insane, people stop me on the street.', 'migs-abellana'],
    ['Trish V.', 4, 'Paying the deposit through Maya was easy, and they confirmed my slot within the hour. Great experience overall.', 'kaye-solis'],
    ['Nico P.', 5, 'Cover-up of a 10-year-old tattoo. You cannot even tell. MUGNA is the real deal.', 'paeng-villanueva'],
  ];
  for (const [name, rating, message, slug] of testimonials) {
    await sql`INSERT INTO testimonials (name, rating, message, artist_id, approved)
      VALUES (${name}, ${rating}, ${message}, ${ids[slug]}, true)`;
  }
}
