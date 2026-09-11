import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion.js'

// Scale+fade "travel" transition shared by the constellation and profile
// pages, driven by AnimatePresence in App.jsx. Reduced motion means an
// instant cut — no motion component, no animation at all.
function PageTransition({ children, className = '' }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return <main className={className}>{children}</main>
  }

  return (
    <motion.main
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {children}
    </motion.main>
  )
}

export default PageTransition
