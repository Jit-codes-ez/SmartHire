import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import FullWidthListLayout from "../../layouts/FullWidthListLayout.jsx";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { authFetch } from "../../lib/authFetch.js";

function IconBuilding({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1"
      />
    </svg>
  );
}

export default function Recruiters() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 8;

  const loadRecruiters = async () => {
    try {
      setLoading(true);

      const response = await authFetch(
        "http://localhost:8080/api/admin/recruiters"
      );

      if (!response.ok) {
        throw new Error("Failed to load recruiters");
      }

      const data = await response.json();
      setRecruiters(data);
    } catch (error) {
      console.error(error);
      showToast("Unable to load recruiters", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecruiters();
  }, []);

  const deleteRecruiter = async (id) => {
    if (!window.confirm("Delete this recruiter permanently?")) {
      return;
    }

    try {
      const response = await authFetch(
        `http://localhost:8080/api/admin/recruiters/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setRecruiters((prev) => prev.filter((r) => r.id !== id));

      showToast("Recruiter deleted successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Delete failed", "error");
    }
  };

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

  const totalPages = Math.ceil(
    filteredRecruiters.length / itemsPerPage
  );

  const currentRecruiters = filteredRecruiters.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const filtersUI = (
    <div className="flex flex-col md:flex-row gap-4">
      <input
        type="text"
        className="input flex-1"
        placeholder="Search company, recruiter or email..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <Button variant="secondary" onClick={loadRecruiters}>
        Refresh
      </Button>
    </div>
  );

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
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <IconBuilding className="h-6 w-6" />
            </span>

            <div>
              <p className="text-gray-500 text-sm">
                Total Recruiters
              </p>

              <h2 className="text-3xl font-bold text-blue-600">
                {recruiters.length}
              </h2>
            </div>
          </div>
        </Card>
      </div>

      {/* Recruiter List */}
      {currentRecruiters.length === 0 ? (
        <Card>
          <EmptyState
            icon={
              <IconBuilding className="h-10 w-10 text-slate-300" />
            }
            title={
              search
                ? "No recruiters found"
                : "No recruiters available"
            }
            description={
              search
                ? "Try searching with a different company, recruiter or email."
                : "There are currently no recruiter accounts."
            }
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">
                    Recruiter
                  </th>

                  <th className="text-center py-3">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentRecruiters.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b hover:bg-slate-800/70 transition-colors duration-200"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center h-11 w-11 rounded-full bg-blue-50 text-blue-600">
                          <IconBuilding className="h-5 w-5" />
                        </span>

                        <div>
                          <p className="font-semibold text-white">
                            {r.companyName || "Company Not Available"}
                          </p>

                          <p className="text-sm font-medium text-white">
                            {r.fullName || "Recruiter"}
                          </p>

                          <p className="text-xs text-slate-200">
                            {r.email || "Email not available"}
                          </p>

                          {r.designation && (
                          <p className="text-xs text-slate-200">
                            {r.designation}
                          </p>
                  )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4">
                      <div className="flex justify-center">
                        <Button
                          variant="danger"
                          onClick={() => deleteRecruiter(r.id)}
                        >
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