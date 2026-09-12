import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createEvent, getEventById, updateEvent } from '../../lib/queries.js'
import { deleteFile, getPathFromPublicUrl, getPublicUrl, uploadFile } from '../../lib/storage.js'

// Must match the events.category check constraint exactly (see
// .claude/rules/data-layer.md).
const CATEGORIES = ['Workshops', 'Guest talks', 'Competitions', 'Flagship events']

const THUMBNAIL_BUCKET = 'event-thumbnails'
const MAX_THUMBNAIL_BYTES = 5 * 1024 * 1024

const inputClass =
  'mt-1 w-full rounded-md border border-white/10 bg-[color:var(--color-bg-base)] px-3 py-2 text-[color:var(--color-text-primary)] focus:border-[color:var(--color-glow-accent)] focus:outline-none'
const labelClass = 'block text-sm text-[color:var(--color-text-secondary)]'
const errorClass = 'mt-1 text-sm text-[color:var(--color-brand-accent)]'

function isValidUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function EventForm() {
  const { eventId } = useParams()
  const isEditing = Boolean(eventId)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(isEditing)
  const [loadError, setLoadError] = useState(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('')
  const [externalLink, setExternalLink] = useState('')
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailError, setThumbnailError] = useState(null)

  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    if (!isEditing) return
    let cancelled = false

    getEventById(eventId).then(({ data: event, error }) => {
      if (cancelled) return
      if (error || !event) {
        setLoadError(error ?? new Error('Event not found'))
        setLoading(false)
        return
      }
      setTitle(event.title ?? '')
      setDescription(event.description ?? '')
      setDate(event.date ?? '')
      setCategory(event.category ?? '')
      setExternalLink(event.external_link ?? '')
      setExistingThumbnailUrl(event.thumbnail_url ?? null)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [eventId, isEditing])

  function handleThumbnailChange(event) {
    const file = event.target.files?.[0]
    setThumbnailError(null)
    setThumbnailFile(null)
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setThumbnailError('Please choose an image file.')
      event.target.value = ''
      return
    }
    if (file.size > MAX_THUMBNAIL_BYTES) {
      setThumbnailError('Image must be 5MB or smaller.')
      event.target.value = ''
      return
    }

    setThumbnailFile(file)
  }

  function validate() {
    const errors = {}
    if (!title.trim()) errors.title = 'Title is required.'
    if (!description.trim()) errors.description = 'Description is required.'
    if (!date) errors.date = 'Date is required.'
    if (!category) errors.category = 'Category is required.'
    if (externalLink.trim() && !isValidUrl(externalLink.trim())) {
      errors.externalLink = 'Enter a valid URL (starting with http:// or https://).'
    }
    return errors
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitError(null)
    setSubmitting(true)

    const targetId = isEditing ? eventId : crypto.randomUUID()
    const payload = {
      title: title.trim(),
      description: description.trim(),
      date,
      category,
      external_link: externalLink.trim() || null,
    }

    try {
      // Upload before writing the row, so a failed upload never leaves an
      // event pointing at a thumbnail that doesn't exist.
      if (thumbnailFile) {
        const extension = thumbnailFile.name.split('.').pop()
        const path = `${targetId}-${Date.now()}.${extension}`
        const { error: uploadError } = await uploadFile(THUMBNAIL_BUCKET, path, thumbnailFile)
        if (uploadError) throw uploadError
        payload.thumbnail_url = getPublicUrl(THUMBNAIL_BUCKET, path)
      }

      if (isEditing) {
        const { error: updateError } = await updateEvent(targetId, payload)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await createEvent({ id: targetId, ...payload })
        if (insertError) throw insertError
      }

      // Only remove the old file once the row referencing the new one has
      // actually saved — never delete before we know the swap succeeded.
      if (thumbnailFile && existingThumbnailUrl) {
        const oldPath = getPathFromPublicUrl(THUMBNAIL_BUCKET, existingThumbnailUrl)
        if (oldPath) await deleteFile(THUMBNAIL_BUCKET, oldPath)
      }

      navigate('/admin/events')
    } catch {
      setSubmitError('Something went wrong saving this event. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="text-[color:var(--color-text-secondary)]">Loading…</p>
  }

  if (loadError) {
    return (
      <p className="text-[color:var(--color-text-secondary)]">
        Couldn't load this form right now. Please try again later.
      </p>
    )
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-[color:var(--color-text-primary)]">
        {isEditing ? 'Edit Event' : 'Add Event'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4">
        <div>
          <label className={labelClass} htmlFor="title">
            Title *
          </label>
          <input id="title" value={title} onChange={(event) => setTitle(event.target.value)} className={inputClass} />
          {fieldErrors.title && <p className={errorClass}>{fieldErrors.title}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="description">
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className={inputClass}
          />
          {fieldErrors.description && <p className={errorClass}>{fieldErrors.description}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="date">
            Date *
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className={inputClass}
          />
          {fieldErrors.date && <p className={errorClass}>{fieldErrors.date}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="category">
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={inputClass}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldErrors.category && <p className={errorClass}>{fieldErrors.category}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="externalLink">
            External link
          </label>
          <input
            id="externalLink"
            value={externalLink}
            onChange={(event) => setExternalLink(event.target.value)}
            placeholder="https://…"
            className={inputClass}
          />
          {fieldErrors.externalLink && <p className={errorClass}>{fieldErrors.externalLink}</p>}
        </div>

        <div>
          <label className={labelClass}>Thumbnail</label>
          {existingThumbnailUrl && !thumbnailFile && (
            <img
              src={existingThumbnailUrl}
              alt=""
              className="mt-2 h-20 w-32 rounded-md border border-white/10 object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="mt-2 block text-sm text-[color:var(--color-text-secondary)]"
          />
          {thumbnailError && <p className={errorClass}>{thumbnailError}</p>}
        </div>

        {submitError && <p className="text-sm text-[color:var(--color-brand-accent)]">{submitError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-[color:var(--color-brand-accent)] px-4 py-2 text-[color:var(--color-text-primary)] disabled:opacity-60"
        >
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </form>
    </div>
  )
}

export default EventForm
