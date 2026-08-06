import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import StatusPill from "../../components/StatusPill.jsx";
import { applications, jobs } from "../../lib/mockData.js";

export default function Dashboard() {
  const navigate = useNavigate();

  // Get logged-in student
  const student = JSON.parse(localStorage.getItem("student"));

  // If not logged in, redirect to login page
  if (!student) {
    navigate("/login");
    return null;
  }

  const stats = [
    { label: "Applied", value: 3 },
    { label: "Shortlisted", value: 2 },
    { label: "Interview", value: 1 },
    { label: "Selected", value: 0 },
  ];

  const recommended = jobs
    .filter((job) => job.status === "Open")
    .slice(0, 2);

  const handleLogout = () => {
    localStorage.removeItem("student");
    navigate("/login");
  };

  return (
    <DashboardLayout
      role="student"
      userName={student.fullName}
      onLogout={handleLogout}
      title={`Welcome back, ${student.fullName}!`}
      subtitle="Here's what's happening with your applications."
    >
      <div className="flex justify-end mb-6 -mt-14 relative z-[1]">
        <Button onClick={() => navigate("/student/jobs")}>
          Browse Open Drives
        </Button>
      </div>

      {/* Student Information */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Student Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Name:</strong> {student.fullName}
          </div>

          <div>
            <strong>Email:</strong> {student.email}
          </div>

          <div>
            <strong>Student ID:</strong> {student.studentId}
          </div>

          <div>
            <strong>Role:</strong> {student.role}
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-xs muted mb-1">{s.label}</p>
            <p className="text-2xl font-bold font-mono">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications */}
        <section>
          <h2 className="text-lg font-semibold mb-3">
            Active Applications
          </h2>

          <div className="space-y-3">
            {applications.map((app) => (
              <Card
                key={app.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-sm">{app.job}</p>

                  <p className="text-xs muted mt-0.5">
                    Applied {app.appliedOn}
                  </p>
                </div>

                <StatusPill status={app.status} size="sm" />
              </Card>
            ))}
          </div>
        </section>

        {/* Recommended Jobs */}
        <section>
          <h2 className="text-lg font-semibold mb-3">
            Recommended Drives
          </h2>

          <div className="space-y-3">
            {recommended.map((job) => (
              <Card
                key={job.id}
                className="cursor-pointer"
                onClick={() => navigate(`/student/jobs/${job.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{job.title}</p>

                    <p className="text-xs muted mt-0.5">
                      {job.company}
                    </p>
                  </div>

                  <StatusPill status={job.status} size="sm" />
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}