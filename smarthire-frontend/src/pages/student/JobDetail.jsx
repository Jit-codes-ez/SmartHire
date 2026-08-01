import { useState, Fragment } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import DetailLayout from '../../layouts/DetailLayout.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import StatusPill from '../../components/StatusPill.jsx'
import Modal from '../../components/Modal.jsx'
import { jobs } from '../../lib/mockData.js'
import { useToast } from '../../context/ToastContext.jsx'

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const job = jobs.find((j) => j.id === id) || jobs[0]
  const [applyOpen, setApplyOpen] = useState(false)
  const [resume, setResume] = useState('')

  const handleApply = (e) => {
    e.preventDefault()
    setApplyOpen(false)
    showToast('Application submitted successfully! Resume score will be calculated shortly.', 'success')
    navigate('/student/applications')
  }

  return (
    <Fragment>
    <DetailLayout
      role="student"
      userName="Jit Hazra"
      onLogout={() => navigate('/login')}
      breadcrumb={<Link to="/student/jobs" style={{ color: 'var(--primary)' }}>Browse Jobs</Link>}
      main={
        <Card>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold">{job.title}</h1>
              <p className="text-sm muted mt-1">{job.company}</p>
            </div>
            <StatusPill status={job.status} />
          </div>
          <p className="text-sm mb-4">{job.description}</p>
          <h3 className="text-sm font-semibold mb-1">Required Skills</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.map((s) => (
              <span key={s} className="text-xs px-2 py-1 rounded-badge" style={{ background: 'var(--border)' }}>{s}</span>
            ))}
          </div>
          <p className="text-xs muted">
            CGPA Cutoff: {job.cgpaCutoff} · Deadline: {job.deadline} · Openings: {job.openings} · Location: {job.location}
          </p>
        </Card>
      }
      sidebar={
        <Card>
          <h3 className="text-sm font-semibold mb-3">Ready to apply?</h3>
          <Button className="w-full" disabled={job.status !== 'Open'} onClick={() => setApplyOpen(true)}>
            {job.status === 'Open' ? 'Apply Now' : 'Closed'}
          </Button>
        </Card>
      }
    />
    <Modal open={applyOpen} title={`Apply for ${job.title}`} onClose={() => setApplyOpen(false)}>
      <form onSubmit={handleApply} className="space-y-4">
        <div>
          <label className="label">Full Name</label>
          <input className="input" defaultValue="Jit Hazra" />
        </div>
        <div>
          <label className="label">Email Address</label>
          <input className="input" defaultValue="jit@email.com" />
        </div>
        <div>
          <label className="label">Upload Resume (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            className="input"
            onChange={(e) => setResume(e.target.files?.[0]?.name || '')}
          />
          {resume && <p className="text-xs mt-1" style={{ color: '#10B981' }}>{resume} ✓</p>}
        </div>
        <Button type="submit" className="w-full">Submit Application</Button>
      </form>
    </Modal>
    </Fragment>
  )
}
