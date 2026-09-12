import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[color:var(--color-bg-base)] px-4 py-20 text-center">
      <h1 className="font-heading text-4xl text-[color:var(--color-text-primary)] md:text-5xl">
        404 — Page not found
      </h1>
      <p className="mt-3 max-w-md text-[color:var(--color-text-secondary)]">
        The page you're looking for doesn't exist or may have moved.
      </p>

      <Link
        to="/"
        className="mt-8 text-lg text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-glow-accent)]"
      >
        Back to Home
      </Link>
    </main>
  )
}

export default NotFound
