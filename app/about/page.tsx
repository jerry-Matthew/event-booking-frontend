"use client";

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-fuchsia-700 to-indigo-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header is shared in the root layout */}
        <div className="pt-8" />

        <section className="bg-zinc-900/50 rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Our mission</h2>
          <p className="text-zinc-300 leading-relaxed mb-6">
            We bring the house-music community together by making it simple to discover and book events.
            Whether you're a DJ, promoter, or party-goer, our goal is to create amazing, safe, and memorable
            experiences.
          </p>

          <h3 className="text-lg font-semibold mt-4">What we do</h3>
          <ul className="list-disc list-inside text-zinc-300 mt-2 space-y-2">
            <li>Curate local and international house music events.</li>
            <li>Provide an easy booking flow for attendees.</li>
            <li>Support artists and venues with promotion tools.</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6">Our team</h3>
          <p className="text-zinc-300 mt-2">A small group of music lovers, product builders, and DJs dedicated to the scene.</p>

          <div className="mt-6">
            <Link href="/contacts" className="inline-block rounded-full bg-pink-500/90 px-4 py-2 font-semibold">Contact us</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
