import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import FullWidthListLayout from '../../layouts/FullWidthListLayout.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { authFetch } from '../../lib/authFetch.js'

export default function MyDrives() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const storedRecruiter = localStorage.getItem('recruiter')
  let loginData = null
  try {
    loginData = storedRecruiter ? JSON.parse(storedRecruiter) : null
  } catch {
    console.error('Invalid recruiter data')
  }

  const [drives, setDrives] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    if (!loginData?.email) {
      navigate('/login')
      return
    }

    const loadDrives = async () => {
      try {
        setLoading(true)
        const res = await authFetch(
          `/api/recruiter/jobs/${encodeURIComponent(loginData.email)}`
        )
        if (!res.ok) throw new Error('Failed to load drives')
        const data = await res.json()
        setDrives(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error(error)
        showToast('Unable to load drives.', 'error')
      } finally {
        setLoading(false)
      }
    }

    loadDrives()
  }, [navigate, showToast, loginData?.email])

  const handleLogout = () => {
    localStorage.removeItem('recruiter')
    window.dispatchEvent(new Event('authChange'))
    navigate('/login')
  }

  // ── Derived counts ─────────────────────────────────────────────────────────
  const totalDrives   = drives.length

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = drives.filter((d) => {
    const matchesSearch =
      !search ||
      d.title?.toLowerCase().includes(search.toLowerCase()) ||
      d.location?.toLowerCase().includes(search.toLowerCase()) ||
      d.employmentType?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'ALL' ||
      d.status === statusFilter ||
      (statusFilter === 'ACTIVE' && d.status === 'OPEN')

    return matchesSearch && matchesStatus
  })

  return (
    <FullWidthListLayout
      role="recruiter"
      userName={loginData?.name || 'Recruiter'}
      onLogout={handleLogout}
      title="My Drives"
      subtitle="All job drives you've posted."
    >

      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-st-muted"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
  />
</svg>
          <input
            type="text"
            placeholder="Search by title, location, type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-8 pr-3 text-sm border border-st-border rounded-full bg-white text-st-text placeholder:text-st-muted focus:outline-none focus:border-st-primary focus:ring-2 focus:ring-st-primary/15 transition"
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1 bg-st-border/30 rounded-full p-1 text-xs font-medium">
          {['ALL', 'ACTIVE', 'INACTIVE'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full transition-colors ${
                statusFilter === s
                  ? 'bg-white text-st-primary shadow-sm'
                  : 'text-st-muted hover:text-st-text'
              }`}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <Card>
        {loading ? (
          <div className="py-16 text-center">
            <p className="text-st-muted text-sm">Loading drives…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <svg
  className="w-10 h-10 text-st-muted mx-auto mb-3"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth={1.5}
  stroke="currentColor"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"
  />
</svg>
            <p className="font-semibold text-st-text">
              {drives.length === 0 ? 'No drives posted yet' : 'No results match your filters'}
            </p>
            <p className="text-sm text-st-muted mt-1 mb-5">
              {drives.length === 0
                ? 'Post your first drive to start receiving applicants.'
                : 'Try adjusting your search or filter.'}
            </p>
            {drives.length === 0 && (
              <Button onClick={() => navigate('/recruiter/drives/new')}>
                Post Your First Drive
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-st-border">
                  {[
                    'Job Title',
                    'Location',
                    'Type',
                    'Experience',
                    'Salary',
                    'Deadline',
                    'Status',
                    'Actions',
                  ].map((col) => (
                    <th
                      key={col}
                      className="text-left py-3 px-3 text-st-muted font-medium text-xs uppercase tracking-wide whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => {
                  const isActive = d.status === 'ACTIVE' || d.status === 'OPEN'
                  const deadlinePassed =
                    d.applicationDeadline && new Date(d.applicationDeadline) < new Date()

                  return (
                    <tr
                      key={d.id}
                      className="border-b border-st-border/50 hover:bg-st-border/20 transition-colors"
                    >
                      {/* Title */}
                      <td className="py-4 px-3">
                        <p className="font-semibold text-st-text leading-tight">{d.title}</p>
                        {d.department && (
                          <p className="text-xs text-st-muted mt-0.5">{d.department}</p>
                        )}
                      </td>

                      {/* Location */}
                      <td className="py-4 px-3 text-st-muted whitespace-nowrap">
                        {d.location || '—'}
                      </td>

                      {/* Type */}
                      <td className="py-4 px-3 text-st-text whitespace-nowrap">
                        {d.employmentType || '—'}
                      </td>

                      {/* Experience */}
                      <td className="py-4 px-3 text-st-muted whitespace-nowrap">
                        {d.experienceRequired + " yrs" || d.experienceLevel + " yrs" || '—'}
                      </td>

                      {/* Salary */}
                      <td className="py-4 px-3 text-st-muted whitespace-nowrap">
                        {d.salary ? `${d.salary} LPA` : '—'}
                      </td>

                      {/* Deadline */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        {d.applicationDeadline ? (
                          <span
                            className={`text-xs font-medium ${
                              deadlinePassed ? 'text-red-500' : 'text-st-muted'
                            }`}
                          >
                            {new Date(d.applicationDeadline).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                            {deadlinePassed && (
                              <span className="ml-1 text-red-400">(Expired)</span>
                            )}
                          </span>
                        ) : (
                          <span className="text-st-muted">—</span>
                        )}
                      </td>

                      {/* Status pill */}
                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          />
                          {d.status || 'ACTIVE'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/recruiter/drives/${d.id}/applicants`)}
                            className="text-xs px-3 py-1.5 rounded-full border border-st-primary text-st-primary hover:bg-st-primary/10 transition-colors font-medium whitespace-nowrap"
                          >
                            View Applicants
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Footer row */}
            <div className="flex items-center justify-between px-3 pt-3 pb-1 border-t border-st-border mt-1">
              <p className="text-xs text-st-muted">
                Showing {filtered.length} of {totalDrives} drive{totalDrives !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}
      </Card>
    </FullWidthListLayout>
  )
}