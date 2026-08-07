import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Reveal from "../../components/Reveal";
import { useToast } from "../../context/ToastContext.jsx";

export default function ForgotPassword() {

  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const response = await fetch(
        "http://localhost:8080/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type":"application/json"
          },
          body: JSON.stringify({
            email
          })
        }
      );

      const text = await response.text();

      let data = {};

      try{
        data = text ? JSON.parse(text) : {};
      }catch{
        data = { message:text };
      }

      if(!response.ok){
        throw new Error(
          data.message || "Unable to send OTP."
        );
      }

      showToast(
        "OTP sent successfully",
        "success"
      );

      navigate(
        "/verify-reset-otp",
        {
          state:{
            email
          }
        }
      );

    } catch(error){

      setError(error.message);

    } finally{

      setLoading(false);

    }

  };

  return (

    <div className="min-h-[calc(100vh-128px)] bg-st-bg flex items-center justify-center px-4 py-12">

      <Reveal>

        <div className="w-full max-w-[480px] bg-st-surface rounded-card border border-st-border border-l-[3.5px] border-l-st-primary shadow-card p-8">

          <h1 className="text-2xl font-bold">
            Forgot Password
          </h1>

          <p className="text-sm text-st-muted mt-2 mb-6">
            Enter your registered email address.
            We'll send you a verification code.
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
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-input border border-st-border"
                placeholder="name@email.com"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-btn bg-st-primary text-white font-medium"
            >

              {loading
                ? "Sending..."
                : "Send OTP"}

            </button>

          </form>

          <p className="mt-6 text-center text-sm">

            <Link
              to="/login"
              className="text-st-primary font-medium"
            >
              ← Back to Login
            </Link>

          </p>

        </div>

      </Reveal>

    </div>

  );

}