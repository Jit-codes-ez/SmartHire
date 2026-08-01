import Navbar from '../components/Navbar.jsx'
import PageHeader from '../components/PageHeader.jsx'

/** Navbar → PageHeader → search/filter bar → content (card grid or table). Max width 1200px. */
export default function FullWidthListLayout({ role, userName, onLogout, title, subtitle, action, filters, children }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar role={role} userName={userName} onLogout={onLogout} />
      <main className="mx-auto max-w-[1200px] px-6 py-8">
        <PageHeader title={title} subtitle={subtitle} action={action} />
        {filters && <div className="mb-6">{filters}</div>}
        {children}
      </main>
    </div>
  )
}
