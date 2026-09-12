import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createGalleryPhoto } from '../../lib/queries.js'
import { getPublicUrl, uploadFile } from '../../lib/storage.js'

const IMAGE_BUCKET = 'gallery-photos'
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

const inputClass =
  'mt-1 w-full rounded-md border border-white/10 bg-[color:var(--color-bg-base)] px-3 py-2 text-[color:var(--color-text-primary)] focus:border-[color:var(--color-glow-accent)] focus:outline-none'
const labelClass = 'block text-sm text-[color:var(--color-text-secondary)]'
const errorClass = 'mt-1 text-sm text-[color:var(--color-brand-accent)]'

// Upload/delete only, per scope — no edit form. Single-file upload only:
// the file input deliberately omits `multiple`, restricting both the
// picker dialog and event.target.files to at most one file.
function GalleryForm() {
  const navigate = useNavigate()

  const [caption, setCaption] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imageError, setImageError] = useState(null)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  function handleImageChange(event) {
    const file = event.target.files?.[0]
    setImageError(null)
    setImageFile(null)
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setImageError('Please choose an image file.')
      event.target.value = ''
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError('Image must be 5MB or smaller.')
      event.target.value = ''
      return
    }

    setImageFile(file)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!imageFile) {
      setImageError('Please choose a photo to upload.')
      return
    }

    setSubmitError(null)
    setSubmitting(true)

    const id = crypto.randomUUID()

    try {
      const extension = imageFile.name.split('.').pop()
      const path = `${id}-${Date.now()}.${extension}`
      const { error: uploadError } = await uploadFile(IMAGE_BUCKET, path, imageFile)
      if (uploadError) throw uploadError

      const { error: insertError } = await createGalleryPhoto({
        id,
        image_url: getPublicUrl(IMAGE_BUCKET, path),
        caption: caption.trim() || null,
      })
      if (insertError) throw insertError

      navigate('/admin/gallery')
    } catch {
      setSubmitError('Something went wrong saving this photo. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-[color:var(--color-text-primary)]">Add Photo</h1>

      <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4">
        <div>
          <label className={labelClass} htmlFor="caption">
            Caption
          </label>
          <input
            id="caption"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="image">
            Photo *
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 block text-sm text-[color:var(--color-text-secondary)]"
          />
          {imageError && <p className={errorClass}>{imageError}</p>}
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

export default GalleryForm
