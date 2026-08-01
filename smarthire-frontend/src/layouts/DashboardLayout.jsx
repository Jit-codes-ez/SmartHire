import Navbar from '../components/Navbar.jsx'

/** Navbar → optional sidebar → main area (stat cards row → content). Max width 1440px. */
export default function DashboardLayout({ role, userName, onLogout, title, subtitle, children }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar role={role} userName={userName} onLogout={onLogout} />
      <main className="mx-auto max-w-[1440px] px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  )
}
