import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { authFetch } from "../../lib/authFetch.js";

/* ─── Primitive UI components ──────────────────────────────────────────────── */

function DarkCard({ children, className = "", id }) {
  return (
    <div
      id={id}
      className={`bg-slate-800 border border-slate-700 rounded-xl p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function DarkButton({
  children,
  variant = "primary",
  disabled,
  onClick,
  className = "",
  size = "md",
}) {
  const base =
    "rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-sm",
  };
  const variants = {
    primary: "bg-teal-600 text-white hover:bg-teal-500 focus:ring-teal-500",
    secondary:
      "bg-slate-700 text-slate-200 hover:bg-slate-600 focus:ring-slate-500",
    danger: "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500",
    ghost:
      "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 focus:ring-slate-500",
  };
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

/* ─── Recruiter Detail Modal ────────────────────────────────────────────────── */

function RecruiterModal({ recruiter, onClose, onApprove, onReject, actioning }) {
  if (!recruiter) return null;

const fields = [
  { label: "Full Name", value: recruiter.fullName },
  { label: "Email", value: recruiter.email },
  { label: "Phone", value: recruiter.mobileNumber },
  { label: "Company", value: recruiter.companyName },
  { label: "Website", value: recruiter.companyWebsite, link: recruiter.companyWebsite },
  { label: "Designation", value: recruiter.designation },
  { label: "Industry", value: recruiter.industry },
  { label: "City", value: recruiter.city},
  { label: "Country", value: recruiter.country },
  { label: "State", value: recruiter.state },
  { label: "Registration Number", value: recruiter.companyRegistrationNumber},
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
              Review before approving or rejecting
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
          <DarkButton
            className="flex-1"
            disabled={actioning}
            onClick={() => onApprove(recruiter)}
          >
            {actioning ? "Processing…" : "Approve"}
          </DarkButton>
          <DarkButton
            variant="danger"
            className="flex-1"
            disabled={actioning}
            onClick={() => onReject(recruiter)}
          >
            {actioning ? "Processing…" : "Reject"}
          </DarkButton>
          <DarkButton variant="secondary" onClick={onClose} disabled={actioning}>
            Cancel
          </DarkButton>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat card ─────────────────────────────────────────────────────────────── */

function StatCard({ title, value, color, badge }) {
  return (
    <DarkCard className="relative overflow-hidden">
      {badge > 0 && (
        <span className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">
        {title}
      </p>
      <h2 className={`text-4xl font-bold mt-3 tabular-nums ${color}`}>
        {value}
      </h2>
    </DarkCard>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────────────────────  */

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loginData = JSON.parse(localStorage.getItem("admin") || "{}");

  const [dashboard, setDashboard] = useState({
    totalStudents: 0,
    totalRecruiters: 0,
    pendingRecruiters: 0,
    totalAdmins: 0,
  });
  const [pendingRecruiters, setPendingRecruiters] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [approvedRecruiters, setApprovedRecruiters] = useState([]);
  const [admins, setAdmins] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [viewingRecruiter, setViewingRecruiter] = useState(null);

/* ── Data loading ── */
const fetchAll = async () => {
  try {
    const [dashRes, pendingRes, adminsRes] = await Promise.all([
      authFetch("/api/admin/dashboard"),
      authFetch("/api/admin/recruiters/pending"),
      authFetch("/api/admin/admins?limit=3"),
    ]);

    if (!dashRes.ok) {
      throw new Error("Failed to fetch dashboard");
    }

    setDashboard(await dashRes.json());
    setPendingRecruiters(pendingRes.ok ? await pendingRes.json() : []);
    setAdmins(adminsRes.ok ? await adminsRes.json() : []);
  } catch (err) {
    console.error(err);
    showToast("Unable to load dashboard", "error");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (!loginData?.email) {
      navigate("/login");
      return;
    }
    fetchAll();
  }, []);

  /* ── Approval actions ── */

  const handleApprove = async (recruiter) => {
    setActioningId(recruiter.id);
    try {
      const res = await authFetch(
        `/api/admin/recruiters/${recruiter.id}/approve`,
        { method: "PUT" }
      );
      if (!res.ok) throw new Error();
      showToast("Recruiter approved", "success");
      setViewingRecruiter(null);
      fetchAll();
    } catch {
      showToast("Approval failed. Please try again.", "error");
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (recruiter) => {
    setActioningId(recruiter.id);
    try {
      const res = await authFetch(
        `/api/admin/recruiters/${recruiter.id}/reject`,
        { method: "PUT" }
      );
      if (!res.ok) throw new Error();
      showToast("Recruiter rejected", "success");
      setViewingRecruiter(null);
      fetchAll();
    } catch {
      showToast("Reject failed. Please try again.", "error");
    } finally {
      setActioningId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  /* ── Loading state ── */

  if (loading) {
    return (
      <DashboardLayout role="admin" userName={loginData?.email} title="Admin Dashboard">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
            <p className="text-slate-400 text-sm">Loading dashboard…</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      title: "Students",
      value: dashboard.totalStudents,
      color: "text-blue-400",
    },
    {
      title: "Recruiters",
      value: dashboard.totalRecruiters,
      color: "text-green-400",
    },
    {
      title: "Pending",
      value: dashboard.pendingRecruiters,
      color: "text-orange-400",
      badge: dashboard.pendingRecruiters,
    },
    {
      title: "Admins",
      value: dashboard.totalAdmins,
      color: "text-teal-400",
    },
  ];

  const displayName =
    loginData?.fullName || loginData?.name || loginData?.email?.split("@")[0] || "Admin";

  const lastLogin = loginData?.lastLogin
    ? new Date(loginData.lastLogin).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <DashboardLayout
      role="admin"
      userName={loginData?.email}
      onLogout={handleLogout}
    >
      {/* Modal */}
      <RecruiterModal
        recruiter={viewingRecruiter}
        onClose={() => setViewingRecruiter(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        actioning={!!actioningId}
      />

      <div className="bg-slate-900 -m-6 p-6 min-h-screen space-y-6">

        {/* ── 1. WELCOME CARD ─────────────────────────────────────────── */}
        <DarkCard>
            {/* Left – identity */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-teal-600/20 border-2 border-teal-600/50 flex items-center justify-center text-teal-300 font-bold text-xl shrink-0 select-none">
                {displayName[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-slate-100 text-lg font-semibold leading-tight">
                  Welcome back, {displayName}
                </p>
                <p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-teal-600/15 text-teal-400 text-[15px] font-semibold tracking-wide uppercase">
                  {loginData?.role || "Administrator"} {' : '}
                <span className="text-slate-400 text-xs mt-2"> {loginData?.email} </span>
                </span>
                </p>

              </div>
            </div>

        </DarkCard>

        {/* ── 2. TOP STATISTICS ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
        </div>

        {/* ── 3. QUICK ACTIONS ────────────────────────────────────────── */}
        <DarkCard>
          <h3 className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <DarkButton onClick={() => navigate("/admin/add-admin")}>
              + Add Admin
            </DarkButton>
            <DarkButton variant="secondary" onClick={() => navigate("/admin/manage-admins")}>
              Manage Admins
            </DarkButton>
            <DarkButton variant="secondary" onClick={() => navigate("/admin/manage-students")}>
              Manage Students
            </DarkButton>
            <DarkButton variant="secondary" onClick={() => navigate("/admin/manage-recruiters")}>
              Manage Recruiters
            </DarkButton>
            <DarkButton variant="ghost" onClick={fetchAll}>
              ↻ Refresh
            </DarkButton>
          </div>
        </DarkCard>

        {/* ── 4. PENDING RECRUITER APPROVALS ──────────────────────────── */}
        <DarkCard id="pending-recruiters">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">
                Pending Recruiter Requests
              </h2>
              <p className="text-slate-500 text-sm mt-0.5">
                Review recruiter details before approving or rejecting.
              </p>
            </div>
            {dashboard.pendingRecruiters > 0 && (
              <span className="bg-orange-500/20 text-orange-300 text-sm font-semibold px-3 py-1 rounded-full border border-orange-500/30">
                {dashboard.pendingRecruiters} pending
              </span>
            )}
          </div>

          {pendingRecruiters.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-3xl mb-2">✓</p>
              <p className="text-slate-400 text-sm">
                No pending recruiter approvals.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-2 text-slate-400 font-medium text-xs uppercase tracking-wide">
                      Recruiter
                    </th>
                    <th className="text-left py-3 px-2 text-slate-400 font-medium text-xs uppercase tracking-wide hidden md:table-cell">
                      Email
                    </th>
                    <th className="text-left py-3 px-2 text-slate-400 font-medium text-xs uppercase tracking-wide">
                      Company
                    </th>
                    <th className="text-center py-3 px-2 text-slate-400 font-medium text-xs uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRecruiters.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 transition"
                    >
                      <td className="py-4 px-2 text-slate-300">{r.fullName || r.name || "N/A"}</td>
                      <td className="py-4 px-2 text-slate-400 hidden md:table-cell">
                        {r.email}
                      </td>
                      <td className="py-4 px-2 font-semibold text-slate-100">
                        {r.companyname || r.companyName || "N/A"}
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center justify-center gap-2">
                          <DarkButton
                            size="sm"
                            variant="secondary"
                            onClick={() => setViewingRecruiter(r)}
                          >
                            View Details
                          </DarkButton>
                          <DarkButton
                            size="sm"
                            disabled={actioningId === r.id}
                            onClick={() => handleApprove(r)}
                          >
                            {actioningId === r.id ? "…" : "Approve"}
                          </DarkButton>
                          <DarkButton
                            size="sm"
                            variant="danger"
                            disabled={actioningId === r.id}
                            onClick={() => handleReject(r)}
                          >
                            {actioningId === r.id ? "…" : "Reject"}
                          </DarkButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DarkCard>
        {/* ──  ADMIN MANAGEMENT PREVIEW ─────────────────────────────── */}
        <DarkCard>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-100">Admins</h2>
          </div>

          {admins.length === 0 ? (
            <p className="text-slate-500 text-sm py-6 text-center">
              No admins found.
            </p>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {admins.map((a) => {
                const isSelf = a.email === loginData?.email;
                return (
                  <div
                    key={a.id}
                    className="py-4 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-slate-100 font-medium">{a.email}</p>
                        {isSelf && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-600/20 text-teal-400 border border-teal-600/30 font-semibold">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {a.role || "Admin"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DarkCard>

      </div>
    </DashboardLayout>
  );
}