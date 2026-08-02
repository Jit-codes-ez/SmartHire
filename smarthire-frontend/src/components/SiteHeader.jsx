import { Link } from "react-router-dom";
import smartHireLogo from "../assets/SmartHireLogo.png";

// Matches the routes defined in App.jsx
export const ROUTES = {
  studentLogin: "/login",
  studentDashboard: "/student/dashboard",
  browseJobs: "/student/jobs",
  myApplications: "/student/applications",
  recruiterDashboard: "/recruiter/dashboard",
  postDrive: "/recruiter/drives/new",
  adminDashboard: "/admin/dashboard",
};

/**
 * Global marketing header — shown on every page (front page, login, dashboards, etc).
 * Not to be confused with the role-based portal Navbar used inside dashboards.
 */
export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 bg-white" style={{ borderBottom: "1px solid #E2E8F0" }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={smartHireLogo} alt="SmartHire" className="h-20 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: "#64748B" }}>
          <a href="#how" className="hover:text-[#1A2130]">How it works</a>
          <a href="#roles" className="hover:text-[#1A2130]">Who it's for</a>
          <a href="#features" className="hover:text-[#1A2130]">Features</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to={ROUTES.studentLogin} className="text-sm font-medium px-4 py-2 rounded-md" style={{ color: "#1A2130" }}>
            Log in
          </Link>
          <Link
            to={ROUTES.browseJobs}
            className="text-sm font-medium px-4 py-2 rounded-md text-white"
            style={{ background: "#2563EB" }}
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
