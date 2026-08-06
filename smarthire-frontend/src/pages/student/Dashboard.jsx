import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import StatusPill from "../../components/StatusPill.jsx";

export default function Dashboard() {
  const navigate = useNavigate();

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
        const profileResponse = await fetch(
          `http://localhost:8080/api/student/profile/${loginData.email}`
        );

        if (profileResponse.ok) {
          const profile = await profileResponse.json();
          setStudent(profile);
        }

      } catch (error) {
        console.log("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("student");
    navigate("/login");
  };

  if (loading) {
    return (
      <h2 className="text-center mt-10">
        Loading Dashboard...
      </h2>
    );
  }

  if (!student) {
    return (
      <h2 className="text-center mt-10">
        Unable to load student data
      </h2>
    );
  }

  const stats = [
    {
      label: "Applied",
      value: applications.length,
    },
    {
      label: "Shortlisted",
      value: applications.filter(
        (item) => item.status === "SHORTLISTED"
      ).length,
    },
    {
      label: "Interview",
      value: applications.filter(
        (item) => item.status === "INTERVIEW"
      ).length,
    },
    {
      label: "Selected",
      value: applications.filter(
        (item) => item.status === "SELECTED"
      ).length,
    },
  ];

  return (
    <DashboardLayout
      role="student"
      userName={student.fullName}
      onLogout={handleLogout}
      title={`Welcome back, ${student.fullName}! `}
      subtitle="Here's what's happening with your placement journey."
    >

      {/* Profile Section */}
      <Card className="mb-8">

        <h2 className="text-2xl font-bold">
          {student.fullName}
        </h2>

        <p className="text-gray-500 mt-1">
          {student.email}
        </p>

        <span className="inline-block mt-3 px-4 py-1 rounded-full bg-blue-100 text-blue-700">
          STUDENT
        </span>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

          <div className="border rounded-lg p-4">
            <p className="text-xs text-gray-500">
              Student ID
            </p>
            <h3 className="font-bold">
              {student.id}
            </h3>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-xs text-gray-500">
              Course
            </p>
            <h3 className="font-bold">
              {student.course}
            </h3>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-xs text-gray-500">
              Branch
            </p>
            <h3 className="font-bold">
              {student.branch}
            </h3>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-xs text-gray-500">
              CGPA
            </p>
            <h3 className="font-bold">
              {student.cgpa}
            </h3>
          </div>

        </div>

        <div className="flex gap-4 mt-6">

          <Button onClick={() => navigate("/student/profile/edit")}>
            Update Profile
          </Button>

          <Button onClick={() => navigate("/student/jobs")}>
            Browse Drives
          </Button>

        </div>

      </Card>


      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        {stats.map((stat) => (
          <Card key={stat.label}>

            <p className="text-gray-500 text-sm">
              {stat.label}
            </p>

            <h2 className="text-3xl font-bold text-blue-600">
              {stat.value}
            </h2>

          </Card>
        ))}

      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Applications */}
        <section>

          <h2 className="text-lg font-semibold mb-4">
            Recent Applications
          </h2>

          {
            applications.length === 0 ?

            <Card>
              <p className="text-gray-500">
                No applications yet
              </p>
            </Card>

            :

            applications.map((app) => (

              <Card key={app.id} className="mb-3">

                <h3 className="font-semibold">
                  {app.jobTitle}
                </h3>

                <p className="text-gray-500">
                  {app.company}
                </p>

                <StatusPill status={app.status}/>

              </Card>

            ))
          }

        </section>


        {/* Jobs */}
        <section>

          <h2 className="text-lg font-semibold mb-4">
            Recommended Drives
          </h2>

          {
            jobs.length === 0 ?

            <Card>
              <p className="text-gray-500">
                No drives available
              </p>
            </Card>

            :

            jobs.map((job) => (

              <Card
                key={job.id}
                className="mb-3 cursor-pointer hover:shadow-lg"
                onClick={() => navigate(`/student/jobs/${job.id}`)}
              >

                <h3 className="font-semibold">
                  {job.title}
                </h3>

                <p className="text-gray-500">
                  {job.company}
                </p>

                <StatusPill status={job.status}/>

              </Card>

            ))
          }

        </section>

      </div>

    </DashboardLayout>
  );
}