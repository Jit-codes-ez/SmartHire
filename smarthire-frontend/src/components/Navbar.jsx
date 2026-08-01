import { NavLink } from 'react-router-dom'

const LINKS = {
  student: [
    { to: '/student/jobs', label: 'Browse Jobs' },
    { to: '/student/applications', label: 'My Applications' },
  ],
  recruiter: [
    { to: '/recruiter/drives', label: 'My Drives' },
    { to: '/recruiter/drives/new', label: 'Post a Drive' },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/students', label: 'Students' },
    { to: '/admin/recruiters', label: 'Recruiters' },
  ],
}

/**
 * Sticky top nav. Logo left, links centre, CTA/actions right.
 * Active link gets a 2px underline in the portal's primary colour.
 */
export default function Navbar({ role, userName, onLogout }) {
  const links = LINKS[role] || []
  const isDark = role === 'admin'

  return (
    <header
      className="sticky top-0 z-10 border-b"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="mx-auto max-w-[1440px] px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="font-bold text-base tracking-tight" style={{ color: 'var(--primary)' }}>
            SmartHire
          </span>
          <nav className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium pb-1 border-b-2 transition-colors ${
                    isActive ? '' : 'border-transparent'
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? 'var(--primary)' : 'var(--muted)',
                  borderColor: isActive ? 'var(--primary)' : 'transparent',
                })}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {userName && (
            <span className={`text-sm hidden sm:inline ${isDark ? '' : ''}`} style={{ color: 'var(--muted)' }}>
              {userName}
            </span>
          )}
          <button
            onClick={onLogout}
            className="text-sm font-medium"
            style={{ color: 'var(--muted)' }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
