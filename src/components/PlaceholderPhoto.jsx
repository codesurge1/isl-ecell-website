// Deterministic index from a string id — used so the same item always
// gets the same placeholder aspect ratio across renders/pages instead of
// a random one that would shift on re-render.
const ASPECT_RATIOS = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[16/11]', 'aspect-[2/3]']

function hashToIndex(value, length) {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash % length
}

export function PhotoIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M21 16l-5.5-5.5a2 2 0 0 0-2.8 0L3 20" />
    </svg>
  )
}

// Shared stand-in for a gallery item with no image_url yet — used by the
// real Gallery page's masonry and the Home page's gallery teaser strip so
// both render the same graceful placeholder instead of a broken <img>.
//
// Used to have a `dark` opt-in prop for the new flat-black/red identity,
// back when the real Gallery page was still on the old navy/violet look
// and only Home's teaser wanted the new one. Now that Gallery has been
// redesigned too, every caller wants the same treatment, so that's just
// the one look this component renders — no toggle needed.
function PlaceholderPhoto({ id, className = '' }) {
  const aspectClass = ASPECT_RATIOS[hashToIndex(id, ASPECT_RATIOS.length)]

  return (
    <div className={`relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-[color:var(--color-brand-accent)]/30 bg-[color:var(--color-bg-black)] ${aspectClass} ${className}`}>
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[color:var(--color-brand-accent)]/10 blur-3xl" aria-hidden="true" />
      <PhotoIcon className="relative z-10 h-8 w-8 text-[color:var(--color-brand-accent)]" />
    </div>
  )
}

export default PlaceholderPhoto
