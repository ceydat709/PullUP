'use client'
import { useState } from 'react'
import supabase from '@/lib/supabaseClient'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'

export default function AuthForm() {
  const [emailInput, setEmailInput] = useState('')
  const [sent, setSent] = useState(false)
  const { user } = useSupabaseAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email: emailInput })
    if (!error) setSent(true)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (user) {
    return (
      <div className="text-center space-y-4">
        <p className="text-green-600">Signed in as <strong>{user.email}</strong></p>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Log out
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {sent ? (
        <p className="text-green-500">Check your email for the magic link!</p>
      ) : (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Sign In / Sign Up
          </button>
        </>
      )}
    </form>
  )
}
