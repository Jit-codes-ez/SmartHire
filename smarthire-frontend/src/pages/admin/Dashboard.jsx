import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { useToast } from "../../context/ToastContext";

function BranchBar({ branch, rate }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between mb-2">
        <span className="font-medium">{branch}</span>
        <span className="text-teal-600 font-semibold">{rate}%</span>
      </div>

      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-600 transition-all duration-700"
          style={{ width: `${rate}%` }}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [dashboard, setDashboard] = useState({
    totalStudents: 0,
    totalRecruiters: 0,
    pendingRecruiters: 0,
    activeDrives: 0,
    totalApplications: 0,
    branchPlacement: [],
  });

  const [activities, setActivities] = useState([]);
  const [pendingRecruiters, setPendingRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [
        dashboardRes,
        activityRes,
        recruiterRes,
      ] = await Promise.all([
        fetch("http://localhost:8080/api/admin/dashboard"),
        fetch("http://localhost:8080/api/admin/activities"),
        fetch("http://localhost:8080/api/admin/recruiters/pending"),
      ]);

      if (!dashboardRes.ok)
        throw new Error("Failed to fetch dashboard");

      const dashboardData = await dashboardRes.json();
      const activityData = activityRes.ok
        ? await activityRes.json()
        : [];
      const recruiterData = recruiterRes.ok
        ? await recruiterRes.json()
        : [];

      setDashboard(dashboardData);
      setActivities(activityData);
      setPendingRecruiters(recruiterData);
    } catch (err) {
      console.error(err);
      showToast("Unable to load dashboard", "error");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Students",
      value: dashboard.totalStudents,
      color: "text-blue-600",
    },
    {
      title: "Recruiters",
      value: dashboard.totalRecruiters,
      color: "text-green-600",
    },
    {
      title: "Pending",
      value: dashboard.pendingRecruiters,
      color: "text-orange-500",
    },
    {
      title: "Drives",
      value: dashboard.activeDrives,
      color: "text-purple-600",
    },
    {
      title: "Applications",
      value: dashboard.totalApplications,
      color: "text-teal-600",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout
        role="admin"
        userName="Administrator"
        title="Admin Dashboard"
        subtitle="Loading dashboard..."
      >
        <div className="flex justify-center py-20">
          <div className="animate-pulse text-xl font-semibold">
            Loading Dashboard...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="admin"
      userName="Administrator"
      onLogout={() => navigate("/login")}
      title="Admin Dashboard"
      subtitle="Manage students, recruiters and placement activities."
    >
      {/* Quick Actions */}

      <div className="flex flex-wrap gap-4 mb-8">

        <Button
          onClick={() => navigate("/admin/students/add")}
        >
          + Add Student
        </Button>

        <Button
          onClick={() => navigate("/admin/recruiters/add")}
        >
          + Add Recruiter
        </Button>

        <Button
          variant="secondary"
          onClick={() => navigate("/admin/students")}
        >
          Manage Students
        </Button>

        <Button
          variant="secondary"
          onClick={() => navigate("/admin/recruiters")}
        >
          Manage Recruiters
        </Button>

        <Button
          variant="secondary"
          onClick={loadDashboard}
        >
          Refresh
        </Button>

      </div>

      {/* Statistics */}

      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">

        {stats.map((item) => (

          <Card key={item.title}>

            <p className="text-gray-500 text-sm">
              {item.title}
            </p>

            <h2
              className={`text-4xl font-bold mt-3 ${item.color}`}
            >
              {item.value}
            </h2>

          </Card>

        ))}

      </div>

      <div className="grid lg:grid-cols-3 gap-6">
                {/* Placement Statistics */}

        <Card className="lg:col-span-2">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-semibold">
              Placement by Branch
            </h2>

            <Button
              variant="secondary"
              onClick={() => navigate("/admin/reports")}
            >
              View Report
            </Button>

          </div>

          {dashboard.branchPlacement &&
          dashboard.branchPlacement.length > 0 ? (

            dashboard.branchPlacement.map((branch) => (
              <BranchBar
                key={branch.branch}
                branch={branch.branch}
                rate={branch.rate}
              />
            ))

          ) : (

            <div className="py-10 text-center text-gray-500">
              No placement statistics available.
            </div>

          )}

        </Card>

        {/* Recent Activities */}

        <Card>

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-semibold">
              Recent Activities
            </h2>

            <Button
              variant="secondary"
              onClick={loadDashboard}
            >
              Refresh
            </Button>

          </div>

          {activities.length === 0 ? (

            <div className="py-8 text-center text-gray-500">
              No recent activities.
            </div>

          ) : (

            <div className="space-y-4">

              {activities.map((activity) => (

                <div
                  key={activity.id}
                  className="border-b pb-3 last:border-none"
                >

                  <p className="font-medium">
                    {activity.message}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {activity.time}
                  </p>

                </div>

              ))}

            </div>

          )}

        </Card>

      </div>

      {/* Dashboard Summary */}

      <div className="grid md:grid-cols-3 gap-6 mt-8">

        <Card>

          <h3 className="text-lg font-semibold mb-3">
            Student Summary
          </h3>

          <p className="text-gray-600">
            Total Registered Students
          </p>

          <h2 className="text-4xl font-bold text-blue-600 mt-2">
            {dashboard.totalStudents}
          </h2>

          <Button
            className="mt-5 w-full"
            onClick={() => navigate("/admin/students")}
          >
            View Students
          </Button>

        </Card>

        <Card>

          <h3 className="text-lg font-semibold mb-3">
            Recruiter Summary
          </h3>

          <p className="text-gray-600">
            Approved Recruiters
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-2">
            {dashboard.totalRecruiters}
          </h2>

          <Button
            className="mt-5 w-full"
            onClick={() => navigate("/admin/recruiters")}
          >
            View Recruiters
          </Button>

        </Card>

        <Card>

          <h3 className="text-lg font-semibold mb-3">
            Pending Approvals
          </h3>

          <p className="text-gray-600">
            Waiting for Verification
          </p>

          <h2 className="text-4xl font-bold text-orange-500 mt-2">
            {dashboard.pendingRecruiters}
          </h2>

          <Button
            className="mt-5 w-full"
            variant="secondary"
            onClick={() =>
              navigate("/admin/recruiters?tab=pending")
            }
          >
            Review Requests
          </Button>

        </Card>

      </div>

      {/* Pending Recruiter Approvals */}

      <Card className="mt-8">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-xl font-semibold">
            Pending Recruiter Approvals
          </h2>

          <Button
            variant="secondary"
            onClick={() =>
              navigate("/admin/recruiters?tab=pending")
            }
          >
            View All
          </Button>

        </div>
                {pendingRecruiters.length === 0 ? (

          <div className="py-10 text-center text-gray-500">
            No pending recruiter approvals.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left py-3">Company</th>
                  <th className="text-left py-3">Recruiter</th>
                  <th className="text-left py-3">Email</th>
                  <th className="text-center py-3">Actions</th>

                </tr>

              </thead>

              <tbody>

                {pendingRecruiters.map((recruiter) => (

                  <tr
                    key={recruiter.id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    <td className="py-4 font-semibold">
                      {recruiter.company}
                    </td>

                    <td>{recruiter.name}</td>

                    <td>{recruiter.email}</td>

                    <td>

                      <div className="flex justify-center gap-2">

                        <Button
                          onClick={async () => {
                            try {

                              await fetch(
                                `http://localhost:8080/api/admin/recruiters/${recruiter.id}/approve`,
                                {
                                  method: "PUT",
                                }
                              );

                              showToast(
                                "Recruiter approved",
                                "success"
                              );

                              loadDashboard();

                            } catch (err) {

                              showToast(
                                "Approval failed",
                                "error"
                              );

                            }
                          }}
                        >
                          Approve
                        </Button>

                        <Button
                          variant="danger"
                          onClick={async () => {

                            try {

                              await fetch(
                                `http://localhost:8080/api/admin/recruiters/${recruiter.id}/reject`,
                                {
                                  method: "PUT",
                                }
                              );

                              showToast(
                                "Recruiter rejected",
                                "success"
                              );

                              loadDashboard();

                            } catch (err) {

                              showToast(
                                "Reject failed",
                                "error"
                              );

                            }
                          }}
                        >
                          Reject
                        </Button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </Card>

    </DashboardLayout>

  );

}