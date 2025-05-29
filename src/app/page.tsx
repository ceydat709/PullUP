// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DiceLink from '../components/DiceLink';

export default function HomePage() {
  // 1) Your three preview images
  const previews = [
    '/media/dashboardpage.png',
    '/media/searchpage.png',
    '/media/createpage.png',
  ];
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((idx - 1 + previews.length) % previews.length);
  const next = () => setIdx((idx + 1) % previews.length);

  return (
    <main className="min-h-screen flex flex-col items-center justify-between px-6 py-8 bg-white shadow-md hover:shadow-lg transition">
      {/* Sign In button */}
      <div className="w-full flex justify-end">
        <Link href="/login">
          <button className="bg-black text-cyan-300 font-bold px-6 py-2 text-lg rounded-full hover:opacity-90 transition">
            Sign In
          </button>
        </Link>
      </div>

      {/* Logo & tagline */}
      <div className="flex flex-col items-center text-center">
        <Image
          src="/media/Logo.png"
          alt="PullUP Logo"
          width={750}
          height={150}
          priority
        />
        <p className="text-2xl font-semibold mt-2 mb-4 text-black">
          Make Plans that Leave the Group Chat.
        </p>
      </div>

      {/* Dice links */}
      <div className="flex justify-center gap-32 mt-6 mb-12">
        <DiceLink label="Create Plan" href="/create" rotation="left" />
        <DiceLink label="Search Plan" href="/search" rotation="right" />
      </div>

      {/* Centered 3-screen carousel */}
      <div className="w-full flex justify-center items-center space-x-6 my-8">
        <button
          onClick={prev}
          className="text-3xl p-2 hover:bg-gray-100 rounded-full"
          aria-label="Previous screen"
        >
          ←
        </button>

        <div className="relative w-[650px] max-w-full aspect-[4/3] border-4 border-black rounded-2xl shadow-lg overflow-hidden">
          <Image
            src={previews[idx]}
            alt={`Preview screen ${idx + 1}`}
            fill
            className="object-contain"
            priority
          />
        </div>

        <button
          onClick={next}
          className="text-3xl p-2 hover:bg-gray-100 rounded-full"
          aria-label="Next screen"
        >
          →
        </button>
      </div>

      {/* Footer */}
      <footer className="flex justify-center space-x-8 text-sm text-gray-600 pb-4">
        <Link href="/about">About Us</Link>
        <Link href="/support">Support</Link>
      </footer>
    </main>
  );
}
