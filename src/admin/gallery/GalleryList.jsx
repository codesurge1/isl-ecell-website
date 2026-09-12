import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteGalleryPhoto, getGallery } from '../../lib/queries.js'
import { deleteFile, getPathFromPublicUrl } from '../../lib/storage.js'

const IMAGE_BUCKET = 'gallery-photos'

function GalleryList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    let cancelled = false

    getGallery().then(({ data, error }) => {
      if (cancelled) return
      if (error) {
        setLoadError(error)
      } else {
        setLoadError(null)
        setItems(data ?? [])
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  async function reloadAfterAction() {
    setLoading(true)
    const { data, error } = await getGallery()
    if (error) {
      setLoadError(error)
    } else {
      setLoadError(null)
      setItems(data ?? [])
    }
    setLoading(false)
  }

  // Unlike Members/Events/Achievements, image_url is required on every new
  // row going forward, so there's no "has an image?" branch here — just
  // delete the row and its file.
  async function handleDelete(item) {
    setActionError(null)

    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return
    }

    const { error } = await deleteGalleryPhoto(item.id)
    if (error) {
      setActionError("Couldn't delete this photo. Please try again.")
      return
    }

    const path = getPathFromPublicUrl(IMAGE_BUCKET, item.image_url)
    if (path) {
      await deleteFile(IMAGE_BUCKET, path)
    }

    reloadAfterAction()
  }

  const sorted = [...items].sort(
    (a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime(),
  )

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl text-[color:var(--color-text-primary)]">Manage Gallery</h1>
        <Link
          to="/admin/gallery/new"
          className="whitespace-nowrap rounded-md bg-[color:var(--color-brand-accent)] px-4 py-2 text-sm text-[color:var(--color-text-primary)]"
        >
          Add photo
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
          Couldn't load the gallery right now. Please try again later.
        </p>
      )}

      {!loading && !loadError && sorted.length === 0 && (
        <p className="mt-6 text-[color:var(--color-text-secondary)]">No photos yet.</p>
      )}

      {!loading && !loadError && sorted.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {sorted.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-md border border-white/10 bg-[color:var(--color-bg-mid)]">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.caption ?? ''} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-[color:var(--color-text-secondary)]">No image</span>
                )}
              </div>
              <p className="truncate text-sm text-[color:var(--color-text-primary)]">
                {item.caption || 'No caption'}
              </p>
              <button
                type="button"
                onClick={() => handleDelete(item)}
                className="self-start text-sm text-[color:var(--color-brand-accent)] hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GalleryList
