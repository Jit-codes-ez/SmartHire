import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import FullWidthListLayout from '../../layouts/FullWidthListLayout.jsx'
import DataTable from '../../components/DataTable.jsx'
import ScoreBadge from '../../components/ScoreBadge.jsx'
import StatusPill from '../../components/StatusPill.jsx'
import AvatarInitials from '../../components/AvatarInitials.jsx'
import Button from '../../components/Button.jsx'
import { applicants, drives } from '../../lib/mockData.js'
import { useToast } from '../../context/ToastContext.jsx'

export default function Applicants() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const drive = drives.find((d) => d.id === id) || drives[0]
  const [rows, setRows] = useState(applicants)

  const ranked = [...rows].sort((a, b) => b.score - a.score)

  const setStatus = (row, status) => {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status } : r)))
    showToast(`${row.name} marked as ${status}.`, 'success')
  }

  const columns = [
    {
      key: 'name',
      label: 'Applicant',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <AvatarInitials name={row.name} size="sm" />
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs muted">{row.college} · {row.degree}</p>
          </div>
        </div>
      ),
    },
    { key: 'score', label: 'Score', sortable: true, render: (row) => <ScoreBadge score={row.score} size="sm" /> },
    { key: 'cgpa', label: 'CGPA', sortable: true },
    { key: 'appliedOn', label: 'Applied' },
    { key: 'status', label: 'Status', render: (row) => <StatusPill status={row.status} size="sm" /> },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="secondary" className="!px-2 !py-1 text-xs" onClick={() => setStatus(row, 'Shortlisted')}>Shortlist</Button>
          <Button variant="danger" className="!px-2 !py-1 text-xs" onClick={() => setStatus(row, 'Rejected')}>Reject</Button>
        </div>
      ),
    },
  ]

  return (
    <FullWidthListLayout
      role="recruiter"
      userName="TCS Recruiter"
      onLogout={() => navigate('/login')}
      title={`Applicants — ${drive.title}`}
      subtitle={<Link to="/recruiter/drives" style={{ color: 'var(--primary)' }}>← Back to My Drives</Link>}
      action={<Button variant="secondary">Download CSV</Button>}
    >
      <DataTable columns={columns} rows={ranked} />
    </FullWidthListLayout>
  )
}
