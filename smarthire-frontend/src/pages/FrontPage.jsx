import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Briefcase,
  LayoutDashboard,
  ArrowRight,
  Search,
  CheckCircle2,
} from "lucide-react";

import smartHireLogo from "../assets/navbar_logo.png";
import ScoreBadge, { AnimatedScoreBadge } from '../components/ScoreBadge.jsx'

// Matches the routes defined in App.jsx
const ROUTES = {
  studentLogin: "/login",
  studentDashboard: "/student/dashboard",
  browseJobs: "/student/jobs",
  myApplications: "/student/applications",
  recruiterDashboard: "/recruiter/dashboard",
  postDrive: "/recruiter/drives/new",
  adminDashboard: "/admin/dashboard",
};

const STATUS = {
  Applied: { text: "#1E40AF", bg: "#DBEAFE" },
  "Under Review": { text: "#92400E", bg: "#FEF3C7" },
  Shortlisted: { text: "#065F46", bg: "#D1FAE5" },
  Interview: { text: "#1D4ED8", bg: "#EFF6FF" },
  Selected: { text: "#14532D", bg: "#BBF7D0" },
};

function StatusPill({ label }) {
  const c = STATUS[label] || STATUS.Applied;
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ color: c.text, background: c.bg }}
    >
      {label}
    </span>
  );
}

function RoleCard({ accent, icon: Icon, role, tagline, body, cta, to }) {
  return (
    <div
      className="bg-white rounded-lg p-6 flex flex-col"
      style={{ border: "1px solid #E2E8F0", borderLeft: `3.5px solid ${accent}` }}
    >
      <div
        className="w-9 h-9 rounded flex items-center justify-center mb-4"
        style={{ background: `${accent}15` }}
      >
        <Icon size={18} strokeWidth={1.9} style={{ color: accent }} />
      </div>
      <div className="text-base font-semibold mb-1" style={{ color: "#1A2130" }}>
        {role}
      </div>
      <div className="text-xs font-medium mb-3" style={{ color: accent }}>
        {tagline}
      </div>
      <p className="text-sm mb-6 flex-1" style={{ color: "#64748B", lineHeight: 1.6 }}>
        {body}
      </p>
      <Link
        to={to}
        className="text-sm font-medium rounded-md px-4 py-2.5 flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
        style={{ background: accent, color: "#FFFFFF" }}
      >
        {cta} <ArrowRight size={14} />
      </Link>
    </div>
  );
}
// TypingHeadline component: types out the text letter by letter, with a blinking cursor.
function TypingHeadline({ text, speed = 45, className, style }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    setDisplay("");
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <h1 className={className} style={style}>
      {display}
      <span
        style={{
          display: "inline-block",
          width: "3px",
          height: "1em",
          background: "#2563EB",
          marginLeft: "3px",
          verticalAlign: "-0.15em",
          animation: "sh-blink 0.9s steps(1) infinite",
        }}
      />
      <style>{`
        @keyframes sh-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sh-typing-cursor { animation: none; }
        }
      `}</style>
    </h1>
  );
}

export default function FrontPage() {
  const [year, setYear] = useState(2026);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap";
    document.head.appendChild(link);
    setYear(new Date().getFullYear());
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query ? `${ROUTES.browseJobs}?q=${encodeURIComponent(query)}` : ROUTES.browseJobs);
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "#F8FAFF",
        color: "#1A2130",
        fontFamily: "'Inter', sans-serif",
        fontSize: "14px",
        lineHeight: 1.6,
      }}
    >
      {/* Navbar */}
      <header className="sticky top-0 z-10 bg-white" style={{ borderBottom: "px solid #E2E8F0" }}>
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

      {/* Hero — content-first, with an orchestrated entrance */}
