"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EventsPage() {
  const [expandedEvent, setExpandedEvent] = React.useState<string | null>(null);
  const [booking, setBooking] = React.useState<string | null>(null); // title of event being booked
  const router = useRouter();

  const events = [
    { 
      title: 'Underground House Night', 
      date: 'Dec 19', 
      isoDate: '2025-12-19',
      price: 20,
      status: 'Sold Out', 
      desc: 'Curated selection of house DJs, immersive lights and visuals.',
      details: 'Join us for a night of deep underground beats featuring DJ Solstice and The Void. 18+ event. Doors open at 10 PM.'
    },
    { 
      title: 'Midnight Sessions', 
      date: 'Jan 10', 
      isoDate: '2026-01-10',
      price: 25,
      status: 'Tickets Available', 
      desc: 'A late-night journey into deep house and tech grooves.',
      details: 'Experience the hypnotic rhythms of Midnight Sessions. Special guest appearance by DJ Lunar. 21+ only.'
    },
    { 
      title: 'Love House', 
      date: 'Feb 14', 
      isoDate: '2026-02-14',
      price: 30,
      status: 'Tickets Available', 
      desc: 'A special Valentine-themed house music experience.',
      details: 'Celebrate love and music with our annual Valentine\'s bash. Couples and singles welcome! Dress to impress.'
    },
  ];

  const handleDetails = (title: string) => {
    setExpandedEvent(expandedEvent === title ? null : title);
  };

  const handleBook = async (event: typeof events[0]) => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (confirm('You need to be logged in to book tickets. Go to login?')) {
        router.push('/login');
      }
      return;
    }

    if (event.status === 'Sold Out') return;

    setBooking(event.title);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3001';
      const res = await fetch(`${apiBase}/tickets/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          eventTitle: event.title,
          eventDate: event.isoDate,
          price: event.price,
          quantity: 1
        })
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Booking failed');
      }

      const data = await res.json();
      alert(`Successfully booked ticket for ${event.title}! Ticket ID: ${data.ticket?.id || data.tickets?.[0]?.id}`);
    } catch (err: any) {
      alert('Booking failed: ' + (err.message || err));
    } finally {
      setBooking(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-fuchsia-700 to-indigo-900 text-white p-6">
      <div className="max-w-6xl mx-auto pt-8">
        <h1 className="text-4xl font-extrabold mb-6">Events</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e) => (
            <article key={e.title} className="rounded-xl bg-black/30 p-4 flex flex-col h-full">
              <div className={`text-sm font-bold mb-1 ${e.status === 'Sold Out' ? 'text-red-400' : 'text-green-400'}`}>
                {e.status}
              </div>
              <h3 className="text-xl font-semibold">{e.title}</h3>
              <div className="text-sm text-zinc-400 mb-2">{e.date} • ${e.price}</div>
              <p className="text-sm text-zinc-200/80 mb-4 flex-grow">{e.desc}</p>
              
              {expandedEvent === e.title && (
                <div className="mb-4 p-3 bg-white/10 rounded text-sm text-zinc-200 animate-in fade-in slide-in-from-top-2">
                  {e.details}
                </div>
              )}

              <div className="flex gap-2 mt-auto">
                <button 
                  onClick={() => handleDetails(e.title)}
                  className="flex-1 rounded px-3 py-2 bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
                >
                  {expandedEvent === e.title ? 'Hide Details' : 'Details'}
                </button>
                <button 
                  onClick={() => handleBook(e)}
                  disabled={e.status === 'Sold Out' || booking === e.title}
                  className={`flex-1 rounded px-3 py-2 font-medium transition-all ${
                    e.status === 'Sold Out' 
                      ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-pink-500 to-violet-500 hover:opacity-90 active:scale-95'
                  }`}
                >
                  {booking === e.title ? 'Booking...' : e.status === 'Sold Out' ? 'Sold Out' : 'Get Ticket'}
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-zinc-300">Want your event listed? <Link href="/contacts" className="underline">Contact us</Link>.</div>
      </div>
    </div>
  );
}
