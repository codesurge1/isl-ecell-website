import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion.js'

const STAR_COUNT = 60

function createStars() {
  return Array.from({ length: STAR_COUNT }, (_, index) => ({
    id: index,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: 1 + Math.random() * 1.5,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 4,
    baseOpacity: 0.25 + Math.random() * 0.35,
  }))
}

function Starfield() {
  const stars = useMemo(() => createStars(), [])
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
          initial={{ opacity: star.baseOpacity }}
          animate={
            prefersReducedMotion
              ? { opacity: star.baseOpacity }
              : { opacity: [star.baseOpacity, star.baseOpacity + 0.4, star.baseOpacity] }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: star.duration, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }
          }
        />
      ))}
    </div>
  )
}

export default Starfield
