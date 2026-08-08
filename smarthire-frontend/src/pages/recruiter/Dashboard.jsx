import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import StatusPill from "../../components/StatusPill.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { authFetch } from "../../lib/authFetch.js";

// ─── Edit Job Modal ───────────────────────────────────────────────────────────

const EMPLOYMENT_TYPES = ["Full-Time", "Part-Time", "Internship", "Contract"];

function EditJobModal({ job, saving, onClose, onSave }) {
  const [form, setForm] = useState({
    ...job,
    skills: Array.isArray(job.skills)
      ? job.skills.join(", ")
      : job.skills || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send skills back as array to match backend expectation
    onSave({
      ...form,
      skills: typeof form.skills === "string"
        ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : form.skills,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-st-border sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-st-text leading-tight tracking-tight">
              Edit Job Drive
            </h2>
            <p className="text-sm text-st-muted mt-0.5">
              Update the details for this job posting.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-st-muted hover:text-st-text text-2xl leading-none ml-4"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">

          <ModalField label="Job Title">
            <input
              name="title"
              className="modal-input"
              placeholder="Software Engineer"
              value={form.title || ""}
              onChange={handleChange}
              required
              disabled={saving}
            />
          </ModalField>

          <ModalField label="Job Description">
            <textarea
              name="description"
              rows={4}
              className="modal-input resize-none"
              placeholder="Describe the role, responsibilities, and requirements..."
              value={form.description || ""}
              onChange={handleChange}
              required
              disabled={saving}
            />
          </ModalField>

          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Location">
              <input
                name="location"
                className="modal-input"
                placeholder="Bengaluru, India"
                value={form.location || ""}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </ModalField>

            <ModalField label="Employment Type">
              <select
                name="employmentType"
                className="modal-input"
                value={form.employmentType || ""}
                onChange={handleChange}
                required
                disabled={saving}
              >
                <option value="" disabled>Select type</option>
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </ModalField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Experience Required">
              <input
                name="experienceRequired"
                className="modal-input"
                placeholder="0-2 years"
                value={form.experienceRequired || ""}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </ModalField>

            <ModalField label="Salary (In LPA, INR)">
              <input
                name="salary"
                className="modal-input"
                placeholder="₹6-10 LPA"
                value={form.salary || ""}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </ModalField>
          </div>

          <ModalField label="Required Skills (comma separated)">
            <input
              name="skills"
              className="modal-input"
              placeholder="Java, Spring Boot, MySQL, REST APIs"
              value={form.skills || ""}
              onChange={handleChange}
              required
              disabled={saving}
            />
          </ModalField>

          <ModalField label="Application Deadline">
            <input
              name="applicationDeadline"
              type="date"
              className="modal-input"
              value={form.applicationDeadline || form.deadline || ""}
              onChange={handleChange}
              required
              disabled={saving}
            />
          </ModalField>

          {/* Status toggle */}
          <div className="flex items-center justify-between bg-st-border/20 rounded-input px-4 py-3">
            <div>
              <p className="text-sm font-medium text-st-text">Job Status</p>
              <p className="text-xs text-st-muted mt-0.5">
                {form.status === "ACTIVE" || form.status === "OPEN"
                  ? "Currently accepting applications"
                  : "Not accepting applications"}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  status:
                    prev.status === "ACTIVE" || prev.status === "OPEN"
                      ? "INACTIVE"
                      : "ACTIVE",
                }))
              }
              className={`relative w-12 h-6 rounded-full transition-colors ${
                form.status === "ACTIVE" || form.status === "OPEN"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  form.status === "ACTIVE" || form.status === "OPEN"
                    ? "left-7"
                    : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 h-10 rounded-full text-sm font-medium border border-st-border text-st-muted hover:bg-st-border/30 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 h-10 rounded-full text-sm font-medium bg-st-primary text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-input {
          width: 100%;
          height: 40px;
          padding: 0 0.75rem;
          border: 1px solid var(--st-border, #e5e7eb);
          border-radius: var(--rounded-input, 0.5rem);
          font-size: 0.875rem;
          color: var(--st-text, #111827);
          background: white;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .modal-input:hover {
          border-color: var(--st-primary, #6366f1);
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .modal-input:focus {
          border-color: var(--st-primary, #6366f1);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--st-primary, #6366f1) 15%, transparent);
        }
        textarea.modal-input {
          height: auto;
          padding: 0.5rem 0.75rem;
          resize: none;
        }
      `}</style>
    </div>
  );
}
// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteConfirmModal({ job, deleting, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="text-center">
          <div className="text-4xl mb-3">🗑️</div>
          <h2 className="text-lg font-bold text-st-text">Delete Job?</h2>
          <p className="text-sm text-st-muted mt-2">
            <span className="font-semibold text-st-text">{job.title}</span> will be
            permanently removed. This cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-full text-sm font-medium border border-st-border text-st-muted hover:bg-st-border/30 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2 rounded-full text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-60 transition-colors"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal field wrapper ──────────────────────────────────────────────────────

