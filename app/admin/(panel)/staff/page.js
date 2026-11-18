import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import ActionForm from '@/components/admin/ActionForm';
import { addStaff, changePassword, removeStaff } from '../../actions';

export default async function StaffAdmin() {
  const me = await requireUser();
  const sql = await db();
  const users = await sql`SELECT id, email, name, role, created_at FROM users ORDER BY id`;
  return (
    <>
      <div className="admin-top"><h1 className="display">Staff</h1></div>
      <div className="card" style={{ marginBottom: 20 }}>
        <table className="table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th /></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name} {u.id === me.id && <span className="muted">(you)</span>}</td>
                <td>{u.email}</td>
                <td><span className={`badge ${u.role === 'admin' ? 'b-pending' : 'b-completed'}`}>{u.role}</span></td>
                <td style={{ textAlign: 'right' }}>
                  {me.role === 'admin' && u.id !== me.id && (
                    <ActionForm action={removeStaff} confirm={`Remove ${u.email}?`}>
                      <input type="hidden" name="id" value={u.id} />
                      <button className="btn btn-danger btn-sm">Remove</button>
                    </ActionForm>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 20 }}>
        {me.role === 'admin' && (
          <div className="card">
            <h2>Add staff account</h2>
            <ActionForm action={addStaff} reset className="stack">
              <div className="field"><label>Name</label><input name="name" className="input input-sm" required /></div>
              <div className="field"><label>Email</label><input name="email" type="email" className="input input-sm" required /></div>
              <div className="field"><label>Temporary password (8+ chars)</label><input name="password" type="text" minLength={8} className="input input-sm" required /></div>
              <div className="field"><label>Role</label><select name="role" className="select input-sm"><option value="staff">Staff — manage bookings, gallery, reviews</option><option value="admin">Admin — also manages staff</option></select></div>
              <button className="btn btn-red btn-sm" style={{ justifySelf: 'start' }}>Create account</button>
            </ActionForm>
          </div>
        )}
        <div className="card">
          <h2>Change my password</h2>
          <ActionForm action={changePassword} reset className="stack">
            <div className="field"><label>Current password</label><input name="current" type="password" className="input input-sm" required autoComplete="current-password" /></div>
            <div className="field"><label>New password</label><input name="next" type="password" minLength={8} className="input input-sm" required autoComplete="new-password" /></div>
            <button className="btn btn-sm" style={{ justifySelf: 'start' }}>Update password</button>
          </ActionForm>
        </div>
      </div>
    </>
  );
}
