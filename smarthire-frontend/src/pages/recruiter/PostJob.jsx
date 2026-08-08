import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { authFetch } from "../../lib/authFetch.js";

export default function PostJob() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loginData, setLoginData] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    employmentType: "",
    experienceRequired: "",
    salary: "",
    skills: "",
    applicationDeadline: "",
  });

  useEffect(() => {
    const storedRecruiter = localStorage.getItem("recruiter");

    if (!storedRecruiter) {
      navigate("/login");
      return;
    }

    try {
      const recruiter = JSON.parse(storedRecruiter);

      if (!recruiter?.email) {
        localStorage.removeItem("recruiter");
        navigate("/login");
        return;
      }

      setLoginData(recruiter);
    } catch (error) {
      console.error("Invalid recruiter data:", error);

      localStorage.removeItem("recruiter");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginData?.email) {
      showToast(
        "Recruiter information not found. Please login again.",
        "error"
      );

      navigate("/login");
      return;
    }

    try {
      setSaving(true);

      const response = await authFetch(
        `http://localhost:8080/api/recruiter/jobs/${encodeURIComponent(
          loginData.email
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Post job error:", errorText);

        throw new Error("Failed to post job");
      }

      showToast("Job posted successfully!", "success");

      setTimeout(() => {
        navigate("/recruiter/dashboard");
      }, 700);
    } catch (error) {
      console.error("Post job error:", error);

      showToast(
        "Unable to post job. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("recruiter");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  if (!loginData) {
    return (
      <DashboardLayout
        role="recruiter"
        userName="Recruiter"
        onLogout={handleLogout}
        title="Post a Job"
        subtitle="Create a new job opportunity for students."
      >
        <Card>
          <div className="flex justify-center py-10">
            <p className="text-st-muted">
              Loading recruiter information...
            </p>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="recruiter"
      userName={loginData.fullName || "Recruiter"}
      onLogout={handleLogout}
      title="Post a Job"
      subtitle="Create a new job opportunity for students."
    >
      <Card>
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-st-text">
              Job Details
            </h2>

            <p className="text-sm text-st-muted mt-1">
              Provide the details of the position you want to post.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Job Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-st-text mb-2">
                Job Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g. Software Developer"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-st-text mb-2">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g. Kolkata / Remote"
                required
              />
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-sm font-medium text-st-text mb-2">
                Employment Type
              </label>

              <select
                name="employmentType"
                value={form.employmentType}
                onChange={handleChange}
                className="input w-full"
                required
              >
                <option value="">
                  Select employment type
                </option>

                <option value="FULL_TIME">
                  Full Time
                </option>

                <option value="PART_TIME">
                  Part Time
                </option>

                <option value="INTERNSHIP">
                  Internship
                </option>

                <option value="CONTRACT">
                  Contract
                </option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-st-text mb-2">
                Experience Required
              </label>

              <input
                type="text"
                name="experienceRequired"
                value={form.experienceRequired}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g. Fresher / 1-2 Years"
                required
              />
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-st-text mb-2">
                Salary
              </label>

              <input
                type="text"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g. ₹5-8 LPA"
                required
              />
            </div>

            {/* Skills */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-st-text mb-2">
                Required Skills
              </label>

              <input
                type="text"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g. Java, Spring Boot, MySQL, React"
                required
              />

              <p className="text-xs text-st-muted mt-1">
                Separate multiple skills using commas.
              </p>
            </div>

            {/* Application Deadline */}
            <div>
              <label className="block text-sm font-medium text-st-text mb-2">
                Application Deadline
              </label>

              <input
                type="date"
                name="applicationDeadline"
                value={form.applicationDeadline}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-st-text mb-2">
                Job Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="input w-full min-h-40 resize-y"
                placeholder="Describe the role, responsibilities, requirements, etc."
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              type="submit"
              disabled={saving}
            >
              {saving ? "Posting..." : "Post Job"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                navigate("/recruiter/dashboard")
              }
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
}