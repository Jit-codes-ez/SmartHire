const STATUS_STYLES = {
  Applied:               { text: '#1E40AF', bg: '#DBEAFE' },
  'Under Review':        { text: '#92400E', bg: '#FEF3C7' },
  Shortlisted:           { text: '#065F46', bg: '#D1FAE5' },
  'Interview Scheduled': { text: '#1D4ED8', bg: '#EFF6FF' },
  Selected:              { text: '#14532D', bg: '#BBF7D0' },
  Rejected:              { text: '#991B1B', bg: '#FEE2E2' },
  Placed:                { text: '#14532D', bg: '#BBF7D0' },
  Open:                  { text: '#065F46', bg: '#D1FAE5' },
  Closed:                { text: '#78716C', bg: '#E7E5E4' },
  Pending:               { text: '#92400E', bg: '#FEF3C7' },
}

/** Small filled pill — never outline. */
export default function StatusPill({ status, size = 'md' }) {
  const style = STATUS_STYLES[status] || { text: '#374151', bg: '#E5E7EB' }
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses}`}
      style={{ background: style.bg, color: style.text }}
    >
      {status}
    </span>
  )
}
