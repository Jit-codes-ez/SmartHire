import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FullWidthListLayout from '../../layouts/FullWidthListLayout.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import StatusPill from '../../components/StatusPill.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { jobs } from '../../lib/mockData.js'

export default function BrowseJobs() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () => jobs.filter((j) => `${j.title} ${j.company}`.toLowerCase().includes(query.toLowerCase())),
    [query]
  )

  return (
    <FullWidthListLayout
      role="student"
      userName="Jit Hazra"
      onLogout={() => navigate('/login')}
      title="Browse Jobs"
      subtitle="Open job drives from top companies."
      filters={
        <input
          className="input max-w-sm"
          placeholder="Search by company or role..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      }
    >
      {filtered.length === 0 ? (
        <EmptyState title="No drives match your search" description="Try a different company or role name." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((job) => (
            <Card key={job.id}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{job.title}</h3>
                <StatusPill status={job.status} size="sm" />
              </div>
              <p className="text-sm muted mb-2">{job.company}</p>
              <p className="text-xs muted mb-1">Required: {job.skills.join(', ')}</p>
              <p className="text-xs muted mb-4">
                CGPA Cutoff: {job.cgpaCutoff} · Deadline: {job.deadline} · Openings: {job.openings} · {job.location}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  disabled={job.status !== 'Open'}
                  onClick={() => navigate(`/student/jobs/${job.id}`)}
                >
                  {job.status === 'Open' ? 'View Details' : 'Closed'}
                </Button>
                <Button variant="secondary">Save Job</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </FullWidthListLayout>
  )
}
