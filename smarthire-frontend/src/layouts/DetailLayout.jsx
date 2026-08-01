import Navbar from '../components/Navbar.jsx'

/** Navbar → breadcrumb → two columns: main content 65% + sidebar 35%. Max width 1200px. */
export default function DetailLayout({ role, userName, onLogout, breadcrumb, main, sidebar }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar role={role} userName={userName} onLogout={onLogout} />
      <main className="mx-auto max-w-[1200px] px-6 py-8">
        {breadcrumb && <div className="text-sm mb-4" style={{ color: 'var(--muted)' }}>{breadcrumb}</div>}
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">
          <div>{main}</div>
          <div>{sidebar}</div>
        </div>
      </main>
    </div>
  )
}
