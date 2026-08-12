import { useState } from "react";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";
import { api } from "./services/api";

function ForgotPassword({ onBack, onVerify }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", { email });
      if (response.success) {
        onVerify(email);
      } else {
        setError(response.message || "Failed to send OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={17} />
          Back to Login
        </button>

        <div className="auth-icon">
          <Mail size={25} />
        </div>

        <div className="auth-heading">
          <span>ACCOUNT RECOVERY</span>
          <h1>Forgot your password?</h1>
          <p>
            Enter your registered email address and we'll send you
            a verification code.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="field">
            <label>Email</label>

            <div className="input-box">
              <Mail size={18} />

              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />
            </div>
          </div>

          <button type="submit" className="sign-in-button" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
            <ArrowRight size={18} />
          </button>

        </form>

        <div className="footer">
          <p>© 2026 HRMS. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;