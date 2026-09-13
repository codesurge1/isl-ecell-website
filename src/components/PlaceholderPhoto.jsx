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
// `dark` opts into the flat-black/red identity (Home's teaser) without
// changing the default look the real Gallery page still renders — that
// page hasn't been redesigned yet, so its call site passes nothing and
// gets the exact navy/violet treatment it always has.
function PlaceholderPhoto({ id, className = '', dark = false }) {
  const aspectClass = ASPECT_RATIOS[hashToIndex(id, ASPECT_RATIOS.length)]
  const borderClass = dark ? 'border-[color:var(--color-brand-accent)]/30' : 'border-[color:var(--color-glow-accent)]/20'
  const bgClass = dark
    ? 'bg-[color:var(--color-bg-black)]'
    : 'bg-gradient-to-br from-[color:var(--color-bg-mid)] to-[color:var(--color-bg-base)]'
  const blobClass = dark ? 'bg-[color:var(--color-brand-accent)]/10' : 'bg-[color:var(--color-glow-accent)]/10'
  const iconClass = dark ? 'text-[color:var(--color-brand-accent)]' : 'text-[color:var(--color-glow-accent)]'

  return (
    <div className={`relative flex w-full items-center justify-center overflow-hidden rounded-xl border ${borderClass} ${bgClass} ${aspectClass} ${className}`}>
      <div className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full ${blobClass} blur-3xl`} aria-hidden="true" />
      <PhotoIcon className={`relative z-10 h-8 w-8 ${iconClass}`} />
    </div>
  )
}

export default PlaceholderPhoto
