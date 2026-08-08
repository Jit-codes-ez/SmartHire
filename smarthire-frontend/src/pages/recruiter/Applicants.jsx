import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import FullWidthListLayout from "../../layouts/FullWidthListLayout.jsx";
import DataTable from "../../components/DataTable.jsx";
import ScoreBadge from "../../components/ScoreBadge.jsx";
import StatusPill from "../../components/StatusPill.jsx";
import AvatarInitials from "../../components/AvatarInitials.jsx";
import Button from "../../components/Button.jsx";

import { useToast } from "../../context/ToastContext.jsx";
import { authFetch } from "../../lib/authFetch.js";

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IconUsers({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
      />
    </svg>
  );
}

function IconBriefcase({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.193.163-.43.295-.69.395m-14.61-8.4a48.114 48.114 0 0 0-3.413.387c-1.07.16-1.837 1.094-1.837 2.175v3.783c0 .63.325 1.218.85 1.561m16.5-8.006V7.5a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 3 7.5v.006m16.5 0V7.5m0 0H3m13.5-3.75h-3v3.75h3V3.75Z"
      />
    </svg>
  );
}

export default function Applicants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [drive, setDrive] = useState(null);
  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // ─────────────────────────────────────────────────────────────
  // Load job + applicants
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const loadApplicants = async () => {
      try {
        setLoading(true);

        const storedRecruiter = localStorage.getItem("recruiter");

        if (!storedRecruiter) {
          navigate("/login");
          return;
        }

        let recruiter;

        try {
          recruiter = JSON.parse(storedRecruiter);
        } catch (error) {
          console.error("Invalid recruiter data:", error);
          localStorage.removeItem("recruiter");
          navigate("/login");
          return;
        }

        if (!recruiter?.email) {
          localStorage.removeItem("recruiter");
          navigate("/login");
          return;
        }

        // 1. Load the selected job/drive
        const jobResponse = await authFetch(
          `http://localhost:8080/api/recruiter/jobs/${id}/${encodeURIComponent(
            recruiter.email
          )}`
        );

        if (!jobResponse.ok) {
          const errorText = await jobResponse.text();
          console.error("Load job error:", errorText);
          throw new Error("Failed to load job");
        }

        const jobData = await jobResponse.json();
        setDrive(jobData);

        // 2. Load applicants for this job
        const applicantsResponse = await authFetch(
          `http://localhost:8080/api/recruiter/jobs/${id}/applicants`
        );

        if (!applicantsResponse.ok) {
          const errorText = await applicantsResponse.text();
          console.error("Load applicants error:", errorText);
          throw new Error("Failed to load applicants");
        }

        const applicantsData = await applicantsResponse.json();
        setRows(Array.isArray(applicantsData) ? applicantsData : []);
      } catch (error) {
        console.error("Applicants loading error:", error);
        showToast("Unable to load applicants.", "error");
        setDrive(null);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadApplicants();
    }
  }, [id, navigate, showToast]);

  // ─────────────────────────────────────────────────────────────
  // Ranked applicants
  // ─────────────────────────────────────────────────────────────

  const ranked = useMemo(() => {
    return [...rows].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }, [rows]);

  // ─────────────────────────────────────────────────────────────
  // Applicant status
  // ─────────────────────────────────────────────────────────────

  const setStatus = async (row, status) => {
    try {
      setUpdatingId(row.id);

      const response = await authFetch(
        `http://localhost:8080/api/recruiter/applications/${row.id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Applicant status update error:", errorText);
        throw new Error("Failed to update applicant status");
      }

      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, status } : r))
      );

      showToast(
        `${row.name || "Applicant"} marked as ${status}.`,
        "success"
      );
    } catch (error) {
      console.error("Applicant status error:", error);
      showToast("Failed to update applicant status.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Loading
  // ─────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <FullWidthListLayout
        role="recruiter"
        userName="Recruiter"
        onLogout={() => navigate("/login")}
        title="Applicants"
        subtitle="Loading applicants..."
      >
        <div className="p-10 text-center">
          <p className="text-st-muted">Loading applicants...</p>
        </div>
      </FullWidthListLayout>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Job not found
  // ─────────────────────────────────────────────────────────────

  if (!drive) {
    return (
      <FullWidthListLayout
        role="recruiter"
        userName="Recruiter"
        onLogout={() => navigate("/login")}
        title="Applicants"
        subtitle="Job not found"
      >
        <div className="py-16 text-center">
          <IconBriefcase className="w-10 h-10 text-st-muted mx-auto mb-3" />
          <p className="text-st-text font-semibold">
            Unable to find this job drive.
          </p>
          <p className="text-sm text-st-muted mt-1">
            The job may have been deleted or you may not have permission to view it.
          </p>
          <Button
            className="mt-5"
            onClick={() => navigate("/recruiter/drives")}
          >
            Back to My Drives
          </Button>
        </div>
      </FullWidthListLayout>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Table columns
  // ─────────────────────────────────────────────────────────────

  const columns = [
    {
      key: "name",
      label: "Applicant",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <AvatarInitials name={row.name || row.fullName || "Applicant"} />
          <div>
            <p className="font-semibold text-st-text">
              {row.name || row.fullName || "Unknown Applicant"}
            </p>
            {(row.college || row.degree) && (
              <p className="text-xs text-st-muted mt-0.5">
                {row.college || "—"}
                {row.college && row.degree ? " · " : ""}
                {row.degree || ""}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "score",
      label: "Score",
      sortable: true,
      render: (row) => <ScoreBadge score={row.score ?? row.aiScore ?? 0} />,
    },
    {
      key: "cgpa",
      label: "CGPA",
      sortable: true,
      render: (row) =>
        row.cgpa !== null && row.cgpa !== undefined ? row.cgpa : "—",
    },
    {
      key: "appliedOn",
      label: "Applied",
      render: (row) =>
        row.appliedOn || row.applicationDate || row.createdAt || "—",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusPill status={row.status || "Applied"} />,
    },
    {
      key: "actions",
      label: "",
      render: (row) => {
        const isUpdating = updatingId === row.id;
        const currentStatus = String(row.status || "").toUpperCase();

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="!px-2 !py-1 text-xs"
              disabled={isUpdating}
              onClick={() => setStatus(row, "SHORTLISTED")}
            >
              {isUpdating && currentStatus !== "SHORTLISTED" ? "..." : "Shortlist"}
            </Button>
            <Button
              variant="danger"
              className="!px-2 !py-1 text-xs"
              disabled={isUpdating}
              onClick={() => setStatus(row, "REJECTED")}
            >
              {isUpdating && currentStatus !== "REJECTED" ? "..." : "Reject"}
            </Button>
          </div>
        );
      },
    },
  ];

  // ─────────────────────────────────────────────────────────────
  // Main page
  // ─────────────────────────────────────────────────────────────

  return (
    <FullWidthListLayout
      role="recruiter"
      userName="Recruiter"
      onLogout={() => {
        localStorage.removeItem("recruiter");
        window.dispatchEvent(new Event("authChange"));
        navigate("/login");
      }}
      title={`Applicants — ${drive.title}`}
      subtitle={
        <Link to="/recruiter/drives" style={{ color: "var(--primary)" }}>
          ← Back to My Drives
        </Link>
      }
      action={
        <Button variant="secondary" onClick={() => navigate("/recruiter/drives")}>
          Back
        </Button>
      }
    >
      {/* ── Job summary ─────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-st-text">{drive.title}</h2>
            <p className="text-sm text-st-muted mt-1">
              {drive.location || "Location not specified"}
              {drive.employmentType ? ` · ${drive.employmentType}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-st-muted">Applicants</p>
              <p className="text-xl font-bold text-st-text">{rows.length}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-st-muted">Shortlisted</p>
              <p className="text-xl font-bold text-green-600">
                {
                  rows.filter(
                    (r) => String(r.status || "").toUpperCase() === "SHORTLISTED"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Applicants table / empty state ──────────────────────────────────── */}
      {rows.length === 0 ? (
        <div className="py-16 text-center border border-st-border rounded-input">
          <IconUsers className="w-10 h-10 text-st-muted mx-auto mb-3" />
          <p className="font-semibold text-st-text">No applicants yet</p>
          <p className="text-sm text-st-muted mt-1">
            No students have applied to this job drive.
          </p>
        </div>
      ) : (
        <DataTable columns={columns} data={ranked} />
      )}
    </FullWidthListLayout>
  );
}