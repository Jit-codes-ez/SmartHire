import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CenteredFormLayout from "../../layouts/CenteredFormLayout.jsx";
import Button from "../../components/Button.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/student/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      // Read response as text first
      const text = await response.text();

      let data = {};

      // Try converting to JSON
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      // Login failed
      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Save logged-in student
      localStorage.setItem("student", JSON.stringify(data));

      showToast("Logged in successfully!", "success");

      navigate("/student/dashboard");
    } catch (error) {
      showToast(error.message || "Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredFormLayout
      title="Welcome back"
      subtitle="Log in to continue to SmartHire."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">
            Email Address
          </label>

          <input
            id="email"
            type="email"
            className="input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            className="input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </Button>
      </form>

      <div
        className="mt-6 pt-4 border-t text-xs text-center space-y-2"
        style={{ borderColor: "var(--border)" }}
      >
        <p className="muted">
          Demo shortcuts — jump straight into a portal:
        </p>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            className="underline"
            style={{ color: "var(--primary)" }}
            onClick={() => navigate("/recruiter/dashboard")}
          >
            Recruiter
          </button>

          <button
            type="button"
            className="underline"
            style={{ color: "var(--primary)" }}
            onClick={() => navigate("/admin/dashboard")}
          >
            Admin
          </button>
        </div>
      </div>
    </CenteredFormLayout>
  );
}