import Navbar from '../components/Navbar.jsx'

/** Navbar (optional) → centered card, max 480px → form → submit. */
export default function CenteredFormLayout({ title, subtitle, children, role, userName, onLogout }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {role && <Navbar role={role} userName={userName} onLogout={onLogout} />}
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[480px] card">
          {!role && (
            <div className="mb-6">
              <span className="font-bold text-lg" style={{ color: 'var(--primary)' }}>SmartHire</span>
            </div>
          )}
          {title && <h1 className="text-xl font-semibold mb-1">{title}</h1>}
          {subtitle && <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  )
}
