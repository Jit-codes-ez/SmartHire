import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import StatusPill from "../../components/StatusPill.jsx";
import EmptyState from "../../components/EmptyState.jsx";

export default function BrowseJobs() {
  const navigate = useNavigate();

  const loginData = JSON.parse(
    localStorage.getItem("student")
  );

  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loginData) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:8080/api/jobs/open")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load jobs");
        }
        return res.json();
      })
      .then((data) => {
        setJobs(data);
      })
      .catch((error) => {
        console.log("Jobs loading error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return jobs.filter((job) =>
      `${job.title} ${job.company}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [jobs, query]);

  if (loading) {
    return (
      <h2 className="text-center mt-10">
        Loading drives...
      </h2>
    );
  }

  return (
  <div className="p-6 max-w-7xl mx-auto">

    <div className="mb-8">
      <h1 className="text-4xl font-bold text-gray-800">
        Browse Drives 🚀
      </h1>

      <p className="text-gray-500 mt-2">
        Discover opportunities from top companies and apply for your dream role.
      </p>
    </div>

    <div className="mb-8">
      <input
        className="w-full md:w-96 border border-gray-300 rounded-xl px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search company or role..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>

    {filtered.length === 0 ? (

      <EmptyState
        title="No drives available"
        description="Try another search or check again later."
      />

    ) : (

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filtered.map((job) => (

          <Card
            key={job.id}
            className="p-6 rounded-2xl border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >

            <div className="flex justify-between items-start mb-4">

              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {job.title}
                </h3>

                <p className="text-blue-600 font-medium mt-1">
                  {job.company}
                </p>
              </div>

              <StatusPill
                status={job.status}
                size="sm"
              />

            </div>

            <div className="space-y-2 text-sm text-gray-600">

              <p>
                🛠️ <span className="font-medium">Skills:</span>{" "}
                {job.skills?.join(", ")}
              </p>

              <p>
                🎓 <span className="font-medium">CGPA:</span>{" "}
                {job.cgpaCutoff}
              </p>

              <p>
                📍 <span className="font-medium">Location:</span>{" "}
                {job.location}
              </p>

              <p>
                👥 <span className="font-medium">Openings:</span>{" "}
                {job.openings}
              </p>

              <p>
                📅 <span className="font-medium">Deadline:</span>{" "}
                {job.deadline}
              </p>

            </div>

            <div className="flex gap-3 mt-6">

              <Button
                variant="primary"
                disabled={job.status !== "Open"}
                onClick={() => navigate(`/student/jobs/${job.id}`)}
              >
                {job.status === "Open" ? "View Details" : "Closed"}
              </Button>

              <Button variant="secondary">
                Save
              </Button>

            </div>

          </Card>

        ))}

      </div>

    )}

  </div>
);
}