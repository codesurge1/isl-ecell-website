import { Navigate, useLocation } from 'react-router-dom'
import { useSession } from '../lib/use-session.js'

// Renders children only once a session is confirmed present. Shows a brief
// loading state while the check is in flight, so a protected page never
// flashes before redirecting an unauthenticated visitor to /admin/login.
function ProtectedRoute({ children }) {
  const { session, loading } = useSession()
  const location = useLocation()

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[color:var(--color-bg-base)]">
        <p className="text-[color:var(--color-text-secondary)]">Loading…</p>
      </main>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
