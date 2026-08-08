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
return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3v18"/><path d="M6 8h6a4 4 0 0 1 4 4v9"/><path d="M6 15h4a3 3 0 0 1 3 3v3"/></svg>;
}

function IconGraduate({ className = "h-5 w-5" }) {
return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 10l10-5 10 5-10 5-10-5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/><path d="M22 10v6"/></svg>;
}

function IconCheckBadge({ className = "h-5 w-5" }) {
return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l2.2 1.5 2.7-.1 1.3 2.4 2.4 1.3-.1 2.7L22 13l-1.5 2.2.1 2.7-2.4 1.3-1.3 2.4-2.7-.1L12 21l-2.2-1.5-2.7.1-1.3-2.4-2.4-1.3.1-2.7L2 13l1.5-2.2-.1-2.7 2.4-1.3 1.3-2.4 2.7.1L12 3Z"/><path d="m9 12 2 2 4-4"/></svg>;
}

/* ─── Student Detail Modal ──────────────────────────────────────────────── */

function StudentModal({ student, onClose }) {
  if (!student) return null;

  const fields = [
    { label: "Student Id", value: student.id },
    { label: "Full Name", value: student.fullName },
    { label: "Email", value: student.email },
    { label: "Mobile", value: student.mobileNumber },
    { label: "Course", value: student.course },
    { label: "Branch", value: student.branch },
    { label: "CGPA", value: student.cgpa },
    { label: "Passing Year", value: student.passingYear },
    { label: "Skills", value: student.skills || "N/A" },
    { label: "LinkedIn", value: student.linkedinUrl || "N/A", link: student.linkedinUrl },
    { label: "Resume", value: student.resumeUrl ? "Uploaded" : "Not uploaded", link: student.resumeUrl,},
  ];

return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Student Details"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              Student Details
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Full profile information
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition p-1 rounded-md hover:bg-slate-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Fields */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto space-y-3">
          {fields
            .filter(({ link }) => !link)
            .map(({ label, value }) => (
              <div
                key={label}
                className="flex items-start gap-3 py-2 border-b border-slate-700/50 last:border-0"
              >
                <span className="text-xs text-slate-400 w-36 shrink-0 pt-0.5">
                  {label}
                </span>
                <span className="text-sm text-slate-100 break-all">
                  {value || "—"}
                </span>
              </div>
            ))}

          {/* Links row */}
          {fields.some(({ link }) => link) && (
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {fields
                .filter(({ link }) => link)
                .map(({ label, link }) => (
                  
                  <a  key={label}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition ${
                      label === "LinkedIn"
                        ? "text-blue-300 bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20"
                        : "text-teal-300 bg-teal-500/10 border-teal-500/30 hover:bg-teal-500/20"
                    }`}
                  >
                    {label === "LinkedIn" ? (
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
                      </svg>
                    ) : (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                    {label}
                  </a>
                ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-700 bg-slate-800/80">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Constants ────────────────────────────────────────────────────────────────

const COURSE_BRANCHES = {
  BTECH: ['CSE', 'ECE', 'ME', 'EE', 'CE'],
  MTECH: ['CSE', 'ECE', 'ME'],
  BCA: ['BCA'],
  MCA: ['MCA'],
};

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
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget,setDeleteTarget] = useState(null);
  const [deleteReason,setDeleteReason] = useState("");
  const [deleting,setDeleting] = useState(false);

  const itemsPerPage = 10;

  // ── Available branches based on selected course ──
  const availableBranches = course
    ? COURSE_BRANCHES[course] || []
    : ['CSE', 'ECE', 'ME', 'EE', 'CE', 'BCA', 'MCA'];

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
  const deleteStudent = async () => {
if (!deleteTarget) return;
if (!deleteReason.trim()) {
showToast("Please provide a reason for deletion","error");
return;
}
setDeleting(true);
try {
const response = await authFetch(`http://localhost:8080/api/admin/students/${deleteTarget.id}`,{
method:"DELETE",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({reason:deleteReason.trim()})
});
const message = await response.text();
if (!response.ok) throw new Error(message || "Delete failed");
setStudents((prev)=>prev.filter((student)=>student.id!==deleteTarget.id));
showToast("Student deleted successfully","success");
setDeleteTarget(null);
setDeleteReason("");
} catch(error) {
showToast(error.message || "Delete failed","error");
} finally {
setDeleting(false);
}
};

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

    // ── Stats ──
  const stats = useMemo(() => ({
  total: filteredStudents.length,
  filteredByBranch: branch ? filteredStudents.filter((s) => s.branch === branch).length : filteredStudents.length,
  filteredByCourse: course ? filteredStudents.filter((s) => s.course === course).length : filteredStudents.length,
}), [filteredStudents, branch, course]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentStudents = filteredStudents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // ── Columns ──
  const columns = [
    {key: "id", label: "Student Id", sortable: true} ,
    { key: "fullName", label: "Student Name", sortable: true },
    { key: "email", label: "Student Email", sortable: true },
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
            onClick={() => setViewTarget(row)}
          >
            View
          </Button>
         <Button variant="danger" onClick={() => { setDeleteTarget(row); setDeleteReason(""); }}>
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
        value={course}
        onChange={(e) => {
          const newCourse = e.target.value;
          setCourse(newCourse);
          setBranch("");
          setPage(1);
        }}
      >
        <option value="">All Courses</option>
        <option value="BTECH">BTECH</option>
        <option value="MTECH">MTECH</option>
        <option value="BCA">BCA</option>
        <option value="MCA">MCA</option>

      </select>

      <select
        className="input max-w-[180px]"
        value={branch}
        disabled={!course}
        onChange={(e) => { setBranch(e.target.value); setPage(1); }}
      >
        <option value="">{course ? "All Branches" : "Select course first"}</option>
        {availableBranches.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      <Button variant="secondary" onClick={loadStudents}>
        Refresh
      </Button>
    </div>
  );

  // ── Main render ──
  return (
    <FullWidthListLayout
      title=" Student Management"
      subtitle="View and manage all registered students."
      filters={filtersUI}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
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
    <span className="p-2 rounded-lg bg-purple-50 text-purple-600">
      <IconGraduate />
    </span>
    <p className="text-gray-500 text-sm">{course || "All Courses"}</p>
  </div>
  <h2 className="text-3xl font-bold text-purple-600">{stats.filteredByCourse}</h2>
</Card>

<Card>
  <div className="flex items-center gap-3 mb-2">
    <span className="p-2 rounded-lg bg-green-50 text-green-600">
      <IconBranch />
    </span>
    <p className="text-gray-500 text-sm">{branch || "All Branches"}</p>
  </div>
  <h2 className="text-3xl font-bold text-green-600">{stats.filteredByBranch}</h2>
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

<StudentModal student={viewTarget} onClose={() => setViewTarget(null)} />
      
      {deleteTarget && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    aria-label="Delete Student"
  >
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={() => { setDeleteTarget(null); setDeleteReason(""); }}
    />

    {/* Panel */}
    <div className="relative z-10 w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-slate-100">Delete Student</h2>
        <p className="text-xs text-slate-400 mt-0.5">This action cannot be undone</p>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        <p className="text-sm text-slate-300">
          You are about to permanently delete{" "}
          <span className="font-semibold text-slate-100">{deleteTarget.fullName}</span>.
        </p>
        <p className="mt-1.5 text-sm text-slate-400">
          An email containing the reason will be sent to the student.
        </p>

        <div className="mt-5">
          <label className="mb-2 block text-xs font-medium text-slate-400 uppercase tracking-wide">
            Reason for deletion
          </label>
          <textarea
            className="w-full min-h-[120px] resize-none rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/50"
            placeholder="Enter the reason for deleting this student..."
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            disabled={deleting}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 px-6 py-4 border-t border-slate-700 bg-slate-800/80">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => { setDeleteTarget(null); setDeleteReason(""); }}
          disabled={deleting}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          className="flex-1"
          onClick={deleteStudent}
          disabled={deleting || !deleteReason.trim()}
        >
          {deleting ? "Deleting..." : "Delete Student"}
        </Button>
      </div>
    </div>
  </div>
)}

 
    </FullWidthListLayout>
  );
}