import { supabase } from './supabaseClient.js'

// Generic Supabase Storage helpers — bucket-agnostic so every admin CRUD
// section (members now, events/achievements/gallery later) can share them
// instead of each re-implementing upload/delete.

export async function uploadFile(bucket, path, file) {
  return supabase.storage.from(bucket).upload(path, file)
}

export function getPublicUrl(bucket, path) {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}

export async function deleteFile(bucket, path) {
  return supabase.storage.from(bucket).remove([path])
}

// Recovers the bucket-relative path from a Supabase public URL, e.g.
// ".../storage/v1/object/public/<bucket>/<path>" -> "<path>". A row only
// stores the public URL, but deleting/replacing a file needs this path.
export function getPathFromPublicUrl(bucket, url) {
  if (!url) return null
  const marker = `/object/public/${bucket}/`
  const index = url.indexOf(marker)
  if (index === -1) return null
  return url.slice(index + marker.length)
}
