function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="7" cy="6.5" r="1" fill="currentColor" stroke="none" />
      <line x1="7" y1="10" x2="7" y2="17" />
      <line x1="11" y1="10" x2="11" y2="17" />
      <path d="M11 12.5a2 2 0 0 1 4 0V17" />
    </svg>
  )
}

function TwitterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M21 5.5c-.7.3-1.4.5-2.2.6a3.8 3.8 0 0 0 1.7-2.1 7.6 7.6 0 0 1-2.4 1 3.8 3.8 0 0 0-6.5 3.5A10.8 10.8 0 0 1 3.8 4.4a3.8 3.8 0 0 0 1.2 5.1 3.8 3.8 0 0 1-1.7-.5v.05a3.8 3.8 0 0 0 3 3.7 3.8 3.8 0 0 1-1.7.07 3.8 3.8 0 0 0 3.5 2.6A7.6 7.6 0 0 1 2.5 17a10.8 10.8 0 0 0 5.8 1.7c7 0 10.8-5.8 10.8-10.8v-.5c.7-.5 1.4-1.2 1.9-1.9z" />
    </svg>
  )
}

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7c-.1-.2-.5-1.3.1-2.7 0 0 .9-.3 2.9 1a10 10 0 0 1 5.2 0c2-1.3 2.9-1 2.9-1 .6 1.4.2 2.5.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.8-4.6 5 .3.3.6.9.6 1.8v2.7c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
    </svg>
  )
}

function GlobeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="12" cy="12" r="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <path d="M12 3c2.5 2.5 4 5.7 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.7-4-9s1.5-6.5 4-9z" />
    </svg>
  )
}

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
  x: TwitterIcon,
  github: GithubIcon,
}

// Renders whichever keys are actually present in the member's `socials`
// jsonb field as icon links — nothing at all if there's nothing to show,
// so an empty {} (the seed data default) doesn't leave behind broken UI.
function SocialLinks({ socials }) {
  const entries = Object.entries(socials ?? {}).filter(
    ([, url]) => typeof url === 'string' && url.trim(),
  )

  if (entries.length === 0) return null

  return (
    <div className="mt-6 flex justify-center gap-4">
      {entries.map(([platform, url]) => {
        const Icon = SOCIAL_ICONS[platform.toLowerCase()] ?? GlobeIcon
        return (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label={platform}
            className="text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-glow-accent)]"
          >
            <Icon className="h-6 w-6" />
          </a>
        )
      })}
    </div>
  )
}

export default SocialLinks
