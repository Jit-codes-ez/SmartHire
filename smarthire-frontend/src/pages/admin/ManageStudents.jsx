import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import FullWidthListLayout from "../../layouts/FullWidthListLayout.jsx";
import DataTable from "../../components/DataTable.jsx";
import StatusPill from "../../components/StatusPill.jsx";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { authFetch } from "../../lib/authFetch.js";

// ── Icons ────────────────────────────────────────────────────────────────────

function IconUsers({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconBranch({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  );
}

function IconGraduate({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m-4-3.5l4 2 4-2" />
    </svg>
  );
}

function IconCheckBadge({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ManageStudents() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [branch, setBranch] = useState("");
  const [course, setCourse] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 10;

  // ── Fetch ──
  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await authFetch("http://localhost:8080/api/admin/students");
      if (!response.ok) throw new Error("Failed to load students");
      setStudents(await response.json());
    } catch (error) {
      console.error(error);
      showToast("Unable to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStudents(); }, []);

  // ── Delete ──
  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student permanently?")) return;
    try {
      const response = await authFetch(
        `http://localhost:8080/api/admin/students/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Delete failed");
      setStudents((prev) => prev.filter((s) => s.id !== id));
      showToast("Student deleted successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Delete failed", "error");
    }
  };

  // ── Stats ──
  const stats = useMemo(() => ({
    total: students.length,
    cse: students.filter((s) => s.branch === "CSE").length,
    mca: students.filter((s) => s.course === "MCA").length,
    placed: students.filter((s) => s.status === "PLACED").length,
  }), [students]);

  // ── Filter + paginate ──
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const text = `${s.fullName} ${s.branch} ${s.course} ${s.email}`.toLowerCase();
      return (
        text.includes(query.toLowerCase()) &&
        (!branch || s.branch === branch) &&
        (!course || s.course === course)
      );
    });
  }, [students, query, branch, course]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentStudents = filteredStudents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // ── Columns ──
  const columns = [
    { key: "fullName", label: "Student Name", sortable: true },
    { key: "course",   label: "Course",        sortable: true },
    { key: "branch",   label: "Branch",        sortable: true },
    { key: "cgpa",     label: "CGPA",          sortable: true },
    { key: "passingYear", label: "Passing Year", sortable: true },
    {
      key: "resume",
      label: "Resume",
      render: (row) => (
        <StatusPill status={row.resumeUrl ? "Uploaded" : "Missing"} />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/admin/students/${row.id}`)}
          >
            View
          </Button>
          <Button onClick={() => navigate(`/admin/students/edit/${row.id}`)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => deleteStudent(row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // ── Shared filters UI ──
  const filtersUI = (
    <div className="flex flex-wrap gap-3">
      <input
        className="input max-w-xs"
        placeholder="Search by name, email, branch…"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
      />
      <select
        className="input max-w-[180px]"
        value={branch}
        onChange={(e) => { setBranch(e.target.value); setPage(1); }}
      >
        <option value="">All Branches</option>
        <option value="CSE">CSE</option>
        <option value="ECE">ECE</option>
        <option value="ME">ME</option>
        <option value="EE">EE</option>
      </select>
      <select
        className="input max-w-[180px]"
        value={course}
        onChange={(e) => { setCourse(e.target.value); setPage(1); }}
      >
        <option value="">All Courses</option>
        <option value="BTECH">BTECH</option>
        <option value="MTECH">MTECH</option>
        <option value="MCA">MCA</option>
      </select>
      <Button variant="secondary" onClick={loadStudents}>
        Refresh
      </Button>
    </div>
  );

  // ── Loading state ──
  if (loading) {
    return (
      <FullWidthListLayout
        title="Manage Students"
        subtitle="View and manage all registered students."
        filters={filtersUI}
      >
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
          <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-sm">Loading students…</p>
        </div>
      </FullWidthListLayout>
    );
  }

  // ── Main render ──
  return (
    <FullWidthListLayout
      title="Manage Students"
      subtitle="View and manage all registered students."
      filters={filtersUI}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <IconUsers />
            </span>
            <p className="text-gray-500 text-sm">Total Students</p>
          </div>
          <h2 className="text-3xl font-bold text-blue-600">{stats.total}</h2>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 rounded-lg bg-green-50 text-green-600">
              <IconBranch />
            </span>
            <p className="text-gray-500 text-sm">CSE Students</p>
          </div>
          <h2 className="text-3xl font-bold text-green-600">{stats.cse}</h2>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <IconGraduate />
            </span>
            <p className="text-gray-500 text-sm">MCA Students</p>
          </div>
          <h2 className="text-3xl font-bold text-purple-600">{stats.mca}</h2>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <IconCheckBadge />
            </span>
            <p className="text-gray-500 text-sm">Placed</p>
          </div>
          <h2 className="text-3xl font-bold text-teal-600">{stats.placed}</h2>
        </Card>
      </div>

      {/* Table or empty state */}
      {currentStudents.length === 0 ? (
        <Card>
          <EmptyState
            icon={<IconUsers className="h-10 w-10 text-slate-300" />}
            title="No students found"
            description="No student records match your search."
          />
        </Card>
      ) : (
        <DataTable columns={columns} rows={currentStudents} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <Button
            variant="secondary"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="font-semibold text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </FullWidthListLayout>
  );
}