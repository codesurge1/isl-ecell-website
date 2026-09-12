import { Link, useNavigate } from 'react-router-dom'
import { signOut } from '../lib/auth.js'

// Deliberately plain/utilitarian — a tool, not a marketing page. Separate
// from the public Navbar/Footer entirely.
function AdminLayout({ children }) {
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-bg-base)]">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <Link to="/admin" className="font-heading text-sm text-[color:var(--color-text-primary)]">
          ISL E-cell Admin
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-glow-accent)]"
        >
          Log out
        </button>
      </header>
      <main className="px-4 py-10">{children}</main>
    </div>
  )
}

export default AdminLayout
