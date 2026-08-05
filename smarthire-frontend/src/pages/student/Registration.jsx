// studentRegistration.jsx

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Reveal from '../../components/Reveal';

const COURSE_BRANCHES = { 
  BTECH: ['CSE', 'ECE', 'ME', 'EE', 'CE'], 
  MTECH: ['CSE', 'ECE', 'ME'], 
  BCA: ['BCA'], 
  MCA: ['MCA'] 
};
const COURSES = Object.keys(COURSE_BRANCHES);

const COUNTRIES = [
  { code: 'IN', dial: '+91', name: 'India' },
  { code: 'US', dial: '+1', name: 'United States' },
  { code: 'GB', dial: '+44', name: 'United Kingdom' },
  { code: 'AU', dial: '+61', name: 'Australia' },
  { code: 'JP', dial: '+81', name: 'Japan' },
];

export default function StudentRegistration() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState('');
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

const password = watch('password');
const selectedCourse = watch('course')

  // Phone country dropdown state
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (countryRef.current && !countryRef.current.contains(e.target)) {
        setCountryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setCountryOpen(false);
    setValue('dialCode', country.dial);
  };

const [resumeError, setResumeError] = useState('');

const onFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (file.type !== 'application/pdf') {
    setServerError('Resume must be a PDF file.');
    e.target.value = '';
    return;
  }
  setServerError('');
  setResumeError('');
  setResumeFile(file);
  setResumeName(file.name);
};

