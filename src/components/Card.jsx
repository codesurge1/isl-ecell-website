function Card({ children }) {
  return (
    <div className="rounded-lg bg-[color:var(--color-bg-mid)] p-4 text-[color:var(--color-text-secondary)]">
      {children}
    </div>
  )
}

export default Card
