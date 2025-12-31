"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function NavLink({ children, href }: Readonly<{ children: React.ReactNode; href?: string }>) {
  return (
    <Link
      href={href ?? '#'}
      className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition"
    >
      {children}
    </Link>
  );
}

function Modal({ title, open, onClose, children }: Readonly<{ title: string; open: boolean; onClose: () => void; children: React.ReactNode }>) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button type="button" aria-label="Close overlay" className="absolute inset-0 bg-black/60" onClick={onClose} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }} />
      <div className="relative z-10 w-full max-w-md rounded bg-zinc-900 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="text-xl" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="mt-4 text-sm text-zinc-300">{children}</div>
      </div>
    </div>
  );
}

export default function Home() {
  // Header and auth actions are handled by the shared Header component in the layout
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<null | { name?: string; email?: string }>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [qty, setQty] = useState<number>(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3001';

  function loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).Razorpay) return resolve();
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.body.appendChild(script);
    });
  }

  useEffect(() => {
    // client-side auth gate for the main page — redirect to /login if not signed in
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }
      // also read basic user info for conditional CTAs
      try {
        const raw = localStorage.getItem('user');
        if (raw) setUser(JSON.parse(raw));
      } catch (e) {
        // log parse errors for visibility during development
        // eslint-disable-next-line no-console
        console.debug('Failed to parse user from storage', e);
      }
    } catch (e) {
      // if localStorage access fails, redirect to login
      // eslint-disable-next-line no-console
      console.debug('localStorage access failed', e);
      router.replace('/login');
      return;
    } finally {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 via-fuchsia-700 to-indigo-900 text-white">
        <div className="text-center">Checking authentication…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-fuchsia-700 to-indigo-900 text-white">
      {/* Header is rendered by the shared Root layout */}

      <main className="mx-auto max-w-6xl px-6 py-24">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">Underground House Night</h1>
            <p className="mt-4 text-lg text-zinc-200 max-w-xl">Join us for a night of deep grooves, lights, and energy — a true house music party featuring top DJs, immersive visuals, and an unforgettable crowd.</p>

            <div className="mt-8 flex flex-wrap gap-4">
              {user ? (
                <Link href="/profile" className="inline-flex items-center gap-3 rounded-full bg-white/10 px-6 py-3">Profile</Link>
              ) : (
                <Link href="/register" className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-6 py-3 font-semibold shadow-lg">Register</Link>
              )}
              <a className="inline-flex items-center gap-3 rounded-full bg-white/10 px-6 py-3" href="/events">See Events</a>
            </div>

            <ul className="mt-8 flex flex-col gap-3 text-sm text-zinc-200">
              <li><strong>Date:</strong> Dec 19, 2025</li>
              <li><strong>Location:</strong> The Warehouse — Downtown</li>
              <li><strong>Dress code:</strong> Club casual</li>
            </ul>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-md aspect-[4/5] rounded-3xl bg-gradient-to-br from-pink-600/40 via-violet-600/30 to-indigo-700/40 p-6 shadow-2xl">
              <div className="h-full w-full rounded-2xl bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/4 to-transparent p-6 flex flex-col justify-end">
                <div className="text-sm text-zinc-100/90 font-semibold">Lineup</div>
                <div className="mt-2 text-2xl font-bold">DJ Pulse • DJ Marrow • EchoBeats</div>
                <div className="mt-4 text-xs text-zinc-200/80">Late doors • 21+ • Limited capacity</div>
              </div>
            </div>
          </div>
        </section>

        <section id="events" className="mt-20">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* simple cards - placeholders for real data */}
            {['Dec 19 — Underground House Night','Jan 10 — Midnight Sessions','Feb 14 — Love House'].map((title, i) => (
              <article key={title} className="rounded-xl bg-black/30 p-4">
                <div className="text-sm text-zinc-200/80">{i === 0 ? 'Sold Out' : 'Tickets Available'}</div>
                <h3 className="mt-2 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-zinc-200/70">Curated selection of house DJs, immersive lights and visuals.</p>
                <div className="mt-4 flex gap-2">
                  <button className="rounded px-3 py-1 bg-white/10">Details</button>
                  <button
                    className={`rounded px-3 py-1 ${i === 0 ? 'bg-white/5 text-zinc-400 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-violet-500'}`}
                    onClick={() => {
                      if (i === 0) return;
                      // open booking modal
                      setSelectedEvent(title);
                      setBookingOpen(true);
                    }}
                  >
                    Tickets
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <Modal title={selectedEvent ?? 'Book ticket'} open={bookingOpen} onClose={() => { setBookingOpen(false); setBookingError(null); setQty(1); }}>
          <div>
            <div className="mb-4">You're about to purchase a ticket for <strong>{selectedEvent}</strong>.</div>
            <div className="mb-4">Quantity: <span className="ml-2"><input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))} className="w-20 rounded bg-white/5 px-2 py-1 text-white" /></span></div>
            <div className="mb-4">Amount: <strong>₹{499 * qty}</strong> (₹499 per ticket)</div>
            {bookingError && <div className="mb-2 text-sm text-red-400">{bookingError}</div>}
            {bookingSuccess ? (
              <div className="text-sm text-green-400">{bookingSuccess}</div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    setBookingLoading(true);
                    setBookingError(null);
                    try {
                      const token = localStorage.getItem('token');
                      if (!token) throw new Error('Not authenticated');

                      const amountPaise = 499 * qty * 100;
                      // create order on server
                      const orderRes = await fetch(`${apiBase}/payments/create-order`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ amountPaise, receipt: `rcpt_${Date.now()}`, notes: { eventTitle: selectedEvent, quantity: qty } }),
                      });
                      if (!orderRes.ok) {
                        const t = await orderRes.text();
                        throw new Error(t || 'Failed creating payment order');
                      }
                      const order = await orderRes.json();

                      // load razorpay script
                      await loadRazorpayScript();

                      const options: any = {
                        key: order.key_id,
                        amount: order.amount,
                        currency: order.currency,
                        name: 'House Party',
                        description: selectedEvent,
                        order_id: order.orderId,
                        handler: async function (response: any) {
                          // verify on server
                          const verifyRes = await fetch(`${apiBase}/payments/verify`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ razorpay_payment_id: response.razorpay_payment_id, razorpay_order_id: response.razorpay_order_id, razorpay_signature: response.razorpay_signature }),
                          });
                          if (!verifyRes.ok) {
                            const t = await verifyRes.text();
                            setBookingError(t || 'Payment verification failed');
                            return;
                          }

                          // create tickets server-side with auth token
                          const bookRes = await fetch(`${apiBase}/tickets/book`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                            body: JSON.stringify({ eventTitle: selectedEvent, eventDate: selectedEvent?.split(' — ')[0] ?? undefined, price: 499, quantity: qty }),
                          });
                          if (!bookRes.ok) {
                            const t = await bookRes.text();
                            setBookingError(t || 'Booking failed');
                            return;
                          }
                          await bookRes.json();
                          setBookingSuccess('Payment successful — ticket(s) booked!');
                          window.dispatchEvent(new Event('auth-change'));
                          setTimeout(() => {
                            setBookingOpen(false);
                            router.push('/profile');
                          }, 900);
                        },
                        prefill: {
                          name: user?.name,
                          email: user?.email,
                        },
                        theme: { color: '#8b5cf6' },
                      };

                      const rzp = new (window as any).Razorpay(options);
                      rzp.open();
                    } catch (err: any) {
                      setBookingError(err?.message ?? String(err));
                    } finally {
                      setBookingLoading(false);
                    }
                  }}
                  disabled={bookingLoading}
                  className="rounded px-3 py-1 bg-pink-500"
                >
                  {bookingLoading ? 'Processing…' : 'Pay with Razorpay'}
                </button>
                <button onClick={() => { setBookingOpen(false); setBookingError(null); }} className="rounded px-3 py-1 bg-white/10">Cancel</button>
              </div>
            )}
          </div>
        </Modal>
      </main>

      {/* Footer is now shared in the Root layout */}

      {/* Register/Login handled on separate pages */}
    </div>
  );
}
