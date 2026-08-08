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

  const storedRecruiter = localStorage.getItem("recruiter");

  let loginData = null;

  try {
    loginData = storedRecruiter
      ? JSON.parse(storedRecruiter)
      : null;
  } catch (error) {
    console.error("Invalid recruiter data:", error);
  }

  const [recruiter, setRecruiter] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loginData?.email) {
      navigate("/login");
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [profileRes, jobsRes] = await Promise.all([
          authFetch(
            `http://localhost:8080/api/recruiter/profile/${encodeURIComponent(
              loginData.email
            )}`
          ),
          authFetch(
            `http://localhost:8080/api/recruiter/jobs/${encodeURIComponent(
              loginData.email
            )}`
          ),
        ]);

        if (!profileRes.ok) {
          throw new Error("Failed to load recruiter profile");
        }

        const profile = await profileRes.json();
        setRecruiter(profile);

        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobs(Array.isArray(jobsData) ? jobsData : []);
        } else {
          console.error(
            "Failed to load jobs:",
            jobsRes.status
          );

          setJobs([]);
        }
      } catch (error) {
        console.error("Dashboard error:", error);

        showToast(
          "Unable to load dashboard data.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate, showToast, loginData?.email]);

  const handleLogout = () => {
    localStorage.removeItem("recruiter");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  if (loading) {
    return (
      <DashboardLayout
        role="recruiter"
        userName="Recruiter"
        onLogout={handleLogout}
        title="Recruiter Dashboard"
        subtitle="Loading your recruitment dashboard..."
      >
        <Card>
          <div className="flex justify-center items-center py-12">
            <p className="text-st-muted">
              Loading dashboard...
            </p>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  if (!recruiter) {
    return (
      <DashboardLayout
        role="recruiter"
        userName="Recruiter"
        onLogout={handleLogout}
        title="Recruiter Dashboard"
        subtitle="Manage your recruitment activities."
      >
        <Card>
          <div className="text-center py-12">
            <p className="text-st-muted mb-5">
              Unable to load recruiter data.
            </p>

            <Button
              onClick={() =>
                navigate("/recruiter/dashboard")
              }
            >
              Try Again
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const activeJobs = jobs.filter(
    (job) =>
      job.status === "ACTIVE" ||
      job.status === "OPEN"
  ).length;

  const stats = [
    {
      label: "Jobs Posted",
      value: jobs.length,
    },
    {
      label: "Active Jobs",
      value: activeJobs,
    },
    {
      label: "Applicants",
      value: 0,
    },
    {
      label: "Shortlisted",
      value: 0,
    },
  ];

  return (
    <DashboardLayout
      role="recruiter"
      userName={recruiter.fullName}
      onLogout={handleLogout}
      title={`Welcome back, ${recruiter.fullName}!`}
      subtitle="Here's what's happening with your recruitment activities."
    >
      {/* Profile Section */}
      <div className="mb-8">
        <Card>
          <div>
            <h2 className="text-2xl font-bold text-st-text">
              {recruiter.fullName}
            </h2>

            <p className="text-st-muted mt-1">
              {recruiter.email}
            </p>

            <span className="inline-block mt-3 px-4 py-1 rounded-full bg-st-primary/10 text-st-primary text-sm font-medium">
              RECRUITER
            </span>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {/* Company */}
              <div className="border border-st-border rounded-input p-4">
                <p className="text-xs text-st-muted">
                  Company
                </p>

                <h3 className="font-bold text-st-text mt-1">
                  {recruiter.companyName || "N/A"}
                </h3>
              </div>

              {/* Designation */}
              <div className="border border-st-border rounded-input p-4">
                <p className="text-xs text-st-muted">
                  Designation
                </p>

                <h3 className="font-bold text-st-text mt-1">
                  {recruiter.designation || "Recruiter"}
                </h3>
              </div>

              {/* Industry */}
              <div className="border border-st-border rounded-input p-4">
                <p className="text-xs text-st-muted">
                  Industry
                </p>

                <h3 className="font-bold text-st-text mt-1">
                  {recruiter.industry || "N/A"}
                </h3>
              </div>

              {/* Recruiter ID */}
              <div className="border border-st-border rounded-input p-4">
                <p className="text-xs text-st-muted">
                  Recruiter ID
                </p>

                <h3 className="font-bold text-st-text mt-1">
                  {recruiter.id}
                </h3>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                onClick={() =>
                  navigate("/recruiter/profile/edit")
                }
              >
                Update Profile
              </Button>

              <Button
                onClick={() =>
                  navigate("/recruiter/jobs/create")
                }
              >
                Post Job
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-st-muted text-sm">
              {stat.label}
            </p>

            <h2 className="text-3xl font-bold text-st-primary mt-1">
              {stat.value}
            </h2>
          </Card>
        ))}
      </div>

      {/* Recent Jobs */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-st-text">
            Recent Job Posts
          </h2>

          <Button
            variant="secondary"
            onClick={() =>
              navigate("/recruiter/jobs/create")
            }
          >
            Post Job
          </Button>
        </div>

        {jobs.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-st-muted">
                No jobs posted yet.
              </p>

              <div className="mt-4">
                <Button
                  onClick={() =>
                    navigate("/recruiter/jobs/create")
                  }
                >
                  Post Your First Job
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() =>
                  navigate(
                    `/recruiter/jobs/${job.id}`
                  )
                }
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold text-st-text">
                      {job.title}
                    </h3>

                    <p className="text-st-muted mt-1">
                      {job.location ||
                        "Location not specified"}
                    </p>

                    {job.employmentType && (
                      <p className="text-xs text-st-muted mt-1">
                        {job.employmentType}
                      </p>
                    )}

                    <p className="text-xs text-st-muted mt-1">
                      {job.applicantCount || 0} applicants
                    </p>
                  </div>

                  <StatusPill
                    status={job.status || "ACTIVE"}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}