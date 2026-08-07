import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import { useToast } from "../../context/ToastContext.jsx";

function BranchBar({ branch, rate }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between mb-2">
        <span className="font-medium">{branch}</span>
        <span className="text-sm text-gray-500">{rate}%</span>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div
          className="h-2 rounded-full bg-teal-600 transition-all"
          style={{ width: `${rate}%` }}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [dashboard, setDashboard] = useState(null);
  const [activities, setActivities] = useState([]);
  const [pendingRecruiters, setPendingRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      /*
      Backend APIs

      GET /api/admin/dashboard
      GET /api/admin/activities
      GET /api/admin/pending-recruiters
      */

      /*
      const dashboardRes = await fetch("http://localhost:8080/api/admin/dashboard");
      const dashboardData = await dashboardRes.json();

      const activityRes = await fetch("http://localhost:8080/api/admin/activities");
      const activityData = await activityRes.json();

      const recruiterRes = await fetch("http://localhost:8080/api/admin/pending-recruiters");
      const recruiterData = await recruiterRes.json();

      setDashboard(dashboardData);
      setActivities(activityData);
      setPendingRecruiters(recruiterData);
      */

      setDashboard({
        totalStudents: 0,
        totalRecruiters: 0,
        activeDrives: 0,
        totalApplications: 0,
        branchPlacement: []
      });

      setActivities([]);
      setPendingRecruiters([]);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const stats = dashboard
    ? [
        {
          label: "Students",
          value: dashboard.totalStudents
        },
        {
          label: "Recruiters",
          value: dashboard.totalRecruiters
        },
        {
          label: "Active Drives",
          value: dashboard.activeDrives
        },
        {
          label: "Applications",
          value: dashboard.totalApplications
        }
      ]
    : [];

  if (loading) {
    return (
      <h2 className="text-center mt-10 text-lg">
        Loading Dashboard...
      </h2>
    );
  }

  return (
    <DashboardLayout
      role="admin"
      userName="Administrator"
      onLogout={() => navigate("/login")}
      title="Admin Dashboard"
      subtitle="Monitor students, recruiters and placement activities."
    >

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-gray-500 text-sm">
              {stat.label}
            </p>

            <h2 className="text-3xl font-bold mt-2 text-teal-600">
              {stat.value}
            </h2>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        <Card className="lg:col-span-2">

          <h2 className="text-xl font-semibold mb-6">
            Placement by Branch
          </h2>

          {dashboard.branchPlacement.length === 0 ? (
            <p className="text-gray-500">
              No statistics available.
            </p>
          ) : (
            dashboard.branchPlacement.map((branch) => (
              <BranchBar
                key={branch.branch}
                branch={branch.branch}
                rate={branch.rate}
              />
            ))
          )}

        </Card>

        <Card>

          <h2 className="text-xl font-semibold mb-6">
            Recent Activity
          </h2>

          {activities.length === 0 ? (
            <p className="text-gray-500">
              No recent activity.
            </p>
          ) : (
            <ul className="space-y-3">
              {activities.map((activity) => (
                <li
                  key={activity.id}
                  className="border-b pb-3 text-sm"
                >
                  {activity.message}
                </li>
              ))}
            </ul>
          )}

        </Card>

      </div>

      <Card className="mt-8">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Pending Recruiter Approvals
          </h2>

          <Button
            variant="secondary"
            onClick={() => navigate("/admin/recruiters")}
          >
            View All
          </Button>
        </div>

        {pendingRecruiters.length === 0 ? (
          <p className="text-gray-500">
            No pending recruiter approvals.
          </p>
        ) : (
          <div className="space-y-4">

            {pendingRecruiters.map((recruiter) => (

              <div
                key={recruiter.id}
                className="flex justify-between items-center border-b pb-4"
              >

                <div>

                  <h3 className="font-semibold">
                    {recruiter.company}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {recruiter.name}
                  </p>

                  <p className="text-gray-400 text-xs">
                    {recruiter.email}
                  </p>

                </div>

                <div className="flex gap-2">

                  <Button
                    onClick={() =>
                      showToast("Recruiter approved", "success")
                    }
                  >
                    Approve
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() =>
                      showToast("Recruiter rejected", "error")
                    }
                  >
                    Reject
                  </Button>

                </div>

              </div>

            ))}

          </div>
        )}

      </Card>

    </DashboardLayout>
  );
}