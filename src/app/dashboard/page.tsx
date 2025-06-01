// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  // State to hold user info from metadata:
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Carousel state
  const [badgeIdx, setBadgeIdx] = useState(0);
  const [albumIdx, setAlbumIdx] = useState(0);
  const [friendIdx, setFriendIdx] = useState(0);

  // Sample/static data for streaks, badges, friends, etc.
  const sampleStreaks = [3, 1, 1];
  const sampleBadges = [
    '/media/badge-camera.png',
    '/media/badge-headphones.png',
    '/media/badge-hamster.png',
  ];
  const sampleFriends = ['/media/friend-placeholder.png'];
  const upcomingPlans = [
    { id: 'new', color: 'bg-black', border: '' },
    { id: 1, color: 'bg-gray-400', border: 'border-4 border-green-900' },
    { id: 2, color: 'bg-white', border: 'border-4 border-green-600' },
    { id: 3, color: 'bg-white', border: 'border-4 border-red-500' },
  ];
  const photoAlbums = [
    { id: 'new' },
    { id: 'album1', src: '/media/photo-album-1.jpg' },
    { id: 'album2', src: '/media/photo-album-2.jpg' },
  ];

  // Utility to get exactly 3 visible items (wrapping around) for carousels
  const getVisible = <T,>(arr: T[], idx: number) => {
    const visibleCount = 3;
    if (arr.length <= visibleCount) return arr;
    return [
      arr[idx % arr.length],
      arr[(idx + 1) % arr.length],
      arr[(idx + 2) % arr.length],
    ];
  };

  // On mount, fetch session and user_metadata
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login');
      } else {
        const { user } = session;
        const meta = user.user_metadata as {
          name?: string;
          phone?: string;
          avatar_url?: string;
        };
        setUserName(meta.name || user.email || 'Unknown');
        setAvatarUrl(meta.avatar_url || null);
        setLoadingUser(false);
      }
    });
  }, [supabase, router]);

  // Sign-out handler
  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loadingUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading user…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-8 py-6">
      <div className="flex justify-between">
        {/* Left Column */}
        <div className="flex-1 pr-6">
          {/* Sidebar header with vertical nav */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-teal-600">Dashboard</h2>
            <div className="mt-2 flex flex-col space-y-2">
              <a href="/search" className="text-lg hover:underline">
                Search
              </a>
              <a href="/create" className="text-lg hover:underline">
                Create
              </a>
            </div>
          </div>

          {/* Upcoming Plans Section */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-teal-600 mb-4">
              Upcoming Plans
            </h3>
            <div className="flex space-x-4">
              {upcomingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`
                    relative flex-shrink-0 
                    h-48 w-32 rounded-2xl 
                    ${plan.color} 
                    ${plan.border} 
                    flex items-center justify-center
                  `}
                >
                  {plan.id === 'new' ? (
                    <span className="text-4xl text-white">＋</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Photo Albums Section */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-teal-600 mb-4">
              Photo Albums
            </h3>
            <div className="flex items-center">
              {/* Left arrow */}
              <button
                onClick={() =>
                  setAlbumIdx((prev) => (prev - 1 + photoAlbums.length) % photoAlbums.length)
                }
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Previous Album"
              >
                <AiOutlineLeft size={24} />
              </button>

              <div className="ml-4 flex space-x-4 overflow-hidden">
                {getVisible(photoAlbums, albumIdx).map((album) => (
                  <div
                    key={album.id}
                    className="relative flex-shrink-0 h-32 w-32 rounded-2xl bg-gray-100 overflow-hidden"
                  >
                    {album.id === 'new' ? (
                      <div className="h-full w-full bg-black rounded-2xl flex items-center justify-center">
                        <span className="text-4xl text-white">＋</span>
                      </div>
                    ) : (
                      <Image
                        src={album.src!}
                        alt={`Album ${album.id}`}
                        fill
                        className="object-cover rounded-2xl"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Right arrow */}
              <button
                onClick={() => setAlbumIdx((prev) => (prev + 1) % photoAlbums.length)}
                className="ml-4 p-2 hover:bg-gray-100 rounded-full"
                aria-label="Next Album"
              >
                <AiOutlineRight size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-80 flex-shrink-0 border-l border-gray-200 pl-6">
          {/* User Info + Edit Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="User avatar"
                  width={48}
                  height={48}
                  className="rounded-full object-cover mr-4"
                />
              ) : (
                <div className="h-12 w-12 bg-red-500 rounded-full flex items-center justify-center text-white text-lg font-semibold mr-4">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold">{userName}</h3>
              </div>
            </div>

            {/* ← New Edit Profile button */}
            <button
              onClick={() => router.push('/profile/edit')}
              className="text-sm text-teal-600 hover:underline"
            >
              Edit Profile
            </button>
          </div>

          {/* Streaks Section */}
          <div className="mb-8">
            <h4 className="text-xl font-semibold text-teal-600 mb-3">Streaks</h4>
            <div className="space-y-4">
              {sampleStreaks.map((count, i) => (
                <div key={i} className="flex items-center">
                  {/* user icon */}
                  <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-white mr-3">
                    <span className="text-lg">👤</span>
                  </div>
                  {/* stars */}
                  <div className="flex space-x-1">
                    {Array.from({ length: count }).map((_, idx) => (
                      <span key={idx} className="text-yellow-500 text-xl">
                        ★
                      </span>
                    ))}
                    {count < 3 &&
                      Array.from({ length: 3 - count }).map((_, idx2) => (
                        <span key={`empty-${idx2}`} className="text-gray-300 text-xl">
                          ★
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges Section */}
          <div className="mb-8">
            <h4 className="text-xl font-semibold text-teal-600 mb-3">Badges</h4>
            <div className="flex items-center">
              {/* Left arrow */}
              <button
                onClick={() =>
                  setBadgeIdx((prev) => (prev - 1 + sampleBadges.length) % sampleBadges.length)
                }
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Previous Badge"
              >
                <AiOutlineLeft size={20} />
              </button>

              <div className="ml-3 flex space-x-4 overflow-hidden">
                {getVisible(sampleBadges, badgeIdx).map((src, i) => (
                  <div
                    key={i}
                    className="relative flex-shrink-0 h-12 w-12 rounded-xl bg-gray-100 overflow-hidden"
                  >
                    <Image
                      src={src}
                      alt={`Badge ${i}`}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                ))}
              </div>

              {/* Right arrow */}
              <button
                onClick={() => setBadgeIdx((prev) => (prev + 1) % sampleBadges.length)}
                className="ml-3 p-2 hover:bg-gray-100 rounded-full"
                aria-label="Next Badge"
              >
                <AiOutlineRight size={20} />
              </button>
            </div>
          </div>

          {/* Friends Section */}
          <div>
            <h4 className="text-xl font-semibold text-teal-600 mb-3">Friends</h4>
            <div className="flex items-center">
              {/* Left arrow */}
              <button
                onClick={() =>
                  setFriendIdx((prev) => (prev - 1 + sampleFriends.length) % sampleFriends.length)
                }
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Previous Friend"
              >
                <AiOutlineLeft size={20} />
              </button>

              <div className="ml-3 flex space-x-4 overflow-hidden">
                {/* “+” at front for adding a friend */}
                <div className="relative flex-shrink-0 h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl">
                  ＋
                </div>

                {getVisible(sampleFriends, friendIdx).map((src, i) => (
                  <div
                    key={i}
                    className="relative flex-shrink-0 h-12 w-12 rounded-full bg-gray-100 overflow-hidden"
                  >
                    <Image
                      src={src}
                      alt={`Friend ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Right arrow */}
              <button
                onClick={() => setFriendIdx((prev) => (prev + 1) % sampleFriends.length)}
                className="ml-3 p-2 hover:bg-gray-100 rounded-full"
                aria-label="Next Friend"
              >
                <AiOutlineRight size={20} />
              </button>
            </div>
          </div>

          {/* Log out button at the very bottom */}
          <div className="mt-8">
            <button
              onClick={signOut}
              className="w-full py-2 bg-red-500 text-white rounded-lg"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
