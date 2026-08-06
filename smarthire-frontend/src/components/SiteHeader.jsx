import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import smartHireLogo from "../assets/SmartHireLogo.png";

export default function SiteHeader() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(() => {
    const stored = localStorage.getItem("student");
    return stored ? JSON.parse(stored) : null;
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      const stored = localStorage.getItem("student");
      setStudent(stored ? JSON.parse(stored) : null);
    };

    window.addEventListener("storage", syncAuth);
    window.addEventListener("authChange", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("authChange", syncAuth);
    };
  }, []);

  // Close mobile menu on route change / resize back to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("student");
    window.dispatchEvent(new Event("authChange"));
    setMenuOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/student/jobs", label: "Jobs" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMenuOpen(false)}>
          <img
            src={smartHireLogo}
            alt="SmartHire"
            className="h-12 sm:h-16 md:h-20 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="transition hover:text-blue-600">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Login / Logout */}
        <div className="hidden md:block">
          {student ? (
            <button
              onClick={handleLogout}
              className="px-8 lg:px-10 py-2 rounded-md bg-red-600 text-white text-sm font-medium disabled:opacity-60 duration-200 hover:scale-[1.02] hover:shadow-lg hover:brightness-110 active:scale-95 disabled:hover:scale-100"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-8 lg:px-10 py-2 rounded-md bg-blue-600 text-white text-sm font-medium disabled:opacity-60 duration-200 hover:scale-[1.02] hover:shadow-lg hover:brightness-110 active:scale-95 disabled:hover:scale-100"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden flex items-center justify-center h-10 w-10 rounded-md text-slate-600 hover:bg-slate-100 transition"
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

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 border-t border-slate-200" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-3 gap-1 text-sm font-medium text-slate-600 bg-white">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="px-2 py-2.5 rounded-md transition hover:bg-slate-50 hover:text-blue-600"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2 mt-1 border-t border-slate-100">
            {student ? (
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 rounded-md bg-red-600 text-white text-sm font-medium duration-200 active:scale-95"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-md bg-blue-600 text-white text-sm font-medium duration-200 active:scale-95"
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