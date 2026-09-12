import { Link } from 'react-router-dom'

const SECTIONS = [
  { to: '/admin/members', label: 'Manage Members' },
  { to: '/admin/events', label: 'Manage Events' },
  { to: '/admin/achievements', label: 'Manage Achievements' },
  { to: '/admin/gallery', label: 'Manage Gallery' },
]

function AdminDashboard() {
  return (
    <div>
      <h1 className="font-heading text-2xl text-[color:var(--color-text-primary)]">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <Link
            key={section.to}
            to={section.to}
            className="rounded-lg border border-white/10 bg-[color:var(--color-bg-mid)]/40 p-4 text-[color:var(--color-text-primary)] transition-colors hover:border-[color:var(--color-glow-accent)]/50"
          >
            {section.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
