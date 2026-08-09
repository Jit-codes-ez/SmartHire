import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Reveal from "../../components/Reveal.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function ResetPassword() {

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const email = location.state?.email || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:8080/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            newPassword: password,
          }),
        }
      );

      const text = await response.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Password reset failed."
        );
      }

      showToast(
        "Password changed successfully!",
        "success"
      );

      navigate("/login");

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-[calc(100vh-128px)] bg-st-bg flex items-center justify-center px-4 py-12">

      <Reveal>

        <div className="w-full max-w-[480px] bg-st-surface rounded-card border border-st-border border-l-[3.5px] border-l-st-primary shadow-card p-8">

          <h1 className="text-2xl font-bold">
            Create New Password
          </h1>

          <p className="text-sm text-st-muted mt-2 mb-6">
            Choose a strong password for your account.
          </p>

          {error && (

            <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>

          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="block text-sm font-medium mb-2">
                New Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 px-3 pr-12 rounded-input border border-st-border"
                  placeholder="Enter new password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>

              <div className="relative">

                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-10 px-3 pr-12 rounded-input border border-st-border"
                  placeholder="Confirm password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-btn bg-st-primary text-white font-medium"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

          </form>

          <p className="mt-6 text-center text-sm">

            <Link
              to="/login"
              className="text-st-primary font-medium"
            >
              Back to Login
            </Link>

          </p>

        </div>

      </Reveal>

    </div>

  );

}