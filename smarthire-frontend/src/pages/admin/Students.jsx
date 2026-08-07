import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import FullWidthListLayout from "../../layouts/FullWidthListLayout.jsx";
import DataTable from "../../components/DataTable.jsx";
import StatusPill from "../../components/StatusPill.jsx";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function Students() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [branch, setBranch] = useState("");
  const [course, setCourse] = useState("");

  const [page, setPage] = useState(1);

  const itemsPerPage = 10;

  // Fetch Students
  const loadStudents = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/admin/students"
      );

      if (!response.ok) {
        throw new Error("Failed to load students");
      }

      const data = await response.json();
      setStudents(data);

    } catch (error) {
      console.log(error);

      showToast(
        "Unable to load students",
        "error"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Delete Student
  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this student permanently?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/students/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setStudents((prev) =>
        prev.filter(
          (student) => student.id !== id
        )
      );

      showToast(
        "Student deleted successfully",
        "success"
      );

    } catch (error) {
      console.log(error);

      showToast(
        "Delete failed",
        "error"
      );
    }
  };

  // Statistics
  const stats = useMemo(() => ({
    total: students.length,

    cse: students.filter(
      (s) => s.branch === "CSE"
    ).length,

    mca: students.filter(
      (s) => s.course === "MCA"
    ).length,

    placed: students.filter(
      (s) => s.status === "PLACED"
    ).length,

  }), [students]);


  // Search and Filters
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {

      const text = `
        ${s.fullName}
        ${s.branch}
        ${s.course}
        ${s.email}
      `.toLowerCase();

      const matchesSearch =
        text.includes(
          query.toLowerCase()
        );

      const matchesBranch =
        !branch || s.branch === branch;

      const matchesCourse =
        !course || s.course === course;

      return (
        matchesSearch &&
        matchesBranch &&
        matchesCourse
      );
    });

  }, [students, query, branch, course]);


  const totalPages = Math.ceil(
    filteredStudents.length / itemsPerPage
  );


  const currentStudents =
    filteredStudents.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );


  if (loading) {
    return (
      <FullWidthListLayout
        role="admin"
        userName="Admin"
        onLogout={() => navigate("/login")}
        title="Students"
        subtitle="Manage registered students."
      >
        <div className="flex justify-center py-20">
          <p className="text-lg font-semibold">
            Loading students...
          </p>
        </div>
      </FullWidthListLayout>
    );
  }


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
      sortable: true,
    },

    {
      key: "resume",
      label: "Resume",

      render: (row) => (
        <StatusPill
          status={
            row.resumeUrl
              ? "Uploaded"
              : "Missing"
          }
        />
      ),
    },

    {
      key: "actions",
      label: "Actions",

      render: (row) => (
        <div className="flex gap-2">

          <Button
            variant="secondary"
            onClick={() =>
              navigate(
                `/admin/students/${row.id}`
              )
            }
          >
            View
          </Button>

          <Button
            onClick={() =>
              navigate(
                `/admin/students/edit/${row.id}`
              )
            }
          >
            Edit
          </Button>

          <Button
            variant="danger"
            onClick={() =>
              deleteStudent(row.id)
            }
          >
            Delete
          </Button>

        </div>
      ),
    },
  ];


  return (
    <FullWidthListLayout
      role="admin"
      userName="Admin"
      onLogout={() => navigate("/login")}

      title="Students"
      subtitle="View and manage all registered students."

      action={
        <Button
          onClick={() =>
            navigate("/admin/students/add")
          }
        >
          + Add Student
        </Button>
      }

      filters={
        <div className="flex flex-wrap gap-3">

          <input
            className="input max-w-xs"
            placeholder="Search student..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="input max-w-[180px]"
            value={branch}
            onChange={(e) => {
              setBranch(e.target.value);
              setPage(1);
            }}
          >
            <option value="">
              All Branches
            </option>
            <option value="CSE">
              CSE
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

          <select
            className="input max-w-[180px]"
            value={course}
            onChange={(e) => {
              setCourse(e.target.value);
              setPage(1);
            }}
          >
            <option value="">
              All Courses
            </option>
            <option value="BTECH">
              BTECH
            </option>
            <option value="MTECH">
              MTECH
            </option>
            <option value="MCA">
              MCA
            </option>
          </select>


          <Button
            variant="secondary"
            onClick={loadStudents}
          >
            Refresh
          </Button>

        </div>
      }
    >

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <Card>
          <p className="text-gray-500 text-sm">
            Total Students
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {stats.total}
          </h2>
        </Card>


        <Card>
          <p className="text-gray-500 text-sm">
            CSE Students
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {stats.cse}
          </h2>
        </Card>


        <Card>
          <p className="text-gray-500 text-sm">
            MCA Students
          </p>

          <h2 className="text-3xl font-bold text-purple-600 mt-2">
            {stats.mca}
          </h2>
        </Card>


        <Card>
          <p className="text-gray-500 text-sm">
            Placed
          </p>

          <h2 className="text-3xl font-bold text-teal-600 mt-2">
            {stats.placed}
          </h2>
        </Card>

      </div>


      {currentStudents.length === 0 ? (

        <Card>
          <EmptyState
            icon="🎓"
            title="No students found"
            description="No student records match your search."
          />
        </Card>

      ) : (

        <DataTable
          columns={columns}
          rows={currentStudents}
        />

      )}


      {totalPages > 1 && (

        <div className="flex justify-center items-center gap-3 mt-8">

          <Button
            variant="secondary"
            disabled={page === 1}
            onClick={() =>
              setPage(prev => prev - 1)
            }
          >
            Previous
          </Button>


          <span className="font-semibold">
            Page {page} of {totalPages}
          </span>


          <Button
            variant="secondary"
            disabled={page === totalPages}
            onClick={() =>
              setPage(prev => prev + 1)
            }
          >
            Next
          </Button>

        </div>

      )}

    </FullWidthListLayout>
  );
}