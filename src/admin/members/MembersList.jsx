import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteMember, getMembers } from '../../lib/queries.js'
import { buildMemberTree } from '../../lib/buildMemberTree.js'
import { deleteFile, getPathFromPublicUrl } from '../../lib/storage.js'

const PHOTO_BUCKET = 'member-photos'

// Flattens the tree in depth-first order with a depth per node, so the
// table can group children under their parent and indent by level —
// cheap hierarchy visualization without a full tree UI.
function flattenWithDepth(members) {
  const tree = buildMemberTree(members)
  const result = []

  function walk(nodes, depth) {
    for (const node of nodes) {
      result.push({ ...node, depth })
      walk(node.children, depth + 1)
    }
  }

  walk(tree, 0)
  return result
}

function MembersList() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    let cancelled = false

    getMembers().then(({ data, error }) => {
      if (cancelled) return
      if (error) {
        setLoadError(error)
      } else {
        setLoadError(null)
        setMembers(data ?? [])
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  async function reloadAfterAction() {
    setLoading(true)
    const { data, error } = await getMembers()
    if (error) {
      setLoadError(error)
    } else {
      setLoadError(null)
      setMembers(data ?? [])
    }
    setLoading(false)
  }

  const membersById = new Map(members.map((member) => [member.id, member]))
  const childCountById = new Map()
  for (const member of members) {
    if (member.parent_id) {
      childCountById.set(member.parent_id, (childCountById.get(member.parent_id) ?? 0) + 1)
    }
  }

  async function handleDelete(member) {
    setActionError(null)
    const childCount = childCountById.get(member.id) ?? 0

    if (childCount > 0) {
      setActionError(
        `${member.name} has ${childCount} direct report${childCount === 1 ? '' : 's'}. Reassign them first.`,
      )
      return
    }

    if (!window.confirm(`Are you sure you want to delete ${member.name}?`)) {
      return
    }

    const { error } = await deleteMember(member.id)
    if (error) {
      setActionError(`Couldn't delete ${member.name}. Please try again.`)
      return
    }

    if (member.photo_url) {
      const path = getPathFromPublicUrl(PHOTO_BUCKET, member.photo_url)
      if (path) {
        await deleteFile(PHOTO_BUCKET, path)
      }
    }

    reloadAfterAction()
  }

  const rows = flattenWithDepth(members)

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl text-[color:var(--color-text-primary)]">Manage Members</h1>
        <Link
          to="/admin/members/new"
          className="whitespace-nowrap rounded-md bg-[color:var(--color-brand-accent)] px-4 py-2 text-sm text-[color:var(--color-text-primary)]"
        >
          Add member
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
          Couldn't load members right now. Please try again later.
        </p>
      )}

      {!loading && !loadError && rows.length === 0 && (
        <p className="mt-6 text-[color:var(--color-text-secondary)]">No members yet.</p>
      )}

      {!loading && !loadError && rows.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[color:var(--color-text-secondary)]">
                <th className="py-2 pr-4 font-normal">Name</th>
                <th className="py-2 pr-4 font-normal">Role</th>
                <th className="py-2 pr-4 font-normal">Domain</th>
                <th className="py-2 pr-4 font-normal">Reports to</th>
                <th className="py-2 pr-4 font-normal" />
              </tr>
            </thead>
            <tbody>
              {rows.map((member) => (
                <tr key={member.id} className="border-b border-white/5 text-[color:var(--color-text-primary)]">
                  <td className="py-2 pr-4" style={{ paddingLeft: member.depth * 20 }}>
                    {member.name}
                  </td>
                  <td className="py-2 pr-4 text-[color:var(--color-text-secondary)]">{member.role || '—'}</td>
                  <td className="py-2 pr-4 text-[color:var(--color-text-secondary)]">{member.domain || '—'}</td>
                  <td className="py-2 pr-4 text-[color:var(--color-text-secondary)]">
                    {member.parent_id
                      ? (membersById.get(member.parent_id)?.name ?? 'Unknown')
                      : 'No one (top of hierarchy)'}
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    <Link
                      to={`/admin/members/${member.id}/edit`}
                      className="text-[color:var(--color-glow-accent)] hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(member)}
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

export default MembersList
