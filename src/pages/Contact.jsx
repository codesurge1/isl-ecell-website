import SocialLinks from '../components/SocialLinks.jsx'

// PLACEHOLDER SOCIAL URLS — replace with the real Instagram/LinkedIn links
// before launch. SocialLinks (shared with MemberProfile) already renders
// whichever keys are present as icon links, so no icon-drawing is
// duplicated here.
const CONTACT_SOCIALS = {
  instagram: '#',
  linkedin: '#',
}

// PLACEHOLDER EMAIL — replace with the real contact address before launch.
const CONTACT_EMAIL = 'ecell@islengineering.edu.in'

// PLACEHOLDER LOCATION — replace with the real building/room before launch.
const CONTACT_LOCATION = 'ISL Engineering College, [Building/Room TBD]'

function Contact() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[color:var(--color-bg-base)] px-4 py-20 text-center">
      <h1 className="font-heading text-4xl text-[color:var(--color-text-primary)] md:text-5xl">
        Get in Touch
      </h1>
      <p className="mt-3 max-w-md text-[color:var(--color-text-secondary)]">
        Ideas don't grow alone — reach out and let's talk.
      </p>

      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="mt-8 text-lg text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-glow-accent)]"
      >
        {CONTACT_EMAIL}
      </a>

      <p className="mt-4 text-[color:var(--color-text-secondary)]">{CONTACT_LOCATION}</p>

      <SocialLinks socials={CONTACT_SOCIALS} />
    </main>
  )
}

export default Contact
