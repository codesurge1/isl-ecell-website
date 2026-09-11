import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getMembers } from '../lib/queries.js'
import { buildMemberTree } from '../lib/buildMemberTree.js'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion.js'
import Starfield from '../components/Starfield.jsx'
import ConstellationNode from '../components/ConstellationNode.jsx'

function Team() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const prefersReducedMotion = usePrefersReducedMotion()

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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[color:var(--color-bg-base)] to-[color:var(--color-bg-mid)] px-4 py-16">
      <Starfield />

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10"
      >
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
      </motion.div>
    </main>
  )
}

export default Team
