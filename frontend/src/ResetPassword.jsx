import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import { api } from "./services/api";

function ResetPassword({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>[\]\\/'`~_+=;-]/.test(password),
  };

  const isStrongPassword =
    passwordRules.length &&
    passwordRules.uppercase &&
    passwordRules.lowercase &&
    passwordRules.number &&
    passwordRules.special;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please enter both password fields.");
      return;
    }

    if (!passwordRules.length) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (!passwordRules.uppercase) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!passwordRules.lowercase) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }

    if (!passwordRules.number) {
      setError("Password must contain at least one number.");
      return;
    }

    if (!passwordRules.special) {
      setError("Password must contain at least one special character.");
      return;
    }

    if (!isStrongPassword) {
      setError("Please enter a strong password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const resetToken = localStorage.getItem("resetToken");

    if (!resetToken) {
      setError("Reset token not found. Please request a new OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/reset-password", {
        password,
        confirmPassword,
        resetToken,
      });

      if (response.success) {
        localStorage.removeItem("resetToken");
        onSuccess();
      } else {
        setError(response.message || "Failed to reset password.");
      }
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const Rule = ({ valid, children }) => (
    <div className={`password-rule ${valid ? "valid" : ""}`}>
      {valid ? <Check size={14} /> : <X size={14} />}
      <span>{children}</span>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-icon">
          <Lock size={25} />
        </div>

        <div className="auth-heading">
          <span>RESET PASSWORD</span>

          <h1>Create new password</h1>

          <p>
            Create a strong password to secure your HRMS account.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="field">
            <label>New Password</label>

            <div className="input-box">
              <Lock size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />

              <button
                type="button"
                className="eye-button"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>
          {password.length > 0 && (
            <div className="password-rules">
              <p className="rules-title">
                Password requirements
              </p>

              <Rule valid={passwordRules.length}>
                At least 8 characters
              </Rule>

              <Rule valid={passwordRules.uppercase}>
                At least one uppercase letter
              </Rule>

              <Rule valid={passwordRules.lowercase}>
                At least one lowercase letter
              </Rule>

              <Rule valid={passwordRules.number}>
                At least one number
              </Rule>

              <Rule valid={passwordRules.special}>
                At least one special character
              </Rule>
            </div>
          )}

          <div className="field">
            <label>Confirm Password</label>

            <div className="input-box">
              <Lock size={18} />

              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
              />

              <button
                type="button"
                className="eye-button"
                onClick={() =>
                  setShowConfirm((previous) => !previous)
                }
              >
                {showConfirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {confirmPassword && (
              <div
                className={
                  password === confirmPassword
                    ? "password-match"
                    : "password-not-match"
                }
              >
                {password === confirmPassword
                  ? "Passwords match"
                  : "Passwords do not match"}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="sign-in-button"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}

            {!loading && <ArrowRight size={18} />}
          </button>

        </form>
      </div>
    </div>
  );
}

export default ResetPassword;