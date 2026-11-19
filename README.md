# MUGNA Tattoo Co.

Website and staff admin for **MUGNA Tattoo Co.**, a custom tattoo studio. It is built with Next.js 16, Postgres and Vercel Blob and is ready to deploy on Vercel.

## What's inside

**Public website**
- Animated hero banner: an ink-smoke canvas that follows the cursor, letters that slide up and outline on hover, floating flash cards with parallax, a spinning badge and an intro preloader
- Motion throughout: a custom cursor ("View", "Book", "Profile" labels), magnetic buttons, 3D tilt and glare on artwork, a red ink wipe over art cards, text scramble on artist names, scroll reveals, marquees, counters and a fill sweep on service rows
- Pages: Home, Artists, Artist profile (portfolio + reviews), Gallery (filters + lightbox), Home Service, Reviews (with a submit form), Aftercare, Visit (Google Map + hours), Book, Booking confirmation
- **Booking wizard** in 5 steps: service, studio or home service, artist, date and live time-slot availability, design details with a reference image upload, contact details, and a **Maya partial deposit (switchable to GCash in Admin → Settings)**
  - **Manual Maya** (default): the customer scans your QR, enters the reference number and uploads a receipt screenshot. Staff verify it with one click.
  - **Instant Maya** (optional): through PayMongo checkout. Payment is confirmed automatically.

**Staff admin** at `/admin`
- Dashboard: pending bookings, GCash deposits to verify, today and next 7 days, home-service jobs, deposits for the last 30 days
- Bookings: filter and search, view the reference image and GCash receipt, "Mark deposit received & confirm", reschedule, reassign the artist, private notes, text the client, delete
- Artists: add, edit or hide, with photo upload
- Gallery: upload many images at once, set artist, style and featured, edit or delete
- Services: prices and the GCash deposit amount for each service
- Reviews: approve or hide customer reviews, or add reviews by hand
- Settings: GCash name, number and QR image; time slots, closed days, home-service fee and areas; shop info, hours, socials and **map coordinates**
- Staff: add staff or admin accounts, change your password

## Deploy to Vercel (about 10 minutes)

1. **Push this folder to GitHub.** Create a new repo, then:
   ```bash
   git remote add origin https://github.com/<you>/mugna-tattoo.git
   ```
   ```bash
   git push -u origin main
   ```
2. **Import it in Vercel.** Go to vercel.com → *Add New → Project* and pick the repo. The framework is detected as Next.js.
3. **Add a database.** In your Vercel project open *Storage → Create Database → Neon (Postgres)*, then connect it to the project. This sets `DATABASE_URL` for you. The tables and the starter content are created automatically on the first visit.
4. **Add image storage.** In *Storage → Create → Blob*, connect it to the project. This sets `BLOB_READ_WRITE_TOKEN`.
5. **Add environment variables** under *Settings → Environment Variables*:
   | Name | Value |
   |---|---|
   | `SESSION_SECRET` | a long random string (run `openssl rand -hex 32`) |
   | `ADMIN_EMAIL` | the owner's login email |
   | `ADMIN_PASSWORD` | a strong password (change it later in Admin → Staff) |
   | `SITE_URL` | your live URL, e.g. `https://mugnatattoo.com` (optional) |
6. **Redeploy**, then open `https://your-site/admin` and sign in.
7. In **Admin → Settings**, upload your real **GCash QR**, set the GCash name and number, the address and **map latitude/longitude**, your hours and socials. Replace the sample artists and artwork with your real ones.

### Optional: instant GCash checkout with PayMongo
1. Create a PayMongo account and activate GCash.
2. Add `PAYMONGO_SECRET_KEY` (`sk_live_…` or `sk_test_…`) on Vercel.
3. In the PayMongo dashboard, add a webhook pointing to `https://your-site/api/paymongo/webhook` for the event `checkout_session.payment.paid`, then set its secret as `PAYMONGO_WEBHOOK_SECRET`.
4. Redeploy. Customers now see **"Pay with GCash app"** at checkout. The booking is confirmed by the webhook, and also when the customer returns to the confirmation page.

## Run locally

```bash
npm install
```
```bash
cp .env.example .env.local
```
Fill in `DATABASE_URL` in `.env.local`. A free Neon database works, or any local Postgres. Then:
```bash
npm run dev
```
Open http://localhost:3000, and http://localhost:3000/admin for the admin. Without Blob configured, local uploads are saved to `.uploads/`.

If `ADMIN_EMAIL` and `ADMIN_PASSWORD` are not set in development, the first account is `admin@mugna.local` / `admin12345`.

## Project structure

```
app/(site)/        public pages (home, artists, gallery, book, testimonials…)
app/admin/         staff login + admin panel, all server actions in actions.js
app/api/           availability lookup + PayMongo webhook
components/        motion components (Effects, HeroCanvas, Gallery, BookingForm…)
lib/               db (schema + seed), auth, storage (Blob), PayMongo, settings
public/art/        original seed artwork (replace with your own via the admin)
scripts/           generate-art.mjs, which regenerates the seed artwork
```

The seed artists, testimonials, address, phone number and GCash QR are **placeholders**. Replace them in the admin before you launch.
