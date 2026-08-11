import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Briefcase,
  LayoutDashboard,
  ArrowRight,
  Search,
  CheckCircle2,
  FileText,
  Sparkles,
  RotateCcw,
} from "lucide-react";


import ScoreBadge, { AnimatedScoreBadge } from '../components/ScoreBadge.jsx'
import Reveal from '../components/Reveal.jsx'

export const ROUTES = {
  login: "/login",
  studentDashboard: "/student/dashboard",
  browseJobs: "/student/jobs",
  myApplications: "/student/applications",
  recruiterDashboard: "/recruiter/dashboard",
  postDrive: "/recruiter/drives/new",
  adminDashboard: "/admin/dashboard",
  studentRegistration: "/student/register",
  recruiterRegistration: "/recruiter/register",
};

function RoleCard({ accent, icon: Icon, role, tagline, body, cta, to, delay = 0 }) {
  return (
    <div
      className="sh-role-card bg-white rounded-lg p-6 flex flex-col"
      style={{
        border: "1px solid #E2E8F0",
        borderLeft: `3.5px solid ${accent}`,
        animationDelay: `${delay}s`,
        boxShadow: `0 10px 24px ${accent}00`,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 14px 28px ${accent}26`)}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 10px 24px ${accent}00`)}
    >
      <div
        className="sh-role-icon w-9 h-9 rounded flex items-center justify-center mb-4"
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
        className="sh-role-cta text-sm font-medium rounded-md px-4 py-2.5 flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
        style={{ background: accent, color: "#FFFFFF" }}
      >
        {cta} <ArrowRight size={14} />
      </Link>
    </div>
  );
}

// TypingHeadline: types out the text letter by letter, with a blinking cursor.
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


