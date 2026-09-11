import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getEvents } from '../lib/queries.js'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion.js'

// Must match the events.category enum exactly (see .claude/rules/data-layer.md).
const CATEGORIES = ['Workshops', 'Guest talks', 'Competitions', 'Flagship events']

function WrenchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2z" />
    </svg>
  )
}

function MicIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <line x1="12" y1="18" x2="12" y2="21" />
      <line x1="9" y1="21" x2="15" y2="21" />
    </svg>
  )
}

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

function RocketIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M12 2c3 2 5 6 5 10 0 2-1 4-2 5l-3 3-3-3c-1-1-2-3-2-5 0-4 2-8 5-10z" />
      <circle cx="12" cy="10" r="1.5" fill="currentColor" stroke="none" />
      <path d="M9 16l-3 1 1-3M15 16l3 1-1-3" />
    </svg>
  )
}

function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </svg>
  )
}

const CATEGORY_ICONS = {
  Workshops: WrenchIcon,
  'Guest talks': MicIcon,
  Competitions: TrophyIcon,
  'Flagship events': RocketIcon,
}

function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function excerpt(text, maxLength = 110) {
  if (!text || text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}…`
}

function CategoryChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
        active
          ? 'border-[color:var(--color-glow-accent)] bg-[color:var(--color-glow-accent)]/10 text-[color:var(--color-glow-accent)]'
          : 'border-[color:var(--color-glow-accent)]/20 text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]'
      }`}
    >
      {label}
    </button>
  )
}

// Renders as an <a> (opens external_link in a new tab) when the event has
// one, otherwise as a <button> that expands the card in place to show the
// full description — never a dead click either way.
function EventCard({ event }) {
  const [expanded, setExpanded] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const hasLink = Boolean(event.external_link)
  const Icon = CATEGORY_ICONS[event.category] ?? CalendarIcon

  const shellProps = hasLink
    ? { as: 'a', href: event.external_link, target: '_blank', rel: 'noopener noreferrer' }
    : { as: 'button', type: 'button', onClick: () => setExpanded((value) => !value) }
  const Shell = shellProps.as

  return (
    <motion.div
      whileHover={
        prefersReducedMotion ? { filter: 'brightness(1.1)' } : { y: -6, filter: 'brightness(1.1)' }
      }
      transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
      className="h-full"
    >
      <Shell
        {...shellProps}
        className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[color:var(--color-glow-accent)]/20 bg-gradient-to-br from-[color:var(--color-bg-mid)] to-[color:var(--color-bg-base)] p-6 text-left shadow-[0_0_30px_-10px_rgba(var(--color-glow-accent-rgb),0.25)]"
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[color:var(--color-glow-accent)]/10 blur-3xl"
          aria-hidden="true"
        />
        <Icon className="relative z-10 h-8 w-8 text-[color:var(--color-glow-accent)]" />

        <div className="relative z-10 mt-8 flex-1">
          <span className="inline-block rounded-full border border-[color:var(--color-glow-accent)]/40 px-2.5 py-0.5 text-xs text-[color:var(--color-glow-accent)]">
            {event.category}
          </span>
          <h3 className="mt-3 font-heading text-xl text-[color:var(--color-text-primary)]">
            {event.title}
          </h3>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
            {formatDate(event.date)}
          </p>
          <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">
            {hasLink || expanded ? event.description : excerpt(event.description)}
          </p>
        </div>

        {!hasLink && (
          <span className="relative z-10 mt-4 text-xs text-[color:var(--color-glow-accent)]">
            {expanded ? 'Show less' : 'Read more'}
          </span>
        )}
      </Shell>
    </motion.div>
  )
}

function EventsSection({ title, events }) {
  return (
    <div>
      <h2 className="font-heading text-2xl text-[color:var(--color-text-primary)]">{title}</h2>
      {events.length === 0 ? (
        <p className="mt-4 text-[color:var(--color-text-secondary)]">
          No events in this category yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}

function Events() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    getEvents().then(({ data, error: fetchError }) => {
      if (cancelled) return
      if (fetchError) {
        setError(fetchError)
      } else {
        setEvents(data ?? [])
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const categoryParam = searchParams.get('category')
  const activeCategory = CATEGORIES.includes(categoryParam) ? categoryParam : null

  function selectCategory(category) {
    setSearchParams(category ? { category } : {})
  }

  const filtered = activeCategory ? events.filter((event) => event.category === activeCategory) : events

  const today = new Date().toISOString().slice(0, 10)
  const upcoming = [...filtered]
    .filter((event) => event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
  const past = [...filtered]
    .filter((event) => event.date < today)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <main className="bg-[color:var(--color-bg-base)] px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-center font-heading text-4xl text-[color:var(--color-text-primary)] md:text-5xl">
          Events &amp; Timeline
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-[color:var(--color-text-secondary)]">
          Workshops, talks, competitions, and the flagship moments that bring our community
          together.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <CategoryChip label="All" active={!activeCategory} onClick={() => selectCategory(null)} />
          {CATEGORIES.map((category) => (
            <CategoryChip
              key={category}
              label={category}
              active={activeCategory === category}
              onClick={() => selectCategory(category)}
            />
          ))}
        </div>

        {loading && (
          <p className="mt-12 text-center text-[color:var(--color-text-secondary)]">
            Loading events…
          </p>
        )}

        {!loading && error && (
          <p className="mt-12 text-center text-[color:var(--color-text-secondary)]">
            Couldn't load events right now. Please try again later.
          </p>
        )}

        {!loading && !error && (
          <div className="mt-12 flex flex-col gap-16">
            <EventsSection title="Upcoming" events={upcoming} />
            <EventsSection title="Past" events={past} />
          </div>
        )}
      </div>
    </main>
  )
}

export default Events
