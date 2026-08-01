import { useEffect } from 'react'

const ICONS = { success: '✓', error: '✕', warning: '■', info: '■' }
const BORDER = { success: '#10B981', error: '#EF4444', warning: '#F59E0B', info: '#2563EB' }

/**
 * Bottom-right, slide-in, 4s auto-dismiss. Rendered by ToastProvider.
 */
export default function Toast({ message, type = 'info', onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div
      role="status"
      className="animate-[slidein_0.2s_ease-out] flex items-start gap-3 rounded-card bg-white px-4 py-3 shadow-float border-l-[3.5px]"
      style={{ borderLeftColor: BORDER[type] }}
    >
      <span className="font-semibold" style={{ color: BORDER[type] }}>{ICONS[type]}</span>
      <p className="text-sm text-st-text flex-1">{message}</p>
      <button onClick={onDismiss} className="text-st-muted hover:text-st-text text-xs" aria-label="Dismiss">✕</button>
    </div>
  )
}
