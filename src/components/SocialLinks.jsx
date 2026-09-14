import {
  GithubIcon,
  GlobeIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  TwitterIcon,
} from './SocialIcons.jsx'

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
  x: TwitterIcon,
  github: GithubIcon,
}

const linkClass =
  'text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-glow-accent)]'

// Renders whichever keys are actually present in the member's `socials`
// jsonb field as icon links — nothing at all if there's nothing to show,
// so an empty {} (the seed data default) doesn't leave behind broken UI.
// `email` is a separate top-level column, not part of `socials` (it's a
// first-class contact field, not a social platform link), but shares the
// exact same icon-link treatment, so it's accepted here as its own prop
// rather than duplicating this markup at each call site.
function SocialLinks({ socials, email }) {
  const entries = Object.entries(socials ?? {}).filter(
    ([, url]) => typeof url === 'string' && url.trim(),
  )

  if (entries.length === 0 && !email) return null

  return (
    <div className="mt-6 flex justify-center gap-4">
      {email && (
        <a href={`mailto:${email}`} aria-label="Email" className={linkClass}>
          <MailIcon className="h-6 w-6" />
        </a>
      )}
      {entries.map(([platform, url]) => {
        const Icon = SOCIAL_ICONS[platform.toLowerCase()] ?? GlobeIcon
        return (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label={platform}
            className={linkClass}
          >
            <Icon className="h-6 w-6" />
          </a>
        )
      })}
    </div>
  )
}

export default SocialLinks
