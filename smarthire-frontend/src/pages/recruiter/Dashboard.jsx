import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import StatusPill from '../../components/StatusPill.jsx'
import ScoreBadge from '../../components/ScoreBadge.jsx'
import { drives, applicants } from '../../lib/mockData.js'

export default function Dashboard() {
  const navigate = useNavigate()
  const topApplicants = [...applicants].sort((a, b) => b.score - a.score).slice(0, 3)
  const totalApplicants = drives.reduce((sum, d) => sum + d.applicants, 0)

  return (
    <DashboardLayout
      role="recruiter"
      userName="TCS Recruiter"
      onLogout={() => navigate('/login')}
      title="Recruiter Dashboard"
      subtitle="Overview of your drives and applicants."
    >
      <div className="flex justify-end mb-6 -mt-14 relative z-[1]">
        <Button onClick={() => navigate('/recruiter/drives/new')}>Post a Drive</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Card><p className="text-xs muted mb-1">Active Drives</p><p className="text-2xl font-bold font-mono">{drives.filter(d=>d.status==='Open').length}</p></Card>
        <Card><p className="text-xs muted mb-1">Total Applicants</p><p className="text-2xl font-bold font-mono">{totalApplicants}</p></Card>
        <Card><p className="text-xs muted mb-1">Shortlisted</p><p className="text-2xl font-bold font-mono">{applicants.filter(a=>a.status==='Shortlisted').length}</p></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-lg font-semibold mb-3">My Drives</h2>
          <div className="space-y-3">
            {drives.map((d) => (
              <Card key={d.id} className="cursor-pointer" onClick={() => navigate(`/recruiter/drives/${d.id}/applicants`)}>
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium text-sm">{d.title} — {d.company}</p>
                  <StatusPill status={d.status} size="sm" />
                </div>
                <p className="text-xs muted">Deadline {d.deadline} · {d.applicants} applicants</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Top Applicants</h2>
          <div className="space-y-3">
            {topApplicants.map((a) => (
              <Card key={a.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{a.name}</p>
                  <p className="text-xs muted mt-0.5">{a.college} · {a.degree}</p>
                </div>
                <ScoreBadge score={a.score} size="sm" />
              </Card>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
