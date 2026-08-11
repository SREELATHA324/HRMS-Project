import { useState } from "react";
import { ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react";

function VerifyOTP({ email, onBack, onReset }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setError("");
    onReset();
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

          <button className="sign-in-button" type="submit">
            Verify OTP
            <ArrowRight size={18} />
          </button>

        </form>

        <button className="resend-button">
          Didn't receive the code? Resend OTP
        </button>

      </div>
    </div>
  );
}

export default VerifyOTP;