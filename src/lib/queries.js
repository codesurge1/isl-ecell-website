import { supabase } from './supabaseClient.js'

// Every function here returns the raw { data, error } shape from
// supabase-js rather than throwing, so callers decide how to handle a
// failed fetch (e.g. render an error state) instead of needing a try/catch
// around every call site. Read-only for now — writes come with the admin
// panel in a later phase.

export async function getMembers() {
  return supabase.from('members').select('*').order('created_at', { ascending: true })
}

// maybeSingle() resolves with { data: null, error: null } when no row
// matches, instead of single()'s "no rows" error — lets the caller render
// a plain "not found" state rather than treating a missing member as a
// fetch failure.
export async function getMemberById(id) {
  return supabase.from('members').select('*').eq('id', id).maybeSingle()
}

export async function getEvents() {
  return supabase.from('events').select('*')
}

export async function getAchievements() {
  return supabase.from('achievements').select('*')
}

export async function getGallery() {
  return supabase.from('gallery').select('*')
}
