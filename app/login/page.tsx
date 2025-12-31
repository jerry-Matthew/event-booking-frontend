"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showBanner, setShowBanner] = useState<boolean>(() => searchParams?.get('registered') === '1');

  const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3001';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const contentType = res.headers.get('content-type') || '';
        const txt = await res.text();
        if (contentType.includes('text/html')) throw new Error(`Received HTML from ${apiBase} — check backend`);
        throw new Error(txt || 'Login failed');
      }
      const data = await res.json();
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      // notify other parts of the app (and this tab) that auth changed so Header updates immediately
      window.dispatchEvent(new Event('auth-change'));
      router.push('/');
    } catch (err: any) {
      alert('Login error: ' + (err?.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 via-fuchsia-700 to-indigo-900 text-white p-6">
      <div className="w-full max-w-md rounded-lg bg-zinc-900/60 p-8 shadow-lg">
        {showBanner && (
          <div className="mb-4 rounded-md bg-green-600/90 p-3 text-sm text-white flex items-start justify-between">
            <div>Account created — please sign in.</div>
            <button aria-label="Dismiss" onClick={() => setShowBanner(false)} className="ml-4 font-bold">×</button>
          </div>
        )}

        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="text-sm text-zinc-300 mt-2">Enter your credentials to access your account.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input className="rounded bg-white/5 px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          <input className="rounded bg-white/5 px-3 py-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />

          <div className="flex items-center justify-between mt-4">
            <button type="submit" disabled={loading} className="rounded-full bg-white/10 px-4 py-2 font-semibold">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
            <button type="button" onClick={() => router.push('/')} className="text-sm text-zinc-300 underline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 via-fuchsia-700 to-indigo-900 text-white">
        <div className="text-lg">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
