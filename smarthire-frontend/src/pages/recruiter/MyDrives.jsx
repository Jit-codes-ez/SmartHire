import { useNavigate } from 'react-router-dom'
import FullWidthListLayout from '../../layouts/FullWidthListLayout.jsx'
import Card from '../../components/Card.jsx'
import StatusPill from '../../components/StatusPill.jsx'
import Button from '../../components/Button.jsx'
import { drives } from '../../lib/mockData.js'

export default function MyDrives() {
  const navigate = useNavigate()

  return (
    <FullWidthListLayout
      role="recruiter"
      userName="TCS Recruiter"
      onLogout={() => navigate('/login')}
      title="My Drives"
      subtitle="All job drives you've posted."
      action={<Button onClick={() => navigate('/recruiter/drives/new')}>Post a Drive</Button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drives.map((d) => (
          <Card key={d.id}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold">{d.title}</h3>
              <StatusPill status={d.status} size="sm" />
            </div>
            <p className="text-sm muted mb-3">{d.company}</p>
            <p className="text-xs muted mb-4">Deadline {d.deadline} · {d.applicants} applicants</p>
            <div className="flex gap-2">
              <Button onClick={() => navigate(`/recruiter/drives/${d.id}/applicants`)}>View Applicants</Button>
              <Button variant="secondary">Download CSV</Button>
            </div>
          </Card>
        ))}
      </div>
    </FullWidthListLayout>
  )
}
