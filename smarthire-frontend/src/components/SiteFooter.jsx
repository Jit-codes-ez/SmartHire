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
    <footer style={{ borderTop: "1px solid #E2E8F0" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10 flex flex-col md:flex-row items-center md:items-center justify-between gap-5 md:gap-4">
        <div>
          <Link to="/" className="flex items-center">
            <img
              src={smartHireLogoBanner}
              alt="SmartHire"
              className="h-12 sm:h-16 md:h-20 w-auto"
            />
          </Link>
        </div>
        <div className="flex items-center gap-6 text-xs font-medium" style={{ color: "#64748B" }}>
          <a href="#" className="hover:text-[#1A2130]">Privacy</a>
          <a href="#" className="hover:text-[#1A2130]">Help Center</a>
        </div>
      </div>
      <div className="text-center text-xs pb-6 px-4" style={{ color: "#94A3B8" }}>
        © {year} SmartHire. All rights reserved.
      </div>
    </footer>
  );
}