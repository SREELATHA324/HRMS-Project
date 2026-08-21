import { useState, useEffect } from "react";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./LoginPage";
import ForgotPassword from "./ForgotPassword";
import VerifyOTP from "./VerifyOTP";
import ResetPassword from "./ResetPassword";
import PasswordSuccess from "./PasswordSuccess";

/* ================= ADMIN PAGES ================= */
import AdminDashboard from "./pages/admin/AdminDashboard";
import Employees from "./pages/admin/Employees";
import Attendance from "./pages/admin/Attendance";
import AddEmployee from "./pages/admin/AddEmployee";
import EmployeeDetails from "./pages/admin/EmployeeDetails";
import EditEmployee from "./pages/admin/EditEmployee";
import AdminLeaves from "./pages/admin/AdminLeaves";
/* ================= MANAGER PAGES ================= */
import ManagerDashboard from "./pages/manager/ManagerDashboard";

/* ================= EMPLOYEE PAGES ================= */
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeAttendance from "./pages/employee/EmployeeAttendance";
import EmployeeAttendanceCorrection from "./pages/employee/EmployeeAttendanceCorrection";
import EmployeeLeaves from "./pages/employee/EmployeeLeaves";
function App() {
  /* =========================================================
     GET CURRENT PAGE FROM URL HASH
  ========================================================= */
  const getPageFromHash = () => {
    const hash = window.location.hash;

    /* ---------- Authentication ---------- */
    if (hash === "#login") return "login";
    if (hash === "#forgot-password") return "forgot";
    if (hash === "#verify-otp") return "verify";
    if (hash === "#reset-password") return "reset";
    if (hash === "#success") return "success";

    /* ---------- Admin ---------- */
    if (hash === "#dashboard") return "dashboard";

    if (hash === "#admin/employees") {
      return "employees";
    }

    if (hash === "#admin/attendance") {
      return "attendance";
    }

    if (hash === "#admin/employees/add") {
      return "addEmployee";
    }

    if (hash.startsWith("#admin/employees/view/")) {
      return "employeeDetails";
    }

    if (hash.startsWith("#admin/employees/edit/")) {
      return "editEmployee";
    }
    if (hash === "#admin/leaves") {
      return "leaves";
    }
    /* ---------- Manager ---------- */
    if (hash === "#manager/dashboard") {
      return "managerDashboard";
    }

    /* ---------- Employee ---------- */
    if (hash === "#employee/dashboard") {
      return "employeeDashboard";
    }

    return "landing";
  };

  /* =========================================================
     USER STATE
  ========================================================= */
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

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
      /* ---------- General ---------- */
      landing: "",
      login: "login",
      forgot: "forgot-password",
      verify: "verify-otp",
      reset: "reset-password",
      success: "success",

      /* ---------- Admin ---------- */
      dashboard: "dashboard",
      employees: "admin/employees",
      attendance: "admin/attendance",
      addEmployee: "admin/employees/add",
      employeeDetails: `admin/employees/view/${value}`,
      editEmployee: `admin/employees/edit/${value}`,
      leaves: "admin/leaves",
      /* ---------- Manager ---------- */
      managerDashboard: "manager/dashboard",

      /* ---------- Employee ---------- */
      employeeDashboard: "employee/dashboard",
      employeeAttendance: "employee/attendance",
      employeeAttendanceCorrection: `employee/attendance/correction/${value}`,
      employeeLeaves: "employee/leaves",
    };

    const hash = hashMap[pageName];

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
     HANDLE LOGIN
  ========================================================= */
  const handleLogin = (userData) => {
    if (!userData) {
      return;
    }

    setUser(userData);
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    /*
      Redirect based on user role
    */
    if (userData.role === "admin") {
      navigate("dashboard", null, true);
    } else if (userData.role === "manager") {
      navigate("managerDashboard", null, true);
    } else if (userData.role === "employee") {
      navigate("employeeDashboard", null, true);
    } else {
      console.error(
        "Unknown user role:",
        userData.role
      );
      navigate("login", null, true);
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

    window.addEventListener(
      "popstate",
      handleNavigation
    );

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

    setUser(null);
    setPage("login");

    window.location.hash = "login";
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
          LOGIN PAGE
      ===================================================== */}
      {page === "login" && (
        <LoginPage
          onLogin={handleLogin}
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
      ===================================================== */}
      {page === "dashboard" && (
        <AdminDashboard
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}

      {/* =====================================================
          ADMIN EMPLOYEES
      ===================================================== */}
      {page === "employees" && (
        <Employees
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}

      {/* =====================================================
          ADMIN ATTENDANCE
      ===================================================== */}
      {page === "attendance" && (
        <Attendance
          onNavigate={navigate}
          onLogout={handleLogout}
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
          EMPLOYEE DETAILS - ADMIN
      ===================================================== */}
      {page === "employeeDetails" && (
        <EmployeeDetails
          employeeId={getEmployeeIdFromHash()}
          onNavigate={navigate}
        />
      )}

      {/* =====================================================
          EDIT EMPLOYEE - ADMIN
      ===================================================== */}
      {page === "editEmployee" && (
        <EditEmployee
          employeeId={getEditEmployeeIdFromHash()}
          onNavigate={navigate}
        />
      )}
      {
        page === "leaves" && (
          <AdminLeaves
            onNavigate={navigate}
            onLogout={handleLogout}
          />
        )
      }

      {/* =====================================================
          MANAGER DASHBOARD
      ===================================================== */}
      {page === "managerDashboard" && (
        <ManagerDashboard
          user={user}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}

      {/* =====================================================
          EMPLOYEE DASHBOARD
      ===================================================== */}
      {page === "employeeDashboard" && (
        <EmployeeDashboard
          user={user}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}

      {page === "employeeAttendance" && (
        <EmployeeAttendance
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}
      {page === "employeeAttendanceCorrection" && (
        <EmployeeAttendanceCorrection
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}
      {page === "employeeLeaves" && (
        <EmployeeLeaves
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default App;