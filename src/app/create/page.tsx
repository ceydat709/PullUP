// src/app/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import Image from 'next/image';

export default function CreatePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loadingUser, setLoadingUser] = useState(true);

  // User metadata
  const [userName, setUserName] = useState<string>('You');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [vibes, setVibes] = useState('');
  const [when, setWhen] = useState('');
  const [where, setWhere] = useState('');
  const [description, setDescription] = useState('');

  // Example friend “colors”
  const friendColors = ['bg-purple-600', 'bg-yellow-300', 'bg-blue-600', 'bg-red-600'];

  const addFriend = () => {
    alert('Add friend clicked!');
  };

  const handleReset = () => {
    setTitle('');
    setVibes('');
    setWhen('');
    setWhere('');
    setDescription('');
  };

  // Sample data for random generation
  const sampleTitles = ['Movie Night', 'Beach Day', 'Game Marathon', 'Coffee Hangout', 'Hiking Trip'];
  const sampleLocations = ['Central Park', 'Alex’s Place', 'Downtown Café', 'Seaside Pier', 'Mountain Trail'];
  const sampleDescriptions = [
    'Bring snacks and comfy chairs.',
    'Meet at the entrance at 7pm.',
    'Don’t forget your gear!',
    'Casual vibes, no dress code.',
    'We’ll grab something to eat afterward.'
  ];
  const sampleVibes = ['Relaxed', 'Energetic', 'Chill', 'Adventurous', 'Laid-back'];

  const handleGenerate = () => {
    // Pick random items
    const randTitle = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
    const randLocation = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
    const randDescription = sampleDescriptions[Math.floor(Math.random() * sampleDescriptions.length)];
    const randVibes = sampleVibes[Math.floor(Math.random() * sampleVibes.length)];
    setTitle(randTitle);
    setWhere(randLocation);
    setDescription(randDescription);
    setVibes(randVibes);
    // For “when,” use current date + random hours
    const now = new Date();
    const future = new Date(now.getTime() + Math.floor(Math.random() * 7 + 1) * 60 * 60 * 1000);
    const iso = future.toISOString().slice(0, 16);
    setWhen(iso);
  };

  // Block unauthenticated access and load user metadata
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login');
      } else {
        const { user } = session;
        const meta = user.user_metadata as { name?: string; phone?: string; avatar_url?: string };
        setUserName(meta.name || user.email || 'You');
        setAvatarUrl(meta.avatar_url || null);
        setLoadingUser(false);
      }
    });
  }, [supabase, router]);

  if (loadingUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-60 pr-6 border-r border-gray-200">
          <nav className="flex flex-col space-y-2 px-4 py-2">
            <Link href="/dashboard">
              <span className="text-teal-600 font-semibold text-lg">Dashboard</span>
            </Link>
            <Link href="/search">
              <span className="text-gray-700 hover:text-teal-600 text-lg">Search</span>
            </Link>
            <Link href="/create">
              <span className="text-teal-600 font-semibold text-lg">Create</span>
            </Link>
            <Link href="/profile/edit">
              <span className="text-gray-700 hover:text-teal-600 text-lg">Edit Profile</span>
            </Link>
          </nav>
        </aside>

        {/* Main content: form + preview */}
        <main className="flex-1 flex items-center justify-center space-x-8 px-8">
          {/* Form Card */}
          <div className="w-full max-w-lg bg-black rounded-2xl p-8 text-white shadow-lg">
            <h2 className="text-3xl font-bold text-teal-400 mb-6 text-center">
              Create Plan
            </h2>

            <form className="space-y-6 overflow-y-auto" onSubmit={(e) => e.preventDefault()}>
              {/* TITLE & VIBES */}
              <div className="grid grid-cols-2 gap-4">
                {/* TITLE */}
                <div className="flex flex-col">
                  <label
                    htmlFor="title"
                    className="mb-1 text-base font-semibold uppercase text-gray-200"
                  >
                    TITLE
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Your title…"
                    className="border-2 border-white rounded-full px-4 py-2 text-teal-400 placeholder-teal-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>

                {/* VIBES */}
                <div className="flex flex-col">
                  <label
                    htmlFor="vibes"
                    className="mb-1 text-base font-semibold uppercase text-gray-200"
                  >
                    VIBES
                  </label>
                  <input
                    id="vibes"
                    type="text"
                    value={vibes}
                    onChange={(e) => setVibes(e.target.value)}
                    placeholder="Your vibes…"
                    className="border-2 border-white rounded-full px-4 py-2 text-teal-400 placeholder-teal-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              </div>

              {/* WHEN & WHERE */}
              <div className="grid grid-cols-2 gap-4">
                {/* WHEN */}
                <div className="flex flex-col">
                  <label
                    htmlFor="when"
                    className="mb-1 text-base font-semibold uppercase text-gray-200"
                  >
                    WHEN
                  </label>
                  <input
                    id="when"
                    type="datetime-local"
                    value={when}
                    onChange={(e) => setWhen(e.target.value)}
                    className="border-2 border-white rounded-full px-4 py-2 text-teal-400 placeholder-teal-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>

                {/* WHERE */}
                <div className="flex flex-col">
                  <label
                    htmlFor="where"
                    className="mb-1 text-base font-semibold uppercase text-gray-200"
                  >
                    WHERE
                  </label>
                  <input
                    id="where"
                    type="text"
                    value={where}
                    onChange={(e) => setWhere(e.target.value)}
                    placeholder="e.g. Alex’s Place"
                    className="border-2 border-white rounded-full px-4 py-2 text-teal-400 placeholder-teal-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="flex flex-col">
                <label
                  htmlFor="description"
                  className="mb-1 text-base font-semibold uppercase text-gray-200"
                >
                  DESCRIPTION
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Add extra details…"
                  className="resize-none border-2 border-white rounded-xl px-4 py-2 text-teal-400 placeholder-teal-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              {/* ADD FRIENDS */}
              <div>
                <span className="block mb-2 text-base font-semibold uppercase text-gray-200">
                  ADD FRIENDS
                </span>
                <div className="flex space-x-3">
                  {friendColors.map((clr, idx) => (
                    <div key={idx} className={`${clr} h-10 w-10 rounded-full`} />
                  ))}
                  <button
                    type="button"
                    onClick={addFriend}
                    className="h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center text-white text-xl"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* RESET & GENERATE */}
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-32 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-full transition"
                >
                  RESET
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="w-32 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-full transition"
                >
                  GENERATE
                </button>
              </div>
            </form>
          </div>

          {/* Phone Preview (with iPhone‐style border) */}
          <div className="w-[320px] h-[640px] bg-gray-900 rounded-3xl border-4 border-gray-800 shadow-xl p-4 flex flex-col">
            {/* Top “status” circles */}
            <div className="flex justify-center space-x-2 mb-4">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="User avatar"
                  width={30}
                  height={30}
                  className="rounded-full border-2 border-red-500"
                />
              ) : (
                <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="h-8 w-8 bg-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                M
              </div>
              <div className="h-8 w-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-semibold">
                S
              </div>
              <div className="h-8 w-8 bg-teal-400 rounded-full flex items-center justify-center text-white font-semibold">
                C
              </div>
            </div>

            {/* Chat bubbles */}
            <div className="flex-1 overflow-y-auto space-y-3 px-2">
              {/* Grey bubble: “What’s move?” */}
              <div className="self-start max-w-[260px] bg-gray-700 rounded-xl p-2">
                <p className="text-sm text-gray-300">What’s move?</p>
              </div>
              {/* Teal bubble: “I made the plans!” */}
              <div className="self-end max-w-[260px] bg-teal-500 rounded-xl p-2">
                <p className="text-sm text-white">I made the plans!</p>
              </div>

              {/* Plan card */}
              <div className="max-w-[260px] bg-teal-500 rounded-2xl p-3 mt-4">
                <div className="flex items-center mb-1">
                  <span className="text-xl mr-2">🍿</span>
                  <h4 className="text-lg font-bold text-white">
                    {title || 'Plan Title'}
                  </h4>
                </div>
                <p className="text-sm text-white mb-1">When: {when ? new Date(when).toLocaleString() : 'When?'}</p>
                <p className="text-sm text-white mb-1">Where: {where || 'Where?'}</p>
                <p className="text-sm italic text-white mb-1">Vibes: {vibes || 'Vibes?'}</p>
                <p className="text-sm text-white mb-2">{description || 'Description?'}</p>
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
                    <span role="img" aria-label="camera">
                      📷
                    </span>
                  </div>
                  <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
                    <span role="img" aria-label="headphones">
                      🎧
                    </span>
                  </div>
                  <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
                    <span role="img" aria-label="bag">
                      🛍️
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Input bar */}
            <div className="mt-4 flex items-center">
              <input
                type="text"
                placeholder="Send Invite"
                className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none"
              />
              <button className="ml-2 bg-teal-400 p-3 rounded-full">
                <span role="img" aria-label="send">
                  ⬆️
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
