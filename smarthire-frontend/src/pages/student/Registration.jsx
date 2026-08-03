// studentRegistration.jsx

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Reveal from '../../components/Reveal';

const BRANCHES = ['CSE', 'MCA', 'ECE', 'ME', 'EE'];

export default function StudentRegistration() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState('');
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const password = watch('password');

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setServerError('Resume must be a PDF file.');
      e.target.value = '';
      return;
    }
    setServerError('');
    setResumeFile(file);
    setResumeName(file.name);
  };

  const onSubmit = async (data) => {
    setServerError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.fullName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('role', 'STUDENT');
      formData.append('branch', data.branch);
      formData.append('cgpa', data.cgpa);
      formData.append('linkedinUrl', data.linkedinUrl || '');
      formData.append('skills', data.skills || '');
      if (resumeFile) formData.append('resume', resumeFile);

      await axios.post('/api/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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

            {/* Branch / CGPA */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="branch">
                  Branch
                </label>
                <select
                  id="branch"
                  defaultValue=""
                  className="w-full h-10 px-3 rounded-input border border-st-border bg-st-surface text-sm focus:outline-none focus:shadow-focus focus:border-st-primary"
                  {...register('branch', { required: 'Select your branch' })}
                >
                  <option value="" disabled>
                    Select branch
                  </option>
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {errors.branch && (
                  <p className="mt-1 text-xs text-[#EF4444]">{errors.branch.message}</p>
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
                Upload Resume (PDF) <span className="text-st-muted font-normal">(optional)</span>
              </label>
              <label
                htmlFor="resume"
                className="flex items-center justify-between h-10 px-3 rounded-input border border-dashed border-st-border bg-st-bg text-sm text-st-muted cursor-pointer hover:border-st-primary transition"
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
