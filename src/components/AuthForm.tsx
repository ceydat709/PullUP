// src/components/AuthForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FcGoogle } from 'react-icons/fc';

export default function AuthForm() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = isSignUp
      ? await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, phone } },
        })
      : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      router.push('/dashboard');
    }
  }

  async function handleGoogleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  }

  return (
    <div className="auth-container">
      <h2 className="auth-title">
        {isSignUp ? 'Sign Up' : 'Log In'} <span>👤</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {isSignUp && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="auth-button w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
        </button>
      </form>

      <p className="auth-toggle-text mt-4 text-center">
        {isSignUp ? 'Already have an account?' : 'New here?'}{' '}
        <span
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          {isSignUp ? 'Log In' : 'Sign Up'}
        </span>
      </p>

      <div className="auth-divider flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-2 text-gray-500">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <button
        onClick={handleGoogleSignIn}
        className="auth-google inline-flex items-center justify-center gap-2 w-full border px-4 py-2 rounded hover:bg-gray-100"
      >
        <FcGoogle className="text-xl" />
        Sign {isSignUp ? 'up' : 'in'} with Google
      </button>
    </div>
  );
}