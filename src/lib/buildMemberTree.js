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

function findNode(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node
    const found = findNode(node.children, id)
    if (found) return found
  }
  return null
}

// Collects the ids of every descendant of the member with the given id, by
// building the tree (via buildMemberTree above) and walking down from that
// member's node. Used to block "Reports to" reassignments that would
// create a cycle — a member can never report to one of its own reports.
export function getDescendantIds(members, memberId) {
  const target = findNode(buildMemberTree(members), memberId)
  const ids = new Set()
  if (!target) return ids

  function collect(node) {
    for (const child of node.children) {
      ids.add(child.id)
      collect(child)
    }
  }
  collect(target)
  return ids
}
