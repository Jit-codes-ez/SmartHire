import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import StatusPill from '../../components/StatusPill.jsx'
import { applications, jobs } from '../../lib/mockData.js'

const stats = [
  { label: 'Applied', value: 3 },
  { label: 'Shortlisted', value: 2 },
  { label: 'Interview', value: 1 },
  { label: 'Selected', value: 0 },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const recommended = jobs.filter((j) => j.status === 'Open').slice(0, 2)

  return (
    <DashboardLayout role="student" userName="Jit Hazra" onLogout={() => navigate('/login')}
      title="Welcome back, Jit!" subtitle="Here's what's happening with your applications.">

      <div className="flex justify-end mb-6 -mt-14 relative z-[1]">
        <Button onClick={() => navigate('/student/jobs')}>Browse Open Drives</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-xs muted mb-1">{s.label}</p>
            <p className="text-2xl font-bold font-mono">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-lg font-semibold mb-3">Active Applications</h2>
          <div className="space-y-3">
            {applications.map((app) => (
              <Card key={app.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{app.job}</p>
                  <p className="text-xs muted mt-0.5">Applied {app.appliedOn}</p>
                </div>
                <StatusPill status={app.status} size="sm" />
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Recommended Drives</h2>
          <div className="space-y-3">
            {recommended.map((job) => (
              <Card key={job.id} className="cursor-pointer" onClick={() => navigate(`/student/jobs/${job.id}`)}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{job.title}</p>
                    <p className="text-xs muted mt-0.5">{job.company}</p>
                  </div>
                  <StatusPill status={job.status} size="sm" />
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
