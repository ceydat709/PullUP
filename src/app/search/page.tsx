// src/app/search/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loadingUser, setLoadingUser] = useState(true);

  // Form state
  const [activity, setActivity] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [location, setLocation] = useState('');

  // Suggestions state
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Sample data for random suggestions
  const sampleActivities = [
    'Movie Night',
    'Beach Day',
    'Coffee Meetup',
    'Board Games',
    'Hiking Trip',
    'Picnic',
    'Museum Visit',
    'Dinner Out',
  ];
  const sampleLocations = [
    'Central Park',
    'Downtown Café',
    'Seaside Pier',
    'Mountain Trail',
    'Alex’s Place',
    'City Museum',
  ];
  const samplePeopleCounts = ['2', '3', '4', '5', '6'];

  // Generate random suggestions once
  useEffect(() => {
    const generateRandomSuggestions = () => {
      const newSugs: string[] = [];
      for (let i = 0; i < 5; i++) {
        const act = sampleActivities[Math.floor(Math.random() * sampleActivities.length)];
        const ppl = samplePeopleCounts[Math.floor(Math.random() * samplePeopleCounts.length)];
        const loc = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
        newSugs.push(`${act} · ${ppl} people · ${loc}`);
      }
      setSuggestions(newSugs);
    };
    generateRandomSuggestions();
  }, []);

  // Block unauthenticated access
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login');
      } else {
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
              <span className="text-gray-700 hover:text-teal-600 text-lg">Dashboard</span>
            </Link>
            <Link href="/search">
              <span className="text-teal-600 font-semibold text-lg">Search</span>
            </Link>
            <Link href="/create">
              <span className="text-gray-700 hover:text-teal-600 text-lg">Create</span>
            </Link>
            <Link href="/profile/edit">
              <span className="text-gray-700 hover:text-teal-600 text-lg">Edit Profile</span>
            </Link>
          </nav>
        </aside>

        {/* Main content: form + preview */}
        <main className="flex-1 flex items-center justify-center space-x-8 px-8">
          {/* Left: Search Card */}
          <div className="w-full max-w-lg bg-black rounded-2xl p-8 text-white shadow-lg">
            <h2 className="text-3xl font-bold text-teal-400 mb-6 text-center">
              Search Plan
            </h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Activity */}
              <div className="flex flex-col">
                <label
                  htmlFor="activity"
                  className="mb-1 text-base font-semibold uppercase text-gray-200"
                >
                  Activity
                </label>
                <input
                  id="activity"
                  type="text"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  placeholder="e.g. Movie Night"
                  className="border-2 border-white rounded-full px-4 py-2 text-teal-400 placeholder-teal-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              {/* Number of People */}
              <div className="flex flex-col">
                <label
                  htmlFor="people"
                  className="mb-1 text-base font-semibold uppercase text-gray-200"
                >
                  Number of People
                </label>
                <input
                  id="people"
                  type="number"
                  min="1"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(e.target.value)}
                  placeholder="e.g. 4"
                  className="border-2 border-white rounded-full px-4 py-2 text-teal-400 placeholder-teal-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              {/* Location */}
              <div className="flex flex-col">
                <label
                  htmlFor="location"
                  className="mb-1 text-base font-semibold uppercase text-gray-200"
                >
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Central Park"
                  className="border-2 border-white rounded-full px-4 py-2 text-teal-400 placeholder-teal-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              {/* Dice Icon at bottom (centered) */}
              <div className="flex justify-center mt-4">
                <Image
                  src="/media/dice.png"
                  alt="Roll Dice"
                  width={60}
                  height={60}
                  className="opacity-80"
                />
              </div>
            </form>
          </div>

          {/* Right: Phone Preview */}
          <div className="w-[320px] h-[640px] bg-gray-900 rounded-3xl border-4 border-gray-800 shadow-xl p-4 flex flex-col">
            {/* Header */}
            <h3 className="text-white text-xl font-bold mb-4 text-center">Suggestions</h3>

            {/* Suggestions List */}
            <div className="flex-1 overflow-y-auto space-y-3 px-2">
              {suggestions.map((sug, idx) => (
                <div
                  key={idx}
                  className="relative bg-white rounded-xl px-3 py-2 flex justify-between items-center max-w-[280px] ml-auto"
                >
                  <span className="text-sm text-gray-800">{sug}</span>
                  <span className="ml-2 bg-teal-400 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Create
                  </span>
                  <div className="absolute right-0 bottom-0 w-4 h-4 bg-white transform rotate-45 translate-x-2 translate-y-2 rounded-sm"></div>
                </div>
              ))}
            </div>

            {/* Two dice icons at bottom */}
            <div className="flex justify-center space-x-2 mt-4">
              <Image src="/media/dice.png" alt="Dice" width={40} height={40} />
              <Image src="/media/dice.png" alt="Dice" width={40} height={40} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
