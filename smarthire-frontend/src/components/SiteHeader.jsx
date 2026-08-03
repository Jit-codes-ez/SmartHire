import { Link } from "react-router-dom";
import smartHireLogo from "../assets/SmartHireLogo.png";

export default function SiteHeader() {
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

          <Link
            to="/"
            className="transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/student/jobs"
            className="transition hover:text-blue-600"
          >
            Jobs
          </Link>

          <Link
            to="/about"
            className="transition hover:text-blue-600"
          >
            About
          </Link>

          <Link
            to="/contact"
            className="transition hover:text-blue-600"
          >
            Contact
          </Link>
        </nav>

        {/* Login Button */}
        <Link
          to="/login"
          className="px-10 py-2 rounded-md bg-blue-600 text-white text-sm font-medium transition-all duration-200 hover:bg-blue-700 hover:shadow-md"
        >
          Login
        </Link>

      </div>
    </header>
  );
}