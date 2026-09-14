import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion.js'

// Deterministic 0..1 value from a string/id, used to stagger each orb's
// pulse so a group of orbs doesn't breathe in perfect sync (that reads as
// robotic, not alive).
function hashToUnit(value) {
  const str = String(value)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return (hash % 1000) / 1000
}

// Shared glowing-frame visual primitive: a portrait rectangle whose glow is
// 2-3 stacked box-shadows (tight+bright to wide+soft) so it reads as a
// light source rather than an outlined shape, plus a slow ambient
// brightness pulse. Used by the Team constellation (MemberOrb).
function GlowOrb({
  wrapperClassName,
  ringClassName,
  pulseSeed,
  hoverAnimation,
  className = '',
  children,
}) {
  const prefersReducedMotion = usePrefersReducedMotion()

  const pulseDelay = hashToUnit(pulseSeed) * 3
  const pulseDuration = 4 + hashToUnit([...String(pulseSeed)].reverse().join('')) * 2
  const glowAnimation = prefersReducedMotion
    ? undefined
    : { filter: ['brightness(1)', 'brightness(1.15)', 'brightness(1)'] }
  const glowTransition = prefersReducedMotion
    ? undefined
    : { duration: pulseDuration, delay: pulseDelay, repeat: Infinity, ease: 'easeInOut' }

  return (
    <motion.span
      animate={glowAnimation}
      transition={glowTransition}
      whileHover={hoverAnimation}
      className={`flex items-center justify-center overflow-hidden rounded-lg bg-[color:var(--color-bg-black)] ${wrapperClassName} ${ringClassName} ${className}`}
    >
      {children}
    </motion.span>
  )
}

export default GlowOrb
