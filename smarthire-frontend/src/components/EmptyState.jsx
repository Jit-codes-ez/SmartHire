/** Centred in container. Icon 40px muted, H3 title, body description, optional CTA. */
export default function EmptyState({ icon = '—', title, description, cta }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-4">
      <div className="text-[40px] mb-3" style={{ color: 'var(--muted)' }}>{icon}</div>
      <h3 className="text-base font-semibold mb-1">{title}</h3>
      {description && <p className="text-sm max-w-sm mb-4" style={{ color: 'var(--muted)' }}>{description}</p>}
      {cta}
    </div>
  )
}
