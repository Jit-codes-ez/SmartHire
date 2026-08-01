const sizeMap = { sm: 16, md: 24, lg: 36 }

/** Thin ring spinner, centred in its container. No full-page spinners. */
export default function LoadingSpinner({ size = 'md' }) {
  const px = sizeMap[size]
  return (
    <div className="flex items-center justify-center p-4">
      <div
        className="animate-spin rounded-full border-2 border-current border-t-transparent"
        style={{ width: px, height: px, color: 'var(--primary)' }}
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}
