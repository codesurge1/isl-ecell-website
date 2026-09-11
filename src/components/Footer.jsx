import { Link } from 'react-router-dom'
import { InstagramIcon, LinkedinIcon } from './SocialIcons.jsx'

const PLACEHOLDER_SOCIALS = [
  { platform: 'Instagram', Icon: InstagramIcon, href: '#' },
  { platform: 'LinkedIn', Icon: LinkedinIcon, href: '#' },
]

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[color:var(--color-bg-base)] px-4 py-10 text-[color:var(--color-text-secondary)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <Link to="/" className="font-heading text-lg text-[color:var(--color-text-primary)]">
          ISL E-cell
        </Link>
        <p className="text-sm">Visionary Questers</p>

        <div className="flex gap-4">
          {PLACEHOLDER_SOCIALS.map(({ platform, Icon, href }) => (
            <a
              key={platform}
              href={href}
              aria-label={platform}
              className="text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-glow-accent)]"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>

        <p className="text-xs text-[color:var(--color-text-secondary)]/70">
          &copy; {new Date().getFullYear()} ISL E-cell. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
