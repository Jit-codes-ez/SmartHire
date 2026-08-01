import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { branchPlacement, activityFeed, pendingRecruiters } from '../../lib/mockData.js'
import { useToast } from '../../context/ToastContext.jsx'

const stats = [
  { label: 'Total Students', value: '1,248' },
  { label: 'Placed', value: '876' },
  { label: 'Drives Active', value: '14' },
  { label: 'Placement %', value: '70.2%' },
]

function BranchBar({ branch, rate }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span>{branch}</span>
        <span className="font-mono" style={{ color: 'var(--muted)' }}>{rate}%</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: 'var(--border)' }}>
        <div className="h-2 rounded-full" style={{ width: `${rate}%`, background: 'var(--primary)' }} />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  return (
    <DashboardLayout
      role="admin"
      userName="Admin"
      onLogout={() => navigate('/login')}
      title="Placement Dashboard"
      subtitle="System-wide overview of students, drives, and recruiters."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-xs muted mb-1">{s.label}</p>
            <p className="text-2xl font-bold font-mono">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h2 className="text-base font-semibold mb-4">Placements by Branch</h2>
          {branchPlacement.map((b) => (
            <BranchBar key={b.branch} {...b} />
          ))}
        </Card>

        <Card>
          <h2 className="text-base font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {activityFeed.map((a, i) => (
              <li key={i} className="text-xs pb-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                {a}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="text-base font-semibold mb-4">Pending Approvals</h2>
        <div className="space-y-3">
          {pendingRecruiters.map((r) => (
            <div key={r.id} className="flex items-center justify-between pb-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-sm font-medium">{r.name} — {r.company}</p>
                <p className="text-xs muted">{r.email} · Requested {r.requestedOn}</p>
              </div>
              <div className="flex gap-2">
                <Button className="!px-3 !py-1.5 text-xs" onClick={() => showToast(`${r.company} approved.`, 'success')}>Approve</Button>
                <Button variant="danger" className="!px-3 !py-1.5 text-xs" onClick={() => showToast(`${r.company} blocked.`, 'error')}>Block</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  )
}
