import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'

import SiteHeader from './components/SiteHeader.jsx'
import SiteFooter from './components/SiteFooter.jsx'

import FrontPage from './pages/FrontPage.jsx'

import StudentLogin from './pages/student/Login.jsx'
import StudentDashboard from './pages/student/Dashboard.jsx'
import BrowseJobs from './pages/student/BrowseJobs.jsx'
import JobDetail from './pages/student/JobDetail.jsx'
import MyApplications from './pages/student/MyApplications.jsx'

import RecruiterDashboard from './pages/recruiter/Dashboard.jsx'
import MyDrives from './pages/recruiter/MyDrives.jsx'
import Applicants from './pages/recruiter/Applicants.jsx'
import PostDrive from './pages/recruiter/PostDrive.jsx'

import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminStudents from './pages/admin/Students.jsx'
import AdminRecruiters from './pages/admin/Recruiters.jsx'

// Maps a URL prefix to the design-system theme it should render in.
function themeForPath(pathname) {
  if (pathname.startsWith('/recruiter')) return 'recruiter'
  if (pathname.startsWith('/admin')) return 'admin'
  return 'student'
}

export default function App() {
  const location = useLocation()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeForPath(location.pathname))
  }, [location.pathname])

  return (
    <>
      <SiteHeader />

      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Home" element={<FrontPage />} />
        <Route path="/login" element={<StudentLogin />} />

        {/* Student portal — Light Blue theme */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/jobs" element={<BrowseJobs />} />
        <Route path="/student/jobs/:id" element={<JobDetail />} />
        <Route path="/student/applications" element={<MyApplications />} />

        {/* Recruiter portal — Warm Indigo theme */}
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/drives" element={<MyDrives />} />
        <Route path="/recruiter/drives/:id/applicants" element={<Applicants />} />
        <Route path="/recruiter/drives/new" element={<PostDrive />} />

        {/* Admin portal — Dark Teal theme */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/recruiters" element={<AdminRecruiters />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <SiteFooter />
    </>
  )
}
