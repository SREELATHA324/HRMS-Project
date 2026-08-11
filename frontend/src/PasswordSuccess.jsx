import { CheckCircle, ArrowRight } from "lucide-react";

function PasswordSuccess({ onLogin }) {
  return (
    <div className="auth-page">
      <div className="auth-card success-card">

        <div className="success-icon">
          <CheckCircle size={42} />
        </div>

        <div className="auth-heading">
          <span>SUCCESS</span>

          <h1>Password reset successful</h1>

          <p>
            Your password has been updated successfully.
            You can now sign in using your new password.
          </p>
        </div>

        <button
          className="sign-in-button"
          onClick={onLogin}
        >
          Continue to Login
          <ArrowRight size={18} />
        </button>

      </div>
    </div>
  );
}

export default PasswordSuccess;