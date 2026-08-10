import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { authFetch } from "../../lib/authFetch.js";

const DESIGNATIONS = ['HR', 'Recruiter', 'Talent Acquisition'];
const COUNTRIES = [
  { code: 'IN', dial: '+91', name: 'India' },
  { code: 'US', dial: '+1', name: 'United States' },
  { code: 'GB', dial: '+44', name: 'United Kingdom' },
  { code: 'AU', dial: '+61', name: 'Australia' },
  { code: 'JP', dial: '+81', name: 'Japan' },
];

function parseStoredMobile(stored) {
  if (!stored) return { country: COUNTRIES[0], formattedNumber: "" };
  const match = COUNTRIES.find((c) => stored.startsWith(c.dial));
  const country = match || COUNTRIES[0];
  const digits = stored.slice(country.dial.length).replace(/\D/g, "").slice(0, 10);
  let formatted = digits;
  if (digits.length > 6) {
    formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length > 3) {
    formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return { country, formattedNumber: formatted };
}

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loginData = JSON.parse(
    localStorage.getItem("recruiter")
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [mobileValue, setMobileValue] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef(null);


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
  function handleClickOutside(e) {
    if (countryRef.current && !countryRef.current.contains(e.target)) {
      setCountryOpen(false);
    }
  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  useEffect(() => {
    if (!loginData) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await authFetch(
          `/api/recruiter/profile/${encodeURIComponent(
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
  companyRegistrationNumber: data.companyRegistrationNumber || "",
});

const { country, formattedNumber } = parseStoredMobile(data.mobileNumber);
setSelectedCountry(country);
setMobileValue(formattedNumber);
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
  setForm((prev) => ({ ...prev, [name]: value }));
};

  const handleMobileChange = (e) => {
  const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
  let formatted = digits;
  if (digits.length > 6) {
    formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length > 3) {
    formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  setMobileValue(formatted);
  setMobileError("");
};

const handleCountrySelect = (country) => {
  setSelectedCountry(country);
  setCountryOpen(false);
};
const handleSubmit = async (e) => {
  e.preventDefault();

  const digits = mobileValue.replace(/\D/g, "");
  if (!/^\d{10}$/.test(digits)) {
    setMobileError("Enter a valid 10-digit mobile number");
    return;
  }

  try {
    setSaving(true);

    const payload = {
      ...form,
      mobileNumber: `${selectedCountry.dial}${digits}`,
    };

    const response = await authFetch(
      `/api/recruiter/profile/${encodeURIComponent(loginData.email)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) throw new Error("Failed to update profile");

    const updatedProfile = await response.json();

    setForm({
      fullName: updatedProfile.fullName || "",
      email: updatedProfile.email || "",
      mobileNumber: updatedProfile.mobileNumber || "",
      companyName: updatedProfile.companyName || "",
      designation: updatedProfile.designation || "",
      companyWebsite: updatedProfile.companyWebsite || "",
      city: updatedProfile.city || "",
      state: updatedProfile.state || "",
      country: updatedProfile.country || "",
      industry: updatedProfile.industry || "",
      companyRegistrationNumber: updatedProfile.companyRegistrationNumber || "",
    });

    const { country, formattedNumber } = parseStoredMobile(updatedProfile.mobileNumber);
    setSelectedCountry(country);
    setMobileValue(formattedNumber);

    showToast("Profile updated successfully.", "success");
    setTimeout(() => navigate("/recruiter/dashboard"), 700);
  } catch (error) {
    console.error(error);
    showToast("Unable to update profile.", "error");
  } finally {
    setSaving(false);
  }
};
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
<div ref={countryRef} className="relative">
  <label className="block text-sm font-medium text-st-text mb-2">
    Mobile Number
  </label>

  <div className="flex items-center h-10 rounded-input border border-st-border bg-st-surface focus-within:shadow-focus focus-within:border-st-primary">
    <button
      type="button"
      onClick={() => setCountryOpen((o) => !o)}
      className="flex items-center gap-1.5 pl-3 pr-2 h-full shrink-0"
    >
      <img
        src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
        alt={selectedCountry.name}
        className="w-5 h-3.5 object-cover rounded-[2px]"
      />
      <svg
        className={`w-3 h-3 text-st-muted transition-transform ${countryOpen ? "rotate-180" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div className="w-px h-5 bg-st-border" />

    <input
      type="tel"
      placeholder="123-456-7890"
      className="flex-1 h-full px-3 bg-transparent text-sm placeholder:text-st-muted focus:outline-none"
      value={mobileValue}
      onChange={handleMobileChange}
    />
  </div>
  {mobileError && <p className="mt-1 text-xs text-[#EF4444]">{mobileError}</p>}

  {countryOpen && (
    <ul className="absolute z-10 mt-1 w-56 max-h-60 overflow-auto rounded-input border border-st-border bg-st-surface shadow-lg py-1">
      {COUNTRIES.map((country) => (
        <li key={country.code}>
          <button
            type="button"
            onClick={() => handleCountrySelect(country)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-st-border/40 text-left"
          >
            <img
              src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
              alt={country.name}
              className="w-5 h-3.5 object-cover rounded-[2px]"
            />
            <span className="flex-1">{country.name}</span>
            <span className="text-st-muted">{country.dial}</span>
          </button>
        </li>
      ))}
    </ul>
  )}
</div>

              {/* Designation */}
<div>
  <label className="block text-sm font-medium text-st-text mb-2">
    Designation
  </label>

  <select
    name="designation"
    value={form.designation}
    onChange={handleChange}
    className="input w-full"
    required
  >
    <option value="" disabled>
      Select designation
    </option>
    {DESIGNATIONS.map((d) => (
      <option key={d} value={d}>
        {d}
      </option>
    ))}
  </select>
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