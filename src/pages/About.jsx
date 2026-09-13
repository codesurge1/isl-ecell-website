import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion.js'

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

// Same three paragraphs as before, unchanged word-for-word — just moved
// into data so the timeline below can map over them. Labels reflect what
// each paragraph actually says: the first is the founding belief/premise
// (not itself a point in time), the second is the literal origin-and-growth
// narrative ("started as... grown into"), the third is explicitly "Today".
const STORY_STAGES = [
  {
    label: 'Why',
    text: "An entrepreneurship cell exists to do one thing: make starting something feel less like a leap and more like a next step. We believe every student carries the seed of an idea worth building — what's usually missing isn't ambition, it's exposure to the right people, the right frameworks, and a room full of others asking the same questions.",
  },
  {
    label: 'How',
    text: "ISL E-cell started as a small group of students who kept ending up in the same late-night conversations about half-formed startup ideas, and decided those conversations deserved a proper home. What began as informal meetups has grown into a full-fledged cell running workshops, guest talks, and competitions year-round — but the spirit hasn't changed: curious people, comparing notes, building things.",
  },
  {
    label: 'Now',
    text: 'Today, we exist to lower the barrier between "I have an idea" and "I did something about it" — through mentorship, hands-on sessions, and a community that treats failure as data, not a verdict. Whether you\'re validating your first idea or your fifth, this is a place to test it out loud.',
  },
]

// Category labels match the events.category enum exactly (see
// .claude/rules/data-layer.md) — each links to /events?category=<value>,
// which pre-selects the matching filter chip there.
const CATEGORIES = [
  {
    category: 'Workshops',
    description:
      'Hands-on sessions where you build real skills — from idea validation to pitching to the fundamentals of running a venture.',
    Icon: WrenchIcon,
  },
  {
    category: 'Guest talks',
    description:
      "Conversations with founders, investors, and operators who share what actually worked — and what didn't — on their own journeys.",
    Icon: MicIcon,
  },
  {
    category: 'Competitions',
    description:
      'Case challenges, pitch competitions, and hackathons that push you to think fast and defend your ideas under pressure.',
    Icon: TrophyIcon,
  },
  {
    category: 'Flagship events',
    description:
      'Our biggest events of the year — the ones that bring the whole entrepreneurial community on campus together.',
    Icon: RocketIcon,
  },
]

function CategoryCard({ category, description, Icon }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <motion.div
      whileHover={
        prefersReducedMotion ? { filter: 'brightness(1.1)' } : { y: -6, filter: 'brightness(1.1)' }
      }
      transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
      className="h-full"
    >
      <Link
        to={`/events?category=${encodeURIComponent(category)}`}
        className="relative flex h-full min-h-56 flex-col justify-between overflow-hidden rounded-2xl border border-[color:var(--color-brand-accent)]/30 bg-[color:var(--color-bg-black)] p-6"
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[color:var(--color-brand-accent)]/10 blur-3xl"
          aria-hidden="true"
        />
        <Icon className="relative z-10 h-8 w-8 text-[color:var(--color-brand-accent)]" />
        <div className="relative z-10 mt-8">
          <h3 className="font-heading text-xl text-[color:var(--color-text-primary)]">{category}</h3>
          <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">{description}</p>
        </div>
      </Link>
    </motion.div>
  )
}

function About() {
  return (
    <main className="bg-[color:var(--color-bg-black)]">
      <section className="mx-auto max-w-3xl px-4 py-20">
        <h1 className="font-display text-5xl tracking-wide text-[color:var(--color-text-primary)] md:text-6xl">
          Our Story
        </h1>

        <div className="relative mt-12">
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-3 w-px bg-[color:var(--color-brand-accent)]/30"
          />
          <div className="space-y-10">
            {STORY_STAGES.map((stage) => (
              <div key={stage.label} className="relative pl-10">
                <span
                  aria-hidden="true"
                  className="absolute top-1 left-0 h-6 w-6 rounded-full bg-[color:var(--color-brand-accent)] ring-4 ring-[color:var(--color-bg-black)]"
                />
                <p className="font-display text-sm tracking-widest text-[color:var(--color-brand-accent)] uppercase">
                  {stage.label}
                </p>
                <p className="mt-2 text-[color:var(--color-text-muted)]">{stage.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[color:var(--color-bg-black)] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-display text-3xl tracking-wide text-[color:var(--color-text-primary)] md:text-4xl">
            What We Do
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[color:var(--color-text-muted)]">
            Everything we run falls into one of four categories.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((item) => (
              <CategoryCard key={item.category} {...item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
