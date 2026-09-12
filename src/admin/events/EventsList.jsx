import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteEvent, getEvents } from '../../lib/queries.js'
import { deleteFile, getPathFromPublicUrl } from '../../lib/storage.js'

const THUMBNAIL_BUCKET = 'event-thumbnails'

function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function EventsList() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    let cancelled = false

    getEvents().then(({ data, error }) => {
      if (cancelled) return
      if (error) {
        setLoadError(error)
      } else {
        setLoadError(null)
        setEvents(data ?? [])
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  async function reloadAfterAction() {
    setLoading(true)
    const { data, error } = await getEvents()
    if (error) {
      setLoadError(error)
    } else {
      setLoadError(null)
      setEvents(data ?? [])
    }
    setLoading(false)
  }

  async function handleDelete(event) {
    setActionError(null)

    if (!window.confirm(`Are you sure you want to delete ${event.title}?`)) {
      return
    }

    const { error } = await deleteEvent(event.id)
    if (error) {
      setActionError(`Couldn't delete ${event.title}. Please try again.`)
      return
    }

    if (event.thumbnail_url) {
      const path = getPathFromPublicUrl(THUMBNAIL_BUCKET, event.thumbnail_url)
      if (path) {
        await deleteFile(THUMBNAIL_BUCKET, path)
      }
    }

    reloadAfterAction()
  }

  const sorted = [...events].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl text-[color:var(--color-text-primary)]">Manage Events</h1>
        <Link
          to="/admin/events/new"
          className="whitespace-nowrap rounded-md bg-[color:var(--color-brand-accent)] px-4 py-2 text-sm text-[color:var(--color-text-primary)]"
        >
          Add event
        </Link>
      </div>

      {actionError && (
        <p className="mt-4 rounded-md border border-[color:var(--color-brand-accent)]/40 bg-[color:var(--color-brand-accent)]/10 px-3 py-2 text-sm text-[color:var(--color-brand-accent)]">
          {actionError}
        </p>
      )}

      {loading && <p className="mt-6 text-[color:var(--color-text-secondary)]">Loading…</p>}

      {!loading && loadError && (
        <p className="mt-6 text-[color:var(--color-text-secondary)]">
          Couldn't load events right now. Please try again later.
        </p>
      )}

      {!loading && !loadError && sorted.length === 0 && (
        <p className="mt-6 text-[color:var(--color-text-secondary)]">No events yet.</p>
      )}

      {!loading && !loadError && sorted.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[color:var(--color-text-secondary)]">
                <th className="py-2 pr-4 font-normal">Title</th>
                <th className="py-2 pr-4 font-normal">Date</th>
                <th className="py-2 pr-4 font-normal">Category</th>
                <th className="py-2 pr-4 font-normal">External link</th>
                <th className="py-2 pr-4 font-normal" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((event) => (
                <tr key={event.id} className="border-b border-white/5 text-[color:var(--color-text-primary)]">
                  <td className="py-2 pr-4">{event.title}</td>
                  <td className="py-2 pr-4 text-[color:var(--color-text-secondary)]">{formatDate(event.date)}</td>
                  <td className="py-2 pr-4 text-[color:var(--color-text-secondary)]">{event.category}</td>
                  <td className="py-2 pr-4 text-[color:var(--color-text-secondary)]">
                    {event.external_link ? 'Yes' : 'No'}
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    <Link
                      to={`/admin/events/${event.id}/edit`}
                      className="text-[color:var(--color-glow-accent)] hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(event)}
                      className="ml-3 text-[color:var(--color-brand-accent)] hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default EventsList
