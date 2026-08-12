import { useState } from "react";
import { ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react";
import { api } from "./services/api";

function VerifyOTP({ email, onBack, onReset }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/verify-otp", { email, otp });
      if (response.success) {
        localStorage.setItem("resetToken", response.resetToken);
        onReset();
      } else {
        setError(response.message || "Invalid OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      if (response.success) {
        alert("OTP resent successfully! Check your email.");
      } else {
        alert("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="auth-icon">
          <ShieldCheck size={25} />
        </div>

        <div className="auth-heading">
          <span>VERIFICATION</span>
          <h1>Verify your email</h1>
          <p>
            Enter the 6-digit verification code sent to
            <strong> {email}</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="field">
            <label>Verification Code</label>

            <input
              className="otp-input"
              type="text"
              inputMode="numeric"
              maxLength="6"
              placeholder="000000"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
            />
          </div>

          <button type="submit" className="sign-in-button" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
            <ArrowRight size={18} />
          </button>

        </form>

        <button 
          className="resend-button" 
          onClick={handleResendOTP}
          disabled={resendLoading}
        >
          {resendLoading ? "Sending..." : "Didn't receive the code? Resend OTP"}
        </button>

      </div>
    </div>
  );
}

export default VerifyOTP;