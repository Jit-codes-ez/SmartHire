import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaSearch,
  FaUsers,
  FaEye,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaFilePdf,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaTimesCircle,
} from "react-icons/fa";

import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import StatusPill from "../../components/StatusPill.jsx";
import { authFetch } from "../../lib/authFetch.js";

export default function Applicants() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [applicants, setApplicants] = useState([]);
  const [drive, setDrive] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [shortlistApplicant, setShortlistApplicant] = useState(null);
  const [approveApplicant, setApproveApplicant] = useState(null);
  const [rejectApplicant, setRejectApplicant] = useState(null);

  // Action loading
  const [actionLoading, setActionLoading] = useState(false);

  // Action message
  const [actionMessage, setActionMessage] = useState("");
  const [actionMessageType, setActionMessageType] = useState("");

  // Shortlist form
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewType, setInterviewType] = useState("Online");
  const [interviewLocation, setInterviewLocation] = useState("");

  // Approve form
  const [joiningDate, setJoiningDate] = useState("");

  // =========================================================
  // LOAD APPLICANTS
  // =========================================================

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  async function fetchApplicants() {
    try {
      setLoading(true);
      setError("");

      const response = await authFetch(
        `/api/recruiter/drives/${id}/applicants`
      );

      const responseText = await response.text();

      console.log("Applicants API status:", response.status);

      if (!response.ok) {
        console.error(
          "Applicants API failed:",
          response.status,
          responseText
        );

        throw new Error("Unable to load applicants.");
      }

      let data = [];

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error(
            "Unable to parse applicants response:",
            parseError
          );

          throw new Error("Unable to load applicants.");
        }
      }

      if (Array.isArray(data)) {
        setApplicants(data);
        setDrive(null);
      } else {
        setApplicants(data?.applicants || []);
        setDrive(data?.drive || null);
      }
    } catch (err) {
      console.error("Applicants loading error:", err);

      setError("Unable to load applicants. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // HELPER FUNCTIONS
  // =========================================================

  const getName = (applicant) =>
    applicant?.fullName ||
    applicant?.studentName ||
    applicant?.name ||
    applicant?.student?.fullName ||
    "Unknown Applicant";

  const getEmail = (applicant) =>
    applicant?.email ||
    applicant?.student?.email ||
    "No email available";

  const getSkills = (applicant) => {
    if (Array.isArray(applicant?.skills)) {
      return applicant.skills.join(", ");
    }

    return (
      applicant?.skills ||
      applicant?.student?.skills ||
      "Not provided"
    );
  };

  const getStatus = (applicant) =>
    (
      applicant?.status ||
      applicant?.applicationStatus ||
      "APPLIED"
    ).toUpperCase();

  const getAppliedDate = (applicant) => {
    const value =
      applicant?.appliedAt ||
      applicant?.applicationDate ||
      applicant?.createdAt;

    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getResumeUrl = (applicant) =>
    applicant?.resumeUrl ||
    applicant?.resume ||
    applicant?.student?.resumeUrl ||
    null;

  const getApplicationId = (applicant) =>
    applicant?.id ||
    applicant?.applicationId ||
    applicant?.application?.id ||
    null;

// =========================================================
// RESUME SCORE HELPERS
// =========================================================

const getResumeScore = (applicant) =>
  applicant?.resumeScore ??
  applicant?.resume_score ??
  applicant?.application?.resumeScore ??
  applicant?.application?.resume_score ??
  null;

const getResumeScoreStatus = (applicant) =>
  (
    applicant?.resumeScoreStatus ||
    applicant?.resume_score_status ||
    applicant?.application?.resumeScoreStatus ||
    applicant?.application?.resume_score_status ||
    ""
  ).toUpperCase();

const getResumeScoreSummary = (applicant) =>
  applicant?.resumeScoreSummary ||
  applicant?.resume_score_summary ||
  applicant?.application?.resumeScoreSummary ||
  applicant?.application?.resume_score_summary ||
  "";

const getMatchedSkills = (applicant) =>
  applicant?.matchedSkills ||
  applicant?.matched_skills ||
  applicant?.application?.matchedSkills ||
  applicant?.application?.matched_skills ||
  "";

const getMissingSkills = (applicant) =>
  applicant?.missingSkills ||
  applicant?.missing_skills ||
  applicant?.application?.missingSkills ||
  applicant?.application?.missing_skills ||
  "";

  // =========================================================
  // FRIENDLY ACTION ERROR HANDLER
  // =========================================================

  function getFriendlyActionMessage(action, status) {
    if (status === 401) {
      return "Your session has expired. Please login again.";
    }

    if (status === 403) {
      return "You are not allowed to perform this action.";
    }

    if (status === 404) {
      return "The application could not be found.";
    }

    if (status === 409) {
      if (action === "shortlist") {
        return "This applicant cannot be shortlisted in the current status.";
      }

      if (action === "approve") {
        return "This applicant cannot be approved in the current status.";
      }

      if (action === "reject") {
        return "This applicant cannot be rejected in the current status.";
      }
    }

    if (status >= 500) {
      return "The server is temporarily unavailable. Please try again.";
    }

    if (action === "shortlist") {
      return "Unable to shortlist this applicant right now.";
    }

    if (action === "approve") {
      return "Unable to approve this applicant right now.";
    }

    if (action === "reject") {
      return "Unable to reject this applicant right now.";
    }

    return "Something went wrong. Please try again.";
  }

  // =========================================================
  // HANDLE ACTION RESPONSE
  // =========================================================

  async function handleActionResponse(
    response,
    action
  ) {
    let responseData = null;
    let responseText = "";

    try {
      responseText = await response.text();
    } catch (error) {
      console.error(
        "Unable to read action response:",
        error
      );
    }

    if (responseText) {
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = null;
      }
    }

    console.log(
      `${action} API status:`,
      response.status
    );

    if (!response.ok) {
      /*
       * Technical information stays in console.
       * The user only gets a friendly message.
       */
      console.error("Recruiter action failed:", {
        action,
        status: response.status,
        response: responseData || responseText,
      });

      throw new Error(
        getFriendlyActionMessage(
          action,
          response.status
        )
      );
    }

    return responseData;
  }

  // =========================================================
  // SHOW ACTION MESSAGE
  // =========================================================

  function showActionMessage(message, type = "success") {
    setActionMessage(message);
    setActionMessageType(type);

    setTimeout(() => {
      setActionMessage("");
      setActionMessageType("");
    }, 3500);
  }

  // =========================================================
  // VIEW RESUME
  // =========================================================

  async function handleViewResume(applicant) {
    const resumeUrl = getResumeUrl(applicant);

    if (!resumeUrl) {
      showActionMessage(
        "Resume is not available.",
        "error"
      );
      return;
    }

    console.log("Opening resume:", resumeUrl);

    const newTab = window.open("", "_blank");

    if (!newTab) {
      showActionMessage(
        "Please allow pop-ups for this site.",
        "error"
      );
      return;
    }

    try {
      newTab.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Loading Resume...</title>

            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background: #f8fafc;
                color: #64748b;
              }

              .loader {
                text-align: center;
              }

              .spinner {
                width: 36px;
                height: 36px;
                margin: 0 auto 15px;
                border: 4px solid #e2e8f0;
                border-top-color: #2563eb;
                border-radius: 50%;
                animation: spin 1s linear infinite;
              }

              @keyframes spin {
                to {
                  transform: rotate(360deg);
                }
              }
            </style>
          </head>

          <body>
            <div class="loader">
              <div class="spinner"></div>
              <div>Loading resume...</div>
            </div>
          </body>
        </html>
      `);

      const response = await authFetch(resumeUrl);

      console.log(
        "Resume response status:",
        response.status
      );

      if (!response.ok) {
        const technicalMessage =
          await response.text();

        console.error(
          "Resume API error:",
          technicalMessage
        );

        newTab.close();

        throw new Error(
          "Unable to open resume."
        );
      }

      const blob = await response.blob();

      console.log(
        "Resume blob type:",
        blob.type
      );

      console.log(
        "Resume blob size:",
        blob.size
      );

      if (!blob || blob.size === 0) {
        newTab.close();

        throw new Error(
          "Resume file is empty."
        );
      }

      const blobUrl =
        window.URL.createObjectURL(blob);

      newTab.location.href = blobUrl;

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 60000);
    } catch (err) {
      console.error(
        "Resume loading error:",
        err
      );

      try {
        newTab.close();
      } catch {
        // Ignore
      }

      showActionMessage(
        "Unable to open resume. Please try again.",
        "error"
      );
    }
  }

  // =========================================================
  // FILTER
  // =========================================================

  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      const text = `
        ${getName(applicant)}
        ${getEmail(applicant)}
        ${getSkills(applicant)}
      `.toLowerCase();

      const matchesSearch =
        text.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        getStatus(applicant) === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    applicants,
    search,
    statusFilter,
  ]);

  // =========================================================
  // STATS
  // =========================================================

  const shortlistedCount =
    applicants.filter(
      (a) =>
        getStatus(a) === "SHORTLISTED"
    ).length;

  const approvedCount =
    applicants.filter(
      (a) =>
        getStatus(a) === "SELECTED"
    ).length;

  const rejectedCount =
    applicants.filter(
      (a) =>
        getStatus(a) === "REJECTED"
    ).length;

  // =========================================================
  // SHORTLIST
  // =========================================================


  function openShortlistModal(applicant) {
    setShortlistApplicant(applicant);
    setInterviewDate(applicant?.interviewDate ? String(applicant.interviewDate).substring(0, 10) : "");
    setInterviewTime(applicant?.interviewTime || "");
    setInterviewLocation(applicant?.interviewLocation || "");
    setInterviewType(applicant?.interviewType || "Online");
    setActionMessage("");
  }

  async function handleShortlist() {
    if (!interviewDate) {
      showActionMessage(
        "Please select an interview date.",
        "error"
      );
      return;
    }

    if (!interviewTime) {
      showActionMessage(
        "Please select an interview time.",
        "error"
      );
      return;
    }

    if (!interviewType) {
      showActionMessage("Please select an interview type.", "error");
      return;
    }
    if (!interviewLocation.trim()) {
      showActionMessage(
        interviewType === "Online"
          ? "Please enter the meeting link."
          : "Please enter the interview location.",
        "error"
      );
      return;
    }

    const applicationId =
      getApplicationId(
        shortlistApplicant
      );

    if (!applicationId) {
      console.error(
        "Application ID not found:",
        shortlistApplicant
      );

      showActionMessage(
        "Unable to identify this application.",
        "error"
      );
      return;
    }

    try {
      setActionLoading(true);

      const response = await authFetch(
        `/api/recruiter/applications/${applicationId}/shortlist`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            interviewDate,
            interviewTime,
            interviewType,
            interviewLocation:
              interviewLocation.trim(),
          }),
        }
      );

      await handleActionResponse(
        response,
        "shortlist"
      );

      closeAllModals();

      showActionMessage(
        "Applicant shortlisted successfully.",
        "success"
      );

      await fetchApplicants();
    } catch (err) {
      console.error(
        "Shortlist action error:",
        err
      );

      showActionMessage(
        err.message ||
          "Unable to shortlist this applicant right now.",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  }

  // =========================================================
  // APPROVE
  // =========================================================

  function openApproveModal(applicant) {
    setApproveApplicant(applicant);

    setJoiningDate(
      applicant?.joiningDate
        ? String(
            applicant.joiningDate
          ).substring(0, 10)
        : ""
    );

    setActionMessage("");
  }

  async function handleApprove() {
    if (!joiningDate) {
      showActionMessage(
        "Please select a joining date.",
        "error"
      );
      return;
    }

    const applicationId =
      getApplicationId(
        approveApplicant
      );

    if (!applicationId) {
      console.error(
        "Application ID not found:",
        approveApplicant
      );

      showActionMessage(
        "Unable to identify this application.",
        "error"
      );
      return;
    }

    try {
      setActionLoading(true);

      const response = await authFetch(
        `/api/recruiter/applications/${applicationId}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            joiningDate,
          }),
        }
      );

      await handleActionResponse(
        response,
        "approve"
      );

      closeAllModals();

      showActionMessage(
        "Applicant approved successfully.",
        "success"
      );

      await fetchApplicants();
    } catch (err) {
      console.error(
        "Approve action error:",
        err
      );

      showActionMessage(
        err.message ||
          "Unable to approve this applicant right now.",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  }

  // =========================================================
  // REJECT
  // =========================================================

  async function handleReject() {
    const applicationId =
      getApplicationId(
        rejectApplicant
      );

    if (!applicationId) {
      console.error(
        "Application ID not found:",
        rejectApplicant
      );

      showActionMessage(
        "Unable to identify this application.",
        "error"
      );
      return;
    }

    try {
      setActionLoading(true);

      const response = await authFetch(
        `/api/recruiter/applications/${applicationId}/reject`,
        {
          method: "PUT",
        }
      );

      await handleActionResponse(
        response,
        "reject"
      );

      closeAllModals();

      showActionMessage(
        "Applicant rejected successfully.",
        "success"
      );

      await fetchApplicants();
    } catch (err) {
      console.error(
        "Reject action error:",
        err
      );

      showActionMessage(
        err.message ||
          "Unable to reject this applicant right now.",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  }

  // =========================================================
  // CLOSE MODALS
  // =========================================================

    function closeAllModals() {
      setSelectedApplicant(null);
      setShortlistApplicant(null);
      setApproveApplicant(null);
      setRejectApplicant(null);

      setInterviewDate("");
      setInterviewTime("");
      setInterviewLocation("");
      setInterviewType("Online");
      setJoiningDate("");
    }

  // =========================================================
  // UI
  // =========================================================

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl">
      
      <style>{`
              @keyframes shFadeInUp {
                from { opacity: 0; transform: translateY(8px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes shPulseSoft {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.55; }
              }
              .sh-fade-in-up {
                animation: shFadeInUp 0.4s ease-out both;
              }
              .sh-pulse {
                animation: shPulseSoft 1.6s ease-in-out infinite;
              }
            `}</style>

            <div className="mx-auto w-full max-w-7xl"></div>

        {/* ACTION MESSAGE */}
        {actionMessage && (
          <div
            className={`fixed right-5 top-5 z-[100] max-w-sm rounded-xl border px-5 py-4 text-sm font-medium shadow-xl ${
              actionMessageType === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {actionMessage}
          </div>
        )}

        {/* BACK */}
        <button
          type="button"
          onClick={() =>
            navigate(
              "/recruiter/drives"
            )
          }
          className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
        >
          <FaArrowLeft />
          Back to My Drives
        </button>

        {/* HEADER */}
        <div className="mb-7">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Applicants
              </h1>

              <p className="mt-1 text-slate-500">
                Manage candidates who applied
                for this job drive.
              </p>

              {drive && (
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">

                  {drive.jobTitle && (
                    <span className="font-medium">
                      {drive.jobTitle}
                    </span>
                  )}

                  {drive.location && (
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt />
                      {drive.location}
                    </span>
                  )}

                  {drive.type && (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                      {drive.type}
                    </span>
                  )}

                </div>
              )}
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-sm">

              <div className="rounded-lg bg-blue-50 p-3">
                <FaUsers className="text-blue-600" />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Total Applicants
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {applicants.length}
                </p>
              </div>

            </div>

          </div>
        </div>

        

        {/* STATS */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">

          <StatCard
            label="Total"
            value={applicants.length}
            icon={<FaUsers />}
          />

          <StatCard
            label="Shortlisted"
            value={shortlistedCount}
            icon={<FaCheck />}
          />

          <StatCard
            label="Selected"
            value={approvedCount}
            icon={<FaCheck />}
          />

          <StatCard
            label="Rejected"
            value={rejectedCount}
            icon={<FaTimes />}
          />

        </div>

        {/* TABLE */}
        <Card className="overflow-hidden p-0">

          {/* SEARCH */}
          <div className="border-b border-slate-200 p-5">

            <div className="flex flex-col gap-3 md:flex-row">

              <div className="relative flex-1">

                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search applicants by name, email or skills..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="ALL">
                  All Status
                </option>

                <option value="APPLIED">
                  Applied
                </option>

                <option value="SHORTLISTED">
                  Shortlisted
                </option>

                <option value="SELECTED">
                  Selected
                </option>

                <option value="REJECTED">
                  Rejected
                </option>
              </select>

            </div>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                <p className="text-sm text-slate-500">
                  Loading applicants...
                </p>

              </div>

            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="p-10 text-center">

              <p className="mb-4 text-red-500">
                {error}
              </p>

              <Button onClick={fetchApplicants}>
                Try Again
              </Button>

            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            !error &&
            filteredApplicants.length === 0 && (
              <div className="flex min-h-[300px] flex-col items-center justify-center text-center">

                <div className="mb-4 rounded-full bg-slate-100 p-5">
                  <FaUsers className="text-3xl text-slate-400" />
                </div>

                <h3 className="text-lg font-semibold text-slate-800">
                  No applicants found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {applicants.length === 0
                    ? "No students have applied for this drive yet."
                    : "Try changing your search or filter."}
                </p>

              </div>
            )}

          {/* DESKTOP TABLE */}
          {!loading &&
            !error &&
            filteredApplicants.length > 0 && (
              <div className="hidden overflow-x-auto md:block">

                <table className="w-full">

                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left">

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Applicant
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Skills
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Applied On
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {filteredApplicants.map(
                      (applicant, index) => {
                        const status =
                          getStatus(
                            applicant
                          );

                        const applicationId =
                          getApplicationId(
                            applicant
                          );

                        return (
                          <tr
                            key={
                              applicationId ||
                              index
                            }
                            className="border-b border-slate-100 transition hover:bg-slate-50"
                          >

                            {/* APPLICANT */}
                            <td className="px-5 py-5">

                              <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-semibold text-white">
                                  {getName(
                                    applicant
                                  )
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div>

                                  <p className="font-semibold text-slate-800">
                                    {getName(
                                      applicant
                                    )}
                                  </p>

                                  <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                                    <FaEnvelope />
                                    {getEmail(
                                      applicant
                                    )}
                                  </p>

                                </div>

                              </div>

                            </td>

                            {/* SKILLS */}
                            <td className="max-w-xs px-5 py-5">

                              <p className="truncate text-sm text-slate-600">
                                {getSkills(
                                  applicant
                                )}
                              </p>

                            </td>

                            {/* DATE */}
                            <td className="px-5 py-5">

                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <FaCalendarAlt />
                                {getAppliedDate(
                                  applicant
                                )}
                              </div>

                            </td>

                            {/* STATUS */}
                            <td className="px-5 py-5">
                              <StatusPill
                                status={status}
                              />
                            </td>

                            {/* ACTIONS */}
                            <td className="px-5 py-5">

                              <div className="flex justify-end gap-2">

                                <ActionButton
                                  title="View"
                                  onClick={() =>
                                    setSelectedApplicant(
                                      applicant
                                    )
                                  }
                                  icon={
                                    <FaEye />
                                  }
                                />

                                  {status !== "APPROVED" &&
                                    status !== "SELECTED" &&
                                    status !== "REJECTED" &&
                                    status !== "SHORTLISTED" && (
                                      <ActionButton
                                        title="Shortlist"
                                        onClick={() => openShortlistModal(applicant)}
                                        icon={<FaCheck />}
                                        variant="blue"
                                        disabled={actionLoading}
                                      />
                                    )}

                                  {status !== "APPROVED" &&
                                    status !== "SELECTED" &&
                                    status !== "REJECTED" && (
                                      <ActionButton
                                        title="Approve"
                                        onClick={() => openApproveModal(applicant)}
                                        icon={<FaCheck />}
                                        variant="green"
                                        disabled={actionLoading}
                                      />
                                    )}

                                  {status !== "REJECTED" &&
                                    status !== "APPROVED" &&
                                    status !== "SELECTED" && (
                                      <ActionButton
                                        title="Reject"
                                        onClick={() => setRejectApplicant(applicant)}
                                        icon={<FaTimes />}
                                        variant="red"
                                        disabled={actionLoading}
                                      />
                                    )}

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>
            )}

          {/* MOBILE */}
          {!loading &&
            !error &&
            filteredApplicants.length > 0 && (
              <div className="space-y-4 p-4 md:hidden">

                {filteredApplicants.map(
                  (applicant, index) => {
                    const status =
                      getStatus(
                        applicant
                      );

                    return (
                      <div
                        key={
                          getApplicationId(
                            applicant
                          ) || index
                        }
                        className="rounded-xl border border-slate-200 bg-white p-4"
                      >

                        <div className="flex items-start justify-between gap-3">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-semibold text-white">
                              {getName(
                                applicant
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>

                              <p className="font-semibold text-slate-800">
                                {getName(
                                  applicant
                                )}
                              </p>

                              <p className="text-xs text-slate-500">
                                {getEmail(
                                  applicant
                                )}
                              </p>

                            </div>

                          </div>

                          <StatusPill
                            status={status}
                          />

                        </div>

                        <p className="mt-4 text-sm text-slate-600">
                          <strong>
                            Skills:
                          </strong>{" "}
                          {getSkills(
                            applicant
                          )}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">

                          <ActionButton
                            title="View"
                            onClick={() =>
                              setSelectedApplicant(
                                applicant
                              )
                            }
                            icon={
                              <FaEye />
                            }
                          />

                          {status !== "APPROVED" &&
                                status !== "SELECTED" &&
                                status !== "REJECTED" && (
                                  <>
                                    {status !== "SHORTLISTED" && (
                                      <ActionButton
                                        title="Shortlist"
                                        onClick={() => openShortlistModal(applicant)}
                                        icon={<FaCheck />}
                                        variant="blue"
                                        disabled={actionLoading}
                                      />
                                    )}

                                    <ActionButton
                                      title="Approve"
                                      onClick={() => openApproveModal(applicant)}
                                      icon={<FaCheck />}
                                      variant="green"
                                      disabled={actionLoading}
                                    />

                                    <ActionButton
                                      title="Reject"
                                      onClick={() => setRejectApplicant(applicant)}
                                      icon={<FaTimes />}
                                      variant="red"
                                      disabled={actionLoading}
                                    />
                                  </>
                                )}

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

        </Card>
      </div>

      {/* =====================================================
          VIEW APPLICANT MODAL
      ===================================================== */}

      {selectedApplicant && (
        <Modal onClose={closeAllModals}>

          <ModalHeader
            title="Applicant Details"
            onClose={closeAllModals}
          />

          <div className="space-y-6 p-6">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white">
                {getName(
                  selectedApplicant
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  {getName(
                    selectedApplicant
                  )}
                </h2>

                <p className="text-sm text-slate-500">
                  {getEmail(
                    selectedApplicant
                  )}
                </p>

              </div>

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <InfoItem
                icon={<FaEnvelope />}
                label="Email"
                value={getEmail(
                  selectedApplicant
                )}
              />

              <InfoItem
                icon={<FaPhone />}
                label="Mobile"
                value={
                  selectedApplicant?.mobileNumber ||
                  selectedApplicant?.student
                    ?.mobileNumber ||
                  "Not provided"
                }
              />

              <InfoItem
                icon={<FaGraduationCap />}
                label="CGPA"
                value={
                  selectedApplicant?.cgpa ||
                  selectedApplicant?.student
                    ?.cgpa ||
                  "Not provided"
                }
              />

              <InfoItem
                icon={<FaGraduationCap />}
                label="Branch"
                value={
                  selectedApplicant?.branch ||
                  selectedApplicant?.student
                    ?.branch ||
                  "Not provided"
                }
              />

            </div>

            <div>

              <p className="mb-2 text-sm font-semibold text-slate-700">
                Skills
              </p>

              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                {getSkills(
                  selectedApplicant
                )}
              </div>

            </div>

            <div>

              <p className="mb-2 text-sm font-semibold text-slate-700">
                Application Status
              </p>

              <StatusPill
                status={getStatus(
                  selectedApplicant
                )}
              />

            </div>

{/* =====================================================
    RESUME SCORE
===================================================== */}

<div
  key={selectedApplicant?.id}
  className="sh-fade-in-up rounded-2xl border border-slate-200 bg-slate-50 p-5"
>

  <div className="mb-4 flex items-center justify-between">

    <div>
      <p className="text-sm font-semibold text-slate-700">
        Resume Score
      </p>

      <p className="mt-1 text-xs text-slate-500">
        AI-based resume matching against this job
      </p>
    </div>

    {getResumeScoreStatus(selectedApplicant) && (
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
          getResumeScoreStatus(selectedApplicant) === "COMPLETED"
            ? "bg-green-100 text-green-700"
            : getResumeScoreStatus(selectedApplicant) === "FAILED"
              ? "bg-red-100 text-red-700"
              : "sh-pulse bg-yellow-100 text-yellow-700"
        }`}
      >
        {getResumeScoreStatus(selectedApplicant) === "PENDING"
          ? "Scoring…"
          : getResumeScoreStatus(selectedApplicant)}
      </span>
    )}

  </div>

  {getResumeScore(selectedApplicant) !== null ? (

    <div className="space-y-5">

      {/* SCORE */}

      <div className="flex items-center gap-5">

        <AnimatedScoreRing score={getResumeScore(selectedApplicant)} />

        <div>
          <p className="text-base font-semibold text-slate-800">
            Resume Match Score
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Based on the candidate's resume and
            the requirements of this job.
          </p>
        </div>

      </div>

      {/* MATCHED SKILLS */}

      {getMatchedSkills(selectedApplicant) && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Matched Skills
          </p>

          <div className="flex flex-wrap gap-2">
            {getMatchedSkills(selectedApplicant)
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
              .map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="sh-fade-in-up rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700"
                  style={{ animationDelay: `${150 + index * 60}ms` }}
                >
                  {skill}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* MISSING SKILLS */}

      {getMissingSkills(selectedApplicant) && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Missing Skills
          </p>

          <div className="flex flex-wrap gap-2">
            {getMissingSkills(selectedApplicant)
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
              .map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="sh-fade-in-up rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700"
                  style={{ animationDelay: `${250 + index * 60}ms` }}
                >
                  {skill}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* AI SUMMARY */}

      {getResumeScoreSummary(selectedApplicant) && (
        <div
          className="sh-fade-in-up"
          style={{ animationDelay: "350ms" }}
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            AI Assessment
          </p>

          <div className="rounded-xl border border-slate-200 bg-blue-50 p-4">
            <p className="text-sm leading-6 text-slate-600">
              {getResumeScoreSummary(selectedApplicant)}
            </p>
          </div>
        </div>
      )}

    </div>

  ) : (

    <div className="sh-fade-in-up rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center">
      <p className="text-sm font-medium text-slate-600">
        Resume score is not available yet.
      </p>
      <p className="mt-1 text-xs text-slate-400">
        The resume may still be waiting for AI analysis.
      </p>
    </div>

  )}

</div>

            {getResumeUrl(
              selectedApplicant
            ) ? (
              <button
                type="button"
                onClick={() =>
                  handleViewResume(
                    selectedApplicant
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <FaFilePdf />
                View Resume
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-sm font-medium text-slate-500">
                <FaFilePdf />
                Resume Not Available
              </div>
            )}

          </div>

        </Modal>
      )}

      {/* =====================================================
          SHORTLIST MODAL
      ===================================================== */}

{shortlistApplicant && (
  <Modal onClose={closeAllModals}>
    <ModalHeader
      title="Shortlist Applicant"
      onClose={closeAllModals}
    />

    <div className="space-y-5 p-6">

      {/* Applicant info */}
      <div className="rounded-xl bg-blue-50 p-4">
        <p className="font-semibold text-blue-900">
          {getName(shortlistApplicant)}
        </p>
        <p className="mt-1 text-sm text-blue-700">
          {getEmail(shortlistApplicant)}
        </p>
      </div>

      {/* Interview Date */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Interview Date
        </label>
        <div className="relative">
          <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="date"
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Interview Time */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Interview Time
        </label>
        <div className="relative">
          <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="time"
            value={interviewTime}
            onChange={(e) => setInterviewTime(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Interview Type */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Interview Type
        </label>
        <div className="flex gap-3">
          {["Online", "Offline"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setInterviewType(type);
                setInterviewLocation("");
              }}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                interviewType === type
                  ? type === "Online"
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-slate-700 border-slate-700 text-white"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="inline-flex items-center justify-center gap-1.5">
                {type === "Online" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                )}
                {type}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Online — meeting link */}
      {interviewType === "Online" && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Meeting Link (Google Meet / Zoom)
          </label>
          <input
            type="url"
            value={interviewLocation}
            onChange={(e) => setInterviewLocation(e.target.value)}
            placeholder="https://meet.google.com/xxx-xxxx-xxx"
            className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      )}

      {/* Offline — location */}
      {interviewType === "Offline" && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Interview Location
          </label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={interviewLocation}
              onChange={(e) => setInterviewLocation(e.target.value)}
              placeholder="e.g. SmartHire Office, Kolkata"
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      )}

      <p className="text-xs text-slate-500">
        The interview details will be included in the
        notification sent to the candidate.
      </p>

    </div>

    <ModalFooter>
      <button
        type="button"
        onClick={closeAllModals}
        disabled={actionLoading}
        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleShortlist}
        disabled={actionLoading}
        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {actionLoading ? "Shortlisting..." : "Shortlist Applicant"}
      </button>
    </ModalFooter>

  </Modal>
)}

      {/* =====================================================
          APPROVE MODAL
      ===================================================== */}

      {approveApplicant && (
        <Modal onClose={closeAllModals}>

          <ModalHeader
            title="Approve Applicant"
            onClose={closeAllModals}
          />

          <div className="space-y-5 p-6">

            <div className="rounded-xl bg-green-50 p-4">

              <p className="font-semibold text-green-900">
                {getName(
                  approveApplicant
                )}
              </p>

              <p className="mt-1 text-sm text-green-700">
                {getEmail(
                  approveApplicant
                )}
              </p>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Joining Date
              </label>

              <div className="relative">

                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) =>
                    setJoiningDate(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

              </div>

            </div>

            <p className="text-xs text-slate-500">
              The candidate will receive a
              confirmation notification containing
              the joining date.
            </p>

          </div>

          <ModalFooter>

            <button
              type="button"
              onClick={closeAllModals}
              disabled={actionLoading}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApprove}
              disabled={actionLoading}
              className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading
                ? "Approving..."
                : "Approve Applicant"}
            </button>

          </ModalFooter>

        </Modal>
      )}

      {/* =====================================================
          REJECT MODAL
      ===================================================== */}

      {rejectApplicant && (
        <Modal onClose={closeAllModals}>

          <ModalHeader
            title="Reject Applicant"
            onClose={closeAllModals}
          />

          <div className="p-6">

            <div className="flex flex-col items-center text-center">

              <div className="mb-4 rounded-full bg-red-50 p-4">
                <FaTimesCircle className="text-3xl text-red-500" />
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                Reject{" "}
                {getName(
                  rejectApplicant
                )}
                ?
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                This applicant will be marked as
                rejected.
              </p>

            </div>

          </div>

          <ModalFooter>

            <button
              type="button"
              onClick={closeAllModals}
              disabled={actionLoading}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleReject}
              disabled={actionLoading}
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading
                ? "Rejecting..."
                : "Reject Application"}
            </button>

          </ModalFooter>

        </Modal>
      )}

    </DashboardLayout>
  );
}

// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  label,
  value,
  icon,
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">

      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-2xl font-bold text-slate-900">
          {value}
        </p>
      </div>

    </div>
  );
}

// =========================================================
// ACTION BUTTON
// =========================================================

function ActionButton({
  title,
  icon,
  onClick,
  variant = "default",
  disabled = false,
}) {
  const styles = {
    default:
      "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600",

    blue:
      "border-blue-200 text-blue-600 hover:bg-blue-50",

    green:
      "border-green-200 text-green-600 hover:bg-green-50",

    red:
      "border-red-200 text-red-600 hover:bg-red-50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]}`}
    >
      {icon}
      {title}
    </button>
  );
}

// =========================================================
// MODAL
// =========================================================

function Modal({
  children,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {children}
      </div>
    </div>
  );
}

// =========================================================
// MODAL HEADER
// =========================================================

function ModalHeader({
  title,
  onClose,
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

      <h2 className="text-xl font-bold text-slate-900">
        {title}
      </h2>

      <button
        type="button"
        onClick={onClose}
        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        <FaTimes />
      </button>

    </div>
  );
}

// =========================================================
// MODAL FOOTER
// =========================================================

function ModalFooter({
  children,
}) {
  return (
    <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
      {children}
    </div>
  );
}

// =========================================================
// INFO ITEM
// =========================================================

function InfoItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

      <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-slate-500">
        {icon}
        {label}
      </div>

      <p className="break-words text-sm font-medium text-slate-800">
        {value}
      </p>

    </div>
  );
}

// =========================================================
// ANIMATED SCORE RING
// =========================================================

function AnimatedScoreRing({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    setAnimatedScore(0);

    const duration = 900;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      setAnimatedScore(Math.round(eased * score));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const ringColor =
    score >= 75 ? "#16A34A" : score >= 50 ? "#CA8A04" : "#DC2626";

  return (
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="8" />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <p className="text-2xl font-bold" style={{ color: ringColor }}>
          {animatedScore}
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          / 100
        </p>
      </div>
    </div>
  );
}