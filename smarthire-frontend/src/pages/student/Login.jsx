import { useNavigate } from 'react-router-dom'
import CenteredFormLayout from '../../layouts/CenteredFormLayout.jsx'
import Button from '../../components/Button.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    showToast('Logged in successfully!', 'success')
    navigate('/student/dashboard')
  }

  return (
    <CenteredFormLayout title="Welcome back" subtitle="Log in to continue to SmartHire.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">Email Address</label>
          <input id="email" type="email" className="input" placeholder="jit@email.com" required />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" className="input" placeholder="••••••••" required />
        </div>
        <Button type="submit" className="w-full">Log In</Button>
      </form>

      <div className="mt-6 pt-4 border-t text-xs text-center space-y-2" style={{ borderColor: 'var(--border)' }}>
        <p className="muted">Demo shortcuts — jump straight into a portal:</p>
        <div className="flex justify-center gap-3">
          <button className="underline" style={{ color: 'var(--primary)' }} onClick={() => navigate('/recruiter/dashboard')}>Recruiter</button>
          <button className="underline" style={{ color: 'var(--primary)' }} onClick={() => navigate('/admin/dashboard')}>Admin</button>
        </div>
      </div>
    </CenteredFormLayout>
  )
}
