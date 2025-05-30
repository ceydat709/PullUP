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
    if (error) alert(error.message);
    else router.push('/dashboard');
  }

  async function handleGoogleSignIn() {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
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
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="auth-button"
        >
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
        </button>
      </form>

      <p className="auth-toggle-text">
        {isSignUp ? 'Already have an account?' : 'New here?'}{' '}
        <span
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          {isSignUp ? 'Log In' : 'Sign Up'}
        </span>
      </p>

      <div className="auth-divider">
        <hr />
        <span>or</span>
        <hr />
      </div>

      <button
        onClick={handleGoogleSignIn}
        className="auth-google"
      >
        <FcGoogle className="text-xl" />
        Sign {isSignUp ? 'up' : 'in'} with Google
      </button>
    </div>
  );
}
