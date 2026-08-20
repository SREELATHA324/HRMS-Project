import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Clock3,
  CalendarDays,
  ClipboardList,
  LogIn,
  LogOut,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import EmployeeSidebar from "../../components/employee/EmployeeSidebar";
import EmployeeHeader from "../../components/employee/EmployeeHeader";
import StatCard from "../../components/admin/StatCard";
import Profile from "../profile/Profile";
import { api } from "../../services/api";
import EmployeeAttendance from "./EmployeeAttendance";
function EmployeeDashboard({ onNavigate, onLogout }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState("dashboard");

  const [
    attendanceActionLoading,
    setAttendanceActionLoading,
  ] = useState(false);

  /* =========================================================
     LOAD EMPLOYEE DASHBOARD
     GET /api/dashboard/employee
  ========================================================= */

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/dashboard/employee"
      );

      /*
        Expected backend response:

        {
          success: true,
          data: {
            employee: {},
            todayAttendance: {},
            monthlyStats: {},
            leaveBalance: {},
            pendingCorrections: 0,
            attendancePercentage: 0
          }
        }
      */

      if (response?.success && response?.data) {
        setDashboardData(response.data);
      } else {
        setDashboardData(null);

        setError(
          response?.message ||
            "Failed to load employee dashboard."
        );
      }
    } catch (err) {
      console.error(
        "Employee dashboard error:",
        err
      );

      setDashboardData(null);

      setError(
        err?.message ||
          "Failed to load employee dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     CHECK IN
     POST /api/attendance/check-in
  ========================================================= */

  const handleCheckIn = async () => {
    try {
      setError("");
      setAttendanceActionLoading(true);

      const response = await api.post(
        "/attendance/check-in",
        {}
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to check in."
        );
      }

      await loadDashboardData();
    } catch (err) {
      console.error(
        "Check-in error:",
        err
      );

      setError(
        err?.message ||
          "Failed to check in."
      );
    } finally {
      setAttendanceActionLoading(false);
    }
  };

  /* =========================================================
     CHECK OUT
     POST /api/attendance/check-out
  ========================================================= */

  const handleCheckOut = async () => {
    try {
      setError("");
      setAttendanceActionLoading(true);

      const response = await api.post(
        "/attendance/check-out",
        {}
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to check out."
        );
      }

      await loadDashboardData();
    } catch (err) {
      console.error(
        "Check-out error:",
        err
      );

      setError(
        err?.message ||
          "Failed to check out."
      );
    } finally {
      setAttendanceActionLoading(false);
    }
  };

  /* =========================================================
     LOAD DATA ON PAGE OPEN
  ========================================================= */

  useEffect(() => {
    loadDashboardData();
  }, []);

  /* =========================================================
     BACKEND DATA
  ========================================================= */

  const employee =
    dashboardData?.employee || {};

  const todayAttendance =
    dashboardData?.todayAttendance || {};

  const monthlyStats =
    dashboardData?.monthlyStats || {};

  const leaveBalance =
    dashboardData?.leaveBalance || {};

  const pendingCorrections =
    dashboardData?.pendingCorrections ?? 0;

  const attendancePercentage =
    dashboardData?.attendancePercentage ?? 0;

  /* =========================================================
     LEAVE CALCULATIONS
  ========================================================= */

  const annualLeave =
    Number(leaveBalance?.annual) || 0;

  const sickLeave =
    Number(leaveBalance?.sick) || 0;

  const casualLeave =
    Number(leaveBalance?.casual) || 0;

  const totalLeaves =
    annualLeave +
    sickLeave +
    casualLeave;

  const formatTime = (value) => {
  if (!value) return "--:--";

  // Already a time like 09:30:00
  if (
    typeof value === "string" &&
    /^\d{2}:\d{2}/.test(value)
  ) {
    return value.slice(0, 5);
  }

  // ISO date/time from PostgreSQL
  const date = new Date(value);

  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  return String(value);
};
  /* =========================================================
     ATTENDANCE VALUES
  ========================================================= */

  const attendanceStatus =
    todayAttendance?.status ||
    "Not Checked In";

  const rawCheckIn =
  todayAttendance?.check_in ||
  todayAttendance?.checkIn ||
  null;

const rawCheckOut =
  todayAttendance?.check_out ||
  todayAttendance?.checkOut ||
  null;

const checkIn = formatTime(rawCheckIn);

const checkOut = formatTime(rawCheckOut);

const workingHours =
  todayAttendance?.working_hours ??
  todayAttendance?.workingHours ??
  "00h 00m";

const hasCheckedIn = Boolean(rawCheckIn);

