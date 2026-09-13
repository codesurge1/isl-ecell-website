import { Link } from 'react-router-dom'
import { InstagramIcon, LinkedinIcon } from './SocialIcons.jsx'

const PLACEHOLDER_SOCIALS = [
  { platform: 'Instagram', Icon: InstagramIcon, href: '#' },
  { platform: 'LinkedIn', Icon: LinkedinIcon, href: '#' },
]

function Footer() {
  return (
    <footer className="border-t border-white/15 bg-[color:var(--color-bg-black)] px-4 py-10 text-[color:var(--color-text-muted)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <Link to="/" className="font-display tracking-wide text-lg text-white transition-colors hover:text-[color:var(--color-brand-accent)]">
          ISL E-cell
        </Link>
        <p className="text-sm">Visionary Questers</p>

        <div className="flex gap-4">
          {PLACEHOLDER_SOCIALS.map(({ platform, Icon, href }) => (
            <a
              key={platform}
              href={href}
              aria-label={platform}
              className="text-[color:var(--color-text-muted)] transition-colors hover:text-[color:var(--color-brand-accent)]"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>

        <p className="text-xs text-[color:var(--color-text-muted)]/70">
          &copy; {new Date().getFullYear()} ISL E-cell. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
