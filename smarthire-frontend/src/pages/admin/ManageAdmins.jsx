import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullWidthListLayout from "../../layouts/FullWidthListLayout.jsx";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { authFetch } from "../../lib/authFetch.js";

export function IconAdmin({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16 21v-1a4 4 0 00-4-4H6a4 4 0 00-4 4v1" />
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 11a4 4 0 100-8 4 4 0 000 8z" />
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17.5 4l1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3z" />
    </svg>
  );
}

export default function Admins() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const loginData = JSON.parse(localStorage.getItem("admin"));
  const loggedInEmail = loginData?.email;

const [deleteTarget, setDeleteTarget] = useState(null);
const [deleting, setDeleting] = useState(false);

  const itemsPerPage = 8;

  const loadAdmins = async () => {
    try {
      setLoading(true);

      const response = await authFetch(
        "/api/admin/admins"
      );

      if (!response.ok) {
        throw new Error("Failed to load admins");
      }

      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error("Load admins error:", error);
      showToast("Unable to load admins", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const deleteAdmin = async () => {
  if (!deleteTarget) return;
  setDeleting(true);
  try {
    const response = await authFetch(
      `/api/admin/admins/${deleteTarget.id}`,
      { method: "DELETE" }
    );
    const message = await response.text();
    if (!response.ok) throw new Error(message || "Delete failed");
    setAdmins((prev) => prev.filter((admin) => admin.id !== deleteTarget.id));
    showToast("Admin deleted successfully", "success");
    setDeleteTarget(null);
  } catch (error) {
    showToast(error.message || "Failed to delete admin", "error");
  } finally {
    setDeleting(false);
  }
};

  const totalAdmins = admins.length;

  const filteredAdmins = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return admins;
    }

    return admins.filter((admin) =>
      admin.email?.toLowerCase().includes(searchText)
    );
  }, [admins, search]);

  const totalPages = Math.ceil(
    filteredAdmins.length / itemsPerPage
  );

  const currentAdmins = filteredAdmins.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const filtersUI = (
    <div className="flex gap-3 w-full">
      <input
        type="text"
        className="input flex-1"
        placeholder="Search admin by email..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <Button
        variant="secondary"
        onClick={loadAdmins}
      >
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
        title="Admin Management"
        subtitle="Manage administrator accounts."
      >
        <div className="py-12 text-center text-slate-400">
          Loading admins...
        </div>
      </FullWidthListLayout>
    );
  }

  return (
    <FullWidthListLayout
      role="admin"
      userName="Admin"
      onLogout={() => navigate("/login")}
      title="Admin Management"
      subtitle="Delete and manage administrator accounts."
      filters={filtersUI}
    >
      <Card className="mb-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-teal-500/10 flex items-center justify-center">
            <IconAdmin className="h-7 w-7 text-teal-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Total Admins</p>
            <p className="text-3xl font-bold text-teal-400 mt-1">
              {totalAdmins}
            </p>
          </div>
        </div>
      </Card>

      {currentAdmins.length === 0 ? (
        <Card>
          <EmptyState
            icon={<IconAdmin className="h-10 w-10 text-slate-300" />}
            title="No admins found"
            description={
              search
                ? "No administrators match your search."
                : "No administrator accounts are available."
            }
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 text-sm font-semibold">
                    Admin
                  </th>
                  <th className="text-center py-3 text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
{currentAdmins.map((admin) => {
const isCurrentAdmin =
admin.email?.toLowerCase() === loggedInEmail?.toLowerCase();

return (
<tr
key={admin.id}
className="border-b border-slate-700 hover:bg-slate-800/60 transition"
>
<td className="py-4">
<div className="flex items-center gap-3">
<div className="h-9 w-9 rounded-full bg-teal-500/10 flex items-center justify-center">
<IconAdmin className="h-5 w-5 text-teal-400" />
</div>

<div>
<p className="text-sm font-medium">
{admin.email}
</p>

<p className="text-xs text-slate-500">
{isCurrentAdmin ? "Administrator" : "Administrator"}
</p>
</div>
</div>
</td>

<td className="py-4">
<div className="flex justify-center gap-2">
{isCurrentAdmin ? (
<span className="px-3 py-2 text-xs font-medium text-teal-400 bg-teal-500/10 rounded-lg">
Current Admin
</span>
) : (
<Button
variant="danger"
onClick={() => setDeleteTarget(admin)}
>
Delete
</Button>
)}
</div>
</td>
</tr>
);
})}
              </tbody>
            </table>
          </div>
        </Card>
      )}

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

      {deleteTarget && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
<div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
<h2 className="text-xl font-semibold text-slate-100">
Delete Administrator
</h2>

<p className="mt-3 text-sm text-slate-400">
Are you sure you want to permanently delete this administrator?
</p>

<div className="mt-4 rounded-lg border border-slate-700 bg-slate-900 p-4">
<p className="text-sm font-medium text-slate-100">
{deleteTarget.email}
</p>
<p className="mt-1 text-xs text-slate-500">
Administrator account
</p>
</div>

<p className="mt-4 text-xs text-red-400">
This action cannot be undone.
</p>

<div className="mt-6 flex justify-end gap-3">
<Button
variant="secondary"
disabled={deleting}
onClick={() => setDeleteTarget(null)}
>
Cancel
</Button>

<Button
variant="danger"
disabled={deleting}
onClick={deleteAdmin}
>
{deleting ? "Deleting..." : "Delete Admin"}
</Button>
</div>
</div>
</div>
)}
    </FullWidthListLayout>
  );
}