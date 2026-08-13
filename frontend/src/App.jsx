import { useEffect, useState } from "react";
import "./App.css";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./LoginPage";
import ForgotPassword from "./ForgotPassword";
import VerifyOTP from "./VerifyOTP";
import ResetPassword from "./ResetPassword";
import PasswordSuccess from "./PasswordSuccess";
import Dashboard from "./Dashboard";  
import AdminDashboard from "./pages/admin/AdminDashboard";
import Employees from "./pages/admin/Employees";
import AddEmployee from "./pages/admin/AddEmployee";
function App() {
  const getPageFromHash = () => {
    const hash = window.location.hash;

    if (hash === "#login") return "login";
    if (hash === "#forgot-password") return "forgot";
    if (hash === "#verify-otp") return "verify";
    if (hash === "#reset-password") return "reset";
    if (hash === "#success") return "success";
    if (hash === "#dashboard") return "dashboard";
    if (hash === "#admin/employees") return "employees";
    if (hash === "#admin/employees/add") return "addEmployee";

    return "landing";
  };

  const [page, setPage] = useState(getPageFromHash);
  const [email, setEmail] = useState("");

  const navigate = (pageName, replace = false) => {
    const hashMap = {
      landing: "",
      login: "login",
      forgot: "forgot-password",
      verify: "verify-otp",
      reset: "reset-password",
      success: "success",
      dashboard: "dashboard",
      employees: "admin/employees",
      addEmployee: "admin/employees/add",
    };

    const hash = hashMap[pageName];

    // Safety check
    if (hash === undefined) {
      console.error(`Unknown page: ${pageName}`);
      return;
    }

    const url = hash ? `#${hash}` : window.location.pathname;

    if (replace) {
      window.history.replaceState(null, "", url);
    } else {
      window.history.pushState(null, "", url);
    }

    setPage(pageName);

    if (pageName === "landing") {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  };

  useEffect(() => {
    const handleNavigation = () => {
      const nextPage = getPageFromHash();

      setPage(nextPage);

      if (nextPage === "landing" && window.location.hash === "") {
        window.scrollTo({
          top: 0,
          behavior: "instant",
        });
      }
    };

    // Browser Back / Forward
    window.addEventListener("popstate", handleNavigation);

    // Hash navigation
    window.addEventListener("hashchange", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleNavigation);
      window.removeEventListener("hashchange", handleNavigation);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("login", true);
  };

  return (
    <>
      {page === "landing" && (
        <LandingPage
          onLogin={() => navigate("login")}
        />
      )}

      {page === "login" && (
        <LoginPage
          onForgotPassword={() => navigate("forgot")}
        />
      )}

      {page === "forgot" && (
        <ForgotPassword
          onBack={() => navigate("login")}
          onVerify={(emailValue) => {
            setEmail(emailValue);
            navigate("verify");
          }}
        />
      )}

      {page === "verify" && (
        <VerifyOTP
          email={email}
          onBack={() => navigate("forgot")}
          onReset={() => navigate("reset")}
        />
      )}

      {page === "reset" && (
        <ResetPassword
          onSuccess={() => navigate("success", true)}
        />
      )}

      {page === "success" && (
        <PasswordSuccess
          onLogin={() => navigate("login", true)}
        />
      )}

      {page === "dashboard" && (
        <AdminDashboard
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}

      {page === "employees" && (
        <Employees
          onNavigate={navigate}
        />
      )}

      {page === "addEmployee" && (
        <AddEmployee
          onNavigate={navigate}
        />
      )}
    </>
  );
}

export default App;