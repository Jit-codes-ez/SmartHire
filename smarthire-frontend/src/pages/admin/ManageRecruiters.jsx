import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import FullWidthListLayout from "../../layouts/FullWidthListLayout.jsx";
import DataTable from "../../components/DataTable.jsx";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { authFetch } from "../../lib/authFetch.js";

// ── Icons ────────────────────────────────────────────────────────────────────

function IconBuilding({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1" />
    </svg>
  );
}

/* ─── Recruiter Detail Modal ────────────────────────────────────────────────── */

function RecruiterViewModal({ recruiter, onClose }) {
  if (!recruiter) return null;

  const fields = [
    { label: "Recruiter Id", value: recruiter.id },
    { label: "Full Name", value: recruiter.fullName },
    { label: "Email", value: recruiter.email },
    { label: "Mobile", value: recruiter.mobileNumber },
    { label: "Company", value: recruiter.companyName },
    { label: "Designation", value: recruiter.designation },
    { label: "Industry", value: recruiter.industry },
    { label: "City", value: recruiter.city },
    { label: "State", value: recruiter.state },
    { label: "Country", value: recruiter.country },
    { label: "Registration Number", value: recruiter.companyRegistrationNumber },
    { label: "Website", value: recruiter.companyWebsite, link: recruiter.companyWebsite },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Recruiter Details"
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
              Recruiter Details
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

        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto space-y-3">
  {fields.map(({ label, value, link }) => (
    <div
      key={label}
      className="flex items-start gap-3 py-2 border-b border-slate-700/50 last:border-0"
    >
      <span className="text-xs text-slate-400 w-36 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-slate-100 break-all flex items-center gap-1.5">
        {value}
        {link && (
          
          <a  href={link.startsWith("http") ? link : `https://${link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-teal-400 transition shrink-0"
            aria-label={`Open ${label}`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </span>
    </div>
  ))}
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

// ── Component ────────────────────────────────────────────────────────────────

export default function ManageRecruiters() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleting, setDeleting] = useState(false);

  const itemsPerPage = 10;

  // ── Fetch ──
  const loadRecruiters = async () => {
    try {
      setLoading(true);
      const response = await authFetch("/api/admin/recruiters");
      if (!response.ok) throw new Error("Failed to load recruiters");
      setRecruiters(await response.json());
    } catch (error) {
      console.error(error);
      showToast("Unable to load recruiters", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRecruiters(); }, []);

  // ── Delete ──
// ── Delete ──
const deleteRecruiter = async () => {
  if (!deleteTarget) return;
  if (!deleteReason.trim()) {
    showToast("Please provide a reason for deletion", "error");
    return;
  }
  setDeleting(true);
  try {
    const response = await authFetch(
      `/api/admin/recruiters/${deleteTarget.id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: deleteReason.trim() }),
      }
    );
    if (!response.ok) throw new Error("Delete failed");
    setRecruiters((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    showToast("Recruiter deleted successfully", "success");
    setDeleteTarget(null);
    setDeleteReason("");
  } catch (error) {
    console.error(error);
    showToast("Delete failed", "error");
  } finally {
    setDeleting(false);
  }
};

  // ── Filter + paginate ──
  const filteredRecruiters = useMemo(() => {
    const searchText = search.toLowerCase().trim();
    return recruiters.filter((r) => {
      const text = `
        ${r.companyName || ""}
        ${r.fullName || ""}
        ${r.email || ""}
        ${r.designation || ""}
        ${r.mobileNumber || ""}
        ${r.industry || ""}
      `.toLowerCase();
      return text.includes(searchText);
    });
  }, [recruiters, search]);

  const totalPages = Math.ceil(filteredRecruiters.length / itemsPerPage);
  const currentRecruiters = filteredRecruiters.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // ── Columns ──
  const columns = [
    { key: "id", label: "Recruiter Id", sortable: true },
    { key: "fullName", label: "Recruiter Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "companyName", label: "Company", sortable: true },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setViewTarget(row)}>
            View
          </Button>
<Button
  variant="danger"
  onClick={() => { setDeleteTarget(row); setDeleteReason(""); }}
>
  Delete
</Button>
        </div>
      ),
    },
  ];

  // ── Shared filters UI ──
  const filtersUI = (
    <div className="flex flex-col md:flex-row gap-4">
      <input
        type="text"
        className="input flex-1"
        placeholder="Search company, recruiter or email..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
      />
      <Button variant="secondary" onClick={loadRecruiters}>
        Refresh
      </Button>
    </div>
  );

  // ── Loading state ──
  if (loading) {
    return (
      <FullWidthListLayout
        role="admin"
        userName="Admin"
        onLogout={() => navigate("/login")}
        title="Recruiter Management"
        subtitle="Delete and manage recruiter accounts."
      >
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
          <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-sm">Loading recruiters...</p>
        </div>
      </FullWidthListLayout>
    );
  }

  // ── Main render ──
  return (
    <FullWidthListLayout
      role="admin"
      userName="Admin"
      onLogout={() => navigate("/login")}
      title="Recruiter Management"
      subtitle="Delete and manage recruiter accounts."
      filters={filtersUI}
    >

      {/* Total Recruiters */}
      <div className="mb-8">
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <IconBuilding />
            </span>
              <p className="text-gray-500 text-sm">Total Recruiters</p>
          </div>
          <h2 className="text-3xl font-bold text-blue-600">{recruiters.length}</h2>
        </Card>
      </div>

      {/* Table or empty state */}
      {currentRecruiters.length === 0 ? (
        <Card>
          <EmptyState
            icon={<IconBuilding className="h-10 w-10 text-slate-300" />}
            title={search ? "No recruiters found" : "No recruiters available"}
            description={
              search
                ? "Try searching with a different company, recruiter or email."
                : "There are currently no recruiter accounts."
            }
          />
        </Card>
      ) : (
        <DataTable columns={columns} rows={currentRecruiters} />
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

      {/* View Modal */}
      <RecruiterViewModal recruiter={viewTarget} onClose={() => setViewTarget(null)} />

      {/* Delete Modal */}
{/* Delete Modal */}
{deleteTarget && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    aria-label="Delete Recruiter"
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
        <h2 className="text-lg font-semibold text-slate-100">Delete Recruiter</h2>
        <p className="text-xs text-slate-400 mt-0.5">This action cannot be undone</p>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        <p className="text-sm text-slate-300">
          You are about to permanently delete{" "}
          <span className="font-semibold text-slate-100">
            {deleteTarget.companyName || deleteTarget.fullName}
          </span>.
        </p>
        <p className="mt-1.5 text-sm text-slate-400">
          An email containing the reason will be sent to the recruiter.
        </p>

        <div className="mt-5">
          <label className="mb-2 block text-xs font-medium text-slate-400 uppercase tracking-wide">
            Reason for deletion
          </label>
          <textarea
            className="w-full min-h-[120px] resize-none rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/50"
            placeholder="Enter the reason for deleting this recruiter..."
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
          onClick={deleteRecruiter}
          disabled={deleting || !deleteReason.trim()}
        >
          {deleting ? "Deleting..." : "Delete Recruiter"}
        </Button>
      </div>
    </div>
  </div>
)}
    </FullWidthListLayout>
  );
}