const hasCheckedOut = Boolean(rawCheckOut);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const handleNavigation = (page) => {
    if (page === "employeeDashboard") {
      setActivePage("dashboard");
      return;
    }

    if (page === "employeeProfile") {
      setActivePage("profile");
      return;
    }

    if (onNavigate) {
      onNavigate(page);
    }
  };

  /* =========================================================
     LOADING SCREEN
  ========================================================= */

  if (loading && !dashboardData) {
    return (
      <div className="admin-layout">
        <EmployeeSidebar
          activePage={activePage}
          onNavigate={handleNavigation}
          onLogout={onLogout}
        />

        <main className="admin-main">
          <EmployeeHeader
            onNavigate={handleNavigation}
            employee={{}}
          />

          <div className="admin-dashboard-content">
            <div className="dashboard-loading">
              Loading employee dashboard...
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* =========================================================
     ERROR SCREEN
  ========================================================= */

  if (error && !dashboardData) {
    return (
      <div className="admin-layout">
        <EmployeeSidebar
          activePage={activePage}
          onNavigate={handleNavigation}
          onLogout={onLogout}
        />

        <main className="admin-main">
          <EmployeeHeader
            onNavigate={handleNavigation}
            employee={{}}
          />

          <div className="admin-dashboard-content">
            <div className="dashboard-error">
              <p>{error}</p>

              <button
                type="button"
                className="admin-panel-link"
                onClick={loadDashboardData}
              >
                <RefreshCw size={17} />
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* =========================================================
     MAIN DASHBOARD
  ========================================================= */

  return (
    <div className="admin-layout">
      {/* =====================================================
          EMPLOYEE SIDEBAR
      ===================================================== */}

      <EmployeeSidebar
        activePage={activePage}
        onNavigate={handleNavigation}
        onLogout={onLogout}
      />

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <main className="admin-main">
        <EmployeeHeader
          onNavigate={handleNavigation}
          employee={employee}
        />

        <div className="admin-dashboard-content">
          {/* =================================================
              PROFILE PAGE
          ================================================= */}

          {activePage === "profile" ? (
            <Profile />
          ) : activePage === "attendance" ? (
  <EmployeeAttendance />
) : (
            <>
              {/* =============================================
                  PAGE HEADING
              ============================================= */}

              <div className="admin-page-heading">
                <div>
                  <h1>Employee Dashboard</h1>

                  <p>
                    Welcome back,{" "}
                    {employee?.firstName ||
                      "Employee"}.
                    {" "}Here's your work overview.
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-panel-link"
                  onClick={loadDashboardData}
                  disabled={loading}
                >
                  <RefreshCw
                    size={17}
                    className={
                      loading ? "spin" : ""
                    }
                  />
                  Refresh
                </button>
              </div>

              {/* =============================================
                  ACTION ERROR
              ============================================= */}

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {/* =============================================
                  TOP STAT CARDS
              ============================================= */}

              <section className="admin-stats-grid">
                <StatCard
                  title="Today's Attendance"
                  value={attendanceStatus}
                  description="Your attendance status today"
                  icon={
                    <CalendarCheck size={20} />
                  }
                />

                <StatCard
                  title="Working Hours"
                  value={workingHours}
                  description="Hours worked today"
                  icon={<Clock3 size={20} />}
                />

                <StatCard
                  title="Available Leaves"
                  value={`${totalLeaves} Days`}
                  description="Current leave balance"
                  icon={
                    <CalendarDays size={20} />
                  }
                />

                <StatCard
                  title="Pending Corrections"
                  value={pendingCorrections}
                  description="Attendance regularization requests"
                  icon={
                    <ClipboardList size={20} />
                  }
                />
              </section>

              {/* =============================================
                  TODAY'S ATTENDANCE
                  + LEAVE OVERVIEW
              ============================================= */}

              <section className="admin-dashboard-grid">
                {/* TODAY'S ATTENDANCE */}

                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h2>
                        Today's Attendance
                      </h2>

                      <p>
                        Manage and track your
                        attendance for today
                      </p>
                    </div>

                    <span className="admin-panel-period">
                      Today
                    </span>
                  </div>

                  <div className="attendance-summary">
                    <div className="attendance-item">
                      <span className="attendance-dot present"></span>

                      <div>
                        <strong>
                          {checkIn}
                        </strong>

                        <span>
                          Check In
                        </span>
                      </div>
                    </div>

                    <div className="attendance-item">
                      <span className="attendance-dot absent"></span>

                      <div>
                        <strong>
                          {checkOut}
                        </strong>

                        <span>
                          Check Out
                        </span>
                      </div>
                    </div>

                    <div className="attendance-item">
                      <span className="attendance-dot late"></span>

                      <div>
                        <strong>
                          {workingHours}
                        </strong>

                        <span>
                          Working Hours
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CHECK IN / CHECK OUT */}

                  <div className="employee-attendance-actions">
                    <button
                      type="button"
                      className="employee-checkin-btn"
                      onClick={handleCheckIn}
                      disabled={
                        attendanceActionLoading ||
                        hasCheckedIn
                      }
                    >
                      <LogIn size={17} />

                      {attendanceActionLoading
                        ? "Processing..."
                        : hasCheckedIn
                        ? "Checked In"
                        : "Check In"}
                    </button>

                    <button
                      type="button"
                      className="employee-checkout-btn"
                      onClick={handleCheckOut}
                      disabled={
                        attendanceActionLoading ||
                        !hasCheckedIn ||
                        hasCheckedOut
                      }
                    >
                      <LogOut size={17} />

                      {attendanceActionLoading
                        ? "Processing..."
                        : hasCheckedOut
                        ? "Checked Out"
                        : "Check Out"}
                    </button>
                  </div>

                  <button
                    type="button"
                    className="admin-panel-link"
                    onClick={() =>
                      handleNavigation(
                        "employeeAttendance"
                      )
                    }
                  >
                    View Attendance
                  </button>
                </div>

                {/* LEAVE OVERVIEW */}

                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h2>
                        Leave Overview
                      </h2>

                      <p>
                        Your current leave balance
                      </p>
                    </div>

                    <span className="admin-panel-period">
                      Current
                    </span>
                  </div>

                  <div className="leave-summary">
                    <div className="leave-item">
                      <span>
                        Annual Leave
                      </span>

                      <strong>
                        {annualLeave}
                      </strong>
                    </div>

                    <div className="leave-item">
                      <span>
                        Sick Leave
                      </span>

                      <strong>
                        {sickLeave}
                      </strong>
                    </div>

                    <div className="leave-item">
                      <span>
                        Casual Leave
                      </span>

                      <strong>
                        {casualLeave}
                      </strong>
                    </div>
                  </div>

                  <div className="leave-progress">
                    <div className="leave-progress-row">
                      <span>
                        Total Available Leaves
                      </span>

                      <strong>
                        {totalLeaves} Days
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="admin-panel-link"
                    onClick={() =>
                      handleNavigation(
                        "employeeLeaves"
                      )
                    }
                  >
                    View Leaves
                  </button>
                </div>
              </section>

              {/* =============================================
                  MONTHLY ATTENDANCE
                  + MY INFORMATION
              ============================================= */}

              <section className="admin-dashboard-grid">
                {/* MONTHLY ATTENDANCE */}

                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h2>
                        Monthly Attendance
                      </h2>

                      <p>
                        Your attendance performance
                        this month
                      </p>
                    </div>

                    <TrendingUp size={20} />
                  </div>

                  <div className="leave-summary">
                    <div className="leave-item">
                      <span>
                        Present Days
                      </span>

                      <strong>
                        {monthlyStats?.presentDays ??
                          0}
                      </strong>
                    </div>

                    <div className="leave-item">
                      <span>
                        Absent Days
                      </span>

                      <strong>
                        {monthlyStats?.absentDays ??
                          0}
                      </strong>
                    </div>

                    <div className="leave-item">
                      <span>
                        Half Days
                      </span>

                      <strong>
                        {monthlyStats?.halfDays ??
                          0}
                      </strong>
                    </div>

                    <div className="leave-item">
                      <span>
                        Late Days
                      </span>

                      <strong>
                        {monthlyStats?.lateDays ??
                          0}
                      </strong>
                    </div>
                  </div>

                  <div className="leave-progress">
                    <div className="leave-progress-row">
                      <span>
                        Attendance Percentage
                      </span>

                      <strong>
                        {attendancePercentage}%
                      </strong>
                    </div>

                    <div className="leave-progress-bar">
                      <span
                        style={{
                          width: `${Math.min(
                            Math.max(
                              Number(
                                attendancePercentage
                              ) || 0,
                              0
                            ),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* MY INFORMATION */}

                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h2>
                        My Information
                      </h2>

                      <p>
                        Your employment details
                      </p>
                    </div>
                  </div>

                  <div className="employee-information-grid">
                    <div className="employee-information-card">
                      <span>
                        Employee ID
                      </span>

                      <strong>
                        {employee?.employeeCode ||
                          "--"}
                      </strong>
                    </div>

                    <div className="employee-information-card">
                      <span>
                        Department
                      </span>

                      <strong>
                        {employee?.department ||
                          "--"}
                      </strong>
                    </div>

                    <div className="employee-information-card employee-designation-card">
                      <span>
                        Designation
                      </span>

                      <strong>
                        {employee?.designation ||
                          "--"}
                      </strong>
                    </div>

                    <div className="employee-information-card">
                      <span>
                        Length of Service
                      </span>

                      <strong>
                        {employee?.lengthOfService ||
                          "--"}
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="admin-panel-link"
                    onClick={() =>
                      handleNavigation(
                        "employeeProfile"
                      )
                    }
                  >
                    View Profile
                  </button>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default EmployeeDashboard;