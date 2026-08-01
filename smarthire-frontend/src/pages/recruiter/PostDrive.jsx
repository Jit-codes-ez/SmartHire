import { useNavigate } from 'react-router-dom'
import CenteredFormLayout from '../../layouts/CenteredFormLayout.jsx'
import Button from '../../components/Button.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function PostDrive() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    showToast('Drive posted successfully!', 'success')
    navigate('/recruiter/drives')
  }

  return (
    <CenteredFormLayout
      role="recruiter"
      userName="TCS Recruiter"
      onLogout={() => navigate('/login')}
      title="Post a Drive"
      subtitle="Fill in the details for your new job drive."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Job Title</label>
          <input className="input" placeholder="Software Engineer" required />
        </div>
        <div>
          <label className="label">Required Skills (comma separated)</label>
          <input className="input" placeholder="Java, Spring Boot, MySQL, REST APIs" required />
        </div>
        <div>
          <label className="label">Minimum CGPA Cutoff</label>
          <input className="input" type="number" step="0.1" placeholder="7.5" required />
        </div>
        <div>
          <label className="label">Application Deadline</label>
          <input className="input" type="date" required />
        </div>
        <Button type="submit" className="w-full">Post Drive</Button>
      </form>
    </CenteredFormLayout>
  )
}
