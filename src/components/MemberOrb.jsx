import { useNavigate } from 'react-router-dom'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion.js'
import { useImageFallback } from '../lib/use-image-fallback.js'
import GlowOrb from './GlowOrb.jsx'

// tier 0 = root (President-level), tier 1 = direct children (domain heads),
// tier 2+ = everyone deeper (volunteers) — falls back to the smallest style.
// Frames are 105x148 portrait rectangles at tier 0 (matching MemberProfile's
// photo treatment), scaled down per tier at the same relative proportions
// the old circular sizes used (144 -> 84 -> 56).
const TIER_STYLES = {
  0: {
    wrapper: 'h-[148px] w-[105px]',
    ring: 'border border-[color:var(--color-glow-accent)]/90 shadow-[0_0_14px_2px_rgba(var(--color-glow-accent-rgb),0.9),0_0_34px_8px_rgba(var(--color-glow-accent-rgb),0.5),0_0_64px_16px_rgba(var(--color-glow-accent-rgb),0.22)]',
    text: 'text-xl',
  },
  1: {
    wrapper: 'h-[86px] w-[61px]',
    ring: 'border border-[color:var(--color-glow-accent)]/70 shadow-[0_0_9px_1px_rgba(var(--color-glow-accent-rgb),0.7),0_0_22px_5px_rgba(var(--color-glow-accent-rgb),0.38),0_0_42px_10px_rgba(var(--color-glow-accent-rgb),0.16)]',
    text: 'text-sm',
  },
}
const DEFAULT_TIER_STYLE = {
  wrapper: 'h-[58px] w-[41px]',
  ring: 'border border-[color:var(--color-glow-accent)]/45 shadow-[0_0_6px_1px_rgba(var(--color-glow-accent-rgb),0.45),0_0_16px_3px_rgba(var(--color-glow-accent-rgb),0.2)]',
  text: 'text-xs',
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function MemberOrb({ member, tier }) {
  const navigate = useNavigate()
  const prefersReducedMotion = usePrefersReducedMotion()
  const { showImage, onError } = useImageFallback(member.photo_url)
  const style = TIER_STYLES[tier] ?? DEFAULT_TIER_STYLE

  const hoverAnimation = prefersReducedMotion
    ? { filter: 'brightness(1.2)', transition: { duration: 0 } }
    : { scale: 1.08, filter: 'brightness(1.25)', transition: { duration: 0.2 } }

  return (
    <button
      type="button"
      onClick={() => navigate(`/team/${member.id}`)}
      className="flex flex-col items-center gap-2 bg-transparent"
    >
      <GlowOrb
        wrapperClassName={style.wrapper}
        ringClassName={style.ring}
        pulseSeed={member.id}
        hoverAnimation={hoverAnimation}
      >
        {showImage ? (
          <img
            src={member.photo_url}
            alt={member.name}
            onError={onError}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className={`font-heading text-[color:var(--color-text-muted)] ${style.text}`}>
            {getInitials(member.name)}
          </span>
        )}
      </GlowOrb>
      <span className="max-w-28 text-center text-xs text-[color:var(--color-text-muted)]">
        {member.name}
      </span>
    </button>
  )
}

export default MemberOrb
