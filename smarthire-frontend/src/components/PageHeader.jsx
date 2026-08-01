/** Title H1 + muted subtitle + optional action button. Thin bottom border, no card wrap. */
export default function PageHeader({ title, subtitle, action }) {
  return (
    <div
      className="flex items-start justify-between gap-4 pb-4 mb-6 border-b"
      style={{ borderColor: 'var(--border)' }}
    >
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
