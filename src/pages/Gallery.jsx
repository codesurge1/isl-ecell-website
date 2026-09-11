import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getGallery } from '../lib/queries.js'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion.js'

function PhotoIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M21 16l-5.5-5.5a2 2 0 0 0-2.8 0L3 20" />
    </svg>
  )
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  )
}

// No real images yet (image_url is null in seed data), so each thumbnail
// gets a stylized placeholder. Aspect ratio is derived deterministically
// from the item's id so the masonry columns show varied heights instead
// of a uniform grid, without random layout shift on re-render.
const ASPECT_RATIOS = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[16/11]', 'aspect-[2/3]']

function hashToIndex(value, length) {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash % length
}

function PlaceholderPhoto({ id, className = '' }) {
  const aspectClass = ASPECT_RATIOS[hashToIndex(id, ASPECT_RATIOS.length)]
  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-[color:var(--color-glow-accent)]/20 bg-gradient-to-br from-[color:var(--color-bg-mid)] to-[color:var(--color-bg-base)] ${aspectClass} ${className}`}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[color:var(--color-glow-accent)]/10 blur-3xl"
        aria-hidden="true"
      />
      <PhotoIcon className="relative z-10 h-8 w-8 text-[color:var(--color-glow-accent)]" />
    </div>
  )
}

function GalleryThumbnail({ item, onOpen }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={
        prefersReducedMotion ? { filter: 'brightness(1.1)' } : { y: -4, filter: 'brightness(1.1)' }
      }
      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
      className="mb-4 block w-full break-inside-avoid text-left"
    >
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.caption ?? ''}
          className="w-full rounded-xl object-cover"
        />
      ) : (
        <PlaceholderPhoto id={item.id} />
      )}
    </motion.button>
  )
}

function Lightbox({ item, onClose }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const focusable = dialog
      ? Array.from(dialog.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])'))
      : []
    focusable[0]?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key === 'Tab' && focusable.length > 0) {
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <motion.div
      onClick={onClose}
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={item.caption ?? 'Gallery photo'}
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-full max-w-3xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--color-glow-accent)]/60 bg-[color:var(--color-bg-mid)] text-[color:var(--color-glow-accent)]"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.caption ?? ''}
            className="max-h-[80vh] w-auto rounded-xl object-contain"
          />
        ) : (
          <div className="flex h-[60vh] w-[70vw] max-w-xl items-center justify-center rounded-xl border border-[color:var(--color-glow-accent)]/20 bg-gradient-to-br from-[color:var(--color-bg-mid)] to-[color:var(--color-bg-base)]">
            <PhotoIcon className="h-16 w-16 text-[color:var(--color-glow-accent)]" />
          </div>
        )}

        {item.caption && (
          <p className="mt-3 text-center text-sm text-[color:var(--color-text-secondary)]">
            {item.caption}
          </p>
        )}
      </div>
    </motion.div>
  )
}

function Gallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    getGallery().then(({ data, error: fetchError }) => {
      if (cancelled) return
      if (fetchError) {
        setError(fetchError)
      } else {
        setItems(data ?? [])
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = selectedId ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedId])

  const sorted = [...items].sort(
    (a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime(),
  )
  const selectedItem = sorted.find((item) => item.id === selectedId) ?? null

  function openLightbox(item, event) {
    triggerRef.current = event.currentTarget
    setSelectedId(item.id)
  }

  function closeLightbox() {
    setSelectedId(null)
    triggerRef.current?.focus()
  }

  return (
    <main className="bg-[color:var(--color-bg-base)] px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-center font-heading text-4xl text-[color:var(--color-text-primary)] md:text-5xl">
          Gallery
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-[color:var(--color-text-secondary)]">
          Moments from workshops, talks, and everything in between.
        </p>

        {loading && (
          <p className="mt-12 text-center text-[color:var(--color-text-secondary)]">
            Loading gallery…
          </p>
        )}

        {!loading && error && (
          <p className="mt-12 text-center text-[color:var(--color-text-secondary)]">
            Couldn't load the gallery right now. Please try again later.
          </p>
        )}

        {!loading && !error && sorted.length === 0 && (
          <p className="mt-12 text-center text-[color:var(--color-text-secondary)]">
            No photos yet — check back soon.
          </p>
        )}

        {!loading && !error && sorted.length > 0 && (
          <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {sorted.map((item) => (
              <GalleryThumbnail
                key={item.id}
                item={item}
                onOpen={(event) => openLightbox(item, event)}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedItem && <Lightbox item={selectedItem} onClose={closeLightbox} />}
      </AnimatePresence>
    </main>
  )
}

export default Gallery
