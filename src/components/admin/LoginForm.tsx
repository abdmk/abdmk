'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Icon } from '@/components/icons';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const password = new FormData(event.currentTarget).get('password');

    const response = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    setBusy(false);
    if (response.ok) {
      router.replace('/admin');
      router.refresh();
    } else {
      setError('Incorrect password.');
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <h1 className="text-h2 font-medium">Admin</h1>
      <p className="mt-2 text-small text-muted">Sign in to manage the site content.</p>

      <label htmlFor="password" className="label mb-1 mt-10 block">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        autoFocus
        required
        className="w-full border-0 border-b border-line bg-transparent px-0 py-3 outline-none focus:border-ink"
      />
      {error ? (
        <p role="alert" className="mt-3 text-small text-accent">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="mt-8 inline-flex items-center gap-2.5 bg-ink px-6 py-3.5 text-small font-medium text-paper disabled:opacity-50"
      >
        {busy ? 'Signing in…' : 'Sign in'}
        <Icon name="signIn" size={16} />
      </button>
    </form>
  );
}
