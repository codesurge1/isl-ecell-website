import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion.js'

// tier 0 = root (President-level), tier 1 = direct children (domain heads),
// tier 2+ = everyone deeper (volunteers) — falls back to the smallest style.
// Each glow is 2-3 stacked shadows (tight+bright to wide+soft) so the orb
// reads as a light source rather than an outlined circle.
const TIER_STYLES = {
  0: {
    wrapper: 'h-36 w-36',
    ring: 'border border-[color:var(--color-glow-accent)]/90 shadow-[0_0_14px_2px_rgba(143,217,255,0.9),0_0_34px_8px_rgba(143,217,255,0.5),0_0_64px_16px_rgba(143,217,255,0.22)]',
    text: 'text-xl',
  },
  1: {
    wrapper: 'h-[84px] w-[84px]',
    ring: 'border border-[color:var(--color-glow-accent)]/70 shadow-[0_0_9px_1px_rgba(143,217,255,0.7),0_0_22px_5px_rgba(143,217,255,0.38),0_0_42px_10px_rgba(143,217,255,0.16)]',
    text: 'text-sm',
  },
}
const DEFAULT_TIER_STYLE = {
  wrapper: 'h-14 w-14',
  ring: 'border border-[color:var(--color-glow-accent)]/45 shadow-[0_0_6px_1px_rgba(143,217,255,0.45),0_0_16px_3px_rgba(143,217,255,0.2)]',
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

// Deterministic 0..1 value from a string, used to stagger each orb's pulse
// so they don't all breathe in perfect sync (that reads as robotic, not alive).
function hashToUnit(value) {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return (hash % 1000) / 1000
}

function MemberOrb({ member, tier }) {
  const navigate = useNavigate()
  const prefersReducedMotion = usePrefersReducedMotion()
  const style = TIER_STYLES[tier] ?? DEFAULT_TIER_STYLE

  const hoverAnimation = prefersReducedMotion
    ? { filter: 'brightness(1.2)', transition: { duration: 0 } }
    : { scale: 1.08, filter: 'brightness(1.25)', transition: { duration: 0.2 } }

  // Very slow, low-amplitude brightness breathing — CSS filter also affects
  // the box-shadow glow of the same element, so this reads as the glow
  // itself pulsing, not just the orb face.
  const pulseDelay = hashToUnit(member.id) * 3
  const pulseDuration = 4 + hashToUnit([...member.id].reverse().join('')) * 2
  const glowAnimation = prefersReducedMotion
    ? undefined
    : { filter: ['brightness(1)', 'brightness(1.15)', 'brightness(1)'] }
  const glowTransition = prefersReducedMotion
    ? undefined
    : { duration: pulseDuration, delay: pulseDelay, repeat: Infinity, ease: 'easeInOut' }

  return (
    <button
      type="button"
      onClick={() => navigate(`/team/${member.id}`)}
      className="flex flex-col items-center gap-2 bg-transparent"
    >
      <motion.span
        animate={glowAnimation}
        transition={glowTransition}
        whileHover={hoverAnimation}
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
