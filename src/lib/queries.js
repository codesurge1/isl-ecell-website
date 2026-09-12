import { supabase } from './supabaseClient.js'

// Every function here returns the raw { data, error } shape from
// supabase-js rather than throwing, so callers decide how to handle a
// failed fetch (e.g. render an error state) instead of needing a try/catch
// around every call site. Writes (RLS-gated to the authenticated admin
// session) are being added table by table as each admin CRUD section is
// built — members', events', and achievements' are below; gallery is
// still read-only.

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

export async function createMember(member) {
  return supabase.from('members').insert(member).select().single()
}

export async function updateMember(id, updates) {
  return supabase.from('members').update(updates).eq('id', id).select().single()
}

export async function deleteMember(id) {
  return supabase.from('members').delete().eq('id', id)
}

export async function getEvents() {
  return supabase.from('events').select('*')
}

export async function getEventById(id) {
  return supabase.from('events').select('*').eq('id', id).maybeSingle()
}

export async function createEvent(event) {
  return supabase.from('events').insert(event).select().single()
}

export async function updateEvent(id, updates) {
  return supabase.from('events').update(updates).eq('id', id).select().single()
}

export async function deleteEvent(id) {
  return supabase.from('events').delete().eq('id', id)
}

export async function getAchievements() {
  return supabase.from('achievements').select('*')
}

export async function createAchievement(achievement) {
  return supabase.from('achievements').insert(achievement).select().single()
}

export async function deleteAchievement(id) {
  return supabase.from('achievements').delete().eq('id', id)
}

export async function getGallery() {
  return supabase.from('gallery').select('*')
}
