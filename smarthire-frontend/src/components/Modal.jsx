import { useEffect } from 'react'
const widthMap = { sm: 'max-w-sm', lg: 'max-w-lg' }

/** Centered overlay. Dark semi-transparent backdrop. 12px radius. Max-width 480px default. */
export default function Modal({ title, children, onClose, size = 'sm', open = true }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className={`w-full ${widthMap[size] || 'max-w-[480px]'} rounded-modal shadow-modal p-6`}
        style={{ background: 'var(--surface)', color: 'var(--text)' }}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-base font-semibold">{title}</h3>
          <button onClick={onClose} className="text-lg leading-none" style={{ color: 'var(--muted)' }} aria-label="Close">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
