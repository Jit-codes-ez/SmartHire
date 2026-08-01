/**
 * 0-40 red · 41-70 amber · 71-100 green. Mono font for the number.
 */
export default function ScoreBadge({ score, size = 'md' }) {
  const tier =
    score <= 40
      ? { bg: '#FEE2E2', text: '#991B1B' }
      : score <= 70
      ? { bg: '#FEF3C7', text: '#92400E' }
      : { bg: '#D1FAE5', text: '#065F46' }

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'

  return (
    <span
      className={`inline-flex items-center rounded-badge font-mono font-semibold ${sizeClasses}`}
      style={{ background: tier.bg, color: tier.text }}
    >
      {score}/100
    </span>
  )
}
