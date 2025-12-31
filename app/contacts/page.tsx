"use client";

import React, { useState } from 'react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

export default function ContactsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Open Gmail compose in a new tab
    const subject = encodeURIComponent(`Contact from ${name || 'Website visitor'}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=jer2ymatheww@gmail.com&su=${subject}&body=${body}`, '_blank');
    
    // Clear form fields
    setName('');
    setEmail('');
    setMessage('');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-fuchsia-700 to-indigo-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header is shared in the root layout */}
        <div className="pt-8" />

        <section className="bg-zinc-900/50 rounded-lg p-8 shadow-lg">
          <p className="text-zinc-300 mb-6">Have a question, want to collaborate, or want your event listed? Send us a message and we'll get back to you.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input className="rounded bg-white/5 px-3 py-2 text-black" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="rounded bg-white/5 px-3 py-2 text-black" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            <textarea className="rounded bg-white/5 px-3 py-2 text-black" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} required />

            <div className="flex items-center justify-between mt-2">
              <button type="submit" className="rounded-full bg-pink-500/90 px-4 py-2 font-semibold">Send message</button>
              <a className="text-sm text-zinc-300 underline" href="https://mail.google.com/mail/?view=cm&fs=1&to=jer2ymatheww@gmail.com" target="_blank" rel="noopener noreferrer">Or email jer2ymatheww@gmail.com</a>
            </div>
          </form>

          <div className="mt-8 text-zinc-300">
            <h4 className="font-semibold">Office</h4>
            <p className="text-sm">123 Music Ave, Suite 4<br/>Party City</p>

            <h4 className="font-semibold mt-4">Connect with us</h4>
            <div className="flex flex-col gap-3 mt-3">
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors">
                <FaWhatsapp className="text-xl" />
                <span>Connect via WhatsApp</span>
              </a>
              <a href="https://instagram.com/jer2ymatheww" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-pink-400 hover:text-pink-300 transition-colors">
                <FaInstagram className="text-xl" />
                <span>Follow on Instagram</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
