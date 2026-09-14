import { Fragment, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { getAchievements, getEvents, getGallery } from '../lib/queries.js'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion.js'
import PlaceholderPhoto from '../components/PlaceholderPhoto.jsx'
import Button from '../components/Button.jsx'
import logoMark from '../assets/logo-mark.png'

// PLACEHOLDER STATS — replace with real figures before launch
const STATS = [
  { value: 40, suffix: '+', label: 'Members' },
  { value: 15, suffix: '+', label: 'Events Hosted' },
  { value: 2, suffix: '+', label: 'Years Active' },
  { value: 6, suffix: '+', label: 'Startups Mentored' },
]

const heroContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
}
const heroItemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
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

function ConstellationIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="12" cy="5" r="2" />
      <circle cx="6" cy="17" r="2" />
      <circle cx="18" cy="17" r="2" />
      <line x1="12" y1="7" x2="7" y2="15.3" />
      <line x1="12" y1="7" x2="17" y2="15.3" />
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

function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Compared as plain 'YYYY-MM-DD' strings — that sorts correctly for ISO
// dates without needing Date parsing (and the timezone bugs that invites).
function findSoonestUpcomingEvent(events) {
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = events.filter((event) => event.date >= today)
  upcoming.sort((a, b) => a.date.localeCompare(b.date))
  return upcoming[0] ?? null
}

function findMostRecentAchievement(achievements) {
  if (achievements.length === 0) return null
  return [...achievements].sort((a, b) => b.date.localeCompare(a.date))[0]
}

function HeroCta() {
  const navigate = useNavigate()

  return (
    <motion.div variants={heroItemVariants}>
      <Button onClick={() => navigate('/team')}>Meet the team</Button>
    </motion.div>
  )
}

// ---------------------------------------------------------------------
// Hero background photo. No real event/team photo exists yet — once one
// does, import it and set it here (one line):
//
//   import heroPhoto from '../assets/hero-photo.jpg'
//   const HERO_PHOTO = heroPhoto
//
// HeroBackground below renders it full-bleed via object-cover as soon as
// this is non-null. Nothing else needs to change: the dark overlay, the
// text, and the layout all already assume a full-bleed background.
// ---------------------------------------------------------------------
const HERO_PHOTO = null

