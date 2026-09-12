import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { signIn } from '../lib/auth.js'
import { useSession } from '../lib/use-session.js'

function AdminLogin() {
  const { session, loading: sessionLoading } = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Already signed in — skip the form.
  if (!sessionLoading && session) {
    const redirectTo = location.state?.from?.pathname ?? '/admin'
    return <Navigate to={redirectTo} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    const { error: signInError } = await signIn(email, password)

    if (signInError) {
      // Deliberately generic — don't reveal whether the email exists or
      // the password was wrong.
      setError('Invalid email or password.')
      setSubmitting(false)
      return
    }

    navigate(location.state?.from?.pathname ?? '/admin', { replace: true })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[color:var(--color-bg-base)] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-white/10 bg-[color:var(--color-bg-mid)]/30 p-8"
      >
        <h1 className="font-heading text-2xl text-[color:var(--color-text-primary)]">Admin Login</h1>

        <label className="mt-6 block text-sm text-[color:var(--color-text-secondary)]" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded-md border border-white/10 bg-[color:var(--color-bg-base)] px-3 py-2 text-[color:var(--color-text-primary)] focus:border-[color:var(--color-glow-accent)] focus:outline-none"
        />

        <label className="mt-4 block text-sm text-[color:var(--color-text-secondary)]" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-md border border-white/10 bg-[color:var(--color-bg-base)] px-3 py-2 text-[color:var(--color-text-primary)] focus:border-[color:var(--color-glow-accent)] focus:outline-none"
        />

        {error && <p className="mt-4 text-sm text-[color:var(--color-brand-accent)]">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-md bg-[color:var(--color-brand-accent)] py-2 font-heading text-[color:var(--color-text-primary)] disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}

export default AdminLogin
