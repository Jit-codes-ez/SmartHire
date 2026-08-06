import { NavLink, Link } from "react-router-dom";
import smartHireLogo from "../assets/SmartHireLogo.png";

const LINKS = {
  student: [
  { to: "/student/dashboard", label: "Home" },
  { to: "/student/jobs", label: "Browse Jobs" },
  { to: "/student/applications", label: "My Applications" },
  ],
  recruiter: [
  { to: "/recruiter/dashboard", label: "Home" },
  { to: "/recruiter/drives", label: "My Drives" },
  { to: "/recruiter/drives/new", label: "Post a Drive" },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/students", label: "Students" },
    { to: "/admin/recruiters", label: "Recruiters" },
  ],
};

export default function Navbar({ role, userName, onLogout }) {
  const links = LINKS[role] || [];

  const dashboardPath =
    role === "student"
      ? "/student/dashboard"
      : role === "recruiter"
      ? "/recruiter/dashboard"
      : "/admin/dashboard";

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to={dashboardPath} className="flex items-center">
          <img
            src={smartHireLogo}
            alt="SmartHire"
            className="h-20 w-auto"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-slate-600 hover:text-blue-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="flex items-center gap-4">
          {userName && (
            <span className="text-sm font-medium text-slate-600">
              {userName}
            </span>
          )}

          <button
            onClick={onLogout}
            className="px-5 py-2 rounded-md bg-blue-600 text-white text-sm font-medium transition hover:bg-blue-700"
          >
            Logout
          </button>
        </div>

      </div>
    </header>
  );
}