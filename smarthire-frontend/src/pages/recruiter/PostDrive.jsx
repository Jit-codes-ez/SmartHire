import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { authFetch } from '../../lib/authFetch.js'

const inputClass =
  "w-full h-10 px-3 rounded-input border border-rc-border bg-white text-sm placeholder:text-rc-muted transition-all duration-300 hover:border-rc-primary hover:shadow-sm focus:outline-none focus:border-rc-primary focus:ring-4 focus:ring-rc-primary/15"

const textareaClass =
  "w-full px-3 py-2 rounded-input border border-rc-border bg-white text-sm placeholder:text-rc-muted transition-all duration-300 hover:border-rc-primary hover:shadow-sm focus:outline-none focus:border-rc-primary focus:ring-4 focus:ring-rc-primary/15 resize-none"

const EMPLOYMENT_TYPES = ['Full-Time', 'Part-Time', 'Internship', 'Contract']
const storedRecruiter = localStorage.getItem("recruiter");
const loginData = storedRecruiter ? JSON.parse(storedRecruiter) : null;

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {children}
    </div>
  )
}

export default function PostDrive() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    employmentType: '',
    experienceRequired: '',
    salary: '',
    skills: '',
    applicationDeadline: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setSubmitting(true)

  try {
    const storedRecruiter = localStorage.getItem("recruiter")
    const loginData = storedRecruiter ? JSON.parse(storedRecruiter) : null

    if (!loginData?.email) {
      throw new Error("Recruiter email not found")
    }

    const response = await authFetch(
      `/api/recruiter/drives/${encodeURIComponent(loginData.email)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Post drive error:', errorText)
      throw new Error('Failed to post drive')
    }

    showToast('Drive posted successfully!', 'success')
    navigate('/recruiter/dashboard')
  } catch (error) {
    console.error(error)
    showToast('Unable to post drive. Please try again.', 'error')
  } finally {
    setSubmitting(false)
  }
}

  return (
    <div className="min-h-[calc(100vh-128px)] bg-rc-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[560px] bg-white rounded-card border border-rc-border border-l-[3.5px] border-l-rc-primary shadow-card p-8">
        <h1 className="text-2xl font-bold leading-tight tracking-tight mb-1">
          Post a Job Drive
        </h1>
        <p className="text-sm text-rc-muted mb-6">
          Fill in the details below to open a new drive for candidates to apply.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Job Title">
            <input
              name="title"
              className={inputClass}
              placeholder="Software Engineer"
              value={form.title}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </Field>

          <Field label="Job Description">
            <textarea
              name="description"
              rows={4}
              className={textareaClass}
              placeholder="Describe the role, responsibilities, and requirements..."
              value={form.description}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Location">
              <input
                name="location"
                className={inputClass}
                placeholder="Bengaluru, India"
                value={form.location}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </Field>

            <Field label="Employment Type">
              <select
                name="employmentType"
                className={inputClass}
                value={form.employmentType}
                onChange={handleChange}
                required
                disabled={submitting}
              >
                <option value="" disabled>
                  Select type
                </option>
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Experience Required">
              <input
                name="experienceRequired"
                className={inputClass}
                placeholder="0-2 years"
                value={form.experienceRequired}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </Field>

            <Field label="Salary (In LPA, INR)">
              <input
                name="salary"
                className={inputClass}
                placeholder="₹6-10 LPA"
                value={form.salary}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </Field>
          </div>

          <Field label="Required Skills (comma separated)">
            <input
              name="skills"
              className={inputClass}
              placeholder="Java, Spring Boot, MySQL, REST APIs"
              value={form.skills}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </Field>

          <Field label="Application Deadline">
            <input
              name="applicationDeadline"
              type="date"
              className={inputClass}
              value={form.applicationDeadline}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-10 rounded-btn bg-rc-primary text-white text-sm font-medium mt-2 disabled:opacity-60 hover:brightness-95 transition"
          >
            {submitting ? 'Posting…' : 'Post Drive'}
          </button>
        </form>
      </div>
    </div>
  )
}