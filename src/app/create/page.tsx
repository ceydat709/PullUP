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

  const [userName, setUserName] = useState<string>('You');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [vibes, setVibes] = useState('');
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleSpark = async () => {
    try {
      const body: any = { vibe: vibes || 'spontaneous' };
      if (coords) {
        body.location = coords;
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const plan = await response.json();

      const { data, error } = await supabase
        .from('plans')
        .insert(plan)
        .select()
        .single();

      if (data) {
        router.push(`/plan/${data.id}`);
      } else {
        alert('Could not spark a vibe');
        console.error(error);
      }
    } catch (err) {
      alert('Something went wrong.');
      console.error(err);
    }
  };

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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
          setLocationAllowed(true);
        },
        () => setLocationAllowed(false)
      );
    }
  }, []);

  if (loadingUser) {
    return <div className="flex h-screen items-center justify-center"><p>Loading…</p></div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-screen">
        <aside className="w-60 pr-6 border-r border-gray-200">
          <nav className="flex flex-col space-y-2 px-4 py-2">
            <Link href="/dashboard"><span className="text-teal-600 font-semibold text-lg">Dashboard</span></Link>
            <Link href="/search"><span className="text-gray-700 hover:text-teal-600 text-lg">Search</span></Link>
            <Link href="/create"><span className="text-teal-600 font-semibold text-lg">Create</span></Link>
            <Link href="/profile/edit"><span className="text-gray-700 hover:text-teal-600 text-lg">Edit Profile</span></Link>
          </nav>
        </aside>

        <main className="flex-1 flex items-center justify-center space-x-8 px-8">
          <div className="w-full max-w-lg bg-black rounded-2xl p-8 text-white shadow-lg">
            <h2 className="text-3xl font-bold text-teal-400 mb-6 text-center">Spark a Vibe</h2>
            <form className="space-y-6 overflow-y-auto" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col">
                <label htmlFor="vibes" className="mb-1 text-base font-semibold uppercase text-gray-200">VIBES</label>
                <input id="vibes" type="text" value={vibes} onChange={(e) => setVibes(e.target.value)} placeholder="Any vibe you're feeling…" className="border-2 border-white rounded-full px-4 py-2 text-teal-400 bg-white" />
              </div>
              <div className="text-sm text-teal-200">
                {locationAllowed ? 'Using your location to make plans nearby!' : 'Enable location to get better suggestions.'}
              </div>
              <div className="mt-6 flex justify-end">
                <button type="button" onClick={handleSpark} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-full transition text-lg">✨ Spark It</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}