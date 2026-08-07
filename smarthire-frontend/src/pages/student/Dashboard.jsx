import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import StatusPill from "../../components/StatusPill.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { authFetch } from "../../lib/authFetch.js";

export default function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loginData = JSON.parse(localStorage.getItem("student"));

  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loginData) {
      navigate("/login");
      return;
    }

    const loadDashboard = async () => {
      try {
        const [profileRes, applicationsRes, jobsRes] = await Promise.all([
          authFetch(
            `http://localhost:8080/api/student/profile/${encodeURIComponent(loginData.email)}`
          ),
          authFetch(
            `http://localhost:8080/api/student/applications/${encodeURIComponent(loginData.email)}`
          ),
          authFetch(`http://localhost:8080/api/student/jobs/recommended`),
        ]);

        if (!profileRes.ok) throw new Error("Failed to load profile");

        const profile = await profileRes.json();
        setStudent(profile);

        if (applicationsRes.ok) {
          setApplications(await applicationsRes.json());
        }

        if (jobsRes.ok) {
          setJobs(await jobsRes.json());
        }
      } catch (error) {
        console.log("Dashboard error:", error);
        showToast("Unable to load dashboard data.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("student");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-st-muted text-sm">Loading dashboard…</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-st-muted text-sm">Unable to load student data.</p>
      </div>
    );
  }

  const stats = [
    { label: "Applied", value: applications.length },
    {
      label: "Shortlisted",
      value: applications.filter((item) => item.status === "SHORTLISTED").length,
    },
    {
      label: "Interview",
      value: applications.filter((item) => item.status === "INTERVIEW").length,
    },
    {
      label: "Selected",
      value: applications.filter((item) => item.status === "SELECTED").length,
    },
  ];

  return (
    <DashboardLayout
      role="student"
      userName={student.fullName}
      onLogout={handleLogout}
      title={`Welcome back, ${student.fullName}!`}
      subtitle="Here's what's happening with your placement journey."
    >
      {/* Profile Section */}
      <Card className="mb-8">
        <h2 className="text-2xl font-bold text-st-text">{student.fullName}</h2>
        <p className="text-st-muted mt-1">{student.email}</p>

        <span className="inline-block mt-3 px-4 py-1 rounded-full bg-st-primary/10 text-st-primary text-sm font-medium">
          STUDENT
        </span>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="border border-st-border rounded-input p-4">
            <p className="text-xs text-st-muted">Student ID</p>
            <h3 className="font-bold text-st-text">{student.id}</h3>
          </div>

          <div className="border border-st-border rounded-input p-4">
            <p className="text-xs text-st-muted">Course</p>
            <h3 className="font-bold text-st-text">{student.course}</h3>
          </div>

          <div className="border border-st-border rounded-input p-4">
            <p className="text-xs text-st-muted">Branch</p>
            <h3 className="font-bold text-st-text">{student.branch}</h3>
          </div>

          <div className="border border-st-border rounded-input p-4">
            <p className="text-xs text-st-muted">CGPA</p>
            <h3 className="font-bold text-st-text">{student.cgpa}</h3>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={() => navigate("/student/profile/edit")}>
            Update Profile
          </Button>
          <Button onClick={() => navigate("/student/jobs")}>Browse Drives</Button>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-st-muted text-sm">{stat.label}</p>
            <h2 className="text-3xl font-bold text-st-primary">{stat.value}</h2>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-st-text">
            Recent Applications
          </h2>

          {applications.length === 0 ? (
            <Card>
              <p className="text-st-muted">No applications yet</p>
            </Card>
          ) : (
            applications.map((app) => (
              <Card key={app.id} className="mb-3">
                <h3 className="font-semibold text-st-text">{app.jobTitle}</h3>
                <p className="text-st-muted">{app.company}</p>
                <StatusPill status={app.status} />
              </Card>
            ))
          )}
        </section>

        {/* Jobs */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-st-text">
            Recommended Drives
          </h2>

          {jobs.length === 0 ? (
            <Card>
              <p className="text-st-muted">No drives available</p>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card
                key={job.id}
                className="mb-3 cursor-pointer hover:shadow-lg"
                onClick={() => navigate(`/student/jobs/${job.id}`)}
              >
                <h3 className="font-semibold text-st-text">{job.title}</h3>
                <p className="text-st-muted">{job.company}</p>
                <StatusPill status={job.status} />
              </Card>
            ))
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}