<section
  className="max-w-6xl mx-auto px-6 pt-16 pb-14 grid md:grid-cols-2 gap-12 items-center relative"
  style={{
    backgroundImage: "radial-gradient(#E2E8F0 1px, transparent 1px)",
    backgroundSize: "24px 24px",
    backgroundPosition: "-12px -12px",
  }}
>
  <style>{`
    @keyframes sh-rise {
      from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .sh-rise { animation: sh-rise 0.5s ease-out both; }
    @media (prefers-reduced-motion: reduce) {
      .sh-rise { animation: none; }
    }
  `}</style>

  <div>
    <TypingHeadline
      text="AI-powered campus recruitment, simplified."
      className="font-bold mb-4"
      style={{ fontSize: "32px", lineHeight: 1.2, letterSpacing: "-0.01em" }}
    />
    <p
      className="sh-rise text-sm mb-7 max-w-md"
      style={{ color: "#64748B", animationDelay: "0.9s" }}
    >
      SmartHire scores every resume against every job on a drive, so students track one
      clear status and recruiters open a ranked shortlist instead of a stack.
    </p>
    <div className="sh-rise flex flex-wrap gap-3" style={{ animationDelay: "1.1s" }}>
      <Link
        to={ROUTES.browseJobs}
        className="text-sm font-medium px-5 py-2.5 rounded-md text-white flex items-center gap-1.5 transition-transform duration-150 hover:-translate-y-0.5"
        style={{ background: "#2563EB" }}
      >
        Browse open drives <ArrowRight size={14} />
      </Link>
      <Link
        to={ROUTES.postDrive}
        className="text-sm font-medium px-5 py-2.5 rounded-md transition-transform duration-150 hover:-translate-y-0.5"
        style={{ color: "#1A2130", border: "1px solid #E2E8F0" }}
      >
        Post a drive
      </Link>
    </div>
  </div>

  {/* Data as hero: score counts up on load */}
  <Link
    to={ROUTES.browseJobs}
    className="sh-rise bg-white rounded-lg p-6 block transition-transform duration-200 hover:-translate-y-1"
    style={{ border: "1px solid #E2E8F0", borderLeft: "3.5px solid #2563EB", animationDelay: "1.3s" }}
  >
    <div className="flex items-start justify-between mb-3">
      <div>
        <div className="text-base font-semibold">Software Engineer — TCS</div>
        <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>
          Tata Consultancy Services
        </div>
      </div>
      <span
        className="text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ color: "#065F46", background: "#D1FAE5" }}
      >
        OPEN
      </span>
    </div>
    <div className="text-sm mb-4" style={{ color: "#1A2130" }}>
      Required: Java, Spring Boot, SQL, REST APIs
    </div>
    <div className="text-xs mb-5" style={{ color: "#64748B" }}>
      CGPA Cutoff: 7.5 · Deadline: 20 Aug 2025 · Openings: 25 · Kolkata / Remote
    </div>

    <div style={{ borderTop: "1px solid #E2E8F0" }} className="pt-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium" style={{ color: "#64748B" }}>
          Rohan Sharma — MCA
        </span>
        <AnimatedScoreBadge target={82} />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <StatusPill label="Shortlisted" />
        <span className="text-xs" style={{ color: "#64748B" }}>
          Rank #1 of 48 applicants
        </span>
      </div>
    </div>
  </Link>
