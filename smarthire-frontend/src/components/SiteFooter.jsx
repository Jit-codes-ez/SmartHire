import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import smartHireLogoBanner from "../assets/SmartHireLogoBanner.png";

/**
 * Global footer — shown on every page.
 */
export default function SiteFooter() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer
      className="transition-colors duration-200"
      style={{
        borderTop: "1px solid var(--border, #E2E8F0)",
        background: "var(--surface, #fff)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10 flex flex-col md:flex-row items-center md:items-center justify-between gap-5 md:gap-4">
        <div>
          <Link to="/Home" className="flex items-center">
            <img
              src={smartHireLogoBanner}
              alt="SmartHire"
              className="h-12 sm:h-16 md:h-20 w-auto"
            />
          </Link>
        </div>
        <div
          className="flex items-center gap-6 text-sm font-medium"
          style={{ color: "var(--muted, #6B7280)" }}
        >

        <Link
            to="/terms"
            className="transition"
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary, #2563eb)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
          >
            Terms & Conditions
          </Link>

          <Link
            to="/privacy"
            className="transition"
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary, #2563eb)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
          >
            Privacy Policy
          </Link>

          <Link
            to="/help-center"
            className="transition"
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary, #2563eb)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
          >
            Help Center
          </Link>
        </div>
      </div>
      <div
        className="text-center text-xs pb-6 px-4"
        style={{ color: "var(--muted, #94A3B8)" }}
      >
        © {year} SmartHire. All rights reserved.
      </div>
    </footer>
  );
}