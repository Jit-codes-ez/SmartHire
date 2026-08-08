import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowLeft,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import { useToast } from "../../context/ToastContext.jsx";

/* ─── Primitive UI components (match AdminDashboard) ───────────────────────── */

function DarkCard({ children, className = "" }) {
  return (
    <div
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
  type = "button",
  className = "",
}) {
  const base =
    "h-10 px-4 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 inline-flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-teal-600 text-white hover:bg-teal-500 focus:ring-teal-500",
    secondary:
      "bg-slate-700 text-slate-200 hover:bg-slate-600 focus:ring-slate-500",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

/* ─── Add Admin Page ────────────────────────────────────────────────────── */

export default function AddAdmin() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email.trim() || !password.trim()) {
    showToast("Please fill all fields.", "error");
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:8080/api/admin/addAdmin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      }
    );

    const contentType = response.headers.get("content-type");

    let errorMessage = "Failed to create admin.";

    if (contentType?.includes("application/json")) {
      const data = await response.json();

      if (!response.ok) {
        errorMessage =
          data?.message ||
          data?.error ||
          "Failed to create admin.";
      }
    } else {
      const text = await response.text();

      if (!response.ok) {
        errorMessage = text || "Failed to create admin.";
      }
    }

    if (!response.ok) {
      throw new Error(errorMessage);
    }

    showToast(
      "Admin created successfully.",
      "success"
    );

    setEmail("");
    setPassword("");
    setShowPassword(false);

  } catch (error) {
    console.error("Add admin error:", error);

    showToast(
      error.message || "Something went wrong.",
      "error"
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <DashboardLayout
      role="admin"
      userName="Admin"
      onLogout={() => navigate("/login")}
    >
      <div className="bg-black-900 min-h-full flex items-center justify-center p-6">
        <DarkCard className="w-full max-w-lg">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-14 w-14 rounded-xl bg-teal-600/20 border border-teal-600/40 flex items-center justify-center shrink-0">
              <UserPlus size={28} className="text-teal-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-100">
                Add Admin
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Create a new administrator for SmartHire.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 h-11 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 h-11 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Permission note */}
            <div className="flex gap-3 p-4 rounded-lg bg-slate-900 border border-slate-700">
              <Shield size={22} className="text-teal-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Administrator Access
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  This account can manage students, recruiters, jobs and
                  platform settings.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-2">
              <DarkButton
                variant="secondary"
                onClick={() => navigate("/admin/dashboard")}
              >
                <ArrowLeft size={18} />
                Back
              </DarkButton>

              <DarkButton type="submit" disabled={loading}>
                <UserPlus size={18} />
                {loading ? "Creating…" : "Create Admin"}
              </DarkButton>
            </div>
          </form>
        </DarkCard>
      </div>
    </DashboardLayout>
  );
}