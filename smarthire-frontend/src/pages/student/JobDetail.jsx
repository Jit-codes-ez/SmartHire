import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  CalendarDays,
  GraduationCap,
  Building2,
  IndianRupee,
  Clock3,
  CheckCircle2,
  Users,
} from "lucide-react";

import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import StatusPill from "../../components/StatusPill.jsx";

export default function JobDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOGIN DATA
  // --------------------------------------------------

  const loginData = (() => {
    try {
      return JSON.parse(localStorage.getItem("student"));
    } catch {
      return null;
    }
  })();

  // --------------------------------------------------
  // LOAD JOB
  // --------------------------------------------------

  useEffect(() => {
    if (!loginData) {
      navigate("/login");
      return;
    }

    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/jobs/${id}`
        );

        if (!response.ok) {
          throw new Error("Job not found");
        }

        const data = await response.json();

        console.log("Job details:", data);

        setJob(data);
      } catch (error) {
        console.error("Job details loading error:", error);
        setError(error.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id, navigate]);

  // --------------------------------------------------
  // CHECK APPLICATION
  // --------------------------------------------------

  useEffect(() => {
    if (!loginData?.email || !id) {
      setCheckingApplication(false);
      return;
    }

    const checkApplication = async () => {
      try {
        setCheckingApplication(true);

        const response = await fetch(
          `/api/applications/check/${id}?email=${encodeURIComponent(
            loginData.email
          )}`
        );

        if (!response.ok) {
          console.error("Failed to check application");
          return;
        }

        const data = await response.json();

        console.log("Application status:", data);

        setHasApplied(data.applied === true);
      } catch (error) {
        console.error("Application check error:", error);
      } finally {
        setCheckingApplication(false);
      }
    };

    checkApplication();
  }, [id, loginData?.email]);

  // --------------------------------------------------
  // APPLY
  // --------------------------------------------------

  const handleApply = async () => {
    if (!job || hasApplied || applying) {
      return;
    }

    if (!loginData?.email) {
      navigate("/login");
      return;
    }

    try {
      setApplying(true);
      setApplicationSuccess(false);
      setError("");

      const response = await fetch(
        `/api/applications/apply/${job.id}?email=${encodeURIComponent(
          loginData.email
        )}`,
        {
          method: "POST",
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log("Application response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit application"
        );
      }

      // Update UI immediately
      setHasApplied(true);
      setApplicationSuccess(true);
    } catch (error) {
      console.error("Application error:", error);

      setError(
        error.message ||
          "Something went wrong while applying."
      );
    } finally {
      setApplying(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // JOB NOT FOUND
  // --------------------------------------------------

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <BriefcaseBusiness size={25} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-800">
            Job not found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error ||
              "This drive may have been removed or is no longer available."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/student/jobs")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={17} />
            Back to Drives
          </button>
        </Card>
      </div>
    );
  }

  // --------------------------------------------------
  // NORMALIZE SKILLS
  // --------------------------------------------------

  const skills = Array.isArray(job.skills)
    ? job.skills
    : typeof job.skills === "string"
    ? job.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  // --------------------------------------------------
  // COMPANY
  // --------------------------------------------------

  const companyName =
    job.recruiter?.companyName ||
    job.company ||
    "Company";

  // --------------------------------------------------
  // STATUS
  // --------------------------------------------------

  const isOpen =
    job.status === "ACTIVE" ||
    job.status === "Open" ||
    job.status === "OPEN";

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="mx-auto max-w-7xl">
      {/* =================================================
          BACK
      ================================================= */}

      <button
        type="button"
        onClick={() => navigate("/student/jobs")}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Back to Drives
      </button>

      {/* =================================================
          HEADER
      ================================================= */}

      <Card className="rounded-2xl border border-gray-100 border-l-4 border-l-blue-600 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            {/* ICON */}

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Building2 size={30} />
            </div>

            {/* TITLE */}

            <div>
              <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                {job.title}
              </h1>

              <p className="mt-1 text-lg font-semibold text-blue-600">
                {companyName}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <MapPin
                    size={16}
                    className="text-blue-500"
                  />

                  {job.location || "Location not specified"}
                </span>

                <span className="flex items-center gap-2">
                  <BriefcaseBusiness
                    size={16}
                    className="text-blue-500"
                  />

                  {job.employmentType || "Not specified"}
                </span>
              </div>
            </div>
          </div>

          {/* STATUS */}

          <div className="self-start">
            <StatusPill
              status={job.status}
              size="sm"
            />
          </div>
        </div>
      </Card>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* =================================================
            LEFT
        ================================================= */}

        <div className="space-y-6 lg:col-span-2">
          {/* DESCRIPTION */}

          <Card className="rounded-2xl border border-gray-100 border-l-4 border-l-blue-500 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <BriefcaseBusiness
                size={21}
                className="text-blue-600"
              />

              Job Description
            </h2>

            <div className="mt-5">
              <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
                {job.description ||
                  "No job description provided."}
              </p>
            </div>
          </Card>

          {/* SKILLS */}

          <Card className="rounded-2xl border border-gray-100 border-l-4 border-l-blue-500 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-xl font-bold text-gray-800">
              Required Skills
            </h2>

            {skills.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-500">
                No specific skills listed.
              </p>
            )}
          </Card>

          {/* COMPANY */}

          <Card className="rounded-2xl border border-gray-100 border-l-4 border-l-blue-500 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-xl font-bold text-gray-800">
              About the Company
            </h2>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Building2 size={23} />
              </div>

              <div>
                <p className="font-semibold text-gray-800">
                  {companyName}
                </p>

                {job.recruiter?.industry && (
                  <p className="mt-1 text-sm text-gray-500">
                    {job.recruiter.industry}
                  </p>
                )}
              </div>
            </div>

            {job.recruiter?.city && (
              <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                <MapPin
                  size={16}
                  className="text-blue-500"
                />

                {job.recruiter.city}

                {job.recruiter.state
                  ? `, ${job.recruiter.state}`
                  : ""}
              </div>
            )}

            {job.recruiter?.companyWebsite && (
              <a
                href={job.recruiter.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Visit Company Website →
              </a>
            )}
          </Card>
        </div>

        {/* =================================================
            RIGHT SIDEBAR
        ================================================= */}

        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* JOB INFORMATION */}

            <Card className="rounded-2xl border border-gray-100 border-l-4 border-l-blue-500 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800">
                Job Information
              </h2>

              <div className="mt-6 space-y-5">
                {/* EMPLOYMENT */}

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-blue-500">
                    <BriefcaseBusiness size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Employment Type
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                      {job.employmentType ||
                        "Not specified"}
                    </p>
                  </div>
                </div>

                {/* EXPERIENCE */}

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-blue-500">
                    <GraduationCap size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Experience
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                      {job.experienceRequired + " yrs"||"Not specified"}
                    </p>
                  </div>
                </div>

                {/* SALARY */}

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-blue-500">
                    <IndianRupee size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Salary
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                      {job.salary + " LPA" || "Not specified"}
                    </p>
                  </div>
                </div>

                {/* LOCATION */}

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-blue-500">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Location
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                      {job.location || "Not specified"}
                    </p>
                  </div>
                </div>

                {/* DEADLINE */}

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-blue-500">
                    <CalendarDays size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Application Deadline
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                      {job.applicationDeadline ||
                        job.deadline ||
                        "Not specified"}
                    </p>
                  </div>
                </div>

                {/* OPENINGS */}

                {job.openings !== undefined &&
                  job.openings !== null && (
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-blue-500">
                        <Users size={19} />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Openings
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-700">
                          {job.openings}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </Card>

            {/* APPLY CARD */}

            <Card className="rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    hasApplied
                      ? "bg-green-100 text-green-600"
                      : "bg-white text-blue-600"
                  }`}
                >
                  {hasApplied ? (
                    <CheckCircle2 size={21} />
                  ) : (
                    <Clock3 size={21} />
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-gray-800">
                    {hasApplied
                      ? "Application Submitted"
                      : "Interested in this drive?"}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {hasApplied
                      ? "You have already applied for this position."
                      : "Submit your application before the deadline."}
                  </p>
                </div>
              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-xs font-medium leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* APPLY BUTTON */}

              <div className="mt-5">
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={
                    !isOpen ||
                    applying ||
                    hasApplied ||
                    checkingApplication
                  }
                  onClick={handleApply}
                >
                  {checkingApplication
                    ? "Checking..."
                    : applying
                    ? "Submitting Application..."
                    : hasApplied
                    ? "✓ Application Submitted"
                    : isOpen
                    ? "Apply Now"
                    : "Applications Closed"}
                </Button>
              </div>

              {/* SUCCESS MESSAGE */}

              {applicationSuccess && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-green-200 bg-white shadow-sm">
                  {/* SUCCESS HEADER */}

                  <div className="flex items-center gap-3 bg-green-50 px-4 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <CheckCircle2 size={22} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-green-700">
                        Application Submitted
                      </p>

                      <p className="mt-0.5 text-xs text-green-600">
                        Your application has been successfully
                        submitted.
                      </p>
                    </div>
                  </div>

                  {/* SUCCESS MESSAGE */}

                  <div className="px-4 py-4">
                    <p className="text-xs leading-5 text-gray-500">
                      Your application has been recorded
                      successfully. You can track its status
                      from your applications section.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/student/applications"
                        )
                      }
                      className="mt-3 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                    >
                      View My Applications →
                    </button>
                  </div>
                </div>
              )}

              {!hasApplied && isOpen && (
                <p className="mt-3 text-center text-[11px] text-gray-400">
                  Make sure your profile and resume are
                  up to date before applying.
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}