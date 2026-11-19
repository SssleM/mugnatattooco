import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUser } from '@/lib/auth';
import ActionForm from '@/components/admin/ActionForm';
import Toaster from '@/components/admin/Toaster';
import { Emblem } from '@/components/Logo';
import { login } from '../actions';

export default async function LoginPage() {
  if (await getUser()) redirect('/admin');
  const needsEnv = process.env.NODE_ENV === 'production' && (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD);
  return (
    <div className="login-wrap">
      <ActionForm action={login} className="login-card">
        <Emblem style={{ width: 72, color: 'var(--bone)', justifySelf: 'center' }} />
        <div>
          <h1 className="display" style={{ margin: 0, fontSize: 44 }}>Staff login</h1>
          <p className="muted" style={{ margin: '4px 0 0' }}>Manage bookings, artists, gallery & reviews.</p>
        </div>
        {needsEnv && <div className="alert alert-warn">Set ADMIN_EMAIL and ADMIN_PASSWORD in your Vercel environment variables to create the first account.</div>}
        <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" className="input" required autoComplete="username" /></div>
        <div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" className="input" required autoComplete="current-password" /></div>
        <button className="btn btn-red" type="submit">Sign in</button>
        <Link href="/" className="muted link-u" style={{ justifySelf: 'center', fontSize: 14 }}>← Back to website</Link>
      </ActionForm>
      <Toaster />
    </div>
  );
}
