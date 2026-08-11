import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  BriefcaseBusiness,
  MapPin,
  CalendarDays,
  Building2,
  ArrowRight,
  CheckCircle2,
  Clock3,
  XCircle,
  FileText,
} from "lucide-react";

import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import EmptyState from "../../components/EmptyState.jsx";
const API_URL = import.meta.env.VITE_API_URL;

export default function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
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
  // GET COMPANY NAME
  // --------------------------------------------------

  const getCompanyName = (application) => {
    const job = application?.job || {};
    const recruiter = application?.recruiter || job?.recruiter || {};
    const company = application?.company || job?.company || {};

    return (
      application?.companyName ||
      application?.company_name ||
      application?.company_name ||
      job?.companyName ||
      job?.company_name ||
      recruiter?.companyName ||
      recruiter?.company_name ||
      recruiter?.company ||
      company?.companyName ||
      company?.name ||
      (typeof application?.company === "string"
        ? application.company
        : null) ||
      (typeof job?.company === "string" ? job.company : null) ||
      "Company"
    );
  };

  // --------------------------------------------------
  // LOAD APPLICATIONS
  // --------------------------------------------------

  useEffect(() => {
    if (!loginData?.email) {
      navigate("/login");
      return;
    }

    const loadApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const url = `${API_URL}/api/applications/my?email=${encodeURIComponent(
          loginData.email
        )}`;

        console.log("Loading applications from:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to load applications");
        }

        const data = await response.json();

        console.log("My applications:", data);

        if (Array.isArray(data)) {
          data.forEach((application, index) => {
            console.log(`Application ${index + 1}:`, application);
            console.log(
              `Company ${index + 1}:`,
              getCompanyName(application)
            );
          });
        }

        setApplications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Applications loading error:", error);

        setError(
          error.message || "Unable to load your applications."
        );
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [navigate, loginData?.email]);

  // --------------------------------------------------
  // STATUS
  // --------------------------------------------------

  const getStatus = (application) => {
    return (
      application?.status ||
      application?.applicationStatus ||
      "APPLIED"
    );
  };

  // --------------------------------------------------
  // STATUS STYLE
  // --------------------------------------------------

  const getStatusConfig = (status) => {
    const normalized = String(status).toUpperCase();

    if (
      normalized === "SELECTED" ||
      normalized === "ACCEPTED"
    ) {
      return {
        label: "Selected",
        icon: CheckCircle2,
        className:
          "bg-green-50 text-green-700 border-green-200",
        iconClass: "text-green-600",
      };
    }

    if (
      normalized === "REJECTED" ||
      normalized === "REJECT"
    ) {
      return {
        label: "Rejected",
        icon: XCircle,
        className:
          "bg-red-50 text-red-700 border-red-200",
        iconClass: "text-red-600",
      };
    }

    if (
      normalized === "SHORTLISTED" ||
      normalized === "INTERVIEW"
    ) {
      return {
        label:
          normalized === "INTERVIEW"
            ? "Interview"
            : "Shortlisted",
        icon: Clock3,
        className:
          "bg-purple-50 text-purple-700 border-purple-200",
        iconClass: "text-purple-600",
      };
    }

    if (
      normalized === "UNDER_REVIEW" ||
      normalized === "REVIEWING"
    ) {
      return {
        label: "Under Review",
        icon: Clock3,
        className:
          "bg-yellow-50 text-yellow-700 border-yellow-200",
        iconClass: "text-yellow-600",
      };
    }

    return {
      label: "Applied",
      icon: CheckCircle2,
      className:
        "bg-blue-50 text-blue-700 border-blue-200",
      iconClass: "text-blue-600",
    };
  };

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filteredApplications = useMemo(() => {
    const search = query.toLowerCase().trim();

    return applications.filter((application) => {
      const job = application?.job || {};

      const company = getCompanyName(application);

      const title =
        job?.title ||
        application?.jobTitle ||
        application?.position ||
        "";

      const location =
        job?.location ||
        application?.location ||
        "";

      const status = getStatus(application);

      const matchesSearch =
        !search ||
        `${title} ${company} ${location} ${status}`
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        status.toUpperCase() ===
          statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [applications, query, statusFilter]);

  // --------------------------------------------------
  // COUNTS
  // --------------------------------------------------

  const totalApplications = applications.length;

  const pendingApplications = applications.filter(
    (application) => {
      const status =
        getStatus(application).toUpperCase();

      return (
        status === "APPLIED" ||
        status === "UNDER_REVIEW" ||
        status === "REVIEWING"
      );
    }
  ).length;

  const shortlistedApplications =
    applications.filter((application) => {
      const status =
        getStatus(application).toUpperCase();

      return (
        status === "SHORTLISTED" ||
        status === "INTERVIEW"
      );
    }).length;

  const selectedApplications =
    applications.filter((application) => {
      const status =
        getStatus(application).toUpperCase();

      return (
        status === "SELECTED" ||
        status === "ACCEPTED"
      );
    }).length;

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return date;
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading your applications...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* HEADER */}

      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            <FileText size={14} />
            Career Applications
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
            My Applications
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Track the jobs you have applied for and
            monitor your application status.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate("/student/jobs")}
          className="self-start lg:self-auto"
        >
          <span className="flex items-center gap-2">
            Browse Drives
            <ArrowRight size={16} />
          </span>
        </Button>
      </div>

      {/* SUMMARY CARDS */}

      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400">
                Total Applications
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {totalApplications}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText size={19} />
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400">
                Under Review
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {pendingApplications}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
              <Clock3 size={19} />
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400">
                Shortlisted
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {shortlistedApplications}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Clock3 size={19} />
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400">
                Selected
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {selectedApplications}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 size={19} />
            </div>
          </div>
        </Card>
      </div>

      {/* ERROR */}

      {error && (
        <Card className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <XCircle
              size={20}
              className="mt-0.5 text-red-500"
            />

            <div>
              <p className="font-semibold text-red-700">
                Unable to load applications
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* SEARCH / FILTER */}

      <Card className="mb-7 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search company, role or location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 md:w-44"
          >
            <option value="All">All Status</option>
            <option value="APPLIED">Applied</option>
            <option value="UNDER_REVIEW">
              Under Review
            </option>
            <option value="SHORTLISTED">
              Shortlisted
            </option>
            <option value="INTERVIEW">Interview</option>
            <option value="SELECTED">Selected</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </Card>

      {/* RESULTS HEADER */}

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Your Applications
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {filteredApplications.length}{" "}
            {filteredApplications.length === 1
              ? "application"
              : "applications"}{" "}
            found
          </p>
        </div>

        {(query || statusFilter !== "All") && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setStatusFilter("All");
            }}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* EMPTY */}

      {filteredApplications.length === 0 ? (
        applications.length === 0 ? (
          <Card className="rounded-2xl border border-gray-100 bg-white p-10 shadow-sm">
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <BriefcaseBusiness size={28} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-800">
                No applications yet
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                You haven't applied to any placement
                drives yet. Explore available
                opportunities and apply for roles
                that match your profile.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/student/jobs")
                }
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Browse Drives
                <ArrowRight size={16} />
              </button>
            </div>
          </Card>
        ) : (
          <EmptyState
            title="No applications found"
            description="Try changing your search or status filter."
          />
        )
      ) : (
        /* APPLICATION LIST */

        <div className="space-y-3">
          {filteredApplications.map((application) => {
            const job = application?.job || {};

            const companyName =
              getCompanyName(application);

            const title =
              job?.title ||
              application?.jobTitle ||
              application?.position ||
              "Job";

            const location =
              job?.location ||
              application?.location ||
              "Location not specified";

            const appliedDate =
              application?.appliedAt ||
              application?.createdAt ||
              application?.applicationDate;

            const status = getStatus(application);

            const statusConfig =
              getStatusConfig(status);

            const StatusIcon =
              statusConfig.icon;

            return (
              <Card
                key={
                  application?.id ||
                  `${job?.id}-${appliedDate}`
                }
                className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* LEFT */}

                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Building2 size={21} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold text-gray-800">
                        {title}
                      </h3>

                      {/* COMPANY NAME */}

                      <p className="mt-0.5 text-sm font-semibold text-blue-600">
                        {companyName}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <MapPin
                            size={13}
                            className="text-blue-500"
                          />
                          {location}
                        </span>

                        {job?.employmentType && (
                          <span className="flex items-center gap-1.5">
                            <BriefcaseBusiness
                              size={13}
                              className="text-blue-500"
                            />
                            {job.employmentType}
                          </span>
                        )}

                        {appliedDate && (
                          <span className="flex items-center gap-1.5">
                            <CalendarDays
                              size={13}
                              className="text-blue-500"
                            />
                            Applied{" "}
                            {formatDate(appliedDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:justify-end">
                    <div
                      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${statusConfig.className}`}
                    >
                      <StatusIcon
                        size={14}
                        className={
                          statusConfig.iconClass
                        }
                      />

                      {statusConfig.label}
                    </div>

                    {job?.id && (
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/student/jobs/${job.id}`
                          )
                        }
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-blue-200 hover:text-blue-600"
                      >
                        View Job
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* STATUS MESSAGE */}

                <div className="mt-3 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2">
                    <StatusIcon
                      size={14}
                      className={
                        statusConfig.iconClass
                      }
                    />

                    <p className="text-xs text-gray-500">
                      {status.toUpperCase() ===
                        "APPLIED" &&
                        "Your application has been submitted successfully and is awaiting review."}

                      {(status.toUpperCase() ===
                        "UNDER_REVIEW" ||
                        status.toUpperCase() ===
                          "REVIEWING") &&
                        "Your application is currently being reviewed by the recruiter."}

                      {(status.toUpperCase() ===
                        "SHORTLISTED" ||
                        status.toUpperCase() ===
                          "INTERVIEW") &&
                        "Congratulations! Your application has progressed to the next stage."}

                      {(status.toUpperCase() ===
                        "SELECTED" ||
                        status.toUpperCase() ===
                          "ACCEPTED") &&
                        "Congratulations! You have been selected for this opportunity."}

                      {(status.toUpperCase() ===
                        "REJECTED" ||
                        status.toUpperCase() ===
                          "REJECT") &&
                        "Unfortunately, this application was not selected for the opportunity."}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}