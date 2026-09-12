import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient.js'

// undefined = session not checked yet, null = checked and signed out,
// object = signed in. Distinguishing undefined from null lets callers show
// a loading state only until the first real answer comes back, regardless
// of whether getSession() or onAuthStateChange's initial event resolves
// first.
export function useSession() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { session, loading: session === undefined }
}
