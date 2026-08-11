import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  CalendarDays,
  Briefcase,
  Clock3,
} from "lucide-react";

import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import StatusPill from "../../components/StatusPill.jsx";
import EmptyState from "../../components/EmptyState.jsx";
const API_URL = import.meta.env.VITE_API_URL;

// ─── Company Logo ─────────────────────────────────────────────────────────────

function CompanyLogo({ companyName }) {
  const [failed, setFailed] = useState(false);

  if (!companyName) return null;

  const domain = companyName
    .toLowerCase()
    .replace(/\b(technologies|technology|solutions|services|systems|software|consulting|india|pvt|ltd|limited|inc|corp|group|co)\b\.?/g, "")
    .trim()
    .replace(/\s+/g, "") + ".com";

  const initials = companyName
    .split(" ").filter(Boolean).slice(0, 2)
    .map((w) => w[0]).join("").toUpperCase();

  const colors = ["bg-blue-100 text-blue-700","bg-violet-100 text-violet-700","bg-emerald-100 text-emerald-700","bg-orange-100 text-orange-700"];
  const colorClass = colors[companyName.charCodeAt(0) % colors.length];

  if (failed) {
    return (
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${colorClass}`}>
        {initials}
      </div>
    );
  }

  return (
    <img
      src={`https://cdn.brandfetch.io/${domain}?c=${import.meta.env.VITE_BRANDFETCH_CLIENT_ID}`}
      alt={companyName}
      className="h-10 w-10 rounded-lg object-contain border border-gray-100 bg-white p-1 shrink-0"
      onError={() => setFailed(true)}
    />
  );
}

export default function BrowseJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const loginData = (() => {
    try {
      return JSON.parse(localStorage.getItem("student"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!loginData) {
      navigate("/login");
      return;
    }

    const loadJobs = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/jobs/open`
        );

        if (!response.ok) {
          throw new Error("Failed to load jobs");
        }

        const data = await response.json();

        setJobs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Jobs loading error:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [navigate]);

  const getSkills = (skills) => {
    if (!skills) {
      return [];
    }

    if (Array.isArray(skills)) {
      return skills
        .map((skill) => String(skill).trim())
        .filter(Boolean);
    }

    return String(skills)
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  };

  const locations = useMemo(() => {
    const values = jobs
      .map((job) => job.location)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const search = query.toLowerCase().trim();

    return jobs.filter((job) => {
      const skillsText = job.skills || "";

      const searchableText = `
        ${job.title || ""}
        ${job.recruiter?.companyName || job.companyName || ""}
        ${job.location || ""}
        ${job.employmentType || ""}
        ${job.experienceRequired || ""}
        ${skillsText}
      `.toLowerCase();

      const matchesSearch =
        !search || searchableText.includes(search);

      const matchesLocation =
        locationFilter === "All" ||
        job.location === locationFilter;

      return matchesSearch && matchesLocation;
    });
  }, [jobs, query, locationFilter]);

  if (loading) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="text-sm font-medium text-gray-500">
            Loading drives...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div className="mb-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>
            <p className="mb-2 text-sm font-semibold text-blue-600">
              STUDENT PORTAL
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-gray-800 md:text-4xl">
              Browse Drives
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-gray-500 md:text-base">
              Find placement opportunities that match your
              skills and profile.
            </p>
          </div>

          {/* Available jobs count */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-blue-500">
              Available Drives
            </p>

            <p className="mt-1 text-2xl font-bold text-blue-700">
              {jobs.length}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          SEARCH + FILTER
      ====================================================== */}
      <Card className="mb-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">

          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by role, company or skill..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Location */}
          <select
            value={locationFilter}
            onChange={(e) =>
              setLocationFilter(e.target.value)
            }
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 md:w-52"
          >
            {locations.map((location) => (
              <option
                key={location}
                value={location}
              >
                {location === "All"
                  ? "All Locations"
                  : location}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* =====================================================
          RESULTS HEADER
      ====================================================== */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Placement Opportunities
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {filteredJobs.length}{" "}
            {filteredJobs.length === 1
              ? "drive"
              : "drives"}{" "}
            found
          </p>
        </div>

        {(query || locationFilter !== "All") && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setLocationFilter("All");
            }}
            className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}
      {filteredJobs.length === 0 ? (
        <EmptyState
          title="No drives found"
          description={
            jobs.length === 0
              ? "There are currently no open placement drives."
              : "Try changing your search or location filter."
          }
        />
      ) : (
        /* ===================================================
           JOB CARDS
        ==================================================== */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job) => {
            const skills = getSkills(job.skills);

            return (
              <Card
                key={job.id}
                className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl"
              >

                {/* -----------------------------------------
                    JOB HEADER
                ------------------------------------------ */}
                <div className="mb-5 flex items-start gap-3">

                      <CompanyLogo
                        companyName={
                          job.recruiter?.companyName ||
                          job.companyName ||
                          job.companyName ||
                          null
                        }
                      />

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-bold text-gray-800">
                      {job.title || "Untitled Position"}
                    </h3>

                    <p className="mt-1 truncate text-sm font-medium text-blue-600">
                      {job.recruiter?.companyName || "Company"}
                    </p>
                  </div>

                  {/* Status pill */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                        job.status === "ACTIVE" || job.status === "OPEN"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        job.status === "ACTIVE" || job.status === "OPEN"
                          ? "bg-green-500" : "bg-red-500"
                      }`} />
                      {job.status || "ACTIVE"}
                    </span>
                  </div>

                {/* -----------------------------------------
                    SHORT DESCRIPTION
                ------------------------------------------ */}
                {job.description && (
                  <p className="mb-5 line-clamp-2 text-sm leading-6 text-gray-500">
                    {job.description}
                  </p>
                )}

                {/* -----------------------------------------
                    BASIC DETAILS
                ------------------------------------------ */}
                <div className="space-y-3">

                  {/* Location */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                      <MapPin size={15} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Location
                      </p>

                      <p className="truncate text-sm font-medium text-gray-700">
                        {job.location || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Employment */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                      <Briefcase size={15} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Employment
                      </p>

                      <p className="truncate text-sm font-medium text-gray-700">
                        {job.employmentType || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                      <Clock3 size={15} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Experience
                      </p>

                      <p className="truncate text-sm font-medium text-gray-700">
                        {job.experienceRequired + " yrs" ||"Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                      <CalendarDays size={15} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Application Deadline
                      </p>

                      <p className="truncate text-sm font-medium text-gray-700">
                        {job.applicationDeadline ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* -----------------------------------------
                    SKILLS
                ------------------------------------------ */}
                {skills.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-medium text-gray-400">
                      Required Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600"
                        >
                          {skill}
                        </span>
                      ))}

                      {skills.length > 3 && (
                        <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500">
                          +{skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* -----------------------------------------
                    ACTION
                ------------------------------------------ */}
                <div className="mt-auto pt-6">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() =>
                      navigate(
                        `/student/jobs/${job.id}`
                      )
                    }
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}