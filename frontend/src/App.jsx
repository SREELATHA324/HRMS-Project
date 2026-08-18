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
import Attendance from "./pages/admin/Attendance";
import AddEmployee from "./pages/admin/AddEmployee";
import EmployeeDetails from "./pages/admin/EmployeeDetails";
import EditEmployee from "./pages/admin/EditEmployee";

function App() {
  /* =========================================================
     GET CURRENT PAGE FROM URL HASH
  ========================================================= */
  const getPageFromHash = () => {
    const hash = window.location.hash;

    if (hash === "#login") return "login";
    if (hash === "#forgot-password") return "forgot";
    if (hash === "#verify-otp") return "verify";
    if (hash === "#reset-password") return "reset";
    if (hash === "#success") return "success";
    if (hash === "#dashboard") return "dashboard";

    // Admin Employees
    if (hash === "#admin/employees") {
      return "employees";
    }

    // Admin Attendance
    if (hash === "#admin/attendance") {
      return "attendance";
    }

    // Add Employee
    if (hash === "#admin/employees/add") {
      return "addEmployee";
    }

    // Employee Details
    if (hash.startsWith("#admin/employees/view/")) {
      return "employeeDetails";
    }

    // Edit Employee
    if (hash.startsWith("#admin/employees/edit/")) {
      return "editEmployee";
    }

    return "landing";
  };

  const [page, setPage] = useState(getPageFromHash);
  const [email, setEmail] = useState("");

  /* =========================================================
     GET EMPLOYEE ID FROM VIEW URL
  ========================================================= */
  const getEmployeeIdFromHash = () => {
    const prefix = "#admin/employees/view/";

    if (!window.location.hash.startsWith(prefix)) {
      return null;
    }

    return window.location.hash.substring(prefix.length);
  };

  /* =========================================================
     GET EMPLOYEE ID FROM EDIT URL
  ========================================================= */
  const getEditEmployeeIdFromHash = () => {
    const prefix = "#admin/employees/edit/";

    if (!window.location.hash.startsWith(prefix)) {
      return null;
    }

    return window.location.hash.substring(prefix.length);
  };

  /* =========================================================
     NAVIGATION
  ========================================================= */
  const navigate = (
    pageName,
    value = null,
    replace = false
  ) => {
    const hashMap = {
      landing: "",
      login: "login",
      forgot: "forgot-password",
      verify: "verify-otp",
      reset: "reset-password",
      success: "success",
      dashboard: "dashboard",

      // Admin pages
      employees: "admin/employees",
      attendance: "admin/attendance",

      // Employee management
      addEmployee: "admin/employees/add",
      employeeDetails: `admin/employees/view/${value}`,
      editEmployee: `admin/employees/edit/${value}`,
    };

    const hash = hashMap[pageName];

    // Safety check
    if (hash === undefined) {
      console.error(`Unknown page: ${pageName}`);
      return;
    }

    const url = hash
      ? `#${hash}`
      : window.location.pathname;

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

  /* =========================================================
     HANDLE BROWSER BACK / FORWARD + HASH CHANGES
  ========================================================= */
  useEffect(() => {
    const handleNavigation = () => {
      const nextPage = getPageFromHash();

      setPage(nextPage);

      if (
        nextPage === "landing" &&
        window.location.hash === ""
      ) {
        window.scrollTo({
          top: 0,
          behavior: "instant",
        });
      }
    };

    // Browser Back / Forward
    window.addEventListener(
      "popstate",
      handleNavigation
    );

    // Hash navigation
    window.addEventListener(
      "hashchange",
      handleNavigation
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handleNavigation
      );

      window.removeEventListener(
        "hashchange",
        handleNavigation
      );
    };
  }, []);

  /* =========================================================
     LOGOUT
  ========================================================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("login", null, true);
  };

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <>
      {/* =====================================================
          LANDING PAGE
      ===================================================== */}
      {page === "landing" && (
        <LandingPage
          onLogin={() => navigate("login")}
        />
      )}

      {/* =====================================================
          LOGIN
      ===================================================== */}
      {page === "login" && (
        <LoginPage
          onForgotPassword={() =>
            navigate("forgot")
          }
        />
      )}

      {/* =====================================================
          FORGOT PASSWORD
      ===================================================== */}
      {page === "forgot" && (
        <ForgotPassword
          onBack={() => navigate("login")}
          onVerify={(emailValue) => {
            setEmail(emailValue);
            navigate("verify");
          }}
        />
      )}

      {/* =====================================================
          VERIFY OTP
      ===================================================== */}
      {page === "verify" && (
        <VerifyOTP
          email={email}
          onBack={() => navigate("forgot")}
          onReset={() => navigate("reset")}
        />
      )}

      {/* =====================================================
          RESET PASSWORD
      ===================================================== */}
      {page === "reset" && (
        <ResetPassword
          onSuccess={() =>
            navigate("success", null, true)
          }
        />
      )}

      {/* =====================================================
          PASSWORD SUCCESS
      ===================================================== */}
      {page === "success" && (
        <PasswordSuccess
          onLogin={() =>
            navigate("login", null, true)
          }
        />
      )}

      {/* =====================================================
          ADMIN DASHBOARD
          
          This page contains the Admin Sidebar/Header.
          Attendance is intentionally NOT rendered here.
      ===================================================== */}
      {page === "dashboard" && (
        <AdminDashboard
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}

      {/* =====================================================
          ADMIN EMPLOYEES

          Rendered directly like your existing Employees page.
          Therefore no AdminHeader/AdminSidebar wrapper here.
      ===================================================== */}
      {page === "employees" && (
        <Employees
          onNavigate={navigate}
        />
      )}

      {/* =====================================================
          ADMIN ATTENDANCE

          IMPORTANT:
          Attendance is rendered directly by App.jsx,
          exactly like Employees.

          Therefore Attendance will NOT show:
          - Admin Sidebar
          - Admin Header
          - Admin Dashboard shell
      ===================================================== */}
      {page === "attendance" && (
        <Attendance
          onNavigate={navigate}
        />
      )}

      {/* =====================================================
          ADD EMPLOYEE
      ===================================================== */}
      {page === "addEmployee" && (
        <AddEmployee
          onNavigate={navigate}
        />
      )}

      {/* =====================================================
          EMPLOYEE DETAILS
      ===================================================== */}
      {page === "employeeDetails" && (
        <EmployeeDetails
          employeeId={getEmployeeIdFromHash()}
          onNavigate={navigate}
        />
      )}

      {/* =====================================================
          EDIT EMPLOYEE
      ===================================================== */}
      {page === "editEmployee" && (
        <EditEmployee
          employeeId={getEditEmployeeIdFromHash()}
          onNavigate={navigate}
        />
      )}
    </>
  );
}

export default App;