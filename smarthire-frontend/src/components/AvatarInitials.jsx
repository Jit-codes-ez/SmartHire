const sizeMap = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' }

function initialsOf(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')
}

/** Circle with initials. Bg: primary @15% opacity, text: primary. */
export default function AvatarInitials({ name, size = 'md' }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold shrink-0 ${sizeMap[size]}`}
      style={{ background: 'color-mix(in srgb, var(--primary) 15%, transparent)', color: 'var(--primary)' }}
    >
      {initialsOf(name)}
    </div>
  )
}
