import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getMemberById } from '../lib/queries.js'
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

function MemberProfile() {
  const { memberId } = useParams()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { showImage, onError } = useImageFallback(member?.photo_url)

  useEffect(() => {
    let cancelled = false

    getMemberById(memberId).then(({ data, error: fetchError }) => {
      if (cancelled) return
      if (fetchError) {
        setError(fetchError)
      } else {
        setMember(data)
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [memberId])

  return (
    <PageTransition className="relative min-h-screen bg-[color:var(--color-bg-black)] px-4 py-16">
      <div className="mx-auto max-w-xl">
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
          <div className="flex flex-col items-center text-center">
            <span className="flex h-[148px] w-[105px] items-center justify-center overflow-hidden rounded-lg border border-[color:var(--color-glow-accent)]/80 bg-[color:var(--color-bg-black)] shadow-[0_0_14px_2px_rgba(var(--color-glow-accent-rgb),0.7),0_0_34px_8px_rgba(var(--color-glow-accent-rgb),0.4),0_0_64px_16px_rgba(var(--color-glow-accent-rgb),0.18)]">
              {showImage ? (
                <img
                  src={member.photo_url}
                  alt={member.name}
                  onError={onError}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="font-heading text-3xl text-[color:var(--color-text-muted)]">
                  {getInitials(member.name)}
                </span>
              )}
            </span>

            <h1 className="mt-6 text-3xl text-[color:var(--color-text-primary)]">{member.name}</h1>
            <p className="mt-1 text-[color:var(--color-text-muted)]">
              {[member.role, member.domain].filter(Boolean).join(' · ')}
            </p>

            {member.bio && (
              <p className="mt-6 max-w-prose text-[color:var(--color-text-muted)]">
                {member.bio}
              </p>
            )}

            <SocialLinks socials={member.socials} email={member.email} />
          </div>
        )}
      </div>
    </PageTransition>
  )
}

export default MemberProfile
