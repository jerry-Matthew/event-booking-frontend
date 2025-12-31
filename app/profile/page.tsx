"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<null | { name?: string; email?: string }>(null);
  const [tickets, setTickets] = useState<Array<{ id: number; eventTitle: string; eventDate?: string; price?: number; createdAt?: string }>>([]);
  const router = useRouter();

  const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3001';

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setUser(JSON.parse(raw));
      else router.replace('/login');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to read user from storage', e);
      router.replace('/login');
    }
  }, [router]);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch(`${apiBase}/tickets`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const json = await res.json();
        setTickets(json.tickets || []);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.debug('Failed to load tickets', e);
      }
    }
    fetchTickets();
  }, [apiBase]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/');
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white p-6">
        <div className="max-w-md w-full text-center">
          <p className="text-lg">Redirecting to sign in…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-fuchsia-700 to-indigo-900 text-white p-6">
      <div className="mx-auto max-w-3xl bg-zinc-900/60 rounded-lg p-8 shadow-lg">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-zinc-300 mt-2">Manage your account details</p>

        <div className="mt-6 space-y-4">
          <div>
            <div className="text-xs text-zinc-400">Name</div>
            <div className="mt-1 text-lg font-semibold">{user.name}</div>
          </div>

          <div>
            <div className="text-xs text-zinc-400">Email</div>
            <div className="mt-1 text-lg">{user.email}</div>
          </div>

          {/* Actions moved to the header/profile menu; no inline actions here per design */}
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Your Tickets</h2>
          {tickets.length === 0 ? (
            <div className="mt-3 text-sm text-zinc-300">You have no tickets yet.</div>
          ) : (
            (() => {
              // group tickets by eventTitle and show counts instead of listing every ticket separately
              const groups = Object.values(
                tickets.reduce((acc: Record<string, any>, t) => {
                  const key = t.eventTitle || 'Unknown Event';
                  if (!acc[key]) {
                    acc[key] = { eventTitle: t.eventTitle, eventDate: t.eventDate, count: 0, totalPrice: 0, latestCreatedAt: t.createdAt };
                  }
                  acc[key].count += 1;
                  acc[key].totalPrice += Number(t.price ?? 0);
                  if (!acc[key].latestCreatedAt || (t.createdAt && new Date(t.createdAt) > new Date(acc[key].latestCreatedAt || 0))) {
                    acc[key].latestCreatedAt = t.createdAt || acc[key].latestCreatedAt;
                  }
                  return acc;
                }, {}),
              );

              return (
                <ul className="mt-3 space-y-2">
                  {groups.map((g) => (
                    <li key={g.eventTitle} className="rounded-md bg-black/20 p-3 flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{g.eventTitle}</div>
                        <div className="text-sm text-zinc-300">{g.eventDate ?? 'Date not set'}</div>
                        <div className="text-xs text-zinc-400">Booked: {g.latestCreatedAt ? new Date(g.latestCreatedAt).toLocaleString() : '—'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{g.count} × Tickets</div>
                        <div className="text-sm text-zinc-300">Total: ₹{g.totalPrice}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
}
