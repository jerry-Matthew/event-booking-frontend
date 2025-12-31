"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3001';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const contentType = res.headers.get('content-type') || '';
        const txt = await res.text();
        if (contentType.includes('text/html')) throw new Error(`Received HTML from ${apiBase} — check backend`);
        throw new Error(txt || 'Registration failed');
      }
  // registration succeeded — redirect user to the login page to authenticate
  await res.json();
  router.push('/login?registered=1');
    } catch (err: any) {
      alert('Register error: ' + (err?.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 via-fuchsia-700 to-indigo-900 text-white p-6">
      <div className="w-full max-w-md rounded-lg bg-zinc-900/60 p-8 shadow-lg">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="text-sm text-zinc-300 mt-2">Sign up to join the House Party — quick and easy.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input className="rounded bg-white/5 px-3 py-2" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="rounded bg-white/5 px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          <input className="rounded bg-white/5 px-3 py-2" placeholder="Password (min 6)" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={6} />

          <div className="flex items-center justify-between mt-4">
            <button type="submit" disabled={loading} className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-4 py-2 font-semibold">
              {loading ? 'Creating…' : 'Create account'}
            </button>
            <button type="button" onClick={() => router.push('/')} className="text-sm text-zinc-300 underline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
