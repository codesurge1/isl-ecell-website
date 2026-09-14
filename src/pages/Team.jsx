import { useEffect, useState } from 'react'
import { getMembers } from '../lib/queries.js'
import { buildMemberTree } from '../lib/buildMemberTree.js'
import ConstellationNode from '../components/ConstellationNode.jsx'
import MobileTeamAccordion from '../components/MobileTeamAccordion.jsx'
import PageTransition from '../components/PageTransition.jsx'
import logoMark from '../assets/logo-mark.png'

// Same faint logo-mark watermark technique as Home's hero placeholder
// background (mask a solid white shape to the logo, low opacity) — reused
// here for visual consistency, but tucked into the bottom-left corner
// instead of vertically centered, since Team's content (orbs, connector
// lines, labels) clusters in the upper-middle of the page rather than a
// single centered text block. The overflow-hidden is scoped to this own
// wrapper div, not the page container, so the bleed doesn't reintroduce
// the wide-constellation-row clipping that overflow-hidden caused before.
function LogoWatermark() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -bottom-16 -left-16 h-[260px] w-[260px] opacity-[0.05] md:-bottom-24 md:-left-24 md:h-[420px] md:w-[420px]"
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

function Team() {
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

  const roots = buildMemberTree(members)

  return (
    <PageTransition className="relative min-h-screen bg-[color:var(--color-bg-black)] px-4 py-16">
      <LogoWatermark />

      <div className="relative">
        <h1 className="mb-12 text-center font-display text-5xl tracking-wide text-[color:var(--color-text-primary)] md:text-6xl">
          Team
        </h1>

        {loading && (
          <p className="text-center text-[color:var(--color-text-muted)]">Loading team…</p>
        )}

        {error && (
          <p className="text-center text-[color:var(--color-text-muted)]">
            Couldn't load the team right now. Please try again later.
          </p>
        )}

        {!loading && !error && (
          <>
            {/* Desktop constellation — hidden below Tailwind's md breakpoint */}
            <div className="hidden md:flex md:flex-wrap md:justify-center md:gap-16">
              {roots.map((root) => (
                <ConstellationNode key={root.id} member={root} tier={0} />
              ))}
            </div>

            {/* Mobile fallback — vertical accordion below md */}
            <div className="md:hidden">
              <MobileTeamAccordion roots={roots} />
            </div>
          </>
        )}
      </div>
    </PageTransition>
  )
}

export default Team
