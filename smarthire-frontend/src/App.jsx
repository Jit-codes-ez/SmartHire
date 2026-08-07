import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'

import ScrollToTop from "./components/ScrollToTop";
import SiteHeader from './components/SiteHeader.jsx'
import SiteFooter from './components/SiteFooter.jsx'

import FrontPage from './pages/FrontPage.jsx'
import About from "./pages/About";


import StudentLogin from './pages/student/Login.jsx'
import StudentRegistration from './pages/student/Registration.jsx'
import StudentDashboard from './pages/student/Dashboard.jsx'
import BrowseJobs from './pages/student/BrowseJobs.jsx'
import JobDetail from './pages/student/JobDetail.jsx'
import MyApplications from './pages/student/MyApplications.jsx'

import RecruiterRegistration from './pages/recruiter/Registration.jsx'
import RecruiterDashboard from './pages/recruiter/Dashboard.jsx'
import MyDrives from './pages/recruiter/MyDrives.jsx'
import Applicants from './pages/recruiter/Applicants.jsx'
import PostDrive from './pages/recruiter/PostDrive.jsx'

import AdminDashboard from './pages/admin/Dashboard.jsx'
import ManageAdmins from './pages/admin/ManageAdmins.jsx'
import ManageStudent from './pages/admin/ManageStudents.jsx'
import ManageRecruiters from './pages/admin/ManageRecruiters.jsx'
import AddAdmin from "./pages/admin/AddAdmin";
import UpdateProfile from "./pages/student/UpdateProfile.jsx";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";
import ForgotPassword from "./pages/student/ForgotPassword.jsx";
import VerifyResetOtp from "./pages/student/VerifyResetOtp";
import ResetPassword from "./pages/student/ResetPassword";


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
    <ScrollToTop />
      <SiteHeader />

      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Home" element={<FrontPage />} />
        <Route path="/login" element={<StudentLogin />} />

        <Route path="/about" element={<About />} />
        <Route path="/student/register" element={<StudentRegistration />} />
        <Route path="/recruiter/register" element={<RecruiterRegistration />} />

        {/* Student portal — Light Blue theme */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/jobs" element={<BrowseJobs />} />
        <Route path="/student/jobs/:id" element={<JobDetail />} />
        <Route path="/student/applications" element={<MyApplications />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Recruiter portal — Warm Indigo theme */}
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/drives" element={<MyDrives />} />
        <Route path="/recruiter/drives/:id/applicants" element={<Applicants />} />
        <Route path="/recruiter/drives/new" element={<PostDrive />} />

        {/* Admin portal — Dark Teal theme */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-admin" element={<AddAdmin />} />
        <Route path="/admin/manage-admins" element={<ManageAdmins />} />
        <Route path="/admin/manage-students" element={<ManageStudent />} />
        <Route path="/admin/manage-recruiters" element={<ManageRecruiters />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/student/profile/edit" element={<UpdateProfile />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>

      <SiteFooter />
    </>
  )
}
