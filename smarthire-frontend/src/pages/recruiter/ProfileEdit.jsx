import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { authFetch } from "../../lib/authFetch.js";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loginData = JSON.parse(
    localStorage.getItem("recruiter")
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    companyName: "",
    designation: "",
    companyWebsite: "",
    city: "",
    state: "",
    country: "",
    industry: "",
    companyRegistrationNumber: "",
  });

  useEffect(() => {
    if (!loginData) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await authFetch(
          `http://localhost:8080/api/recruiter/profile/${encodeURIComponent(
            loginData.email
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await response.json();

        setForm({
          fullName: data.fullName || "",
          email: data.email || "",
          mobileNumber: data.mobileNumber || "",
          companyName: data.companyName || "",
          designation: data.designation || "",
          companyWebsite: data.companyWebsite || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          industry: data.industry || "",
          companyRegistrationNumber:
            data.companyRegistrationNumber || "",
        });
      } catch (error) {
        console.error(error);
        showToast(
          "Unable to load profile.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate, showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await authFetch(
        `http://localhost:8080/api/recruiter/profile/${encodeURIComponent(
          loginData.email
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedProfile = await response.json();

      setForm({
        fullName: updatedProfile.fullName || "",
        email: updatedProfile.email || "",
        mobileNumber: updatedProfile.mobileNumber || "",
        companyName: updatedProfile.companyName || "",
        designation: updatedProfile.designation || "",
        companyWebsite:
          updatedProfile.companyWebsite || "",
        city: updatedProfile.city || "",
        state: updatedProfile.state || "",
        country: updatedProfile.country || "",
        industry: updatedProfile.industry || "",
        companyRegistrationNumber:
          updatedProfile.companyRegistrationNumber || "",
      });

      showToast(
        "Profile updated successfully.",
        "success"
      );

      setTimeout(() => {
        navigate("/recruiter/dashboard");
      }, 700);
    } catch (error) {
      console.error(error);
      showToast(
        "Unable to update profile.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        role="recruiter"
        userName="Recruiter"
        onLogout={() => {
          localStorage.removeItem("recruiter");
          navigate("/login");
        }}
        title="Update Profile"
        subtitle="Update your recruiter and company information."
      >
        <Card>
          <p className="text-st-muted">
            Loading profile...
          </p>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="recruiter"
      userName={form.fullName || "Recruiter"}
      onLogout={() => {
        localStorage.removeItem("recruiter");
        window.dispatchEvent(new Event("authChange"));
        navigate("/login");
      }}
      title="Update Profile"
      subtitle="Update your recruiter and company information."
    >
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-st-text">
              Personal Information
            </h2>

            <p className="text-sm text-st-muted mt-1">
              Keep your recruiter information up to date.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-st-text mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-st-text mb-2">
                Email
              </label>

              <input
                type="email"
                value={form.email}
                className="input w-full bg-gray-100 cursor-not-allowed"
                disabled
              />

              <p className="text-xs text-st-muted mt-1">
                Email cannot be changed here.
              </p>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-st-text mb-2">
                Mobile Number
              </label>

              <input
                type="text"
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-st-text mb-2">
                Designation
              </label>

              <input
                type="text"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>
          </div>

          <div className="border-t border-st-border my-8" />

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-st-text">
              Company Information
            </h2>

            <p className="text-sm text-st-muted mt-1">
              Update your company details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-st-text mb-2">
                Company Name
              </label>

              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-st-text mb-2">
                Industry
              </label>

              <input
                type="text"
                name="industry"
                value={form.industry}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-st-text mb-2">
                Company Website
              </label>

              <input
                type="url"
                name="companyWebsite"
                value={form.companyWebsite}
                onChange={handleChange}
                className="input w-full"
                placeholder="https://example.com"
              />
            </div>

            {/* Registration Number */}
            <div>
              <label className="block text-sm font-medium text-st-text mb-2">
                Company Registration Number
              </label>

              <input
                type="text"
                name="companyRegistrationNumber"
                value={form.companyRegistrationNumber}
                onChange={handleChange}
                className="input w-full"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-st-text mb-2">
                City
              </label>

              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-st-text mb-2">
                State
              </label>

              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-st-text mb-2">
                Country
              </label>

              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
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