import { useState } from "react";
import LoginPage from "./LoginPage";
import ForgotPassword from "./ForgotPassword";
import VerifyOTP from "./VerifyOTP";
import ResetPassword from "./ResetPassword";
import PasswordSuccess from "./PasswordSuccess";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import Dashboard from "./Dashboard";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [page, setPage] = useState("login");

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPage("login");
    window.location.hash = "login";
  };

  if (user?.role === "admin") {
    return (
      <AdminDashboard
        onLogout={handleLogout}
      />
    );
  }

  if (user?.role === "manager") {
    return (
      <ManagerDashboard
        onLogout={handleLogout}
      />
    );
  }

  if (user?.role === "employee") {
    return (
      <Dashboard
        onLogout={handleLogout}
      />
    );
  }

  if (page === "forgot-password") {
    return (
      <ForgotPassword
        onNavigate={setPage}
      />
    );
  }

  if (page === "verify-otp") {
    return (
      <VerifyOTP
        onNavigate={setPage}
      />
    );
  }

  if (page === "reset-password") {
    return (
      <ResetPassword
        onNavigate={setPage}
      />
    );
  }

  if (page === "password-success") {
    return (
      <PasswordSuccess
        onNavigate={setPage}
      />
    );
  }

  return (
    <LoginPage
      onLogin={handleLogin}
      onNavigate={setPage}
    />
  );
}

export default App;