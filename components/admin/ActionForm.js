'use client';
import { startTransition, useActionState, useEffect, useRef } from 'react';
import { toast } from './Toaster';

/**
 * Wraps a server action (prevState, formData) => { ok?, message?, error? }.
 * Shows a toast, optional confirm prompt, and optional reset after success.
 */
export default function ActionForm({ action, children, confirm, reset = false, className, style, id }) {
  const ref = useRef(null);
  const [state, formAction, pending] = useActionState(async (prev, fd) => {
    const result = await action(prev, fd);
    // fire here (not in an effect) so the toast shows even if this form unmounts after revalidation
    if (result?.error || result?.message) toast(result.error || result.message, result.error ? 'err' : 'ok');
    return result;
  }, null);

  useEffect(() => {
    if (state?.ok && reset) ref.current?.reset();
  }, [state, reset]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (confirm && !window.confirm(confirm)) return;
    const fd = new FormData(e.currentTarget);
    if (e.nativeEvent.submitter?.name) fd.set(e.nativeEvent.submitter.name, e.nativeEvent.submitter.value);
    startTransition(() => formAction(fd));
  };

  return (
    <form ref={ref} onSubmit={onSubmit} className={className} style={style} id={id} aria-busy={pending}>
      <fieldset disabled={pending} style={{ border: 0, padding: 0, margin: 0, minWidth: 0, display: 'contents' }}>
        {children}
      </fieldset>
    </form>
  );
}
