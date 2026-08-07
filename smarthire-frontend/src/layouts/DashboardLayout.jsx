
export default function DashboardLayout({
  role,
  userName,
  onLogout,
  title,
  subtitle,
  children,
}) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <main className="mx-auto max-w-[1440px] px-6 py-8">
        {(title || subtitle) && (
          <div className="mb-6">
            {title && <h1 className="text-2xl font-bold">{title}</h1>}
            {subtitle && (
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}