import { supabase } from './supabaseClient.js'

// Every function here returns the raw { data, error } shape from
// supabase-js rather than throwing, so callers decide how to handle a
// failed fetch (e.g. render an error state) instead of needing a try/catch
// around every call site. Read-only for now — writes come with the admin
// panel in a later phase.

export async function getMembers() {
  return supabase.from('members').select('*')
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