const onSubmit = async (data) => {
  if (!resumeFile) {
    setResumeError('Resume is required');
    return;
  }
  setResumeError('');
  setServerError('');
  setSubmitting(true);
  try {
      const formData = new FormData();
      formData.append('fullName', data.fullName); 
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('role', 'STUDENT');
      formData.append('branch', data.branch);
      formData.append('cgpa', data.cgpa);
      formData.append('linkedinUrl', data.linkedinUrl || '');
      formData.append('skills', data.skills || '');
      formData.append('mobileNumber', `${selectedCountry.dial}${data.mobile}`);
      formData.append('course', data.course); 
      formData.append('passingYear', data.passingYear);
      if (resumeFile) formData.append('resume', resumeFile);

      await axios.post('http://localhost:8080/api/student/register', formData, { headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });

      navigate('/verify-otp', { state: { email: data.email } });
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          'Something went wrong. Please try again or check your internet connection.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-128px)] bg-st-bg flex items-center justify-center px-4 py-12 font-sans text-st-text">

      {/* Centered form layout — max 480px card */}
      <Reveal>
  <div className="w-full max-w-[480px] bg-st-surface rounded-card border border-st-border border-l-[3.5px] border-l-st-primary shadow-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <h1 className="text-2xl font-bold leading-tight tracking-tight mb-1">
            Create your student account
          </h1>
          <p className="text-sm text-st-muted mb-6">
            Browse open drives, apply in seconds, track your status.
          </p>

          {serverError && (
            <div className="mb-4 rounded-input border border-[#FECACA] bg-[#FEE2E2] px-3 py-2 text-sm text-[#991B1B]">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Jit Hazra"
                className="w-full h-10 px-3 rounded-input border border-st-border bg-st-surface text-sm placeholder:text-st-muted focus:outline-none focus:shadow-focus focus:border-st-primary"
                {...register('fullName', { required: 'Full name is required' })}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-[#EF4444]">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="jit@email.com"
                className="w-full h-10 px-3 rounded-input border border-st-border bg-st-surface text-sm placeholder:text-st-muted focus:outline-none focus:shadow-focus focus:border-st-primary"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
                })}
              />
              {errors.email && <p className="mt-1 text-xs text-[#EF4444]">{errors.email.message}</p>}
            </div>

            {/* Mobile — flag + caret combined input */}
            <div ref={countryRef} className="relative">
              <label className="block text-sm font-medium mb-1" htmlFor="mobile">
                Mobile Number
              </label>

              <div className="flex items-center h-10 rounded-input border border-st-border bg-st-surface focus-within:shadow-focus focus-within:border-st-primary">
                {/* Flag + caret trigger */}
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
                      countryOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className="w-px h-5 bg-st-border" />

                {/* Number input */}
                <input
                  id="mobile"
                  type="tel"
                  placeholder="123-456-7890"
                  className="flex-1 h-full px-3 bg-transparent text-sm placeholder:text-st-muted focus:outline-none"
                  {...register('mobile', {
                    required: 'Mobile number is required',
                    pattern: {
                      value: /^\d{3}-\d{3}-\d{4}$/,
                      message: 'Enter a valid 10-digit mobile number',
                    },
                  })}
                  onChange={(e) => {
                    // Strip non-digits, then re-insert dashes as XXX-XXX-XXXX
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                    let formatted = digits;
                    if (digits.length > 6) {
                      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
                    } else if (digits.length > 3) {
                      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
                    }
                    setValue('mobile', formatted, { shouldValidate: true });
                  }}
                />
              </div>

              {errors.mobile && <p className="mt-1 text-xs text-[#EF4444]">{errors.mobile.message}</p>}

              {/* Country dropdown panel */}
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

            {/* Password / Confirm Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-10 px-3 rounded-input border border-st-border bg-st-surface text-sm placeholder:text-st-muted focus:outline-none focus:shadow-focus focus:border-st-primary"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Minimum 8 characters' },
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-[#EF4444]">{errors.password.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-10 px-3 rounded-input border border-st-border bg-st-surface text-sm placeholder:text-st-muted focus:outline-none focus:shadow-focus focus:border-st-primary"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-[#EF4444]">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Course / Branch */}
<div className="grid grid-cols-2 gap-3">
  <div>
    <label className="block text-sm font-medium mb-1" htmlFor="course">
      Course
    </label>
    <select
      id="course"
      defaultValue=""
      className="w-full h-10 px-3 rounded-input border border-st-border bg-st-surface text-sm focus:outline-none focus:shadow-focus focus:border-st-primary"
      {...register('course', {
        required: 'Select your course',
        onChange: () => setValue('branch', ''), // reset branch when course changes
      })}
    >
      <option value="" disabled>
        Select course
      </option>
      {COURSES.map((c) => ( 
        <option key={c} value={c}> 
        {c === 'BTECH' ? 'B.Tech' : c === 'MTECH' ? 'M.Tech' : c} 
        </option> 
      ))}
    </select>
    {errors.course && <p className="mt-1 text-xs text-[#EF4444]">{errors.course.message}</p>}
  </div>

  <div>
    <label className="block text-sm font-medium mb-1" htmlFor="branch">
      Branch
    </label>
    <select
      id="branch"
      defaultValue=""
      disabled={!selectedCourse}
      className="w-full h-10 px-3 rounded-input border border-st-border bg-st-surface text-sm focus:outline-none focus:shadow-focus focus:border-st-primary disabled:bg-st-bg disabled:text-st-muted disabled:cursor-not-allowed"
      {...register('branch', { required: 'Select your branch' })}
    >
      <option value="" disabled>
        {selectedCourse ? 'Select branch' : 'Select course first'}
      </option>
      {(COURSE_BRANCHES[selectedCourse] || []).map((b) => (
        <option key={b} value={b}>
          {b}
        </option>
      ))}
    </select>
    {errors.branch && <p className="mt-1 text-xs text-[#EF4444]">{errors.branch.message}</p>}
  </div>
</div>

{/* Passing Year / CGPA */}
<div className="grid grid-cols-2 gap-3">
  <div>
    <label className="block text-sm font-medium mb-1" htmlFor="passingYear">
      Passing Year
    </label>
    <input
      id="passingYear"
      type="number"
      placeholder="2023"
      className="w-full h-10 px-3 rounded-input border border-st-border bg-st-surface text-sm placeholder:text-st-muted focus:outline-none focus:shadow-focus focus:border-st-primary"
      {...register('passingYear', {
        required: 'Passing year is required',
        min: { value: 1900, message: 'Invalid year' },
        max: { value: new Date().getFullYear() + 5, message: 'Invalid year' },
      })}
    />
    {errors.passingYear && (
      <p className="mt-1 text-xs text-[#EF4444]">{errors.passingYear.message}</p>
    )}
  </div>

  <div>
    <label className="block text-sm font-medium mb-1" htmlFor="cgpa">
      CGPA
    </label>
    <input
      id="cgpa"
      type="number"
      step="0.01"
      min="0"
      max="10"
      placeholder="9.16"
      className="w-full h-10 px-3 rounded-input border border-st-border bg-st-surface text-sm placeholder:text-st-muted focus:outline-none focus:shadow-focus focus:border-st-primary"
      {...register('cgpa', {
        required: 'CGPA is required',
        min: { value: 0, message: 'CGPA cannot be negative' },
        max: { value: 10, message: 'CGPA cannot exceed 10' },
      })}
    />
    {errors.cgpa && <p className="mt-1 text-xs text-[#EF4444]">{errors.cgpa.message}</p>}
  </div>
</div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="skills">
                Skills <span className="text-st-muted font-normal">(comma separated)</span>
              </label>
              <input
                id="skills"
                type="text"
                placeholder="Java, Spring Boot, MySQL, React"
                className="w-full h-10 px-3 rounded-input border border-st-border bg-st-surface text-sm placeholder:text-st-muted focus:outline-none focus:shadow-focus focus:border-st-primary"
                {...register('skills')}
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="linkedinUrl">
                LinkedIn URL <span className="text-st-muted font-normal">(optional)</span>
              </label>
              <input
                id="linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/username"
                className="w-full h-10 px-3 rounded-input border border-st-border bg-st-surface text-sm placeholder:text-st-muted focus:outline-none focus:shadow-focus focus:border-st-primary"
                {...register('linkedinUrl')}
              />
            </div>

            {/* Resume upload */}
<div>
  <label className="block text-sm font-medium mb-1" htmlFor="resume">
    Upload Resume (PDF)
  </label>
  <label
    htmlFor="resume"
    className={`flex items-center justify-between h-10 px-3 rounded-input border border-dashed bg-st-bg text-sm text-st-muted cursor-pointer transition ${
      resumeError ? 'border-[#EF4444]' : 'border-st-border hover:border-st-primary'
    }`}
  >
    <span className="truncate">{resumeName || 'Choose PDF file...'}</span>
    {resumeName && <span className="text-[#10B981] ml-2">✓</span>}
  </label>
  <input
    id="resume"
    type="file"
    accept="application/pdf"
    onChange={onFileChange}
    className="hidden"
  />
  {resumeError && <p className="mt-1 text-xs text-[#EF4444]">{resumeError}</p>}
</div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-10 rounded-btn bg-st-primary text-white text-sm font-medium mt-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
            >
              {submitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-st-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-st-primary font-medium">
              Log in
            </Link>
          </p>
        </div>
      </Reveal>
    </div>
  );
}