import { Link } from "react-router-dom";
import {
  Target,
  Users,
  Brain,
  FileText,
  Search,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  ArrowRight,
  Code2,
  Database,
  Cpu,
} from "lucide-react";
import {
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import Reveal from "../components/Reveal";

export default function About() {
  const features = [
    {
      icon: FileText,
      title: "Resume Parsing",
      body: "Automatically extracts skills, education, certifications and experience.",
    },
    {
      icon: Brain,
      title: "AI Resume Scoring",
      body: "Ranks every resume against the job description using intelligent matching.",
    },
    {
      icon: Search,
      title: "Application Tracking",
      body: "Students always know where they stand in the recruitment process.",
    },
    {
      icon: Briefcase,
      title: "Recruitment Management",
      body: "Recruiters can post drives, shortlist candidates and schedule interviews.",
    },
    {
      icon: Users,
      title: "Role Based Dashboards",
      body: "Separate experiences for Students, Recruiters and Placement Officers.",
    },
    {
      icon: CheckCircle2,
      title: "Email Notifications",
      body: "Automatic notifications keep everyone updated throughout the process.",
    },
  ];

const workflow = [
  {
    title: "Resume Upload",
    desc: "Student uploads a PDF resume.",
    color: "bg-blue-100 text-blue-600 border-blue-200",
  },
  {
    title: "AI Resume Parser",
    desc: "Extracts education, skills and projects.",
    color: "bg-indigo-100 text-indigo-600 border-indigo-200",
  },
  {
    title: "Resume Matching",
    desc: "Compared against the Job Description.",
    color: "bg-violet-100 text-violet-600 border-violet-200",
  },
  {
    title: "AI Resume Score",
    desc: "Suitability score is generated instantly.",
    color: "bg-cyan-100 text-cyan-600 border-cyan-200",
  },
  {
    title: "Recruiter Review",
    desc: "Recruiter reviews ranked candidates.",
    color: "bg-emerald-100 text-emerald-600 border-emerald-200",
  },
  {
    title: "Interview & Offer",
    desc: "Shortlisted candidates move forward.",
    color: "bg-orange-100 text-orange-600 border-orange-200",
  },
];

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#1A2130]">

      {/* HERO */}

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
          <Brain size={16} />
          AI Powered Campus Recruitment
        </div>

        <h1 className="text-5xl font-bold mb-6">
          About SmartHire
        </h1>

        <p className="max-w-3xl mx-auto text-lg text-slate-600 leading-8">
          SmartHire is an intelligent campus recruitment platform designed to
          simplify placement management for students, recruiters and placement
          administrators through AI-powered resume analysis and smart
          recruitment workflows.
        </p>

      </section>

      {/* MISSION */}

      <Reveal as="section" className="max-w-6xl mx-auto px-6 py-20">

        <div className="bg-white rounded-xl border border-slate-200 p-8">

          <div className="flex items-center gap-3 mb-5">

            <Target className="text-blue-600" />

            <h2 className="text-2xl font-bold">
              Our Mission
            </h2>

          </div>

          <p className="text-slate-600 leading-8">
            We believe campus recruitment should be simple, transparent and
            efficient. SmartHire reduces manual work by automating resume
            screening, helping recruiters identify suitable candidates quickly
            while giving students a better application experience.
          </p>

        </div>

      </Reveal>

      {/* CHALLENGES → SOLUTION */}

<Reveal as="section" className="max-w-6xl mx-auto px-6 py-20">

  <div className="text-center mb-12">

    <h2 className="text-3xl font-bold mb-3">
      Transforming Campus Recruitment
    </h2>

    <p className="text-slate-500 max-w-2xl mx-auto">
      SmartHire replaces slow, manual recruitment with an intelligent,
      transparent and AI-assisted hiring workflow.
    </p>

  </div>

  <div className="grid lg:grid-cols-2 gap-8">

    <Reveal>
  <div
    className="
      group
      bg-white
      rounded-xl
      border
      border-red-200
      p-8
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-xl
      hover:border-red-300
    "
  >
    <div className="flex items-center gap-3 mb-6">
      <div
  className="
    w-12 h-12
    rounded-full
    bg-red-100
    flex items-center justify-center
    transition-all duration-300
    group-hover:scale-110
  "
>
  <AlertTriangle
    size={24}
    className="text-red-600"
    strokeWidth={2}
  />
</div>

      <div>
        <h2 className="text-2xl font-bold text-red-600">
          Traditional Process
        </h2>

        <p className="text-sm text-slate-500">
          Common challenges during campus placements
        </p>
      </div>
    </div>

    <div className="space-y-5">
      {[
        "Manual resume screening takes hours",
        "Recruiters review hundreds of resumes",
        "Students rarely know their application status",
        "Interview coordination happens through emails",
        "Placement data is maintained in spreadsheets",
      ].map((item) => (
        <div
          key={item}
          className="flex items-start gap-3 transition-all duration-300 group-hover:translate-x-1"
        >
          <span className="text-red-500 mt-1">✖</span>

          <p className="text-slate-600">{item}</p>
        </div>
      ))}
    </div>
  </div>
</Reveal>

    {/* SmartHire */}

    <div
      className="
      group
      bg-white
      rounded-xl
      border
      border-blue-200
      p-8
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-xl
      "
    >

      <div className="flex items-center gap-3 mb-6">

<div
  className="
    w-12 h-12
    rounded-full
    bg-blue-100
    flex
    items-center
    justify-center
    transition-all
    duration-300
    group-hover:scale-110
    group-hover:rotate-6
  "
>
  <Sparkles
    size={24}
    className="text-blue-600"
    strokeWidth={2}
  />
</div>

        <div>

          <h2 className="text-2xl font-bold text-blue-600">
            SmartHire Approach
          </h2>

          <p className="text-sm text-slate-500">
            Faster, smarter and transparent recruitment
          </p>

        </div>

      </div>

      <div className="space-y-5">

        {[
          "AI automatically parses and analyses resumes",
          "Candidates are ranked by job relevance",
          "Students receive real-time application updates",
          "Recruiters manage everything from one dashboard",
          "Placement records stay organised digitally",
        ].map((item) => (

          <div
            key={item}
            className="flex items-start gap-3"
          >

            <span className="text-blue-600 mt-1">✔</span>

            <p className="text-slate-600">
              {item}
            </p>

          </div>

        ))}

      </div>

    </div>

  </div>

</Reveal>

        {/* WORKFLOW */}

<Reveal as="section" className="max-w-5xl mx-auto px-6 py-20">

  <h2 className="text-3xl font-bold text-center mb-3">
    Recruitment Workflow
  </h2>

  <p className="text-center text-slate-500 mb-14">
    Every application follows an intelligent pipeline from upload to placement.
  </p>

  <div className="space-y-2">

    {workflow.map((step, index) => (

      <div
        key={step.title}
        className="group flex gap-6 items-start"
      >

        {/* Timeline */}

        <div className="flex flex-col items-center">

          <div
            className={`
              w-14 h-14 rounded-full border
              flex items-center justify-center
              font-bold text-lg
              transition-all duration-300
              group-hover:scale-110 group-hover:rotate-6
              ${step.color}
            `}
          >
            {index + 1}
          </div>

          {index !== workflow.length - 1 && (

            <div
              className="w-[3px] h-20
              bg-gradient-to-b
              from-blue-300
              via-indigo-300
              to-slate-200"
            />

          )}

        </div>

        {/* Card */}

        <div
          className="
          flex-1
          bg-white
          rounded-xl
          border
          border-slate-200
          p-6
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
          hover:border-blue-300"
        >

          <h3 className="text-lg font-semibold mb-2">
            {step.title}
          </h3>

          <p className="text-slate-600 leading-7">
            {step.desc}
          </p>

        </div>

      </div>

    ))}

  </div>

</Reveal>

      {/* VISION */}

<Reveal as="section" className="max-w-6xl mx-auto px-6 pb-20">

  <div className="grid md:grid-cols-2 gap-8">

    <div
      className="bg-white rounded-xl border border-slate-200 p-8
                 transition-all duration-300
                 hover:-translate-y-1 hover:shadow-xl"
    >
      <h2 className="text-2xl font-bold mb-5 text-blue-600">
        Our Vision
      </h2>

      <p className="text-slate-600 leading-8">
        We envision a campus recruitment ecosystem where every deserving
        student receives equal visibility and every recruiter can identify
        the right talent quickly using intelligent technology instead of
        manual filtering.
      </p>
    </div>

    <div
      className="bg-white rounded-xl border border-slate-200 p-8
                 transition-all duration-300
                 hover:-translate-y-1 hover:shadow-xl"
    >
      <h2 className="text-2xl font-bold mb-5 text-indigo-600">
        Why SmartHire?
      </h2>

      <p className="text-slate-600 leading-8">
        Traditional placement portals mainly store applications.
        SmartHire goes beyond storage by analysing resumes,
        ranking candidates, simplifying recruiter workflows,
        and keeping students informed throughout the hiring journey.
      </p>
    </div>

  </div>

</Reveal>
    </div>
    
  );
}