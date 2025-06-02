// src/app/profile/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

export default function EditProfilePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load current user metadata on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login');
        return;
      }
      const user = session.user;
      const meta = user.user_metadata as { name?: string; phone?: string; avatar_url?: string };
      if (meta.name) setName(meta.name);
      if (meta.phone) setPhone(meta.phone);
      if (meta.avatar_url) setAvatarPreview(meta.avatar_url);
    });
  }, [supabase, router]);

  // Preview a newly selected avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Get user ID
    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser();
    if (sessionError || !user) {
      alert('Unable to fetch user session.');
      setLoading(false);
      return;
    }
    const uid = user.id;
    let avatar_url = (user.user_metadata as any)?.avatar_url || null;

    // 2. If a new file is selected, upload it to Storage
    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `avatars/${uid}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { cacheControl: '3600', upsert: true });
      if (uploadError) {
        alert('Error uploading avatar: ' + uploadError.message);
        setLoading(false);
        return;
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);
      avatar_url = publicUrl;
    }

    // 3. Update user metadata (name, phone, avatar_url)
    const { error: updateError } = await supabase.auth.updateUser({
      data: { name, phone, avatar_url },
    });
    if (updateError) {
      alert('Error updating profile: ' + updateError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push('/dashboard');
  };

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
              <span className="text-gray-700 hover:text-teal-600 text-lg">Search</span>
            </Link>
            <Link href="/create">
              <span className="text-gray-700 hover:text-teal-600 text-lg">Create</span>
            </Link>
            <Link href="/profile/edit">
              <span className="text-teal-600 font-semibold text-lg">Edit Profile</span>
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-md bg-gray-50 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-teal-600 text-center">
              Edit Profile
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <label className="block">
                <span className="text-gray-700">Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </label>

              {/* Phone */}
              <label className="block">
                <span className="text-gray-700">Phone Number</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="mt-1 w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </label>

              {/* Avatar Upload */}
              <label className="block">
                <span className="text-gray-700">Profile Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="mt-1 w-full"
                />
              </label>

              {/* Preview */}
              {avatarPreview && (
                <div className="flex justify-center">
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="h-24 w-24 rounded-full object-cover"
                  />
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
