import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Reveal from "../../components/Reveal.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function VerifyResetOtp() {

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {

    if (!email) {
      navigate("/forgot-password");
    }

  }, [email, navigate]);

  useEffect(() => {

    if (countdown === 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);

  }, [countdown]);



  const verifyOtp = async () => {

    if (otp.length !== 6) return;

    setLoading(true);
    setError("");

    try {

      const response = await fetch(
        "/api/auth/verify-reset-otp",
        {
          method: "POST",
          headers: {
            "Content-Type":"application/json"
          },
          body: JSON.stringify({
            email,
            otp
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
          data.message || "Invalid OTP"
        );
      }

      showToast(
        "OTP verified successfully",
        "success"
      );

      navigate(
        "/reset-password",
        {
          state:{ email }
        }
      );

    } catch(error){

      setError(error.message);

    } finally{

      setLoading(false);

    }

  };



  const resendOtp = async () => {

    setSending(true);

    try{

      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            email
          })
        }
      );

      if(!response.ok){
        throw new Error();
      }

      setCountdown(30);

      showToast(
        "OTP sent again",
        "success"
      );

    }catch{

      showToast(
        "Unable to resend OTP",
        "error"
      );

    }finally{

      setSending(false);

    }

  };



  return (

    <div className="min-h-[calc(100vh-128px)] bg-st-bg flex items-center justify-center px-4 py-12">

      <Reveal>

        <div className="w-full max-w-[480px] bg-st-surface rounded-card border border-st-border border-l-[3.5px] border-l-st-primary shadow-card p-8">

          <h1 className="text-2xl font-bold">
            Verify OTP
          </h1>

          <p className="text-sm text-st-muted mt-2 mb-6">

            Enter the verification code sent to

            <span className="font-semibold text-st-primary">
              {" "}{email}
            </span>

          </p>

          {error && (

            <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>

          )}

          <div>

            <label className="block text-sm font-medium mb-2">
              Verification Code
            </label>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e)=>
                setOtp(
                  e.target.value.replace(/\D/g,"")
                )
              }
              className="w-full h-10 px-3 rounded-input border border-st-border"
              placeholder="Enter OTP"
            />

          </div>

          <button
            onClick={verifyOtp}
            disabled={loading || otp.length!==6}
            className="w-full mt-6 h-10 rounded-btn bg-st-primary text-white"
          >

            {loading
              ? "Verifying..."
              : "Verify OTP"}

          </button>

          <div className="text-center mt-4">

            <button
              disabled={countdown>0 || sending}
              onClick={resendOtp}
              className="text-st-primary text-sm"
            >

              {sending
                ? "Sending..."
                : countdown>0
                ? `Resend OTP (${countdown}s)`
                : "Resend OTP"}

            </button>

          </div>

          <p className="text-center mt-6">

            <Link
              to="/login"
              className="text-st-primary"
            >
              Back to Login
            </Link>

          </p>

        </div>

      </Reveal>

    </div>

  );

}