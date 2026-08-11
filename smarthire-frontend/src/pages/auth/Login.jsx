import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext.jsx';
import Reveal from '../../components/Reveal.jsx';
const API_URL = import.meta.env.VITE_API_URL;

const ROLE_DASHBOARDS = {
  STUDENT: '/student/dashboard',
  RECRUITER: '/recruiter/dashboard',
  ADMIN: '/admin/dashboard',
};

const ROLE_STORAGE_KEY = {
  STUDENT: 'student',
  RECRUITER: 'recruiter',
  ADMIN: 'admin',       
};

export default function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Becomes true once credentials are verified — locks the form and reveals OTP field
  const [credentialsVerified, setCredentialsVerified] = useState(false);
  const [pendingStudentData, setPendingStudentData] = useState(null);

  // OTP state — same pattern as registration
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpStatus, setOtpStatus] = useState(null); // null | 'success' | 'error'
  const [emailOtpError, setEmailOtpError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Login button — validates credentials, then sends OTP automatically
  const handleCredentialsSubmit = async (e) => {
  e.preventDefault();
  setServerError('');
  setLoading(true);
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const text = await response.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text }; // backend sent a plain string, not JSON
    }

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    if (!data.role || !ROLE_DASHBOARDS[data.role]) {
      throw new Error('Unrecognized account role. Please contact support.');
    }

    setPendingStudentData(data);
    setCredentialsVerified(true);
    await handleSendOtp();
  } catch (error) {
    setServerError(error.message);
  } finally {
    setLoading(false);
  }
};

  const handleSendOtp = async () => {
    setSendingOtp(true);
    setEmailOtpError('');
    try {
      const response = await fetch(`${API_URL}/api/auth/login/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};
        throw new Error(data.message || 'Failed to send OTP. Please try again.');
      }
      setOtpSent(true);
      setOtpValue('');
      setOtpStatus(null);
      setResendCooldown(30);
    } catch (error) {
      setEmailOtpError(error.message);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
  if (otpValue.length !== 6) return;
  setVerifyingOtp(true);
  try {
    const response = await fetch(`${API_URL}/api/auth/login/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: otpValue }),
    });

    if (!response.ok) {
      throw new Error();
    }

    const data = await response.json();

      const storageKey = ROLE_STORAGE_KEY[data.role] || 'student';
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          email: data.email,
          role: data.role,
          token: data.token,
          fullName: data.fullName || data.name || '',
        })
      );
    window.dispatchEvent(new Event('authChange'));
    showToast('Logged in successfully!', 'success');

    const destination = ROLE_DASHBOARDS[data.role] || '/login';
    setTimeout(() => navigate(destination), 50)
  } catch {
    setOtpStatus('error');
  } finally {
    setVerifyingOtp(false);
  }
};

  return (
    <div className="min-h-[calc(100vh-128px)] bg-st-bg flex items-center justify-center px-4 py-12 font-sans text-st-text">
      <Reveal>
        <div className="w-full max-w-[480px] bg-st-surface rounded-card border border-st-border border-l-[3.5px] border-l-st-primary shadow-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <h1 className="text-2xl font-bold leading-tight tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-st-muted mb-6">
            Log in to continue to SmartHire.
          </p>

          {serverError && (
            <div className="mb-4 rounded-input border border-[#FECACA] bg-[#FEE2E2] px-3 py-2 text-sm text-[#991B1B]">
              {serverError}
            </div>
          )}

          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="jit@email.com"
                disabled={credentialsVerified}
                className="w-full h-10 px-3 rounded-input border border-st-border bg-st-surface text-sm placeholder:text-st-muted focus:outline-none focus:shadow-focus focus:border-st-primary disabled:bg-st-bg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                disabled={credentialsVerified}
                className="w-full h-10 px-3 rounded-input border border-st-border bg-st-surface text-sm placeholder:text-st-muted focus:outline-none focus:shadow-focus focus:border-st-primary disabled:bg-st-bg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Login button — hidden once credentials are verified and OTP flow takes over */}
            {!credentialsVerified && (
              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 rounded-btn bg-st-primary text-white text-sm font-medium mt-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
              >
                {loading ? 'Logging in…' : 'Log In'}
              </button>
            )}

            {emailOtpError && <p className="mt-1 text-xs text-[#EF4444]">{emailOtpError}</p>}

            {/* OTP field — appears only after credentials are verified via Log In */}
            {credentialsVerified && (
              <div className="pt-2">
                <div className="mb-2 rounded-input border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                  We've sent a verification code to{' '}
                  <span className="font-semibold text-green-800">{email}</span>.
                </div>

                <label className="block text-sm font-medium mb-1" htmlFor="loginOtp">
                  Enter OTP
                </label>
                <div className="flex gap-2 items-start">
                  <div className="flex-1 relative">
                    <input
                      id="loginOtp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter OTP"
                      value={otpValue}
                      onChange={(e) => {
                        setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6));
                        setOtpStatus(null);
                      }}
                      className={`w-full h-10 px-3 pr-8 rounded-input border bg-st-surface text-sm placeholder:text-st-muted focus:outline-none focus:shadow-focus ${
                        otpStatus === 'error'
                          ? 'border-[#EF4444]'
                          : 'border-st-border focus:border-st-primary'
                      }`}
                    />
                    {otpStatus === 'success' && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#10B981] text-sm">✓</span>
                    )}
                    {otpStatus === 'error' && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#EF4444] text-sm">✕</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp || otpValue.length !== 6}
                    className="h-10 px-4 shrink-0 rounded-btn bg-st-primary text-white text-sm font-medium disabled:opacity-60 duration-200 hover:scale-[1.02] hover:shadow-lg hover:brightness-110 active:scale-95 disabled:hover:scale-100"
                  >
                    {verifyingOtp ? 'Checking…' : 'Submit'}
                  </button>
                </div>
                {otpStatus === 'error' && (
                  <p className="mt-1 text-xs text-[#EF4444]">Incorrect OTP. Please try again.</p>
                )}

                <div className="flex items-center justify-end mt-2 text-xs">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || resendCooldown > 0}
                    className="text-st-primary font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sendingOtp
                      ? 'Sending…'
                      : resendCooldown > 0
                      ? `Resend (${resendCooldown}s)`
                      : 'Resend OTP'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-st-muted">
            Don't have an account?{' '}
          </p>
          <p>
            <Link to="/student/register" className="text-st-primary font-medium">
              Register as Student
            </Link>{' '}
            or{' '}
            <Link to="/recruiter/register" className="text-st-primary font-medium">
              Register as Recruiter
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-st-muted">
            Forgot your password?{' '}
            <Link to="/forgot-password" className="text-st-primary font-medium">
              Reset it here
            </Link>
          </p>
        </div>
      </Reveal>
    </div>
  );
}