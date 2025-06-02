'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DiceLink from '../../components/DiceLink';
import Sidebar from '../../components/Sidebar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoggedInHomePage() {
  const previews = [
    '/media/dashboardpage.png',
    '/media/searchpage.png',
    '/media/createpage.png',
  ];
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((idx - 1 + previews.length) % previews.length);
  const next = () => setIdx((idx + 1) % previews.length);

  const supabase = createClientComponentClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      const url = user?.user_metadata?.avatar_url;
      setAvatarUrl(url || null);
    }
    fetchUserData();
  }, []);

  return (
    <main className="min-h-screen bg-white relative px-6 py-8">
      {/* Collapsible sidebar toggle */}
      <div className="absolute top-4 left-4 z-50">
        <Sidebar />
      </div>

      {/* Dynamic profile avatar */}
      <div className="absolute top-4 right-4 z-50">
        <Link href="/profile/edit">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-14 h-14 rounded-full border-2 border-black object-cover cursor-pointer"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#9BD4D3] flex items-center justify-center font-bold text-black cursor-pointer">
              Me
            </div>
          )}
        </Link>
      </div>

      {/* Logo and marquee */}
      <div className="relative w-screen flex flex-col items-center justify-center mt-5 mb-8">
        <div className="absolute top-[calc(50%-0.5px)] left-0 w-screen flex items-center overflow-hidden z-0 pointer-events-none">
          <div className="marquee-track">
            <div className="marquee-content text-4xl font-bold text-[#9BD4D3]">
              {['Trip', 'Hangout', 'Dinner', 'Picnic', 'Study', 'Game Night', 'Hike', 'Chill', 'Party', 'Museum'].map((word, i) => (
                <span key={`${word}-${i}`} className={`inline-block mx-8 animate-fade-word delay-${i % 10}`}>
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <Image src="/media/Logo.png" alt="PullUP Logo" width={750} height={150} priority />
        </div>

        <p className="text-2xl text-black z-2 -mt-2 ml-6">
          Make Plans that Leave the Group Chat.
        </p>
      </div>

      {/* Dice Links */}
      <div className="flex flex-row justify-center mt-6 mb-12">
        <DiceLink label="Create Plan" href="/create" rotation="left" textPosition="above" />
        <DiceLink label="Search Plan" href="/search" rotation="right" textPosition="below" />
      </div>
    </main>
  );
}
