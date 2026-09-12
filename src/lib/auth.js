import { supabase } from './supabaseClient.js'

// Same { data, error } pattern as queries.js — callers decide how to
// handle a failed sign-in/sign-out rather than needing a try/catch. Only
// email/password auth for the one existing admin account — no signup or
// password-reset flow.
export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  return supabase.auth.signOut()
}
