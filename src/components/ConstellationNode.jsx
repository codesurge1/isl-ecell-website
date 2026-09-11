import { useState } from 'react'
import MemberOrb from './MemberOrb.jsx'

const MAX_VISIBLE_CHILDREN = 4

function CollapsedClusterNode({ count, onExpand }) {
  return (
    <button type="button" onClick={onExpand} className="flex flex-col items-center gap-2 bg-transparent">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-[color:var(--color-glow-accent)]/60 bg-[color:var(--color-bg-mid)] text-xs text-[color:var(--color-text-secondary)] shadow-[0_0_8px_2px_rgba(143,217,255,0.15)]">
        +{count}
      </span>
      <span className="text-xs text-[color:var(--color-text-secondary)]">members</span>
    </button>
  )
}

function ConstellationNode({ member, tier }) {
  const [expanded, setExpanded] = useState(false)
  const children = member.children ?? []
  const isCollapsed = children.length > MAX_VISIBLE_CHILDREN && !expanded

  return (
    <div className="flex flex-col items-center">
      <MemberOrb member={member} tier={tier} />

      {children.length > 0 && (
        <>
          <div className="h-6 w-px bg-[color:var(--color-glow-accent)]/40" />
          <div className="relative flex justify-center gap-10 before:absolute before:left-[8%] before:right-[8%] before:top-0 before:border-t before:border-[color:var(--color-glow-accent)]/30">
            {isCollapsed ? (
              <div className="pt-6">
                <CollapsedClusterNode count={children.length} onExpand={() => setExpanded(true)} />
              </div>
            ) : (
              children.map((child) => (
                <div key={child.id} className="flex flex-col items-center pt-6">
                  <ConstellationNode member={child} tier={tier + 1} />
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default ConstellationNode
