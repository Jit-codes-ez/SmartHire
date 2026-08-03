// recruiterRegistration.jsx
// Recruiter Portal — Warm Indigo Theme (Section 5) · Centered form layout (Section 8)
// Depends on tailwind.config.js tokens from Section 10 of the SmartHire Design System:
// rc-primary, rc-accent, rc-bg, rc-muted, rc-border, rounded-card/btn/input, shadow-focus
//
// Note: the design system only documents a `users` table for recruiters (no recruiter_profiles
// table), so Company Name / Designation / Company Website below are added as the natural
// recruiter-side fields — mirror them into a recruiter_profiles table (or extra users columns)
// on the backend if you want them persisted beyond the users record.

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Reveal from '../../components/Reveal';

export default function RecruiterRegistration() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data) => {
    setServerError('');
    setSubmitting(true);
    try {
      await axios.post('/api/auth/register', {
        name: data.fullName,
        email: data.email,
        password: data.password,
        role: 'RECRUITER',
        companyName: data.companyName,
        designation: data.designation || '',
        companyWebsite: data.companyWebsite || '',
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
    <div className="min-h-[calc(100vh-128px)] bg-rc-bg flex items-center justify-center px-4 py-12 font-sans text-[#1C1917]">
        <Reveal>
        <div className="w-full max-w-[480px] bg-white rounded-card border border-rc-border border-l-[3.5px] border-l-rc-primary shadow-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <h1 className="text-2xl font-bold leading-tight tracking-tight mb-1">
            Create your recruiter account
          </h1>
          <p className="text-sm text-rc-muted mb-6">
            Post job drives and shortlist candidates with AI-ranked applicants.
          </p>

          {/* Pending-approval notice — recruiter accounts are approved by admin before posting */}
          <div className="mb-5 rounded-input border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 leading-5">
               New recruiter accounts are reviewed by an admin before you can post a drive.
          </div>

          {serverError && (
            <div className="w-full h-10 px-3 rounded-input border border-rc-border bg-white text-sm placeholder:text-rc-muted transition-all duration-300 hover:border-rc-primary hover:shadow-sm focus:outline-none focus:border-rc-primary focus:ring-4 focus:ring-rc-primary/15">
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
                placeholder="Ananya Rao"
                className="w-full h-10 px-3 rounded-input border border-rc-border bg-white text-sm placeholder:text-rc-muted transition-all duration-300 hover:border-rc-primary hover:shadow-sm focus:outline-none focus:border-rc-primary focus:ring-4 focus:ring-rc-primary/15"
                {...register('fullName', { required: 'Full name is required' })}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-[#DC2626]">{errors.fullName.message}</p>
              )}
            </div>

            {/* Work Email */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Work Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="ananya@tcs.com"
                className="w-full h-10 px-3 rounded-input border border-rc-border bg-white text-sm placeholder:text-rc-muted transition-all duration-300 hover:border-rc-primary hover:shadow-sm focus:outline-none focus:border-rc-primary focus:ring-4 focus:ring-rc-primary/15"
                {...register('email', {
                  required: 'Work email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
                })}
              />
              {errors.email && <p className="mt-1 text-xs text-[#DC2626]">{errors.email.message}</p>}
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

            {/* Designation / Website */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="designation">
                  Designation <span className="text-rc-muted font-normal">(optional)</span>
                </label>
                <input
                  id="designation"
                  type="text"
                  placeholder="HR Manager"
                  className="w-full h-10 px-3 rounded-input border border-rc-border bg-white text-sm placeholder:text-rc-muted transition-all duration-300 hover:border-rc-primary hover:shadow-sm focus:outline-none focus:border-rc-primary focus:ring-4 focus:ring-rc-primary/15"
                  {...register('designation')}
                />
              </div>
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
            </div>

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
  </div>
);
}
