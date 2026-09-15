import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getMembers } from '../lib/queries.js'
import { buildMemberTree } from '../lib/buildMemberTree.js'
import { useImageFallback } from '../lib/use-image-fallback.js'
import PageTransition from '../components/PageTransition.jsx'
import SocialLinks from '../components/SocialLinks.jsx'

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

// Position in the org chart for the "#0N" badge — root is 1, then each
// tier's members in existing (created_at) order, breadth-first. Computed
// client-side from the same members list the page already loads; never
// stored in the database.
function getTreePosition(members, memberId) {
  const queue = buildMemberTree(members)
  let position = 0
  while (queue.length > 0) {
    const node = queue.shift()
    position += 1
    if (node.id === memberId) return position
    queue.push(...node.children)
  }
  return null
}

function BackLink({ className = '' }) {
  return (
    <Link
      to="/team"
      className={`text-[color:var(--color-glow-accent)] hover:underline ${className}`}
    >
      ← Back to constellation
    </Link>
  )
}

// Giant "E-CELL" ghost-lettering bleeding from behind the photo panel into
// the open space above the name — replaces an earlier, too-subtle logo-mark
// icon watermark. Brand text instead of a masked image, but the same idea
// the original reference photos had before their ghost-lettering was
// cropped out for clean cutouts: a huge, faint wordmark that reads as a
// deliberate design element, not something you have to squint to notice.
//
// Scoped to the text column (not the whole photo+text row) rather than
// literally overlapping the photo panel: the photo has an opaque fill, so
// an earlier version of this that spanned the full row was almost entirely
// hidden behind it, leaving only a barely-legible sliver visible. Anchored
// to bleed off the column's own top-left — i.e. from right where the photo
// panel ends — so it still reads as originating from behind the panel.
function Wordmark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      <span className="absolute -left-2 -top-10 whitespace-nowrap font-display text-[22vw] leading-none tracking-tight text-white/15 md:-left-4 md:-top-16 md:text-[13vw]">
        E-CELL
      </span>
    </div>
  )
}

function NumberBadge({ position }) {
  if (!position) return null
  return (
    <span className="inline-flex items-center rounded-full border border-[color:var(--color-brand-accent)]/40 px-2.5 py-0.5 font-display text-xs tracking-wide text-[color:var(--color-brand-accent)]">
      #{String(position).padStart(2, '0')}
    </span>
  )
}

// Same pill style as Events' category badge — red accent, not a new style.
function DomainBadge({ domain }) {
  if (!domain) return null
  return (
    <span className="inline-block rounded-full border border-[color:var(--color-brand-accent)]/40 px-2.5 py-0.5 text-xs text-[color:var(--color-brand-accent)]">
      {domain}
    </span>
  )
}

// Dominant photo panel: sized off viewport height (not a fixed px value)
// so it stays the single largest element on the page regardless of screen
// size — roughly half the viewport height at minimum on desktop, bigger
// still above that floor. Same object-contain + black-fill + red-glow
// treatment already established, just at a genuinely large scale.
function PhotoPanel({ member, showImage, onError }) {
  return (
    <span className="relative flex h-[52vh] min-h-[420px] w-auto aspect-[105/148] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[color:var(--color-glow-accent)]/80 bg-[color:var(--color-bg-black)] shadow-[0_0_24px_4px_rgba(var(--color-glow-accent-rgb),0.7),0_0_56px_14px_rgba(var(--color-glow-accent-rgb),0.4),0_0_100px_26px_rgba(var(--color-glow-accent-rgb),0.18)] md:h-[68vh] md:min-h-[560px]">
      {showImage ? (
        <img
          src={member.photo_url}
          alt={member.name}
          onError={onError}
          className="h-full w-full object-contain"
        />
      ) : (
        <span className="font-heading text-6xl text-[color:var(--color-text-muted)] md:text-8xl">
          {getInitials(member.name)}
        </span>
      )}
    </span>
  )
}

// Domain, role, and bio (when present) live together in one bordered info
// card — same border/fill/accent-blur treatment as Events' category
// cards, not a new pattern. Contact icons sit inside the card too, so the
// whole block reads as one substantial unit rather than a few lines
// floating in empty space — deliberately not dependent on bio text being
// present to feel complete.
function InfoCard({ member }) {
  return (
    <div className="relative mt-6 overflow-hidden rounded-2xl border border-[color:var(--color-brand-accent)]/30 bg-[color:var(--color-bg-black)] p-6 md:p-8">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[color:var(--color-brand-accent)]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-wrap items-center justify-center gap-2 md:justify-start">
        <DomainBadge domain={member.domain} />
      </div>

      {member.role && (
        <p className="relative mt-4 text-xl text-[color:var(--color-text-primary)]">
          {member.role}
        </p>
      )}

      {member.bio && (
        <p className="relative mx-auto mt-3 max-w-prose text-sm text-[color:var(--color-text-muted)] md:mx-0">
          {member.bio}
        </p>
      )}

      <div className="relative mt-6 flex justify-center gap-4 md:justify-start">
        <SocialLinks socials={{ linkedin: member.socials?.linkedin }} email={member.email} />
      </div>
    </div>
  )
}

function MemberProfile() {
  const { memberId } = useParams()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    getMembers().then(({ data, error: fetchError }) => {
      if (cancelled) return
      if (fetchError) {
        setError(fetchError)
      } else {
        setMembers(data ?? [])
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const member = members.find((candidate) => candidate.id === memberId) ?? null
  const position = member ? getTreePosition(members, memberId) : null
  const { showImage, onError } = useImageFallback(member?.photo_url)

  return (
    <PageTransition className="relative min-h-screen bg-[color:var(--color-bg-black)] px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <BackLink className="relative z-10 mb-8 inline-block text-sm" />

        {loading && (
          <p className="text-center text-[color:var(--color-text-muted)]">Loading member…</p>
        )}

        {!loading && error && (
          <p className="text-center text-[color:var(--color-text-muted)]">
            Couldn't load this member right now. Please try again later.
          </p>
        )}

        {!loading && !error && !member && (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-[color:var(--color-text-muted)]">Member not found.</p>
            <BackLink />
          </div>
        )}

        {!loading && !error && member && (
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-16">
            <div className="relative">
              <PhotoPanel member={member} showImage={showImage} onError={onError} />
            </div>

            <div className="relative flex-1 text-center md:text-left">
              <Wordmark />

              <div className="relative">
                <NumberBadge position={position} />

                <h1 className="mt-3 font-display text-5xl tracking-wide text-[color:var(--color-text-primary)] md:text-7xl">
                  {member.name}
                </h1>

                <InfoCard member={member} />
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}

export default MemberProfile
