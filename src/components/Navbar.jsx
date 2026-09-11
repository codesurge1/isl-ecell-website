import { Link } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/what-we-do', label: 'What We Do' },
  { to: '/events', label: 'Events' },
  { to: '/team', label: 'Team' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

function Navbar() {
  return (
    <nav className="flex flex-wrap gap-4 bg-[color:var(--color-bg-base)] p-4 font-heading text-[color:var(--color-text-primary)]">
      {links.map((link) => (
        <Link key={link.to} to={link.to}>
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

export default Navbar
