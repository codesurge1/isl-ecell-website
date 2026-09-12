import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteAchievement, getAchievements } from '../../lib/queries.js'
import { deleteFile, getPathFromPublicUrl } from '../../lib/storage.js'

const IMAGE_BUCKET = 'achievement-images'

function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function AchievementsList() {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    let cancelled = false

    getAchievements().then(({ data, error }) => {
      if (cancelled) return
      if (error) {
        setLoadError(error)
      } else {
        setLoadError(null)
        setAchievements(data ?? [])
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  async function reloadAfterAction() {
    setLoading(true)
    const { data, error } = await getAchievements()
    if (error) {
      setLoadError(error)
    } else {
      setLoadError(null)
      setAchievements(data ?? [])
    }
    setLoading(false)
  }

  async function handleDelete(achievement) {
    setActionError(null)

    if (!window.confirm(`Are you sure you want to delete ${achievement.title}?`)) {
      return
    }

    const { error } = await deleteAchievement(achievement.id)
    if (error) {
      setActionError(`Couldn't delete ${achievement.title}. Please try again.`)
      return
    }

    if (achievement.image_url) {
      const path = getPathFromPublicUrl(IMAGE_BUCKET, achievement.image_url)
      if (path) {
        await deleteFile(IMAGE_BUCKET, path)
      }
    }

    reloadAfterAction()
  }

  const sorted = [...achievements].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl text-[color:var(--color-text-primary)]">Manage Achievements</h1>
        <Link
          to="/admin/achievements/new"
          className="whitespace-nowrap rounded-md bg-[color:var(--color-brand-accent)] px-4 py-2 text-sm text-[color:var(--color-text-primary)]"
        >
          Add achievement
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
          Couldn't load achievements right now. Please try again later.
        </p>
      )}

      {!loading && !loadError && sorted.length === 0 && (
        <p className="mt-6 text-[color:var(--color-text-secondary)]">No achievements yet.</p>
      )}

      {!loading && !loadError && sorted.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[color:var(--color-text-secondary)]">
                <th className="py-2 pr-4 font-normal">Title</th>
                <th className="py-2 pr-4 font-normal">Date</th>
                <th className="py-2 pr-4 font-normal">Image</th>
                <th className="py-2 pr-4 font-normal" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((achievement) => (
                <tr key={achievement.id} className="border-b border-white/5 text-[color:var(--color-text-primary)]">
                  <td className="py-2 pr-4">{achievement.title}</td>
                  <td className="py-2 pr-4 text-[color:var(--color-text-secondary)]">
                    {formatDate(achievement.date)}
                  </td>
                  <td className="py-2 pr-4 text-[color:var(--color-text-secondary)]">
                    {achievement.image_url ? 'Yes' : 'No'}
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleDelete(achievement)}
                      className="text-[color:var(--color-brand-accent)] hover:underline"
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

export default AchievementsList
