import {
  GithubIcon,
  GlobeIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from './SocialIcons.jsx'

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
