import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createMember, getMemberById, getMembers, updateMember } from '../../lib/queries.js'
import { getDescendantIds } from '../../lib/buildMemberTree.js'
import { deleteFile, getPathFromPublicUrl, getPublicUrl, uploadFile } from '../../lib/storage.js'

const PHOTO_BUCKET = 'member-photos'
const MAX_PHOTO_BYTES = 5 * 1024 * 1024

const inputClass =
  'mt-1 w-full rounded-md border border-white/10 bg-[color:var(--color-bg-base)] px-3 py-2 text-[color:var(--color-text-primary)] focus:border-[color:var(--color-glow-accent)] focus:outline-none'
const labelClass = 'block text-sm text-[color:var(--color-text-secondary)]'

// Deliberately simple — this just catches obvious typos in an optional
// contact field, not a full RFC 5322 validator.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function MemberForm() {
  const { memberId } = useParams()
  const isEditing = Boolean(memberId)
  const navigate = useNavigate()

  const [allMembers, setAllMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [domain, setDomain] = useState('')
  const [bio, setBio] = useState('')
  const [parentId, setParentId] = useState('')
  const [instagram, setInstagram] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [twitter, setTwitter] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(null)
  const [existingPhotoUrl, setExistingPhotoUrl] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoError, setPhotoError] = useState(null)

  const [nameError, setNameError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)

      const { data: membersData, error: membersError } = await getMembers()
      if (cancelled) return
      if (membersError) {
        setLoadError(membersError)
        setLoading(false)
        return
      }
      setAllMembers(membersData ?? [])

      if (isEditing) {
        const { data: member, error: memberError } = await getMemberById(memberId)
        if (cancelled) return
        if (memberError || !member) {
          setLoadError(memberError ?? new Error('Member not found'))
          setLoading(false)
          return
        }
        setName(member.name ?? '')
        setRole(member.role ?? '')
        setDomain(member.domain ?? '')
        setBio(member.bio ?? '')
        setParentId(member.parent_id ?? '')
        setInstagram(member.socials?.instagram ?? '')
        setLinkedin(member.socials?.linkedin ?? '')
        setTwitter(member.socials?.twitter ?? '')
        setEmail(member.email ?? '')
        setExistingPhotoUrl(member.photo_url ?? null)
      }

      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [memberId, isEditing])

  // Exclude self and every descendant from "Reports to" — reassigning a
  // member under itself or one of its own reports would create a cycle.
  const parentOptions = useMemo(() => {
    if (!isEditing) return allMembers
    const excluded = getDescendantIds(allMembers, memberId)
    excluded.add(memberId)
    return allMembers.filter((member) => !excluded.has(member.id))
  }, [allMembers, memberId, isEditing])

  function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    setPhotoError(null)
    setPhotoFile(null)
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please choose an image file.')
      event.target.value = ''
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError('Image must be 5MB or smaller.')
      event.target.value = ''
      return
    }

    setPhotoFile(file)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    let hasError = false
    if (!name.trim()) {
      setNameError('Name is required.')
      hasError = true
    } else {
      setNameError(null)
    }

    if (email.trim() && !EMAIL_PATTERN.test(email.trim())) {
      setEmailError('Please enter a valid email address.')
      hasError = true
    } else {
      setEmailError(null)
    }

    if (hasError) return

    setSubmitError(null)
    setSubmitting(true)

    const socials = {}
    if (instagram.trim()) socials.instagram = instagram.trim()
    if (linkedin.trim()) socials.linkedin = linkedin.trim()
    if (twitter.trim()) socials.twitter = twitter.trim()

    const targetId = isEditing ? memberId : crypto.randomUUID()
    const payload = {
      name: name.trim(),
      role: role.trim() || null,
      domain: domain.trim() || null,
      bio: bio.trim() || null,
      parent_id: parentId || null,
      email: email.trim() || null,
      socials,
    }

    try {
      // Upload before writing the row, so a failed upload never leaves a
      // member pointing at a photo that doesn't exist.
      if (photoFile) {
        const extension = photoFile.name.split('.').pop()
        const path = `${targetId}-${Date.now()}.${extension}`
        const { error: uploadError } = await uploadFile(PHOTO_BUCKET, path, photoFile)
        if (uploadError) throw uploadError
        payload.photo_url = getPublicUrl(PHOTO_BUCKET, path)
      }

      if (isEditing) {
        const { error: updateError } = await updateMember(targetId, payload)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await createMember({ id: targetId, ...payload })
        if (insertError) throw insertError
      }

      // Only remove the old file once the row referencing the new one has
      // actually saved — never delete before we know the swap succeeded.
      if (photoFile && existingPhotoUrl) {
        const oldPath = getPathFromPublicUrl(PHOTO_BUCKET, existingPhotoUrl)
        if (oldPath) await deleteFile(PHOTO_BUCKET, oldPath)
      }

      navigate('/admin/members')
    } catch {
      setSubmitError('Something went wrong saving this member. Please try again.')
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
        {isEditing ? 'Edit Member' : 'Add Member'}
      </h1>

      <form onSubmit={handleSubmit} noValidate className="mt-6 max-w-lg space-y-4">
        <div>
          <label className={labelClass} htmlFor="name">
            Name *
          </label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className={inputClass}
          />
          {nameError && <p className="mt-1 text-sm text-[color:var(--color-brand-accent)]">{nameError}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="role">
            Role
          </label>
          <input id="role" value={role} onChange={(event) => setRole(event.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="domain">
            Domain
          </label>
          <input
            id="domain"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="parent">
            Reports to
          </label>
          <select
            id="parent"
            value={parentId}
            onChange={(event) => setParentId(event.target.value)}
            className={inputClass}
          >
            <option value="">No one (top of hierarchy)</option>
            {parentOptions.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
          {emailError && <p className="mt-1 text-sm text-[color:var(--color-brand-accent)]">{emailError}</p>}
        </div>

        <fieldset className="space-y-2">
          <legend className={labelClass}>Socials</legend>
          <input
            aria-label="Instagram URL"
            placeholder="Instagram URL"
            value={instagram}
            onChange={(event) => setInstagram(event.target.value)}
            className={inputClass}
          />
          <input
            aria-label="LinkedIn URL"
            placeholder="LinkedIn URL"
            value={linkedin}
            onChange={(event) => setLinkedin(event.target.value)}
            className={inputClass}
          />
          <input
            aria-label="Twitter URL"
            placeholder="Twitter URL"
            value={twitter}
            onChange={(event) => setTwitter(event.target.value)}
            className={inputClass}
          />
        </fieldset>

        <div>
          <label className={labelClass}>Photo</label>
          {existingPhotoUrl && !photoFile && (
            <img
              src={existingPhotoUrl}
              alt=""
              className="mt-2 h-20 w-20 rounded-full border border-white/10 object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="mt-2 block text-sm text-[color:var(--color-text-secondary)]"
          />
          {photoError && <p className="mt-1 text-sm text-[color:var(--color-brand-accent)]">{photoError}</p>}
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

export default MemberForm
