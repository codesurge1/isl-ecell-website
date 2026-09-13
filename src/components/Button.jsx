// Solid red fill, no glow — the site's one real primary-action treatment
// going forward. Border radius kept at rounded-md to match every other
// button-shaped element already on the site (admin Save/Add actions, the
// Home hero CTA); sharpening corners here alone would just make Button
// inconsistent with everything it hasn't replaced yet.
function Button({ children, type = 'button', className = '', ...props }) {
  return (
    <button
      type={type}
      className={`rounded-md bg-[color:var(--color-brand-accent)] px-6 py-3 text-sm font-semibold tracking-wide text-white uppercase transition hover:brightness-90 disabled:opacity-60 disabled:hover:brightness-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
