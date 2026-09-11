// Turns the flat members list (as returned by getMembers) into a tree by
// nesting each member under its parent_id. A member with no parent, or
// whose parent_id doesn't match another member in the list, becomes a root.
export function buildMemberTree(members) {
  const nodesById = new Map(members.map((member) => [member.id, { ...member, children: [] }]))
  const roots = []

  for (const node of nodesById.values()) {
    const parent = node.parent_id && nodesById.get(node.parent_id)
    if (parent) {
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}
