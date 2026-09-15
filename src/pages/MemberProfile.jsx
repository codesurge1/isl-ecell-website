import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getMembers } from '../lib/queries.js'
import { buildMemberTree } from '../lib/buildMemberTree.js'
import { useImageFallback } from '../lib/use-image-fallback.js'
import PageTransition from '../components/PageTransition.jsx'
import SocialLinks from '../components/SocialLinks.jsx'
import logoMark from '../assets/logo-mark.png'

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

// Giant, faint logo-mark bleeding behind the photo panel — same masking
// technique as Home's hero and Team's page background (mask a solid white
// shape to the logo, low opacity), just scoped to this panel instead of
// the whole page. The overflow-hidden is on a wrapper spanning the whole
// photo+text row rather than tightly around the photo itself, so the mark
// actually has room to bleed instead of being clipped down to the photo's
// own small box.
function ProfileWatermark() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -top-12 left-1/2 h-[380px] w-[380px] -translate-x-1/2 opacity-[0.05] md:left-0 md:h-[560px] md:w-[560px] md:-translate-x-1/4"
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

function PhotoPanel({ member, showImage, onError }) {
  return (
    <span className="relative flex h-[300px] w-[213px] items-center justify-center overflow-hidden rounded-2xl border border-[color:var(--color-glow-accent)]/80 bg-[color:var(--color-bg-black)] shadow-[0_0_18px_3px_rgba(var(--color-glow-accent-rgb),0.7),0_0_44px_10px_rgba(var(--color-glow-accent-rgb),0.4),0_0_84px_20px_rgba(var(--color-glow-accent-rgb),0.18)] md:h-[440px] md:w-[312px]">
      {showImage ? (
        <img
          src={member.photo_url}
          alt={member.name}
          onError={onError}
          className="h-full w-full object-contain"
        />
      ) : (
        <span className="font-heading text-5xl text-[color:var(--color-text-muted)]">
          {getInitials(member.name)}
        </span>
      )}
    </span>
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
      <div className="mx-auto max-w-4xl">
        <BackLink className="mb-8 inline-block text-sm" />

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
          <div className="relative grid gap-10 md:grid-cols-[minmax(0,320px)_1fr] md:items-center md:gap-16">
            <ProfileWatermark />

            <div className="relative mx-auto md:mx-0">
              <PhotoPanel member={member} showImage={showImage} onError={onError} />
            </div>

            <div className="relative text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <NumberBadge position={position} />
                <DomainBadge domain={member.domain} />
              </div>

              <h1 className="mt-4 font-display text-4xl tracking-wide text-[color:var(--color-text-primary)] md:text-6xl">
                {member.name}
              </h1>

              {member.role && (
                <p className="mt-2 text-lg text-[color:var(--color-text-muted)]">{member.role}</p>
              )}

              {member.bio && (
                <p className="mx-auto mt-4 max-w-prose text-sm text-[color:var(--color-text-muted)] md:mx-0">
                  {member.bio}
                </p>
              )}

              <div className="flex justify-center md:justify-start">
                <SocialLinks socials={{ linkedin: member.socials?.linkedin }} email={member.email} />
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}

export default MemberProfile
