import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Mobile fallback for the constellation (below Tailwind's `md` breakpoint):
// a vertical accordion instead of the branching orb layout. Reuses the same
// tree from buildMemberTree — no separate data shape.

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

// Same 105x148 portrait-rectangle treatment as MemberOrb/MemberProfile,
// scaled down to fit a compact accordion row: solid black fill behind the
// photo and object-contain so a transparent PNG cutout letterboxes cleanly
// instead of being cropped or leaving empty corners.
function Avatar({ member, className = '' }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-[color:var(--color-glow-accent)]/40 bg-[color:var(--color-bg-black)] ${className}`}
    >
      {member.photo_url ? (
        <img src={member.photo_url} alt={member.name} className="h-full w-full object-contain" />
      ) : (
        <span className="font-heading text-[color:var(--color-text-muted)]">
          {getInitials(member.name)}
        </span>
      )}
    </span>
  )
}

function ChevronIcon({ expanded }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-5 w-5 shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function RootCard({ member }) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(`/team/${member.id}`)}
      className="flex w-full items-center gap-4 rounded-xl border border-[color:var(--color-glow-accent)]/50 bg-[color:var(--color-bg-black)]/70 p-4 text-left"
    >
      <Avatar member={member} className="h-[68px] w-[48px] text-lg" />
      <span>
        <span className="block font-heading text-lg text-[color:var(--color-text-primary)]">
          {member.name}
        </span>
        <span className="block text-sm text-[color:var(--color-text-muted)]">
          {[member.role, member.domain].filter(Boolean).join(' · ')}
        </span>
      </span>
    </button>
  )
}

// A domain-head-or-deeper row: tapping the name/avatar navigates to the
// profile, tapping the chevron expands/collapses direct reports underneath.
// Collapsed by default; recurses for nested levels.
function MemberRow({ member, depth }) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const children = member.children ?? []
  const hasChildren = children.length > 0

  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <div className="flex items-center gap-2 rounded-lg border border-[color:var(--color-glow-accent)]/20 bg-[color:var(--color-bg-black)]/50 px-3 py-2">
        <button
          type="button"
          onClick={() => navigate(`/team/${member.id}`)}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <Avatar member={member} className="h-[45px] w-[32px] text-xs" />
          <span>
            <span className="block text-sm text-[color:var(--color-text-primary)]">
              {member.name}
            </span>
            <span className="block text-xs text-[color:var(--color-text-muted)]">
              {[member.role, member.domain].filter(Boolean).join(' · ')}
            </span>
          </span>
        </button>

        {hasChildren && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse' : 'Expand'}
            className={
              expanded
                ? 'text-[color:var(--color-glow-accent)]'
                : 'text-[color:var(--color-text-muted)]'
            }
          >
            <ChevronIcon expanded={expanded} />
          </button>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="mt-2 flex flex-col gap-2">
          {children.map((child) => (
            <MemberRow key={child.id} member={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

function MobileTeamAccordion({ roots }) {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      {roots.map((root) => {
        const domainHeads = root.children ?? []
        return (
          <div key={root.id} className="flex flex-col gap-2">
            <RootCard member={root} />
            {domainHeads.length > 0 && (
              <div className="flex flex-col gap-2">
                {domainHeads.map((domainHead) => (
                  <MemberRow key={domainHead.id} member={domainHead} depth={0} />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default MobileTeamAccordion
