import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { api } from "./services/api";

function LoginPage({onForgotPassword}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.success) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        window.location.replace("/#dashboard");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">

      <div className="login-left">

        <div className="circle circle-one"></div>
        <div className="circle circle-two"></div>

        <div className="left-content">

          <div className="logo-section">
            <div className="logo-box">H</div>

            <div>
              <h2>HRMS</h2>
              <p>Human Resource Management System</p>
            </div>
          </div>

          <div className="hero-content">

            <div className="small-title">
              SMARTER HR MANAGEMENT
            </div>

            <h1>
              Empower your people.
              <span>Elevate your business.</span>
            </h1>

            <p>
              Manage employees, attendance, payroll and HR operations
              from one secure and centralized platform.
            </p>

          </div>

          <div className="stats">

            <div className="stat">
              <strong>24/7</strong>
              <span>Access</span>
            </div>

            <div className="divider"></div>

            <div className="stat">
              <strong>Secure</strong>
              <span>Platform</span>
            </div>

            <div className="divider"></div>

            <div className="stat">
              <strong>All-in-One</strong>
              <span>HR Solution</span>
            </div>

          </div>

        </div>
      </div>

      <div className="login-right">

        <div className="login-card">

          <div className="mobile-logo">
            <div className="mobile-logo-box">H</div>

            <div>
              <h2>HRMS</h2>
              <p>Human Resource Management</p>
            </div>
          </div>

          <div className="login-heading">

            <span>WELCOME BACK</span>

            <h1>Sign in to your account</h1>

            <p>
              Enter your credentials to access your HRMS dashboard.
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

                <Mail size={19} />

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

            <div className="field">

              <div className="password-top">

                <label>Password</label>

                <button
                  type="button"
                  className="forgot"
                  onClick={onForgotPassword}
                >
                  Forgot password?
                </button>

              </div>

              <div className="input-box">

                <Lock size={19} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            <div style={{ marginTop: "20px" }}></div>

            <button type="submit" className="sign-in-button" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight size={18} />
            </button>

          </form>

          <div className="footer">

            <p>© 2026 HRMS. All rights reserved.</p>

            <span>
              Secure Human Resource Management Platform
            </span>

          </div>

        </div>
      </div>

    </div>
  );
}

export default LoginPage;