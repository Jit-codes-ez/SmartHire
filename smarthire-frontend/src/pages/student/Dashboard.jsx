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

  const loginData = (() => {
    try {
      return JSON.parse(localStorage.getItem("student"));
    } catch {
      return null;
    }
  })();

  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
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

        /*
         * Load profile, applications and open jobs.
         *
         * IMPORTANT:
         * Applications use /api/applications/my
         * because that is the endpoint from your
         * ApplicationController.
         */
        const [profileRes, applicationsRes, jobsRes] =
          await Promise.all([
            authFetch(
              `http://localhost:8080/api/student/profile/${encodeURIComponent(
                loginData.email
              )}`
            ),

            authFetch(
              `http://localhost:8080/api/applications/my?email=${encodeURIComponent(
                loginData.email
              )}`
            ),

            authFetch(
              "http://localhost:8080/api/jobs/open"
            ),
          ]);

        // ==========================================
        // PROFILE
        // ==========================================

        if (!profileRes.ok) {
          throw new Error("Failed to load profile");
        }

        const profileData = await profileRes.json();

        console.log(
          "Dashboard profile:",
          profileData
        );

        setStudent(profileData);

        // ==========================================
        // APPLICATIONS
        // ==========================================

        let applicationData = [];

        if (applicationsRes.ok) {
          const data = await applicationsRes.json();

          console.log(
            "Dashboard applications:",
            data
          );

          applicationData = Array.isArray(data)
            ? data
            : [];

          setApplications(applicationData);
        } else {
          console.error(
            "Applications API error:",
            applicationsRes.status
          );

          setApplications([]);
        }

        // ==========================================
        // OPEN JOBS
        // ==========================================

        let openJobs = [];

        if (jobsRes.ok) {
          const data = await jobsRes.json();

          console.log(
            "Dashboard open jobs:",
            data
          );

          openJobs = Array.isArray(data)
            ? data
            : [];
        } else {
          console.error(
            "Jobs API error:",
            jobsRes.status
          );
        }

        // ==========================================
        // REMOVE ALREADY APPLIED JOBS
        // ==========================================

        /*
         * Application entity:
         *
         * application.id
         * application.student
         * application.job
         *
         * Therefore the applied job ID is:
         *
         * application.job.id
         */

        const appliedJobIds = new Set(
          applicationData
            .map((application) => {
              return (
                application?.job?.id ??
                application?.jobId ??
                application?.job?.jobId
              );
            })
            .filter(
              (jobId) =>
                jobId !== null &&
                jobId !== undefined
            )
            .map((jobId) => String(jobId))
        );

        console.log(
          "Applied job IDs:",
          [...appliedJobIds]
        );

        /*
         * Only show open jobs which the student
         * has NOT already applied for.
         */
        const recommendedJobs = openJobs.filter(
          (job) =>
            !appliedJobIds.has(String(job.id))
        );

        console.log(
          "Recommended drives:",
          recommendedJobs
        );

        setJobs(recommendedJobs);
      } catch (error) {
        console.error(
          "Dashboard error:",
          error
        );

        showToast(
          "Unable to load dashboard data.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("student");

    window.dispatchEvent(
      new Event("authChange")
    );

    navigate("/login");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <DashboardLayout
        role="student"
        userName="Student"
      >
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // STUDENT NOT FOUND
  // ==========================================

  if (!student) {
    return (
      <DashboardLayout
        role="student"
        userName="Student"
      >
        <Card>
          <div className="py-8 text-center">
            <p className="font-medium text-gray-700">
              Unable to load student data.
            </p>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  // ==========================================
  // STATISTICS
  // ==========================================

  const stats = [
    {
      label: "Applied",
      value: applications.length,
    },
    {
      label: "Shortlisted",
      value: applications.filter(
        (item) =>
          String(item.status).toUpperCase() ===
          "SHORTLISTED"
      ).length,
    },
    {
      label: "Interview",
      value: applications.filter(
        (item) =>
          String(item.status).toUpperCase() ===
          "INTERVIEW"
      ).length,
    },
    {
      label: "Selected",
      value: applications.filter(
        (item) =>
          String(item.status).toUpperCase() ===
          "SELECTED"
      ).length,
    },
  ];

  // ==========================================
  // HELPERS
  // ==========================================

  const getApplicationJobTitle = (application) => {
    return (
      application?.job?.title ||
      application?.jobTitle ||
      "Job"
    );
  };

  const getApplicationCompany = (application) => {
    return (
      application?.job?.recruiter?.companyName ||
      application?.job?.companyName ||
      application?.job?.company ||
      application?.recruiter?.companyName ||
      application?.companyName ||
      application?.company ||
      "Company"
    );
  };

  const getJobCompany = (job) => {
    return (
      job?.recruiter?.companyName ||
      job?.companyName ||
      job?.company ||
      "Company"
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <DashboardLayout
      role="student"
      userName={student.fullName}
      onLogout={handleLogout}
      title={`Welcome back, ${student.fullName}!`}
      subtitle="Here's what's happening with your placement journey."
    >
      {/* ======================================
          PROFILE
      ====================================== */}

      <Card className="mb-8">
        <div>
          <h2 className="text-xl font-bold text-st-text">
            {student.fullName}
          </h2>

          <p className="mt-1 text-sm text-st-muted">
            {student.email}
          </p>

          <span className="mt-3 inline-block rounded-full bg-st-primary/10 px-4 py-1 text-sm font-medium text-st-primary">
            STUDENT
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-input border border-st-border p-4">
            <p className="text-xs text-st-muted">
              Student ID
            </p>

            <h3 className="font-bold text-st-text">
              {student.id}
            </h3>
          </div>

          <div className="rounded-input border border-st-border p-4">
            <p className="text-xs text-st-muted">
              Course
            </p>

            <h3 className="font-bold text-st-text">
              {student.course || "Not specified"}
            </h3>
          </div>

          <div className="rounded-input border border-st-border p-4">
            <p className="text-xs text-st-muted">
              Branch
            </p>

            <h3 className="font-bold text-st-text">
              {student.branch || "Not specified"}
            </h3>
          </div>

          <div className="rounded-input border border-st-border p-4">
            <p className="text-xs text-st-muted">
              CGPA
            </p>

            <h3 className="font-bold text-st-text">
              {student.cgpa ?? "Not specified"}
            </h3>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Button
            onClick={() =>
              navigate("/student/profile/edit")
            }
          >
            Update Profile
          </Button>

          <Button
            onClick={() =>
              navigate("/student/jobs")
            }
          >
            Browse Drives
          </Button>
        </div>
      </Card>

      {/* ======================================
          STATISTICS
      ====================================== */}

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-st-muted">
              {stat.label}
            </p>

            <h2 className="mt-1 text-3xl font-bold text-st-primary">
              {stat.value}
            </h2>
          </Card>
        ))}
      </div>

      {/* ======================================
          APPLICATIONS + RECOMMENDED DRIVES
      ====================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ====================================
            RECENT APPLICATIONS
        ==================================== */}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-st-text">
                Recent Applications
              </h2>

              <p className="mt-1 text-xs text-st-muted">
                Your latest placement applications
              </p>
            </div>

            {applications.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/student/applications"
                  )
                }
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                View All
              </button>
            )}
          </div>

          {applications.length === 0 ? (
            <Card>
              <div className="py-8 text-center">
                <p className="font-medium text-gray-700">
                  No applications yet
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Apply to a placement drive and
                  it will appear here.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/student/jobs")
                  }
                  className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Browse Drives →
                </button>
              </div>
            </Card>
          ) : (
            applications
              .slice(0, 4)
              .map((application) => (
                <Card
                  key={application.id}
                  className="mb-3 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-st-text">
                        {getApplicationJobTitle(
                          application
                        )}
                      </h3>

                      <p className="mt-1 text-sm text-st-muted">
                        {getApplicationCompany(
                          application
                        )}
                      </p>

                      {application.appliedAt && (
                        <p className="mt-2 text-xs text-gray-400">
                          Applied on{" "}
                          {new Date(
                            application.appliedAt
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <StatusPill
                      status={
                        application.status ||
                        "APPLIED"
                      }
                    />
                  </div>
                </Card>
              ))
          )}
        </section>

        {/* ====================================
            RECOMMENDED DRIVES
        ==================================== */}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-st-text">
                Recommended Drives
              </h2>

              <p className="mt-1 text-xs text-st-muted">
                Drives you haven't applied to yet
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/student/jobs")
              }
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View All
            </button>
          </div>

          {jobs.length === 0 ? (
            <Card>
              <div className="py-8 text-center">
                <p className="font-medium text-gray-700">
                  No new drives
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  You've already applied to all
                  currently available drives.
                </p>
              </div>
            </Card>
          ) : (
            jobs.slice(0, 4).map((job) => (
              <Card
                key={job.id}
                className="mb-3 cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md"
                onClick={() =>
                  navigate(
                    `/student/jobs/${job.id}`
                  )
                }
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-st-text">
                      {job.title}
                    </h3>

                    <p className="mt-1 text-sm text-st-muted">
                      {getJobCompany(job)}
                    </p>

                    {job.location && (
                      <p className="mt-2 text-xs text-gray-400">
                        {job.location}
                      </p>
                    )}
                  </div>

                  <StatusPill
                    status={job.status}
                  />
                </div>
              </Card>
            ))
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}