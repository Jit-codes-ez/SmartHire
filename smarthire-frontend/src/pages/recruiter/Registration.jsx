// recruiterRegistration.jsx
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Reveal from '../../components/Reveal';
import Modal from '../../components/Modal';

const API_URL = import.meta.env.VITE_API_URL

const DESIGNATIONS = ['HR', 'Recruiter', 'Talent Acquisition'];

const COUNTRIES = [
  { code: 'IN', dial: '+91', name: 'India' },
  { code: 'US', dial: '+1', name: 'United States' },
  { code: 'GB', dial: '+44', name: 'United Kingdom' },
  { code: 'AU', dial: '+61', name: 'Australia' },
  { code: 'JP', dial: '+81', name: 'Japan' },
];

export default function RecruiterRegistration() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const password = watch('password');

  // Phone country dropdown state — same pattern as student registration
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef(null);

  // OTP verification state — same pattern as student registration
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpStatus, setOtpStatus] = useState(null); // null | 'success' | 'error'
  const [emailOtpError, setEmailOtpError] = useState('');

  const watchedEmail = watch('email');

  // Resend OTP cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

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

  const handleSendOtp = async () => {
    if (!watchedEmail || errors.email) return;
    setSendingOtp(true);
    setEmailOtpError('');
    try {
      await axios.post(`${API_URL}/api/auth/register/send-otp`, { email: watchedEmail });
      setOtpSent(true);
      setOtpStatus(null);
      setOtpValue('');
      setResendCooldown(30);
    } catch (err) {
      const data = err?.response?.data;
      setEmailOtpError(
        typeof data === 'string' ? data : data?.message || 'Failed to send OTP. Please try again.'
      );
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) return;
    setVerifyingOtp(true);
    try {
      await axios.post(`${API_URL}/api/auth/register/verify-otp`, {
        email: watchedEmail,
        otp: otpValue,
      });
      setOtpStatus('success');
      setEmailVerified(true);
    } catch (err) {
      setOtpStatus('error');
      setEmailVerified(false);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const onSubmit = async (data) => {
    if (!emailVerified) {
      setServerError('Please verify your official company email before creating an account.');
      return;
    }
    setServerError('');
    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/recruiter/register`, {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: 'RECRUITER',
        mobileNumber: `${selectedCountry.dial}${data.mobile}`,
        companyName: data.companyName,
        designation: data.designation,
        companyWebsite: data.companyWebsite || '',
        city: data.city,
        state: data.state,
        country: data.country,
        industry: data.industry,
        companyRegistrationNumber: data.companyRegistrationNumber || '',
      });

      setShowSuccessModal(true);
    } catch (err) {
      const data = err?.response?.data;
      const errorMessage =
        typeof data === 'string'
          ? data
          : data?.message || 'Something went wrong. Please try again or check your internet connection.';
      setServerError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-128px)] bg-rc-bg flex items-center justify-center px-4 py-12 font-sans text-[#1C1917]">
      <Reveal>
        <div className="w-full max-w-[480px] bg-white rounded-card border border-rc-border border-l-[3.5px] border-l-rc-primary shadow-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <h1 className="text-2xl font-bold leading-tight tracking-tight mb-1">
            Create your recruiter account
          </h1>
          <p className="text-sm text-rc-muted mb-6">
            Post job drives and shortlist candidates with AI-ranked applicants.
          </p>

          <div className="mb-5 rounded-input border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 leading-5">
            New recruiter accounts are reviewed by an admin before you can post a drive.
          </div>

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
                placeholder="Saini Paul"
                className="w-full h-10 px-3 rounded-input border border-rc-border bg-white text-sm placeholder:text-rc-muted transition-all duration-300 hover:border-rc-primary hover:shadow-sm focus:outline-none focus:border-rc-primary focus:ring-4 focus:ring-rc-primary/15"
                {...register('fullName', { required: 'Full name is required' })}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-[#DC2626]">{errors.fullName.message}</p>
              )}
            </div>

            {/* Official Company Email — with OTP verification */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Official Company Email
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="saini@tcs.com"
                    disabled={emailVerified}
                    className="w-full h-10 px-3 pr-8 rounded-input border border-rc-border bg-white text-sm placeholder:text-rc-muted transition-all duration-300 hover:border-rc-primary hover:shadow-sm focus:outline-none focus:border-rc-primary focus:ring-4 focus:ring-rc-primary/15 disabled:bg-rc-bg"
                    {...register('email', {
                      required: 'Work email is required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
                      onChange: () => {
                        setEmailVerified(false);
                        setOtpSent(false);
                        setOtpValue('');
                        setOtpStatus(null);
                        setEmailOtpError('');
                      },
                    })}
                  />
                  {emailVerified && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#10B981] text-sm">✓</span>
                  )}
                </div>

                {watchedEmail && !errors.email && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={emailVerified || sendingOtp || resendCooldown > 0}
                    className="h-10 px-4 shrink-0 rounded-btn bg-rc-primary text-white text-sm font-medium disabled:opacity-60 hover:brightness-95 transition"
                  >
                    {emailVerified
                      ? 'Verified'
                      : sendingOtp
                      ? 'Sending…'
                      : resendCooldown > 0
                      ? `Resend (${resendCooldown}s)`
                      : otpSent
                      ? 'Resend'
                      : 'Verify'}
                  </button>
                )}
              </div>

              {errors.email && <p className="mt-1 text-xs text-[#DC2626]">{errors.email.message}</p>}
              {emailOtpError && <p className="mt-1 text-xs text-[#DC2626]">{emailOtpError}</p>}

              {otpSent && !emailVerified && (
                <div className="mt-2 flex gap-2 items-start">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter OTP"
                      value={otpValue}
                      onChange={(e) => {
                        setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6));
                        setOtpStatus(null);
                      }}
                      className={`w-full h-10 px-3 pr-8 rounded-input border bg-white text-sm placeholder:text-rc-muted focus:outline-none focus:ring-4 focus:ring-rc-primary/15 ${
                        otpStatus === 'error' ? 'border-[#DC2626]' : 'border-rc-border focus:border-rc-primary'
                      }`}
                    />
                    {otpStatus === 'success' && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#10B981] text-sm">✓</span>
                    )}
                    {otpStatus === 'error' && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#DC2626] text-sm">✕</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp || otpValue.length !== 6}
                    className="h-10 px-4 shrink-0 rounded-btn bg-rc-primary text-white text-sm font-medium disabled:opacity-60 hover:brightness-95 transition"
                  >
                    {verifyingOtp ? 'Checking…' : 'Submit'}
                  </button>
                </div>
              )}
              {otpStatus === 'error' && (
                <p className="mt-1 text-xs text-[#DC2626]">Incorrect OTP. Please try again.</p>
              )}
            </div>

            {/* Mobile — flag + caret combined input, same as student registration */}
            <div ref={countryRef} className="relative">
              <label className="block text-sm font-medium mb-1" htmlFor="mobile">
                Mobile Number
              </label>

              <div className="flex items-center h-10 rounded-input border border-rc-border bg-white focus-within:ring-4 focus-within:ring-rc-primary/15 focus-within:border-rc-primary">
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
                    className={`w-3 h-3 text-rc-muted transition-transform ${
                      countryOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className="w-px h-5 bg-rc-border" />

                <input
                  id="mobile"
                  type="tel"
                  placeholder="123-456-7890"
                  className="flex-1 h-full px-3 bg-transparent text-sm placeholder:text-rc-muted focus:outline-none"
                  {...register('mobile', {
                    required: 'Mobile number is required',
                    pattern: {
                      value: /^\d{3}-\d{3}-\d{4}$/,
                      message: 'Enter a valid 10-digit mobile number',
                    },
                  })}
                  onChange={(e) => {
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

              {errors.mobile && <p className="mt-1 text-xs text-[#DC2626]">{errors.mobile.message}</p>}

              {countryOpen && (
                <ul className="absolute z-10 mt-1 w-56 max-h-60 overflow-auto rounded-input border border-rc-border bg-white shadow-lg py-1">
                  {COUNTRIES.map((country) => (
                    <li key={country.code}>
                      <button
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-rc-bg text-left"
                      >
                        <img
                          src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                          alt={country.name}
                          className="w-5 h-3.5 object-cover rounded-[2px]"
                        />
                        <span className="flex-1">{country.name}</span>
                        <span className="text-rc-muted">{country.dial}</span>
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
                  className="w-full h-10 px-3 rounded-input border border-rc-border bg-white text-sm placeholder:text-rc-muted transition-all duration-300 hover:border-rc-primary hover:shadow-sm focus:outline-none focus:border-rc-primary focus:ring-4 focus:ring-rc-primary/15"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Minimum 8 characters' },
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-[#DC2626]">{errors.password.message}</p>
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
                  className="w-full h-10 px-3 rounded-input border border-rc-border bg-white text-sm placeholder:text-rc-muted transition-all duration-300 hover:border-rc-primary hover:shadow-sm focus:outline-none focus:border-rc-primary focus:ring-4 focus:ring-rc-primary/15"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-[#DC2626]">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="companyName">
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                placeholder="Tata Consultancy Services"
                className="w-full h-10 px-3 rounded-input border border-rc-border bg-white text-sm placeholder:text-rc-muted transition-all duration-300 hover:border-rc-primary hover:shadow-sm focus:outline-none focus:border-rc-primary focus:ring-4 focus:ring-rc-primary/15"
                {...register('companyName', { required: 'Company name is required' })}
              />
              {errors.companyName && (
                <p className="mt-1 text-xs text-[#DC2626]">{errors.companyName.message}</p>
              )}
            </div>

            {/* Designation / Industry */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="designation">
                  Designation
                </label>
                <select
                  id="designation"
                  defaultValue=""
                  className="w-full h-10 px-3 rounded-input border border-rc-border bg-white text-sm transition-all duration-300 hover:border-rc-primary hover:shadow-sm focus:outline-none focus:border-rc-primary focus:ring-4 focus:ring-rc-primary/15"
                  {...register('designation', { required: 'Select a designation' })}
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
                {errors.designation && (
                  <p className="mt-1 text-xs text-[#DC2626]">{errors.designation.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="industry">
                  Industry
                </label>
                <input
                  id="industry"
                  type="text"
                  placeholder="IT Services"
                  className="w-full h-10 px-3 rounded-input border border-rc-border bg-white text-sm placeholder:text-rc-muted transition-all duration-300 hover:border-rc-primary hover:shadow-sm focus:outline-none focus:border-rc-primary focus:ring-4 focus:ring-rc-primary/15"
                  {...register('industry', { required: 'Industry is required' })}
                />
                {errors.industry && (
                  <p className="mt-1 text-xs text-[#DC2626]">{errors.industry.message}</p>
                )}
              </div>
            </div>

            {/* Company Website */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="companyWebsite">
                Company Website <span className="text-rc-muted font-normal">(optional)</span>
              </label>
              <input
                id="companyWebsite"
                type="url"
                placeholder="https://tcs.com"
                className="w-full h-10 px-3 rounded-input border border-rc-border bg-white text-sm placeholder:text-rc-muted transition-all duration-300 hover:border-rc-primary hover:shadow-sm focus:outline-none focus:border-rc-primary focus:ring-4 focus:ring-rc-primary/15"
                {...register('companyWebsite')}
              />
            </div>

            {/* Company Address — City / State / Country */}
            <div>
              <label className="block text-sm font-medium mb-1">Company Address</label>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  className="w-full h-10 px-3 rounded-input border border-rc-border bg-white text-sm placeholder:text-rc-muted transition-all duration-300 hover:border-rc-primary hover:shadow-sm focus:outline-none focus:border-rc-primary focus:ring-4 focus:ring-rc-primary/15"
                  {...register('city', { required: 'City is required' })}
                />
                <input
                  type="text"
                  placeholder="State"
                  className="w-full h-10 px-3 rounded-input border border-rc-border bg-white text-sm placeholder:text-rc-muted transition-all duration-300 hover:border-rc-primary hover:shadow-sm focus:outline-none focus:border-rc-primary focus:ring-4 focus:ring-rc-primary/15"
                  {...register('state', { required: 'State is required' })}
                />
                <input
                  type="text"
                  placeholder="Country"
                  className="w-full h-10 px-3 rounded-input border border-rc-border bg-white text-sm placeholder:text-rc-muted transition-all duration-300 hover:border-rc-primary hover:shadow-sm focus:outline-none focus:border-rc-primary focus:ring-4 focus:ring-rc-primary/15"
                  {...register('country', { required: 'Country is required' })}
                />
              </div>
              {(errors.city || errors.state || errors.country) && (
                <p className="mt-1 text-xs text-[#DC2626]">
                  {errors.city?.message || errors.state?.message || errors.country?.message}
                </p>
              )}
            </div>

            {/* Company Registration Number */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="companyRegistrationNumber">
                Company Registration Number{' '}
                <span className="text-rc-muted font-normal">(optional, recommended for verification)</span>
              </label>
              <input
                id="companyRegistrationNumber"
                type="text"
                placeholder="e.g. CIN / GSTIN / Registration No."
                className="w-full h-10 px-3 rounded-input border border-rc-border bg-white text-sm placeholder:text-rc-muted transition-all duration-300 hover:border-rc-primary hover:shadow-sm focus:outline-none focus:border-rc-primary focus:ring-4 focus:ring-rc-primary/15"
                {...register('companyRegistrationNumber')}
              />
            </div>
{/* Terms & Conditions */}
<div className="flex items-start gap-2 pt-1">
  <label className="flex items-start gap-2 text-sm">
    <input
      type="checkbox"
      {...register("acceptTerms", {
        required: "You must accept the Terms & Conditions and Privacy Policy."
      })}
    />

    <span>
      I agree to SmartHire's{" "}
      <Link
        to="/terms"
        className="text-blue-600 hover:text-blue-700 hover:underline"
      >
        Terms & Conditions
      </Link>{" "}
      and{" "}
      <Link
        to="/privacy"
        className="text-blue-600 hover:text-blue-700 hover:underline"
      >
        Privacy Policy
      </Link>.
    </span>
  </label>
</div>

{errors.acceptTerms && (
  <p className="text-xs text-red-500 mt-1">
    {errors.acceptTerms.message}
  </p>
)}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-10 rounded-btn bg-rc-primary text-white text-sm font-medium mt-2 disabled:opacity-60 hover:brightness-95 transition"
            >
              {submitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-rc-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-rc-primary font-medium">
              Log in
            </Link>
          </p>
        </div>
      </Reveal>

      <Modal
        title="Account created successfully!"
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        size="sm"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
            <svg className="w-7 h-7 text-rc-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-rc-muted mb-6">
            Your account has been created and is pending admin approval. We'll notify you by
            email once you're approved to start posting drives.
          </p>
          <button
            type="button"
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/login');
            }}
            className="w-full h-10 rounded-btn bg-rc-primary text-white text-sm font-medium transition-all duration-300 hover:brightness-95 active:scale-95"
          >
            Go to Login
          </button>
        </div>
      </Modal>
    </div>
  );
}