// Pipeline diagram: shows the steps a student application goes through, with icons and labels.
const PIPELINE = [
  { icon: FileText, label: "Resume Submitted", detail: "Student uploads once" },
  { icon: Sparkles, label: "Parsed", detail: "Skills, education, experience extracted" },
  { icon: LayoutDashboard, label: "Scored", detail: "Ranked against the job description" },
  { icon: CheckCircle2, label: "Shortlisted", detail: "Recruiter reviews ranked list" },
  { icon: Briefcase, label: "Interview", detail: "Scheduled directly in-app" },
  { icon: GraduationCap, label: "Placed", detail: "Offer recorded, batch updated" },
];
function PipelineDiagram() {
  return (
    <div className="sh-rise" style={{ animationDelay: "1.2s" }}>
      <style>{`
        @keyframes sh-step-fade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sh-step { animation: sh-step-fade 0.4s ease-out both; }
        .sh-pipeline-step {
          border-radius: 8px;
          margin: 0 -0.75rem;
          padding: 0.5rem 0.75rem;
          border-left: 3.5px solid transparent;
          transform: scale(1);
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease;
          position: relative;
        }
        .sh-pipeline-step:hover {
          transform: scale(1.04);
          border-left-color: #2563EB;
          background: #FFFFFF;
          box-shadow: 0 6px 16px rgba(37,99,235,0.12);
          z-index: 2;
        }
        .sh-pipeline-icon {
          transition: transform 0.18s ease;
        }
        .sh-pipeline-step:hover .sh-pipeline-icon {
          transform: scale(1.12);
        }
        @media (prefers-reduced-motion: reduce) {
          .sh-step { animation: none; }
          .sh-pipeline-step, .sh-pipeline-icon { transition: none; }
          .sh-pipeline-step:hover { transform: none; }
        }
      `}</style>

      <div className="rounded-lg p-6 bg-white" style={{ border: "1px solid #E2E8F0" }}>
        <div className="text-xs font-semibold uppercase tracking-wide mb-6" style={{ color: "#64748B" }}>
          How an application moves through SmartHire
        </div>

        <div className="flex flex-col">
          {PIPELINE.map((step, i) => (
            <div
              key={step.label}
              className="sh-step sh-pipeline-step flex gap-4"
              style={{ animationDelay: `${1.3 + i * 0.1}s` }}
            >
              <div className="flex flex-col items-center">
                <div
                  className="sh-pipeline-icon w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "#EFF6FF", border: "1px solid #DBEAFE" }}
                >
                  <step.icon size={16} style={{ color: "#2563EB" }} strokeWidth={1.9} />
                </div>
                {i < PIPELINE.length - 1 && (
                  <div style={{ width: "1px", flex: 1, background: "#E2E8F0", minHeight: "20px" }} />
                )}
              </div>
              <div className="pb-6">
                <div className="text-sm font-semibold" style={{ color: "#1A2130" }}>
                  {step.label}
                </div>
                <div className="text-xs" style={{ color: "#64748B" }}>
                  {step.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// FrontPage: the landing page, with hero, roles, features, and search bar.
export default function FrontPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap";
    document.head.appendChild(link);
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
      {/* Hero — content-first, with an orchestrated entrance */}
      <section
        id= "how" className="max-w-6xl mx-auto px-6 pt-16 pb-14 grid md:grid-cols-2 gap-12 items-center relative"
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
  <button
    onClick={() => document.getElementById("roles")?.scrollIntoView({ behavior: "smooth" })}
    className="text-sm font-medium px-5 py-2.5 rounded-md text-white flex items-center gap-1.5 transition-transform duration-150 hover:-translate-y-0.5"
    style={{ background: "#2563EB" }}
  >
   Get Started <ArrowRight size={14} />
  </button>
</div>
        </div>

        {/* Data as hero — a generic scoring demo, clearly labeled as an example */}
        <PipelineDiagram />
      </section>

      {/* Roles */}
      <div id="roles">
<Reveal as="section" id="roles" className="max-w-6xl mx-auto px-6 py-14" style={{ borderTop: "1px solid #E2E8F0" }}>
  <style>{`
    @keyframes sh-role-fade {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .sh-role-card {
      animation: sh-role-fade 0.45s ease-out both;
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }
    .sh-role-card:hover {
      transform: translateY(-6px) scale(1.02);
    }
    .sh-role-icon {
      transition: transform 0.18s ease;
    }
    .sh-role-card:hover .sh-role-icon {
      transform: scale(1.12) rotate(-4deg);
    }
    .sh-role-cta {
      transition: gap 0.15s ease;
    }
    .sh-role-card:hover .sh-role-cta {
      gap: 10px;
    }
    @media (prefers-reduced-motion: reduce) {
      .sh-role-card { animation: none; }
      .sh-role-card, .sh-role-icon, .sh-role-cta { transition: none; }
      .sh-role-card:hover { transform: none; }
    }
  `}</style>

  <h2 className="font-bold mb-2" style={{ fontSize: "24px", letterSpacing: "-0.01em" }}>
    Your role, your experience.
  </h2>
  <p className="text-sm mb-8" style={{ color: "#64748B" }}>
    Students apply, Recruiters hire. One platform built for both — SmartHire has you covered.
  </p>
  <div className="grid md:grid-cols-2 gap-5">
    <RoleCard
      accent="#2563EB"
      icon={GraduationCap}
      role="Student"
      tagline="Turn your talent into Opportunity"
      body="Build one profile, apply to every open drive, and track status without chasing an email thread."
      cta="Register as Student"
      to={ROUTES.studentRegistration}
      delay={0}
    />
    <RoleCard
      accent="#4F46E5"
      icon={Briefcase}
      role="Recruiter"
      tagline="Discover skilled candidates with ease"
      body="Post a drive, get a ranked shortlist by fit score, and schedule interviews without a spreadsheet."
      cta="Register as Recruiter"
      to={ROUTES.recruiterRegistration}
      delay={0.1}
    />
  </div>
</Reveal>

      {/* Features */}
<Reveal as="section" id="features" className="max-w-6xl mx-auto px-6 py-14" style={{ borderTop: "1px solid #E2E8F0" }}>
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
        className="bg-white rounded-lg p-5 border border-[#E2E8F0] border-l-[3.5px] border-l-[#94A3B8]
             transition-all duration-200 ease-out
             hover:-translate-y-0.5 hover:shadow-lg hover:border-l-[#2563EB] cursor-default"
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
</Reveal>

      {/* Closing CTA */}
<Reveal as="section" className="max-w-6xl mx-auto px-6 py-16" style={{ borderTop: "1px solid #E2E8F0" }}>
  <div
    className="rounded-lg p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
    style={{ background: "#1A2130" }}
  >
    <div>
      <TypingHeadline
        text="Ready for placement season?"
        className="font-bold mb-4"
        style={{ fontSize: "20px", lineHeight: 1.2, letterSpacing: "-0.01em", color: "white" }}
      />
      <TypingHeadline
        text="Set up your drive in minutes, or build your student profile once and apply everywhere."
        className="mb-4"
        style={{ fontSize: "15px", lineHeight: 1.2, letterSpacing: "-0.01em", color: "white" }}
      />
    </div>
    <div className="flex flex-wrap gap-3 shrink-0">
      <Link
        to={ROUTES.studentRegistration}
        className="group text-sm font-medium px-5 py-2.5 rounded-md text-white flex items-center gap-1.5
                   transition-all duration-200 ease-out
                   hover:-translate-y-0.5"
        style={{ background: "#2563EB" }}
      >
        I'm a student
        <ArrowRight size={14} className="transition-transform duration-200 ease-out group-hover:translate-x-1" />
      </Link>
      <Link
        to={ROUTES.recruiterRegistration}
        className="text-sm font-medium px-5 py-2.5 rounded-md
                   transition-all duration-200 ease-out
                   hover:-translate-y-0.5 hover:bg-white/5 hover:border-[#94A3B8]"
        style={{ color: "#FFFFFF", border: "1px solid #334155" }}
      >
        I'm a recruiter
        </Link>
    </div>
  </div>
</Reveal>
</div>
    </div>
  );
}
