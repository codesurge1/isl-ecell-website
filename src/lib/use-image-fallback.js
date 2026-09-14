import { useState } from 'react'

// Tracks whether an <img> should actually be attempted, vs. falling back to
// something else (e.g. initials) — true only while a URL is present AND
// hasn't failed to load. Resets whenever the URL itself changes, so a new
// photo gets a fresh attempt instead of staying stuck on a previous
// failure. Callers wire the returned onError into the <img> tag.
//
// Resets `failed` by comparing against the previous src during render
// (React's documented pattern for adjusting state when a prop changes)
// rather than a useEffect, which would cost an extra render for no benefit.
export function useImageFallback(src) {
  const [failed, setFailed] = useState(false)
  const [prevSrc, setPrevSrc] = useState(src)

  if (src !== prevSrc) {
    setPrevSrc(src)
    setFailed(false)
  }

  return { showImage: Boolean(src) && !failed, onError: () => setFailed(true) }
}
