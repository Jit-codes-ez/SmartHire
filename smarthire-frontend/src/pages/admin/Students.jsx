import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import FullWidthListLayout from "../../layouts/FullWidthListLayout.jsx";
import DataTable from "../../components/DataTable.jsx";
import StatusPill from "../../components/StatusPill.jsx";

export default function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [branch, setBranch] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/students")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load students");
        }
        return res.json();
      })
      .then((data) => {
        setStudents(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesQuery = (
        `${s.fullName} ${s.branch} ${s.course}`
      )
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesBranch =
        !branch || s.branch === branch;

      return matchesQuery && matchesBranch;
    });
  }, [students, query, branch]);

  const columns = [
    {
      key: "fullName",
      label: "Student Name",
      sortable: true,
    },
    {
      key: "course",
      label: "Course",
      sortable: true,
    },
    {
      key: "branch",
      label: "Branch",
      sortable: true,
    },
    {
      key: "cgpa",
      label: "CGPA",
      sortable: true,
    },
    {
      key: "passingYear",
      label: "Passing Year",
    },
    {
      key: "status",
      label: "Resume",
      render: (row) => (
        <StatusPill
          status={row.resumeUrl ? "Uploaded" : "Missing"}
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            className="text-blue-600 hover:underline"
            onClick={() =>
              window.open(row.resumeUrl, "_blank")
            }
          >
            Resume
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <h2 className="text-center mt-10">
        Loading students...
      </h2>
    );
  }

  return (
    <FullWidthListLayout
      role="admin"
      userName="Admin"
      onLogout={() => navigate("/login")}
      title="Students"
      subtitle="All registered students."

      filters={
        <div className="flex gap-3">

          <input
            className="input max-w-xs"
            placeholder="Search student..."
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
          />

          <select
            className="input max-w-[180px]"
            value={branch}
            onChange={(e) =>
              setBranch(e.target.value)
            }
          >
            <option value="">
              All Branches
            </option>

            <option value="CSE">
              CSE
            </option>

            <option value="MCA">
              MCA
            </option>

            <option value="ECE">
              ECE
            </option>

            <option value="ME">
              ME
            </option>

            <option value="EE">
              EE
            </option>

          </select>

        </div>
      }
    >
      <DataTable
        columns={columns}
        rows={filtered}
      />
    </FullWidthListLayout>
  );
}