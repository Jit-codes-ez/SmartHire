import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import smartHireLogo from "../assets/SmartHireLogo.png";

export default function SiteHeader() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(() => {
    const stored = localStorage.getItem("student");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const syncAuth = () => {
      const stored = localStorage.getItem("student");
      setStudent(stored ? JSON.parse(stored) : null);
    };

    // Cross-tab changes
    window.addEventListener("storage", syncAuth);
    // Same-tab changes (login/logout triggered from this tab)
    window.addEventListener("authChange", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("authChange", syncAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("student");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={smartHireLogo}
            alt="SmartHire"
            className="h-20 w-auto"
          />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link to="/" className="transition hover:text-blue-600">
            Home
          </Link>
          <Link to="/student/jobs" className="transition hover:text-blue-600">
            Jobs
          </Link>
          <Link to="/about" className="transition hover:text-blue-600">
            About
          </Link>
          <Link to="/contact" className="transition hover:text-blue-600">
            Contact
          </Link>
        </nav>

        {/* Login / Logout Button */}
        {student ? (
          <button
            onClick={handleLogout}
            className="px-10 py-2 rounded-md bg-red-600 text-white text-sm font-medium disabled:opacity-60 duration-200 hover:scale-[1.02] hover:shadow-lg hover:brightness-110 active:scale-95 disabled:hover:scale-100"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="px-10 py-2 rounded-md bg-blue-600 text-white text-sm font-medium disabled:opacity-60 duration-200 hover:scale-[1.02] hover:shadow-lg hover:brightness-110 active:scale-95 disabled:hover:scale-100"
          >
            Login
          </Link>
        )}

      </div>
    </header>
  );
}