</section>

      {/* How it works — status timeline as the visual moment */}
      <section id="how" className="max-w-6xl mx-auto px-6 py-14" style={{ borderTop: "1px solid #E2E8F0" }}>
        <h2 className="font-bold mb-2" style={{ fontSize: "24px", letterSpacing: "-0.01em" }}>
          One status, always visible.
        </h2>
        <p className="text-sm mb-8" style={{ color: "#64748B" }}>
          Every application moves through the same clear pipeline.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {["Applied", "Under Review", "Shortlisted", "Interview", "Selected"].map((s, i, arr) => (
            <React.Fragment key={s}>
              <StatusPill label={s} />
              {i < arr.length - 1 && <ArrowRight size={14} style={{ color: "#94A3B8" }} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Roles — the signature: same card, coloured left border, real routes */}
      <section id="roles" className="max-w-6xl mx-auto px-6 py-14" style={{ borderTop: "1px solid #E2E8F0" }}>
        <h2 className="font-bold mb-2" style={{ fontSize: "24px", letterSpacing: "-0.01em" }}>
          One portal, three vantage points.
        </h2>
        <p className="text-sm mb-8" style={{ color: "#64748B" }}>
          Same components, same spacing — the colour tells you where you are.
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          <RoleCard
            accent="#2563EB"
            icon={GraduationCap}
            role="Student"
            tagline="Light blue theme"
            body="Build one profile, apply to every open drive, and track status without chasing an email thread."
            cta="Browse jobs"
            to={ROUTES.browseJobs}
          />
          <RoleCard
            accent="#4F46E5"
            icon={Briefcase}
            role="Recruiter"
            tagline="Warm indigo theme"
            body="Post a drive, get a ranked shortlist by fit score, and schedule interviews without a spreadsheet."
            cta="Post a drive"
            to={ROUTES.postDrive}
          />
          <RoleCard
            accent="#00D4AA"
            icon={LayoutDashboard}
            role="Admin"
            tagline="Dark teal theme"
            body="Approve recruiters, watch placement rate by branch, and export reports for the whole batch."
            cta="Open console"
            to={ROUTES.adminDashboard}
          />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-14" style={{ borderTop: "1px solid #E2E8F0" }}>
        <h2 className="font-bold mb-8" style={{ fontSize: "24px", letterSpacing: "-0.01em" }}>
          Built for placement season.
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[
            { title: "Resume parsing", body: "Skills, education, and experience extracted on upload." },
            { title: "AI resume scoring", body: "Every resume ranked against the job it's applied to." },
            { title: "Interview scheduling", body: "Recruiters set slots; students book without email." },
            { title: "Role-based dashboards", body: "Students, recruiters, and admins each see their own view." },
            { title: "Placement analytics", body: "Branch-wise placement rate, updated live." },
            { title: "Email notifications", body: "Status changes reach students automatically." },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-lg p-5"
              style={{ border: "1px solid #E2E8F0", borderLeft: "3.5px solid #94A3B8" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={15} style={{ color: "#10B981" }} />
                <span className="text-sm font-semibold">{f.title}</span>
              </div>
              <p className="text-sm" style={{ color: "#64748B" }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Search bar — routes into BrowseJobs.jsx with a query param */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-lg p-2 flex items-center gap-2 max-w-xl"
          style={{ border: "1px solid #E2E8F0" }}
        >
          <Search size={16} style={{ color: "#64748B" }} className="ml-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search open drives by role or company..."
            className="flex-1 text-sm px-2 py-2 outline-none"
            style={{ border: "none", borderRadius: "4px", color: "#1A2130" }}
          />
          <button
            type="submit"
            className="text-sm font-medium px-4 py-2 rounded-md text-white"
            style={{ background: "#2563EB" }}
          >
            Search
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #E2E8F0" }}>
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "#2563EB" }}>
                <GraduationCap size={13} color="#FFFFFF" strokeWidth={2} />
              </div>
              <span className="text-sm font-bold">SmartHire</span>
            </div>
            <p className="text-xs" style={{ color: "#64748B" }}>
              AI-powered campus recruitment, simplified.
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs font-medium" style={{ color: "#64748B" }}>
            <a href="#" className="hover:text-[#1A2130]">Privacy</a>
            <a href="#" className="hover:text-[#1A2130]">Contact</a>
            <a href="#" className="hover:text-[#1A2130]">Help Center</a>
          </div>
        </div>
        <div className="text-center text-xs pb-6" style={{ color: "#94A3B8" }}>
          © {year} SmartHire. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
