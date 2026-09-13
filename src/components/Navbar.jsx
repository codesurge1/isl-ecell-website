import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useScrolled } from '../lib/use-scrolled.js'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion.js'
import logoMark from '../assets/logo-mark.png'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/events', label: 'Events' },
  { to: '/team', label: 'Team' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

// Active state is a solid red pill, not just an underline/color change —
// hover on inactive links stays a plain text-color shift so it never
// competes with the active pill's boldness.
function desktopLinkClass({ isActive }) {
  return `rounded-full px-4 py-1.5 text-sm tracking-wide transition-colors ${
    isActive
      ? 'bg-[color:var(--color-brand-accent)] text-white'
      : 'text-[color:var(--color-text-muted)] hover:text-white'
  }`
}

function mobileLinkClass({ isActive }) {
  return `rounded-full px-6 py-3 text-lg transition-colors ${
    isActive
      ? 'bg-[color:var(--color-brand-accent)] text-white'
      : 'text-[color:var(--color-text-muted)] hover:text-white'
  }`
}

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  )
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  )
}

function Navbar() {
  const scrolled = useScrolled()
  const prefersReducedMotion = usePrefersReducedMotion()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lastPathname, setLastPathname] = useState(location.pathname)

  // Auto-close the mobile menu whenever the route changes. Navbar sits
  // outside the keyed Routes swap (it doesn't remount on navigation), so
  // this can't be reset by a key — adjusting state during render, rather
  // than in an effect, avoids the extra post-navigation render pass.
  if (location.pathname !== lastPathname) {
    setLastPathname(location.pathname)
    setMobileOpen(false)
  }

  // Lock background scroll while the full-screen mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/10 bg-[color:var(--color-bg-black)] transition-shadow duration-300 ${
        scrolled ? 'shadow-lg shadow-black/40' : ''
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-lg text-white transition-colors hover:text-[color:var(--color-brand-accent)]">
          <img src={logoMark} alt="" className="h-8 w-auto" />
          <span className="font-bold tracking-wide">ISL E-cell</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={desktopLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="text-white md:hidden"
        >
          {mobileOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col items-center justify-center gap-2 bg-[color:var(--color-bg-black)] md:hidden"
          >
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={mobileLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
