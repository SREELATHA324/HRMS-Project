import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from "lucide-react";

function ResetPassword({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Please enter both password fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    onSuccess();
  };

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
            Your new password must be different from your
            previous password.
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
                  setShowPassword(!showPassword)
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
                  setShowConfirm(!showConfirm)
                }
              >
                {showConfirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <button className="sign-in-button" type="submit">
            Reset Password
            <ArrowRight size={18} />
          </button>

        </form>

      </div>
    </div>
  );
}

export default ResetPassword;