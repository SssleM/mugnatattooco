import './admin.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Staff Admin', robots: { index: false } };

export default function AdminRoot({ children }) {
  return children;
}
