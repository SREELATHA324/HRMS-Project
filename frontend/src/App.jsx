import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./LoginPage";
import ForgotPassword from "./ForgotPassword";
import VerifyOTP from "./VerifyOTP";
import ResetPassword from "./ResetPassword";
import PasswordSuccess from "./PasswordSuccess";

function App() {
  const [email, setEmail] = useState("");

  return (
    <Routes>
      <Route path="/" element={<LandingPageRoute />} />

      <Route path="/login" element={<LoginPageRoute />} />

      <Route
        path="/forgot-password"
        element={<ForgotPasswordRoute setEmail={setEmail} />}
      />

      <Route
        path="/verify-otp"
        element={<VerifyOTPRoute email={email} />}
      />

      <Route path="/reset-password" element={<ResetPasswordRoute />} />

      <Route path="/success" element={<PasswordSuccessRoute />} />
    </Routes>
  );
}

function LandingPageRoute() {
  const navigate = useNavigate();

  return (
    <LandingPage
      onLogin={() => navigate("/login")}
    />
  );
}

function LoginPageRoute() {
  const navigate = useNavigate();

  return (
    <LoginPage
      onForgotPassword={() => navigate("/forgot-password")}
    />
  );
}

function ForgotPasswordRoute({ setEmail }) {
  const navigate = useNavigate();

  return (
    <ForgotPassword
      onBack={() => navigate("/login")}
      onVerify={(emailValue) => {
        setEmail(emailValue);
        navigate("/verify-otp");
      }}
    />
  );
}

function VerifyOTPRoute({ email }) {
  const navigate = useNavigate();

  return (
    <VerifyOTP
      email={email}
      onBack={() => navigate("/forgot-password")}
      onReset={() => navigate("/reset-password")}
    />
  );
}

function ResetPasswordRoute() {
  const navigate = useNavigate();

  return (
    <ResetPassword
      onSuccess={() => navigate("/success")}
    />
  );
}

function PasswordSuccessRoute() {
  const navigate = useNavigate();

  return (
    <PasswordSuccess
      onLogin={() => navigate("/login")}
    />
  );
}

export default App;