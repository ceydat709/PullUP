'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; 

export default function AuthForm() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-10 p-4 border rounded shadow space-y-4"
    >
      <h2 className="text-2xl font-bold">{isSignUp ? 'Sign Up' : 'Log In'}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white p-2 rounded"
      >
        {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
      </button>
      <p
        className="text-sm text-center cursor-pointer text-blue-600"
        onClick={() => setIsSignUp(!isSignUp)}
      >
        {isSignUp ? 'Already have an account? Log In' : 'New here? Sign Up'}
      </p>
    </form>
  );
}
