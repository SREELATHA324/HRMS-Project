import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";
import { api } from "./services/api";

function LoginPage({ onForgotPassword, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================================================
     LOGIN SUBMIT
  ========================================================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const data = response?.data || response;

      /* =====================================================
         SUCCESSFUL LOGIN
      ===================================================== */
      if (data?.success) {
        const token = data?.token;
        const user = data?.user;

        if (!token || !user) {
          setError("Invalid login response from server.");
          return;
        }

        /* Save token */
        localStorage.setItem("token", token);

        /* Save logged-in user */
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        /*
          IMPORTANT:

          App.jsx already handles:

          admin    -> dashboard
          manager  -> managerDashboard
          employee -> employeeDashboard

          Therefore, do not do role routing here.
        */
        if (onLogin) {
          onLogin(user);
          return;
        }

        setError("Unable to navigate after login.");
      } else {
        setError(
          data?.message ||
            data?.detail ||
            "Login failed"
        );
      }
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Network error. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     UI
  ========================================================= */
  return (
    <div className="login-page">

      {/* =====================================================
          LEFT SIDE
      ===================================================== */}
      <div className="login-left">
        <div className="circle circle-one"></div>
        <div className="circle circle-two"></div>

        <div className="left-content">

          {/* LOGO */}
          <div className="logo-section">
            <div className="logo-box">
              H
            </div>

            <div>
              <h2>HRMS</h2>

              <p>
                Human Resource Management System
              </p>
            </div>
          </div>

          {/* HERO */}
          <div className="hero-content">
            <div className="small-title">
              SMARTER HR MANAGEMENT
            </div>

            <h1>
              Empower your people.
              <span>
                Elevate your business.
              </span>
            </h1>

            <p>
              Manage employees, attendance, payroll
              and HR operations from one secure and
              centralized platform.
            </p>
          </div>

          {/* STATS */}
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

      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}
      <div className="login-right">
        <div className="login-card">

          {/* MOBILE LOGO */}
          <div className="mobile-logo">
            <div className="mobile-logo-box">
              H
            </div>

            <div>
              <h2>HRMS</h2>
              <p>Human Resource Management</p>
            </div>
          </div>

          {/* HEADING */}
          <div className="login-heading">
            <span>WELCOME BACK</span>

            <h1>
              Sign in to your account
            </h1>

            <p>
              Enter your credentials to access
              your HRMS dashboard.
            </p>
          </div>

          {/* =================================================
              LOGIN FORM
          ================================================= */}
          <form onSubmit={handleSubmit}>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* EMAIL */}
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

            {/* PASSWORD */}
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
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
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
                  onClick={() => {
                    setShowPassword(
                      !showPassword
                    );
                  }}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* SPACE */}
            <div
              style={{
                marginTop: "20px",
              }}
            ></div>

            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              className="sign-in-button"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}

              <ArrowRight size={18} />
            </button>

          </form>

          {/* FOOTER */}
          <div className="footer">
            <p>
              © 2026 HRMS. All rights reserved.
            </p>

            <span>
              Secure Human Resource Management
              Platform
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}

export default LoginPage;