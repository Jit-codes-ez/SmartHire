import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import FullWidthListLayout from "../../layouts/FullWidthListLayout.jsx";
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

function IconCheckCircle({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconClock({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconXCircle({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15 9l-6 6m0-6l6 6m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function Recruiters() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 8;

  // ── Fetch ──
  const loadRecruiters = async () => {
    try {
      setLoading(true);
      const response = await authFetch("http://localhost:8080/api/admin/recruiters");
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

  // ── Approve / Reject ──
  const updateStatus = async (id, status) => {
    try {
      const response = await authFetch(
        `http://localhost:8080/api/admin/recruiters/${id}/${status}`,
        { method: "PUT" }
      );
      if (!response.ok) throw new Error("Failed");

      setRecruiters((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: status === "approve" ? "APPROVED" : "REJECTED" }
            : r
        )
      );

      showToast(
        status === "approve" ? "Recruiter approved" : "Recruiter rejected",
        "success"
      );
    } catch (error) {
      console.error(error);
      showToast("Operation failed", "error");
    }
  };

  // ── Delete ──
  const deleteRecruiter = async (id) => {
    if (!window.confirm("Delete this recruiter permanently?")) return;
    try {
      const response = await authFetch(
        `http://localhost:8080/api/admin/recruiters/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Delete failed");
      setRecruiters((prev) => prev.filter((r) => r.id !== id));
      showToast("Recruiter deleted", "success");
    } catch (error) {
      console.error(error);
      showToast("Delete failed", "error");
    }
  };

  // ── Stats ──
  const stats = useMemo(() => ({
    total: recruiters.length,
    approved: recruiters.filter((r) => r.status === "APPROVED").length,
    pending: recruiters.filter((r) => r.status === "PENDING").length,
    rejected: recruiters.filter((r) => r.status === "REJECTED").length,
  }), [recruiters]);

  // ── Filter + paginate ──
  const filteredRecruiters = useMemo(() => {
    return recruiters.filter((r) => {
      const matchesTab = r.status === activeTab;
      const text = `${r.companyName} ${r.fullName} ${r.email}`.toLowerCase();
      return matchesTab && text.includes(search.toLowerCase());
    });
  }, [recruiters, activeTab, search]);

  const totalPages = Math.ceil(filteredRecruiters.length / itemsPerPage);
  const currentRecruiters = filteredRecruiters.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // ── Shared filters UI ──
  const filtersUI = (
    <div className="flex flex-col md:flex-row gap-4">
      <input
        type="text"
        className="input flex-1"
        placeholder="Search company, recruiter or email…"
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
        subtitle="Review and manage recruiter registrations."
      >
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
          <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-sm">Loading recruiters…</p>
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
      subtitle="Approve, reject and manage recruiter accounts."
      filters={filtersUI}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <IconBuilding />
            </span>
            <p className="text-gray-500 text-sm">Total Recruiters</p>
          </div>
          <h2 className="text-3xl font-bold text-blue-600">{stats.total}</h2>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 rounded-lg bg-green-50 text-green-600">
              <IconCheckCircle />
            </span>
            <p className="text-gray-500 text-sm">Approved</p>
          </div>
          <h2 className="text-3xl font-bold text-green-600">{stats.approved}</h2>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
              <IconClock />
            </span>
            <p className="text-gray-500 text-sm">Pending</p>
          </div>
          <h2 className="text-3xl font-bold text-yellow-600">{stats.pending}</h2>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 rounded-lg bg-red-50 text-red-600">
              <IconXCircle />
            </span>
            <p className="text-gray-500 text-sm">Rejected</p>
          </div>
          <h2 className="text-3xl font-bold text-red-600">{stats.rejected}</h2>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <Button
          variant={activeTab === "PENDING" ? "primary" : "secondary"}
          onClick={() => { setActiveTab("PENDING"); setPage(1); }}
        >
          Pending Recruiters
        </Button>

        <Button
          variant={activeTab === "APPROVED" ? "primary" : "secondary"}
          onClick={() => { setActiveTab("APPROVED"); setPage(1); }}
        >
          Approved Recruiters
        </Button>

        <Button
          variant={activeTab === "REJECTED" ? "primary" : "secondary"}
          onClick={() => { setActiveTab("REJECTED"); setPage(1); }}
        >
          Rejected
        </Button>
      </div>

      {/* Recruiter List */}
      {currentRecruiters.length === 0 ? (
        <Card>
          <EmptyState
            icon={<IconBuilding className="h-10 w-10 text-slate-300" />}
            title="No recruiters found"
            description={
              activeTab === "PENDING"
                ? "No recruiters are waiting for approval."
                : "No recruiters available."
            }
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Company</th>
                  <th className="text-left py-3">Recruiter</th>
                  <th className="text-left py-3">Email</th>
                  <th className="text-left py-3">Industry</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-center py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRecruiters.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4">
                      <p className="font-semibold">{r.companyName}</p>
                    </td>

                    <td>
                      <p className="font-medium">{r.fullName}</p>
                      <p className="text-xs text-gray-500">{r.designation}</p>
                    </td>

                    <td>
                      <p className="text-sm">{r.email}</p>
                      <p className="text-xs text-gray-500">{r.mobileNumber}</p>
                    </td>

                    <td>{r.industry || "N/A"}</td>

                    <td>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          r.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : r.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td>
                      <div className="flex justify-center gap-2">
                        {r.status === "PENDING" && (
                          <>
                            <Button onClick={() => updateStatus(r.id, "approve")}>
                              Approve
                            </Button>
                            <Button variant="danger" onClick={() => updateStatus(r.id, "reject")}>
                              Reject
                            </Button>
                          </>
                        )}

                        {r.status === "APPROVED" && (
                          <Button
                            variant="secondary"
                            onClick={() => navigate(`/admin/recruiters/${r.id}`)}
                          >
                            View
                          </Button>
                        )}

                        <Button variant="danger" onClick={() => deleteRecruiter(r.id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
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