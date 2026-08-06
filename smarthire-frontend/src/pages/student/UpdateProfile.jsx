import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { authFetch } from "../../lib/authFetch.js";

const COURSE_BRANCHES = {
  BTECH: ['CSE', 'ECE', 'ME', 'EE', 'CE'],
  MTECH: ['CSE', 'ECE', 'ME'],
  BCA: ['BCA'],
  MCA: ['MCA'],
};
const COURSES = Object.keys(COURSE_BRANCHES);

const COUNTRIES = [
  { code: 'IN', dial: '+91', name: 'India' },
  { code: 'US', dial: '+1', name: 'United States' },
  { code: 'GB', dial: '+44', name: 'United Kingdom' },
  { code: 'AU', dial: '+61', name: 'Australia' },
  { code: 'JP', dial: '+81', name: 'Japan' },
];

const inputClass =
  "w-full h-10 px-3 rounded-input border border-st-border bg-st-surface text-sm text-st-text placeholder:text-st-muted focus:outline-none focus:shadow-focus focus:border-st-primary disabled:bg-st-bg disabled:text-st-muted";

// Moved OUTSIDE the component — defined once, not recreated every render
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-st-text">
        {label}
      </label>
      {children}
    </div>
  );
}

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

export default function UpdateProfile() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loginData = JSON.parse(localStorage.getItem("student"));

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [mobileValue, setMobileValue] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef(null);

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

    authFetch(
      `http://localhost:8080/api/student/profile/${encodeURIComponent(loginData.email)}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Profile not found");
        return res.json();
      })
      .then((data) => {
        setStudent(data);
        const { country, formattedNumber } = parseStoredMobile(data.mobileNumber);
        setSelectedCountry(country);
        setMobileValue(formattedNumber);
      })
      .catch((error) => {
        console.log(error);
        showToast("Unable to load profile data.", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const handleCourseChange = (e) => {
    setStudent({
      ...student,
      course: e.target.value,
      branch: "",
    });
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

    setSaving(true);

    try {
      const payload = {
        ...student,
        mobileNumber: `${selectedCountry.dial}${digits}`,
      };

      const response = await authFetch(
        `http://localhost:8080/api/student/profile/${encodeURIComponent(loginData.email)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          showToast("Your session has expired. Please log in again.", "error");
          navigate("/login");
          return;
        }
        const errorMessage = await response.text();
        console.log("Backend Error:", errorMessage);
        throw new Error("Profile update failed");
      }

      showToast("Profile updated successfully!", "success");
      setTimeout(() => navigate("/student/dashboard"), 1000);
    } catch (error) {
      console.log(error);
      if (error.message === "Failed to fetch") {
        showToast("Server is unavailable. Please try again later.", "error");
      } else {
        showToast("Profile update failed. Please try again.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-st-muted text-sm">Loading profile…</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-st-muted text-sm">Profile not found</p>
      </div>
    );
  }

  const availableBranches = COURSE_BRANCHES[student.course] || [];
  const branchValue = availableBranches.includes(student.branch) ? student.branch : "";

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <Card className="rounded-card border border-st-border border-l-[3.5px] border-l-st-primary shadow-card p-8">
        <h2 className="text-2xl font-bold mb-1 text-st-text">
          Update Profile
        </h2>
        <p className="text-sm text-st-muted mb-6">
          Keep your details current so recruiters see the right info.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name">
              <input
                className={inputClass}
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={student.fullName || ""}
                onChange={handleChange}
              />
            </Field>

            <div ref={countryRef} className="relative">
              <label className="block text-sm font-medium mb-1 text-st-text">
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
                    className={`w-3 h-3 text-st-muted transition-transform ${
                      countryOpen ? "rotate-180" : ""
                    }`}
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

            <Field label="Course">
              <select
                className={inputClass}
                name="course"
                value={student.course || ""}
                onChange={handleCourseChange}
              >
                <option value="" disabled>
                  Select course
                </option>
                {COURSES.map((c) => (
                  <option key={c} value={c}>
                    {c === "BTECH" ? "B.Tech" : c === "MTECH" ? "M.Tech" : c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Branch">
              <select
                className={inputClass}
                name="branch"
                value={branchValue}
                disabled={!student.course}
                onChange={handleChange}
              >
                <option value="" disabled>
                  {student.course ? "Select branch" : "Select course first"}
                </option>
                {availableBranches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="CGPA">
              <input
                className={inputClass}
                type="number"
                step="0.01"
                name="cgpa"
                placeholder="CGPA"
                value={student.cgpa || ""}
                onChange={handleChange}
              />
            </Field>

            <Field label="Passing Year">
              <input
                className={inputClass}
                type="text"
                name="passingYear"
                placeholder="Passing Year"
                value={student.passingYear || ""}
                onChange={handleChange}
              />
            </Field>
          </div>

          <Field label="Skills">
            <textarea
              className={`${inputClass} h-24 pt-2 resize-none`}
              name="skills"
              placeholder="e.g. React, Java, SQL"
              value={student.skills || ""}
              onChange={handleChange}
            />
          </Field>

          <Field label="LinkedIn URL">
            <input
              className={inputClass}
              type="text"
              name="linkedinUrl"
              placeholder="https://linkedin.com/in/yourname"
              value={student.linkedinUrl || ""}
              onChange={handleChange}
            />
          </Field>

          <Button
            type="submit"
            disabled={saving}
            className="w-full h-10 rounded-btn bg-st-primary text-white text-sm font-medium mt-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
          >
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}