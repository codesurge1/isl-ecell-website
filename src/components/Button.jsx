function Button({ children, onClick, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="rounded-md bg-[color:var(--color-brand-accent)] px-4 py-2 font-heading text-[color:var(--color-text-primary)]"
    >
      {children}
    </button>
  )
}

export default Button
