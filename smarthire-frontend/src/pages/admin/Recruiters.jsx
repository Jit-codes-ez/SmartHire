import { useNavigate } from 'react-router-dom'
import FullWidthListLayout from '../../layouts/FullWidthListLayout.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { pendingRecruiters } from '../../lib/mockData.js'
import { useToast } from '../../context/ToastContext.jsx'
import { useState } from 'react'

export default function Recruiters() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [rows, setRows] = useState(pendingRecruiters)

  const resolve = (id, company, action) => {
    setRows((prev) => prev.filter((r) => r.id !== id))
    showToast(`${company} ${action}.`, action === 'approved' ? 'success' : 'error')
  }

  return (
    <FullWidthListLayout
      role="admin"
      userName="Admin"
      onLogout={() => navigate('/login')}
      title="Recruiters"
      subtitle="Manage recruiter accounts awaiting approval."
    >
      {rows.length === 0 ? (
        <EmptyState title="No pending recruiters" description="New recruiter sign-ups will show up here for review." />
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <Card key={r.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{r.name} — {r.company}</p>
                <p className="text-xs muted">{r.email} · Requested {r.requestedOn}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => resolve(r.id, r.company, 'approved')}>Approve Recruiter</Button>
                <Button variant="danger" onClick={() => resolve(r.id, r.company, 'blocked')}>Block Account</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </FullWidthListLayout>
  )
}