function HeroBackground({ photo }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {photo ? (
        <img src={photo} alt="" className="h-full w-full object-cover" />
      ) : (
        // Stylized placeholder for when there's no photo yet: a dark
        // red/black gradient plus a faint, oversized logo-mark watermark
        // bleeding off the right edge. Deliberately looks designed, not
        // like a missing image.
        <div className="relative h-full w-full bg-[color:var(--color-bg-black)]">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 90% at 78% 25%, rgba(179,30,45,0.22), transparent 60%), linear-gradient(180deg, #0f0f0f 0%, #050505 100%)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-1/2 -right-16 h-[130%] w-[65%] -translate-y-1/2 opacity-[0.08] md:right-0 md:w-[45%]"
            style={{
              backgroundColor: '#ffffff',
              WebkitMaskImage: `url(${logoMark})`,
              maskImage: `url(${logoMark})`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
            }}
          />
        </div>
      )}

      {/* Legibility overlay for text sitting on top — stronger toward the
          bottom where the text block sits. Keep this once a real photo
          replaces the placeholder above; it's what keeps the headline
          readable over any busy image. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/55 to-black/35" />
    </div>
  )
}

function HeroSection() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-24 text-center">
      <HeroBackground photo={HERO_PHOTO} />

      <motion.div
        variants={heroContainerVariants}
        initial={prefersReducedMotion ? 'show' : 'hidden'}
        animate="show"
        className="relative z-10 flex max-w-2xl flex-col items-center gap-6"
      >
        <motion.h1
          variants={heroItemVariants}
          className="font-display text-6xl tracking-wide text-[color:var(--color-text-primary)] md:text-8xl"
        >
          Visionary Questers
        </motion.h1>

        <motion.p
          variants={heroItemVariants}
          className="max-w-xl text-base text-[color:var(--color-text-muted)] md:text-lg"
        >
          The Entrepreneurship Cell of ISL — turning curiosity into ventures, one idea at a time.
        </motion.p>

        <HeroCta />
      </motion.div>
    </section>
  )
}

// 2-3 sentences distilled from About.jsx's "Our Story" copy (mission,
// origin/growth, current purpose) — a summary of the real text, not new
// placeholder copy that could drift from or contradict it.
function AboutPreviewSection() {
  return (
    <section className="border-t border-white/10 bg-[color:var(--color-bg-black)] px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-base text-[color:var(--color-text-muted)] md:text-lg">
          An entrepreneurship cell exists to make starting something feel less like a leap and
          more like a next step — pairing curious students with the people, frameworks, and
          community it takes to test an idea for real. What started as informal late-night
          conversations has grown into a cell running workshops, guest talks, and competitions
          year-round, all in service of one goal: lowering the barrier between having an idea and
          doing something about it.
        </p>
        <Link
          to="/about"
          className="mt-4 inline-block text-[color:var(--color-brand-accent)] hover:underline"
        >
          Read our story
        </Link>
      </div>
    </section>
  )
}

// A genuine sequence (unlike the Bento grid's non-ordered feature set), so
// a numbered progression with a connecting line is earned here.
const JOURNEY_STAGES = [
  {
    title: 'Ideate',
    description: 'Turn a raw observation or frustration into a concrete idea worth testing.',
  },
  {
    title: 'Validate',
    description: 'Talk to real users and stress-test assumptions before building anything more.',
  },
  {
    title: 'Pitch',
    description: 'Sharpen the idea into a story you can tell in five minutes to a room of strangers.',
  },
  {
    title: 'Launch',
    description: 'Ship something real, and start the whole loop again with a live product.',
  },
]

function JourneyStage({ index, title, description }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center md:flex-1">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-brand-accent)] font-display text-sm text-white">
        {index + 1}
      </span>
      <div>
        <h3 className="font-display text-xl tracking-wide text-[color:var(--color-text-primary)]">
          {title}
        </h3>
        <p className="mt-1 max-w-64 text-sm text-[color:var(--color-text-muted)] md:mx-auto">
          {description}
        </p>
      </div>
    </div>
  )
}

function JourneyConnector() {
  return (
    <span
      aria-hidden="true"
      className="my-2 h-8 w-px self-center bg-[color:var(--color-brand-accent)]/50 md:my-0 md:mt-5 md:h-px md:w-auto md:flex-1"
    />
  )
}

function JourneySection() {
  return (
    <section className="border-t border-white/10 bg-[color:var(--color-bg-black)] px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-heading text-3xl text-[color:var(--color-text-primary)] md:text-4xl">
          The journey we support
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[color:var(--color-text-muted)]">
          Every venture we back moves through the same four stages.
        </p>

        <div className="mt-12 flex flex-col md:flex-row md:items-start">
          {JOURNEY_STAGES.map((stage, index) => (
            <Fragment key={stage.title}>
              <JourneyStage index={index} {...stage} />
              {index < JOURNEY_STAGES.length - 1 && <JourneyConnector />}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

function GalleryTeaserSection() {
  const [items, setItems] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    getGallery().then(({ data, error }) => {
      if (cancelled) return
      if (!error) setItems(data ?? [])
      setLoaded(true)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const recent = [...items]
    .sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())
    .slice(0, 4)

  // Nothing to show yet (still loading) or nothing to show at all (zero
  // rows) — omit the section entirely rather than rendering it empty.
  if (!loaded || recent.length === 0) return null

  return (
    <section className="border-t border-white/10 bg-[color:var(--color-bg-black)] px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <h2 className="font-heading text-3xl text-[color:var(--color-text-primary)] md:text-4xl">
            From the gallery
          </h2>
          <Link
            to="/gallery"
            className="whitespace-nowrap text-[color:var(--color-brand-accent)] hover:underline"
          >
            Explore the gallery
          </Link>
        </div>

        <div className="mt-8 columns-2 gap-4 sm:columns-4">
          {recent.map((item) => (
            <div key={item.id} className="mb-4 break-inside-avoid">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.caption ?? ''}
                  className="w-full rounded-xl object-cover"
                />
              ) : (
                <PlaceholderPhoto id={item.id} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function useCountUp(target, { active, duration = 1.2 }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return

    let frame
    const start = performance.now()

    function tick(now) {
      const progress = Math.min((now - start) / (duration * 1000), 1)
      setValue(Math.round(progress * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, target, duration])

  return value
}

function StatBlock({ value, suffix, label }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReducedMotion = usePrefersReducedMotion()
  const count = useCountUp(value, { active: !prefersReducedMotion && inView })
  const displayValue = prefersReducedMotion ? value : count

  return (
    <div ref={ref} className="text-center">
      <p className="font-heading text-4xl text-[color:var(--color-brand-accent)] md:text-5xl">
        {displayValue}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">{label}</p>
    </div>
  )
}

function StatsSection() {
  return (
    <section className="border-t border-white/10 bg-[color:var(--color-bg-black)] px-4 py-16">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
        {STATS.map((stat) => (
          <StatBlock key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  )
}

function BentoCard({ to, title, blurb, Icon }) {
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
        to={to}
        className="relative flex h-full min-h-56 flex-col justify-between overflow-hidden rounded-2xl border border-[color:var(--color-brand-accent)]/30 bg-[color:var(--color-bg-black)] p-6"
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[color:var(--color-brand-accent)]/10 blur-3xl"
          aria-hidden="true"
        />
        <Icon className="relative z-10 h-8 w-8 text-[color:var(--color-brand-accent)]" />
        <div className="relative z-10 mt-8">
          <h3 className="font-heading text-xl text-[color:var(--color-text-primary)]">{title}</h3>
          <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">{blurb}</p>
        </div>
      </Link>
    </motion.div>
  )
}

function BentoSection() {
  const [events, setEvents] = useState([])
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    let cancelled = false

    Promise.all([getEvents(), getAchievements()]).then(([eventsResult, achievementsResult]) => {
      if (cancelled) return
      setEvents(eventsResult.data ?? [])
      setAchievements(achievementsResult.data ?? [])
    })

    return () => {
      cancelled = true
    }
  }, [])

  const soonestEvent = findSoonestUpcomingEvent(events)
  const eventsBlurb = soonestEvent
    ? `${soonestEvent.title} — ${formatDate(soonestEvent.date)}`
    : 'Explore our upcoming events.'

  const recentAchievement = findMostRecentAchievement(achievements)
  const achievementsBlurb = recentAchievement
    ? recentAchievement.title
    : "See what we've accomplished."

  return (
    <section className="border-t border-white/10 bg-[color:var(--color-bg-black)] px-4 py-16">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        <BentoCard to="/events" title="Events" blurb={eventsBlurb} Icon={CalendarIcon} />
        <BentoCard
          to="/team"
          title="Team"
          blurb="Meet the people behind ISL E-cell — explore the constellation."
          Icon={ConstellationIcon}
        />
        <BentoCard
          to="/achievements"
          title="Achievements"
          blurb={achievementsBlurb}
          Icon={TrophyIcon}
        />
      </div>
    </section>
  )
}

function ClosingCtaSection() {
  return (
    <section className="border-t border-white/10 bg-[color:var(--color-bg-black)] px-4 py-20 text-center">
      <p className="font-display text-3xl tracking-wide text-[color:var(--color-text-primary)] md:text-4xl">
        Ideas don't grow alone — let's talk.
      </p>
      <Link
        to="/contact"
        className="mt-6 inline-block text-[color:var(--color-brand-accent)] hover:underline"
      >
        Get in touch
      </Link>
    </section>
  )
}

function Home() {
  return (
    <main>
      <HeroSection />
      <AboutPreviewSection />
      <JourneySection />
      <BentoSection />
      <GalleryTeaserSection />
      <StatsSection />
      <ClosingCtaSection />
    </main>
  )
}

export default Home
