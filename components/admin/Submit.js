'use client';
import { useFormStatus } from 'react-dom';

export default function Submit({ children = 'Save', className = 'btn btn-red btn-sm', name, value, pendingText = 'Saving…' }) {
  const { pending, data } = useFormStatus();
  const mine = !name || data?.get?.(name) === value;
  return (
    <button type="submit" className={className} name={name} value={value} disabled={pending}>
      {pending && mine ? pendingText : children}
    </button>
  );
}
