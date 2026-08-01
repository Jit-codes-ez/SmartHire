import { useNavigate } from 'react-router-dom'
import FullWidthListLayout from '../../layouts/FullWidthListLayout.jsx'
import Card from '../../components/Card.jsx'
import StatusPill from '../../components/StatusPill.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import Button from '../../components/Button.jsx'
import { applications } from '../../lib/mockData.js'

const STAGES = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected']

function Timeline({ status }) {
  if (status === 'Rejected') {
    return <p className="text-xs" style={{ color: '#991B1B' }}>Rejected</p>
  }
  const activeIndex = STAGES.indexOf(status)
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {STAGES.map((stage, i) => (
        <span key={stage} className="flex items-center gap-1">
          <span
            className="text-[11px] px-2 py-0.5 rounded-full"
            style={{
              background: i <= activeIndex ? 'var(--primary)' : 'var(--border)',
              color: i <= activeIndex ? 'white' : 'var(--muted)',
            }}
          >
            {stage}
          </span>
          {i < STAGES.length - 1 && <span className="muted">→</span>}
        </span>
      ))}
    </div>
  )
}

export default function MyApplications() {
  const navigate = useNavigate()

  return (
    <FullWidthListLayout
      role="student"
      userName="Jit Hazra"
      onLogout={() => navigate('/login')}
      title="My Applications"
      subtitle="Track the status of every drive you've applied to."
    >
      {applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Once you apply to a drive, you'll be able to track its status here."
          cta={<Button onClick={() => navigate('/student/jobs')}>Browse Jobs</Button>}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-sm">{app.job}</p>
                  <p className="text-xs muted mt-0.5">Applied on {app.appliedOn}</p>
                </div>
                <StatusPill status={app.status} size="sm" />
              </div>
              <Timeline status={app.status} />
            </Card>
          ))}
        </div>
      )}
    </FullWidthListLayout>
  )
}
