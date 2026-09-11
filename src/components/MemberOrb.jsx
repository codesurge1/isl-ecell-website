import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion.js'

// tier 0 = root (President-level), tier 1 = direct children (domain heads),
// tier 2+ = everyone deeper (volunteers) — falls back to the smallest style.
const TIER_STYLES = {
  0: {
    wrapper: 'h-28 w-28',
    ring: 'border-2 border-[color:var(--color-glow-accent)] shadow-[0_0_36px_10px_rgba(143,217,255,0.55)]',
    text: 'text-lg',
  },
  1: {
    wrapper: 'h-20 w-20',
    ring: 'border border-[color:var(--color-glow-accent)]/70 shadow-[0_0_18px_4px_rgba(143,217,255,0.3)]',
    text: 'text-sm',
  },
}
const DEFAULT_TIER_STYLE = {
  wrapper: 'h-14 w-14',
  ring: 'border border-[color:var(--color-glow-accent)]/40 shadow-[0_0_8px_2px_rgba(143,217,255,0.15)]',
  text: 'text-xs',
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function MemberOrb({ member, tier }) {
  const navigate = useNavigate()
  const prefersReducedMotion = usePrefersReducedMotion()
  const style = TIER_STYLES[tier] ?? DEFAULT_TIER_STYLE

  const hoverAnimation = prefersReducedMotion
    ? { filter: 'brightness(1.2)' }
    : { scale: 1.08, filter: 'brightness(1.25)' }

  return (
    <button
      type="button"
      onClick={() => navigate(`/team/${member.id}`)}
      className="flex flex-col items-center gap-2 bg-transparent"
    >
      <motion.span
        whileHover={hoverAnimation}
        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
        className={`flex items-center justify-center overflow-hidden rounded-full bg-[color:var(--color-bg-mid)] ${style.wrapper} ${style.ring}`}
      >
        {member.photo_url ? (
          <img src={member.photo_url} alt={member.name} className="h-full w-full object-cover" />
        ) : (
          <span className={`font-heading text-[color:var(--color-text-secondary)] ${style.text}`}>
            {getInitials(member.name)}
          </span>
        )}
      </motion.span>
      <span className="max-w-28 text-center text-xs text-[color:var(--color-text-secondary)]">
        {member.name}
      </span>
    </button>
  )
}

export default MemberOrb
