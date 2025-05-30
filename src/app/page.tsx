'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DiceLink from '../components/DiceLink';

const scrollingWords = [
  'Trip', 'Hangout', 'Dinner', 'Picnic', 'Study',
  'Game Night', 'Hike', 'Chill', 'Party', 'Museum'
];

export default function HomePage() {
  const previews = [
    '/media/dashboardpage.png',
    '/media/searchpage.png',
    '/media/createpage.png',
  ];
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((idx - 1 + previews.length) % previews.length);
  const next = () => setIdx((idx + 1) % previews.length);

  return (
    <main className="min-h-screen flex flex-col items-center justify-between px-6 py-8 bg-white">
      {/* Sign In button */}
      <div className="w-full flex justify-end">
        <Link href="/login">
          <button className="bg-black text-cyan-300 font-bold px-6 py-2 text-lg rounded-full hover:opacity-90 transition">
            Sign In
          </button>
        </Link>
      </div>

      {/* Logo with scrolling background text */}
      <div className="relative w-screen flex flex-col items-center justify-center mt-20 mb-8">
        {/* Scrolling text behind logo */}
        <div className="absolute top-[calc(50%-0.5px)] left-0 w-screen flex items-center overflow-hidden z-0 pointer-events-none">
          <div className="marquee-track">
            <div className="marquee-content text-4xl font-bold text-[#9BD4D3]">
              {scrollingWords.map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  className={`inline-block mx-8 animate-fade-word delay-${i % 10}`}
                >
                  {word}
                </span>
              ))}
            </div>
            <div className="marquee-content text-4xl font-bold text-[#9BD4D3]">
              {scrollingWords.map((word, i) => (
                <span
                  key={`copy-${word}-${i}`}
                  className={`inline-block mx-8 animate-fade-word delay-${i % 10}`}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Foreground logo */}
        <div className="relative z-10">
          <Image
            src="/media/Logo.png"
            alt="PullUP Logo"
            width={750}
            height={150}
            priority
          />
        </div>

        {/* Tagline below logo */}
        <p className="text-2xl font-semibold text-black z-10 mt-4">
          Make Plans that Leave the Group Chat.
        </p>
      </div>

      {/* Dice links */}
      <div className="flex flex-row justify-center gap-12 mt-6 mb-12">
        <DiceLink
          label="Create Plan"
          href="/create"
          rotation="left"
          textPosition="above"
        />
        <DiceLink
          label="Search Plan"
          href="/search"
          rotation="right"
          textPosition="below"
        />
      </div>

      {/* 3-screen carousel */}
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
