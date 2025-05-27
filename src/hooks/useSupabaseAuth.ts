import { useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import supabase from '@/lib/supabaseClient'

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // Get current session on first load
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
    })

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return { user, session }
}
