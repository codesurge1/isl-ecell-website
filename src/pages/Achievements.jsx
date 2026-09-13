import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getAchievements } from '../lib/queries.js'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion.js'
import { PhotoIcon } from '../components/PlaceholderPhoto.jsx'

// Same trophy icon already used for Achievements elsewhere on the site
// (Home's Bento card, Events' Competitions chip) — the previous MedalIcon
// here (a circle with two diverging diagonal lines above it, meant as
// ribbon straps) read ambiguously as horns on a head rather than a medal.
function TrophyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4z" />
      <path d="M8 5H5a3 3 0 0 0 3 4M16 5h3a3 3 0 0 1-3 4" />
      <line x1="12" y1="13" x2="12" y2="17" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="17" x2="12" y2="20" />
    </svg>
  )
}

function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function excerpt(text, maxLength = 160) {
  if (!text || text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}…`
}

// A fixed aspect ratio (rather than PlaceholderPhoto's per-id random
// aspect meant for masonry variety) so every card in this uniform grid
// lines up row to row. Reuses PlaceholderPhoto's exported PhotoIcon glyph
// and the same dark/red visual language, just without the masonry-style
// variable height it isn't needed for here.
function AchievementImage({ achievement }) {
  if (achievement.image_url) {
    return (
      <img
        src={achievement.image_url}
        alt=""
        className="aspect-[4/3] w-full object-cover"
      />
    )
  }

  return (
    <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-[color:var(--color-bg-black)]">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[color:var(--color-brand-accent)]/10 blur-3xl"
        aria-hidden="true"
      />
      <PhotoIcon className="relative z-10 h-8 w-8 text-[color:var(--color-brand-accent)]" />
    </div>
  )
}

function AchievementCard({ achievement }) {
  const [expanded, setExpanded] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const isTruncated = Boolean(achievement.description) && achievement.description.length > 160

  return (
    <motion.div
      whileHover={
        prefersReducedMotion ? { filter: 'brightness(1.1)' } : { y: -6, filter: 'brightness(1.1)' }
      }
      transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
      className="h-full"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--color-brand-accent)]/30 bg-[color:var(--color-bg-black)]">
        <AchievementImage achievement={achievement} />

        <div className="relative flex flex-1 flex-col p-6">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[color:var(--color-brand-accent)]/10 blur-3xl"
            aria-hidden="true"
          />
          <TrophyIcon className="relative z-10 h-8 w-8 text-[color:var(--color-brand-accent)]" />

          <div className="relative z-10 mt-8 flex-1">
            <h3 className="font-heading text-xl text-[color:var(--color-text-primary)]">
              {achievement.title}
            </h3>
            <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
              {formatDate(achievement.date)}
            </p>
            {achievement.description && (
              <p className="mt-3 text-sm text-[color:var(--color-text-muted)]">
                {expanded || !isTruncated ? achievement.description : excerpt(achievement.description)}
              </p>
            )}
          </div>

          {isTruncated && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="relative z-10 mt-4 self-start text-xs text-[color:var(--color-brand-accent)]"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function Achievements() {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    getAchievements().then(({ data, error: fetchError }) => {
      if (cancelled) return
      if (fetchError) {
        setError(fetchError)
      } else {
        setAchievements(data ?? [])
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const sorted = [...achievements].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <main className="bg-[color:var(--color-bg-black)] px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-center font-display text-5xl tracking-wide text-[color:var(--color-text-primary)] md:text-6xl">
          Achievements
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-[color:var(--color-text-muted)]">
          Moments we're proud of, in reverse chronological order.
        </p>

        {loading && (
          <p className="mt-12 text-center text-[color:var(--color-text-muted)]">
            Loading achievements…
          </p>
        )}

        {!loading && error && (
          <p className="mt-12 text-center text-[color:var(--color-text-muted)]">
            Couldn't load achievements right now. Please try again later.
          </p>
        )}

        {!loading && !error && sorted.length === 0 && (
          <p className="mt-12 text-center text-[color:var(--color-text-muted)]">
            No achievements yet — check back soon.
          </p>
        )}

        {!loading && !error && sorted.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Achievements
