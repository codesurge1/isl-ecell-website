import { useEffect, useState } from 'react'
import { getMembers } from '../lib/queries.js'
import { buildMemberTree } from '../lib/buildMemberTree.js'
import Starfield from '../components/Starfield.jsx'
import ConstellationNode from '../components/ConstellationNode.jsx'
import PageTransition from '../components/PageTransition.jsx'

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
    <PageTransition className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[color:var(--color-bg-base)] to-[color:var(--color-bg-mid)] px-4 py-16">
      <Starfield />

      <div className="relative z-10">
        <h1 className="mb-12 text-center text-3xl text-[color:var(--color-text-primary)]">Team</h1>

        {loading && (
          <p className="text-center text-[color:var(--color-text-secondary)]">Loading team…</p>
        )}

        {error && (
          <p className="text-center text-[color:var(--color-text-secondary)]">
            Couldn't load the team right now. Please try again later.
          </p>
        )}

        {!loading && !error && (
          <div className="flex flex-wrap justify-center gap-16">
            {roots.map((root) => (
              <ConstellationNode key={root.id} member={root} tier={0} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}

export default Team