function ModalField({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-st-muted mb-1">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const storedRecruiter = localStorage.getItem("recruiter");
  let loginData = null;
  try {
    loginData = storedRecruiter ? JSON.parse(storedRecruiter) : null;
  } catch (error) {
    console.error("Invalid recruiter data:", error);
  }

  const [recruiter, setRecruiter] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Job action state ───────────────────────────────────────────────────────
  const [editingJob, setEditingJob] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    if (!loginData?.email) {
      navigate("/login");
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [profileRes, jobsRes] = await Promise.all([
          authFetch(
            `http://localhost:8080/api/recruiter/profile/${encodeURIComponent(loginData.email)}`
          ),
          authFetch(
            `http://localhost:8080/api/recruiter/jobs/${encodeURIComponent(loginData.email)}`
          ),
        ]);

        if (!profileRes.ok) throw new Error("Failed to load recruiter profile");

        const profile = await profileRes.json();
        setRecruiter(profile);

        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobs(Array.isArray(jobsData) ? jobsData : []);
        } else {
          console.error("Failed to load jobs:", jobsRes.status);
          setJobs([]);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
        showToast("Unable to load dashboard data.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate, showToast, loginData?.email]);

  const handleLogout = () => {
    localStorage.removeItem("recruiter");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  // ── Toggle active / inactive ───────────────────────────────────────────────
  const handleToggleStatus = async (job) => {
    const newStatus = job.status === "ACTIVE" || job.status === "OPEN" ? "INACTIVE" : "ACTIVE";
  setTogglingId(job.id);
  try {
    const storedRecruiter = localStorage.getItem("recruiter");

    if (!storedRecruiter) {
      throw new Error("Recruiter not logged in");
    }

    const recruiter = JSON.parse(storedRecruiter);

    if (!recruiter?.email) {
      throw new Error("Recruiter email not found");
    }

    const response = await authFetch(
      `http://localhost:8080/api/recruiter/jobs/${job.id}/${encodeURIComponent(
        recruiter.email
      )}/status?status=${newStatus}`,
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Status update error:", errorText);
      throw new Error("Failed to update job status");
    }

    setJobs((prev) =>
      prev.map((j) =>
        j.id === job.id
          ? { ...j, status: newStatus }
          : j
      )
    );

    showToast(
      `Job marked as ${newStatus.toLowerCase()}.`,
      "success"
    );
  } catch (error) {
    console.error("Status toggle error:", error);

    showToast(
      "Failed to update status.",
      "error"
    );
  } finally {
    setTogglingId(null);
  }
};
  // ── Save edited job ────────────────────────────────────────────────────────
  const handleSaveEdit = async (updatedJob) => {
  setSaving(true);

  try {
    const payload = {
      ...updatedJob,
      skills: Array.isArray(updatedJob.skills)
        ? updatedJob.skills.join(", ")
        : updatedJob.skills,
    };

    const res = await authFetch(
      `http://localhost:8080/api/recruiter/jobs/${updatedJob.id}/${encodeURIComponent(loginData.email)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Update job error:", errorText);
      throw new Error("Failed to update job");
    }

    const savedJob = await res.json();

    setJobs((prev) =>
      prev.map((j) => (j.id === savedJob.id ? savedJob : j))
    );

    setEditingJob(null);
    showToast("Job updated successfully.", "success");
  } catch (error) {
    console.error(error);
    showToast("Failed to save changes.", "error");
  } finally {
    setSaving(false);
  }
};

// ── Delete job ─────────────────────────────────────────────────────────────

const handleDelete = async (job) => {
  setDeleting(true);

  try {
    const response = await authFetch(
      `http://localhost:8080/api/recruiter/jobs/${job.id}/${encodeURIComponent(
        loginData.email
      )}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Delete job error:", errorText);

      throw new Error("Failed to delete job");
    }

    // Remove from frontend only after backend successfully deletes it
    setJobs((prev) =>
      prev.filter((j) => j.id !== job.id)
    );

    setDeleteTarget(null);

    showToast("Job deleted successfully.", "success");

  } catch (error) {
    console.error("Delete job error:", error);

    showToast(
      "Failed to delete job.",
      "error"
    );
  } finally {
    setDeleting(false);
  }
};

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout
        role="recruiter"
        userName="Recruiter"
        onLogout={handleLogout}
        title="Recruiter Dashboard"
        subtitle="Loading your recruitment dashboard..."
      >
        <Card>
          <div className="flex justify-center items-center py-12">
            <p className="text-st-muted">Loading dashboard...</p>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (!recruiter) {
    return (
      <DashboardLayout
        role="recruiter"
        userName="Recruiter"
        onLogout={handleLogout}
        title="Recruiter Dashboard"
        subtitle="Manage your recruitment activities."
      >
        <Card>
          <div className="text-center py-12">
            <p className="text-st-muted mb-5">Unable to load recruiter data.</p>
            <Button onClick={() => navigate("/recruiter/dashboard")}>
              Try Again
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }
  const activeJobs = jobs.filter(
  (job) => job.status === "ACTIVE" || job.status === "OPEN"
).length;

  const stats = [
    { label: "Jobs Posted", value: jobs.length },
    { label: "Active Jobs", value: activeJobs },
    { label: "Applicants", value: 0 },
    { label: "Shortlisted", value: 0 },
  ];

  return (
    <DashboardLayout
      role="recruiter"
      userName={recruiter.fullName}
      onLogout={handleLogout}
      title={`Welcome back, ${recruiter.fullName}!`}
      subtitle="Here's what's happening with your recruitment activities."
    >
      {/* ── Profile ─────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <Card>
          <h2 className="text-2xl font-bold text-st-text">{recruiter.fullName}</h2>
          <p className="text-st-muted mt-1">{recruiter.email}</p>
          <span className="inline-block mt-3 px-4 py-1 rounded-full bg-st-primary/10 text-st-primary text-sm font-medium">
            RECRUITER
          </span>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="border border-st-border rounded-input p-4">
              <p className="text-xs text-st-muted">Recruiter ID</p>
              <h3 className="font-bold text-st-text mt-1">{recruiter.id}</h3>
            </div>
            <div className="border border-st-border rounded-input p-4">
              <p className="text-xs text-st-muted">Company</p>
              <h3 className="font-bold text-st-text mt-1">
                {recruiter.companyName || "N/A"}
              </h3>
            </div>
            <div className="border border-st-border rounded-input p-4">
              <p className="text-xs text-st-muted">Designation</p>
              <h3 className="font-bold text-st-text mt-1">
                {recruiter.designation || "Recruiter"}
              </h3>
            </div>
            <div className="border border-st-border rounded-input p-4">
              <p className="text-xs text-st-muted">Industry</p>
              <h3 className="font-bold text-st-text mt-1">
                {recruiter.industry || "N/A"}
              </h3>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button onClick={() => navigate("/recruiter/update-profile")}>
              Update Profile
            </Button>
            <Button onClick={() => navigate("/recruiter/drives/new")}>
              Post Job
            </Button>
          </div>
        </Card>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-st-muted text-sm">{stat.label}</p>
            <h2 className="text-3xl font-bold text-st-primary mt-1">
              {stat.value}
            </h2>
          </Card>
        ))}
      </div>

      {/* ── Recent Jobs ─────────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-st-text">Recent Job Posts</h2>
          </div>
        </div>

        <Card>
          {jobs.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-3xl mb-2">📋</p>
              <p className="font-semibold text-st-text">No jobs posted yet</p>
              <p className="text-sm text-st-muted mt-1 mb-5">
                Start hiring by posting your first job opening.
              </p>
              <Button onClick={() => navigate("/recruiter/drives/new")}>
                Post Your First Job
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-st-border">
                    {[
                      "Job Title",
                      "Location",
                      "Type / Mode",
                      "Experience",
                      "Salary",
                      "Applicants",
                      "Status",
                      "Actions",
                    ].map((col) => (
                      <th
                        key={col}
                        className="text-left py-3 px-3 text-st-muted font-medium text-xs uppercase tracking-wide whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => {
                   const isActive = job.status === "ACTIVE";
                  const isToggling = togglingId === job.id;

                    return (
                      <tr
                        key={job.id}
                        className="border-b border-st-border/50 hover:bg-st-border/20 transition-colors"
                      >
                        {/* Title + department */}
                        <td className="py-4 px-3">
                          <p className="font-semibold text-st-text leading-tight">
                            {job.title}
                          </p>
                          {job.department && (
                            <p className="text-xs text-st-muted mt-0.5">
                              {job.department}
                            </p>
                          )}
                          {job.openings && (
                            <p className="text-xs text-st-muted mt-0.5">
                              {job.openings} opening{job.openings !== 1 ? "s" : ""}
                            </p>
                          )}
                        </td>

                        {/* Location */}
                        <td className="py-4 px-3 text-st-muted whitespace-nowrap">
                          {job.location || "—"}
                        </td>

                        {/* Type / Mode */}
                        <td className="py-4 px-3">
                          <p className="text-st-text whitespace-nowrap">
                            {job.employmentType || "—"}
                          </p>
                          {job.workMode && (
                            <p className="text-xs text-st-muted mt-0.5">
                              {job.workMode}
                            </p>
                          )}
                        </td>

                        {/* Experience */}
                        <td className="py-4 px-3 text-st-muted whitespace-nowrap">
                          {job.experienceRequired || job.experienceLevel || "—"}
                        </td>

                        {/* Salary */}
                        <td className="py-4 px-3 text-st-muted whitespace-nowrap">
                          {job.salary ? `${job.salary} LPA` : "—"}
                        </td>

                        {/* Applicants */}
                        <td className="py-4 px-3">
                          <p className="font-semibold text-st-text">
                            {job.applicantCount ?? 0}
                          </p>
                          {job.shortlistedCount > 0 && (
                            <p className="text-xs text-green-600 mt-0.5">
                              {job.shortlistedCount} shortlisted
                            </p>
                          )}
                        </td>

                          {/* Status */}
<td className="py-4 px-3">
  <span
    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
      job.status === "ACTIVE"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-600"
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${
        job.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
      }`}
    />
    {job.status || "ACTIVE"}
  </span>
</td>

                        {/* Actions */}
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2">

                            {/* Edit */}
                            <button
                              onClick={() => setEditingJob({ ...job })}
                              className="text-xs px-3 py-1.5 rounded-full border border-st-primary text-st-primary hover:bg-st-primary/10 transition-colors font-medium"
                            >
                              Edit
                            </button> 

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteTarget(job)}
                              className="text-xs px-3 py-1.5 rounded-full border border-red-400 text-red-500 hover:bg-red-50 transition-colors font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>

      {/* ── Edit Modal ──────────────────────────────────────────────────────── */}
      {editingJob && (
        <EditJobModal
          job={editingJob}
          saving={saving}
          onClose={() => setEditingJob(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* ── Delete Confirm ──────────────────────────────────────────────────── */}
      {deleteTarget && (
        <DeleteConfirmModal
          job={deleteTarget}
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => handleDelete(deleteTarget)}
        />
      )}
    </DashboardLayout>
  );
}