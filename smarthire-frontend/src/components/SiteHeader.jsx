import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import smartHireLogo from "../assets/SmartHireLogo.png";

function getLoggedInUser() {
  for (const key of ["student", "recruiter", "admin"]) {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return { key, data: JSON.parse(stored) };
      } catch {
        // ignore malformed entry
      }
    }
  }
  return null;
}

// Nav links differ by role so each user only sees what's relevant to them.
function getNavLinks(user) {
  if (!user) {
    // Logged-out: public pages only
    return [
      { to: "/Home", label: "Home" },
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
    ];
  }

  const role = user.data?.role;

  if (role === "ADMIN") {
    return [
      { to: "/admin/dashboard", label: "Dashboard" },
      { to: "/admin/manage-students", label: "Students" },
      { to: "/admin/manage-recruiters", label: "Recruiters" },
    ];
  }

  if (role === "RECRUITER") {
    return [
      { to: "/Home", label: "Home" },
      { to: "/recruiter/dashboard", label: "Dashboard" },
      { to: "/student/jobs", label: "Jobs" },
    ];
  }

  // STUDENT 
  return [
    { to: "/Home", label: "Home" },
    { to: "/student/dashboard", label: "Dashboard" },
    { to: "/student/jobs", label: "Jobs" },
  ];
}

export default function SiteHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getLoggedInUser());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const syncAuth = () => setUser(getLoggedInUser());
    window.addEventListener("storage", syncAuth);
    window.addEventListener("authChange", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("authChange", syncAuth);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    if (user) localStorage.removeItem(user.key);
    window.dispatchEvent(new Event("authChange"));
    setMenuOpen(false);
    navigate("/login");
  };

  const navLinks = getNavLinks(user);

  return (
    <header
      className="sticky top-0 z-50 border-b shadow-sm transition-colors duration-200"
      style={{
        background: "var(--surface, #fff)",
        borderColor: "var(--border, #e2e8f0)",
        color: "var(--text, #1e293b)",
      }}
    >
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        <Link
          to="/Home"
          className="flex items-center gap-2 shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          <img src={smartHireLogo} alt="SmartHire" className="h-12 sm:h-16 md:h-20 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-8 text-sm font-medium"
          style={{ color: "var(--muted, #64748b)" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="transition"
              style={{ color: "inherit" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--primary, #2563eb)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop login/logout */}
        <div className="hidden md:block">
          {user ? (
            <button
              onClick={handleLogout}
              className="px-8 lg:px-10 py-2 rounded-md text-white text-sm font-medium duration-200 hover:scale-[1.02] hover:shadow-lg hover:brightness-110 active:scale-95"
              style={{ background: "var(--danger, #dc2626)" }}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-8 lg:px-10 py-2 rounded-md text-white text-sm font-medium duration-200 hover:scale-[1.02] hover:shadow-lg hover:brightness-110 active:scale-95"
              style={{ background: "var(--primary, #2563eb)" }}
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden flex items-center justify-center h-10 w-10 rounded-md transition"
          style={{ color: "var(--muted, #64748b)" }}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 border-t" : "max-h-0"
        }`}
        style={{ borderColor: "var(--border, #e2e8f0)" }}
      >
        <nav
          className="flex flex-col px-4 py-3 gap-1 text-sm font-medium"
          style={{
            background: "var(--surface, #fff)",
            color: "var(--muted, #64748b)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="px-2 py-2.5 rounded-md transition"
            >
              {link.label}
            </Link>
          ))}

          <div
            className="pt-2 mt-1 border-t"
            style={{ borderColor: "var(--border, #e2e8f0)" }}
          >
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 rounded-md text-white text-sm font-medium duration-200 active:scale-95"
                style={{ background: "var(--danger, #dc2626)" }}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-md text-white text-sm font-medium duration-200 active:scale-95"
                style={{ background: "var(--primary, #2563eb)" }}
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}