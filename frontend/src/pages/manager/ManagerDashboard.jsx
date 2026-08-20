import { useEffect, useState } from "react";
import {
  Users,
  CalendarDays,
  ClipboardCheck,
  BarChart3,
  UserCircle,
  Settings,
  LogOut,
  Bell,
  Search,
  Clock3,
  UserPlus,
  UserCheck,
  UserX,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  CalendarCheck,
} from "lucide-react";

import { api } from "../../services/api";
import ManagerSidebar from "../../components/manager/ManagerSidebar";
import ManagerHeader from "../../components/manager/ManagerHeader";
import Profile from "../profile/Profile";

function ManagerDashboard({ onNavigate, onLogout }) {
  const [dashboard, setDashboard] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [error, setError] = useState("");
  const [attendanceError, setAttendanceError] = useState("");
  const [search, setSearch] = useState("");

  /* =========================================================
     LOAD MANAGER DASHBOARD
  ========================================================= */
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard/manager");

      if (response?.success) {
        setDashboard(response.data || {
          manager: {},
          team: [],
          teamStats: { totalMembers: 0, activeMembers: 0, presentToday: 0, absentToday: 0, lateToday: 0, newJoiners: 0 },
          monthlyStats: { present: 0, absent: 0, half: 0, late: 0 },
          pendingApprovals: { corrections: 0, overtime: 0, total: 0 }
        });
        setError("");
      } else {
        setError(response?.message || "Unable to load dashboard data.");
        setDashboard(null);
      }
    } catch (err) {
      console.error("Manager dashboard error:", err);
      const message = err?.response?.data?.detail || err?.response?.data?.message || err?.message || "Unable to load manager dashboard.";
      setError(message);
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     LOAD TODAY ATTENDANCE
  ========================================================= */
  const fetchAttendance = async () => {
    try {
      setAttendanceError("");

      const response = await api.get("/attendance/daily");

      if (response?.success && response?.data) {
        const attendanceData = Array.isArray(response.data) 
          ? response.data[0] 
          : response.data;
        
        setAttendance(attendanceData || {
          check_in: null,
          check_out: null,
          status: 'Not Checked In',
          working_hours: 0,
          is_late: false,
          is_early_checkout: false,
          is_half_day: false,
          late_minutes: 0,
          early_checkout_minutes: 0,
          overtime_hours: 0
        });
      } else {
        setAttendance({
          check_in: null,
          check_out: null,
          status: 'Not Checked In',
          working_hours: 0,
          is_late: false,
          is_early_checkout: false,
          is_half_day: false,
          late_minutes: 0,
          early_checkout_minutes: 0,
          overtime_hours: 0
        });
      }
    } catch (err) {
      console.error("Attendance error:", err);
      const message = err?.response?.data?.detail || err?.response?.data?.message || "";
      setAttendanceError(message);
      setAttendance({
        check_in: null,
        check_out: null,
        status: 'Not Checked In',
        working_hours: 0,
        is_late: false,
        is_early_checkout: false,
        is_half_day: false,
        late_minutes: 0,
        early_checkout_minutes: 0,
        overtime_hours: 0
      });
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchAttendance();
  }, []);

  /* =========================================================
     FORMAT TIME - IST FIX
  ========================================================= */
  const formatTime = (value) => {
    if (!value) return "--:--";
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata"
        });
      }
      return value;
    } catch (e) {
      return value;
    }
  };

  /* =========================================================
     FORMAT WORKING HOURS - ADDED FIX
  ========================================================= */
  const formatWorkingHours = (value) => {
    if (value === null || value === undefined || value === "") {
      return "0h 00m";
    }

    const hours = Number(value);
    if (Number.isNaN(hours) || hours <= 0) {
      return "0h 00m";
    }

    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    return `${wholeHours}h ${String(minutes).padStart(2, "0")}m`;
  };

  /* =========================================================
     DASHBOARD DATA
  ========================================================= */
  const manager = dashboard?.manager || {};

  const team = Array.isArray(dashboard?.team)
    ? dashboard.team
    : [];

  const teamStats = dashboard?.teamStats || {};
  const monthlyStats = dashboard?.monthlyStats || {};
  const pendingApprovals =
    dashboard?.pendingApprovals || {};

  const filteredTeam = team.filter((member) => {
    const value = search.toLowerCase();

    return (
      String(member?.name || "")
        .toLowerCase()
        .includes(value) ||
      String(member?.employeeCode || "")
        .toLowerCase()
        .includes(value) ||
      String(member?.email || "")
        .toLowerCase()
        .includes(value) ||
      String(member?.department || "")
        .toLowerCase()
        .includes(value)
    );
  });

  /* =========================================================
     NAVIGATION
  ========================================================= */
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace("/#login");
  };

  /* =========================================================
     CHECK IN
  ========================================================= */
  const handleCheckIn = async () => {
    try {
      setAttendanceLoading(true);
      setAttendanceError("");

      const response = await api.post(
        "/attendance/check-in"
      );

      await fetchDashboard();
      await fetchAttendance();
    } catch (err) {
      console.error("Check-in error:", err);

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Unable to check in.";

      setAttendanceError(message);
      await fetchAttendance();
    } finally {
      setAttendanceLoading(false);
    }
  };

  /* =========================================================
     CHECK OUT
  ========================================================= */
  const handleCheckOut = async () => {
    try {
      setAttendanceLoading(true);
      setAttendanceError("");

      const response = await api.post(
        "/attendance/check-out"
      );

      await fetchDashboard();
      await fetchAttendance();
    } catch (err) {
      console.error("Check-out error:", err);

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Unable to check out.";

      setAttendanceError(message);
      await fetchAttendance();
    } finally {
      setAttendanceLoading(false);
    }
  };

  /* =========================================================
     INITIALS
  ========================================================= */
  const renderInitials = (name = "") => {
    if (!name.trim()) {
      return "M";
    }

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0]
        .charAt(0)
        .toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  /* =========================================================
     STATUS CLASS
  ========================================================= */
  const getStatusClass = (status) => {
    const value = String(status || "")
      .toLowerCase()
      .replace(/\s+/g, "-");

    if (
      value === "active" ||
      value === "present" ||
      value === "completed" ||
      value === "working"
    ) {
      return "status-active";
    }

    if (
      value === "inactive" ||
      value === "absent"
    ) {
      return "status-inactive";
    }

    return "status-default";
  };

  /* =========================================================
     ATTENDANCE STATUS
  ========================================================= */
  const getAttendanceStatus = () => {
    if (!attendance) {
      return "Not Checked In";
    }

    if (attendance?.check_in && attendance?.check_out) {
      return "Completed";
    }

    if (attendance?.check_in) {
      return "Working";
    }

    return "Not Checked In";
  };

  /* =========================================================
     MY ATTENDANCE CARD
  ========================================================= */
  const renderAttendanceCard = () => {
    const hasCheckIn = Boolean(
      attendance?.check_in
    );

    const hasCheckOut = Boolean(
      attendance?.check_out
    );

    return (
      <section className="admin-panel manager-attendance-panel">
        <div className="admin-panel-header">
          <div>
            <h2>My Attendance</h2>
            <p>Manage your attendance for today</p>
          </div>

          <span className="admin-panel-period">
            Today
          </span>
        </div>

        <div className="manager-attendance-status">
          <span>STATUS</span>

          <strong
            className={`status-badge ${getStatusClass(
              getAttendanceStatus()
            )}`}
          >
            {getAttendanceStatus()}
          </strong>
        </div>

        <div className="manager-attendance-grid">
          <div>
            <span>Check In</span>
            <strong>
              {attendance?.check_in ? formatTime(attendance.check_in) : "--:--"}
            </strong>
          </div>

          <div>
            <span>Check Out</span>
            <strong>
              {attendance?.check_out ? formatTime(attendance.check_out) : "--:--"}
            </strong>
          </div>

          <div>
            <span>Working Hours</span>
            <strong>
              {formatWorkingHours(attendance?.working_hours)}
            </strong>
          </div>
        </div>

        {attendanceError && (
          <div className="manager-attendance-error">
            <AlertCircle size={16} />
            <span>{attendanceError}</span>
          </div>
        )}

        <div className="manager-attendance-actions">
          <button
            type="button"
            className="admin-primary-button"
            onClick={handleCheckIn}
            disabled={
              attendanceLoading || hasCheckIn
            }
          >
            <CheckCircle2 size={17} />

            {attendanceLoading
              ? "Processing..."
              : hasCheckIn
              ? "Checked In"
              : "Check In"}
          </button>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={handleCheckOut}
            disabled={
              attendanceLoading ||
              !hasCheckIn ||
              hasCheckOut
            }
          >
            <LogOut size={17} />

            {hasCheckOut
              ? "Checked Out"
              : "Check Out"}
          </button>
        </div>
      </section>
    );
  };

  /* =========================================================
     DASHBOARD PAGE
  ========================================================= */
  const renderDashboard = () => {
    // Calculate team attendance percentage
    const totalMembers = teamStats?.totalMembers || 0;
    const presentToday = teamStats?.presentToday || 0;
    const attendancePercent = totalMembers > 0 
      ? Math.round((presentToday / totalMembers) * 100) 
      : 0;

    return (
      <>
        <div className="admin-page-heading">
          <div>
            <h1>Manager Dashboard</h1>

            <p>
              Welcome back,{" "}
              {manager?.name || "Manager"}.
              Here's your team overview.
            </p>
          </div>

          <button
            type="button"
            className="admin-panel-link manager-refresh-button"
            onClick={() => {
              fetchDashboard();
              fetchAttendance();
            }}
            disabled={loading}
          >
            <RefreshCw
              size={17}
              className={loading ? "spin" : ""}
            />
            Refresh
          </button>
        </div>

        {renderAttendanceCard()}

        <section className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Users size={20} />
            </div>

            <div>
              <p>Total Team Members</p>
              <h3>
                {teamStats?.totalMembers ?? 0}
              </h3>
              <span>Team members assigned</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <UserCheck size={20} />
            </div>

            <div>
              <p>Present Today</p>
              <h3>
                {teamStats?.presentToday ?? 0}
              </h3>
              <span>Currently present</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Clock3 size={20} />
            </div>

            <div>
              <p>Late Today</p>
              <h3>
                {teamStats?.lateToday ?? 0}
              </h3>
              <span>Late arrivals</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <UserPlus size={20} />
            </div>

            <div>
              <p>New Joiners</p>
              <h3>
                {teamStats?.newJoiners ?? 0}
              </h3>
              <span>Recently joined</span>
            </div>
          </div>
        </section>

        <section className="admin-dashboard-grid">
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h2>
                  Today's Team Attendance
                </h2>
                <p>
                  Monitor your team's attendance
                  status
                </p>
              </div>

              <span className="admin-panel-period">
                Today
              </span>
            </div>

            <div className="attendance-summary">
              <div className="attendance-item">
                <span className="attendance-dot present" />

                <div>
                  <strong>
                    {teamStats?.presentToday ?? 0}
                  </strong>
                  <span>Present</span>
                </div>
              </div>

              <div className="attendance-item">
                <span className="attendance-dot absent" />

                <div>
                  <strong>
                    {teamStats?.absentToday ?? 0}
                  </strong>
                  <span>Absent</span>
                </div>
              </div>

              <div className="attendance-item">
                <span className="attendance-dot late" />

                <div>
                  <strong>
                    {teamStats?.lateToday ?? 0}
                  </strong>
                  <span>Late</span>
                </div>
              </div>
            </div>

            <div className="manager-progress-section">
              <div className="manager-progress-label">
                <span>Team Attendance</span>

                <strong>
                  {attendancePercent}%
                </strong>
              </div>

              <div className="manager-progress-track">
                <span
                  style={{
                    width: `${Math.min(attendancePercent, 100)}%`,
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              className="admin-panel-link"
              onClick={() =>
                handleMenuClick("attendance")
              }
            >
              View Team Attendance
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h2>Pending Approvals</h2>
                <p>
                  Requests waiting for your action
                </p>
              </div>

              <span className="admin-panel-period">
                {pendingApprovals?.total ?? 0} Pending
              </span>
            </div>

            <div className="manager-approval-list">
              <div className="manager-approval-row">
                <div>
                  <CalendarDays size={18} />
                </div>

                <section>
                  <strong>
                    Attendance Corrections
                  </strong>

                  <span>
                    {pendingApprovals?.corrections ??
                      0}{" "}
                    requests
                  </span>
                </section>
              </div>

              <div className="manager-approval-row">
                <div>
                  <Clock3 size={18} />
                </div>

                <section>
                  <strong>
                    Overtime Requests
                  </strong>

                  <span>
                    {pendingApprovals?.overtime ?? 0}{" "}
                    requests
                  </span>
                </section>
              </div>
            </div>

            <button
              type="button"
              className="admin-panel-link"
              onClick={() =>
                handleMenuClick("approvals")
              }
            >
              Review Approvals
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>
                Monthly Attendance Overview
              </h2>
              <p>
                Team attendance summary for this
                month
              </p>
            </div>

            <span className="admin-panel-period">
              This Month
            </span>
          </div>

          <div className="manager-monthly-grid">
            <div>
              <span>Present</span>
              <strong>
                {monthlyStats?.present ?? 0}
              </strong>
            </div>

            <div>
              <span>Absent</span>
              <strong>
                {monthlyStats?.absent ?? 0}
              </strong>
            </div>

            <div>
              <span>Half Day</span>
              <strong>
                {monthlyStats?.half ?? 0}
              </strong>
            </div>

            <div>
              <span>Late</span>
              <strong>
                {monthlyStats?.late ?? 0}
              </strong>
            </div>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>My Team</h2>
              <p>Employees reporting to you</p>
            </div>

            <button
              type="button"
              className="admin-panel-link"
              onClick={() =>
                handleMenuClick("team")
              }
            >
              View All
            </button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {team.slice(0, 5).map((member) => (
                  <tr key={member?.id}>
                    <td>
                      <div className="manager-employee-cell">
                        <div className="manager-employee-avatar">
                          {renderInitials(member?.name)}
                        </div>

                        <div>
                          <strong>
                            {member?.name || "-"}
                          </strong>

                          <span>
                            {member?.email || "-"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      {member?.employeeCode || "-"}
                    </td>

                    <td>
                      {member?.department || "-"}
                    </td>

                    <td>
                      {member?.designation || "-"}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          member?.status
                        )}`}
                      >
                        {member?.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}

                {team.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="admin-empty-state"
                    >
                      No team members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  };

  /* =========================================================
     MY TEAM PAGE
  ========================================================= */
  const renderTeam = () => {
    return (
      <>
        <div className="admin-page-heading">
          <div>
            <h1>My Team</h1>
            <p>
              View and manage your team members
            </p>
          </div>
        </div>

        <section className="admin-panel">
          <div className="admin-table-toolbar">
            <div className="admin-search">
              <Search size={17} />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search team members..."
              />
            </div>

            <span className="admin-panel-period">
              {filteredTeam.length} Members
            </span>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Employee ID</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredTeam.map((member) => (
                  <tr key={member?.id}>
                    <td>
                      <div className="manager-employee-cell">
                        <div className="manager-employee-avatar">
                          {renderInitials(member?.name)}
                        </div>

                        <strong>
                          {member?.name || "-"}
                        </strong>
                      </div>
                    </td>

                    <td>
                      {member?.employeeCode || "-"}
                    </td>

                    <td>
                      {member?.email || "-"}
                    </td>

                    <td>
                      {member?.department || "-"}
                    </td>

                    <td>
                      {member?.designation || "-"}
                    </td>

                    <td>
                      {member?.joiningDate || "-"}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          member?.status
                        )}`}
                      >
                        {member?.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredTeam.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="admin-empty-state"
                    >
                      No employees match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  };

  /* =========================================================
     ATTENDANCE PAGE
  ========================================================= */
  const renderAttendance = () => {
    return (
      <>
        <div className="admin-page-heading">
          <div>
            <h1>Team Attendance</h1>
            <p>
              Monitor today's team attendance
            </p>
          </div>
        </div>

        <section className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <UserCheck size={20} />
            </div>

            <div>
              <p>Present Today</p>
              <h3>
                {teamStats?.presentToday ?? 0}
              </h3>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <UserX size={20} />
            </div>

            <div>
              <p>Absent Today</p>
              <h3>
                {teamStats?.absentToday ?? 0}
              </h3>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Clock3 size={20} />
            </div>

            <div>
              <p>Late Today</p>
              <h3>
                {teamStats?.lateToday ?? 0}
              </h3>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Users size={20} />
            </div>

            <div>
              <p>Active Members</p>
              <h3>
                {teamStats?.activeMembers ?? 0}
              </h3>
            </div>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Attendance Summary</h2>
              <p>
                Current team attendance statistics
              </p>
            </div>

            <span className="admin-panel-period">
              Today
            </span>
          </div>

          <div className="manager-monthly-grid">
            <div>
              <span>Present</span>
              <strong>
                {teamStats?.presentToday ?? 0}
              </strong>
            </div>

            <div>
              <span>Absent</span>
              <strong>
                {teamStats?.absentToday ?? 0}
              </strong>
            </div>

            <div>
              <span>Late</span>
              <strong>
                {teamStats?.lateToday ?? 0}
              </strong>
            </div>

            <div>
              <span>Total Members</span>
              <strong>
                {teamStats?.totalMembers ?? 0}
              </strong>
            </div>
          </div>
        </section>
      </>
    );
  };

  /* =========================================================
     APPROVALS PAGE
  ========================================================= */
  const renderApprovals = () => {
    return (
      <>
        <div className="admin-page-heading">
          <div>
            <h1>Pending Approvals</h1>
            <p>
              Review requests waiting for manager
              action
            </p>
          </div>
        </div>

        <section className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <CalendarDays size={20} />
            </div>

            <div>
              <p>Attendance Corrections</p>
              <h3>
                {pendingApprovals?.corrections ?? 0}
              </h3>
              <span>Correction requests</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Clock3 size={20} />
            </div>

            <div>
              <p>Overtime Requests</p>
              <h3>
                {pendingApprovals?.overtime ?? 0}
              </h3>
              <span>Approval requests</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <ClipboardCheck size={20} />
            </div>

            <div>
              <p>Total Pending</p>
              <h3>
                {pendingApprovals?.total ?? 0}
              </h3>
              <span>Requires attention</span>
            </div>
          </div>
        </section>
      </>
    );
  };

  /* =========================================================
     PROFILE PAGE
  ========================================================= */
  const renderProfile = () => {
    return <Profile/>;
  };

  /* =========================================================
     REPORTS PAGE
  ========================================================= */
  const renderReports = () => {
    const present = Number(
      monthlyStats?.present || 0
    );

    const absent = Number(
      monthlyStats?.absent || 0
    );

    const half = Number(
      monthlyStats?.half || 0
    );

    const late = Number(
      monthlyStats?.late || 0
    );

    const totalDays = present + absent + half + late;
    const maxValue = totalDays > 0 ? totalDays : 1;

    return (
      <>
        <div className="admin-page-heading">
          <div>
            <h1>Team Reports</h1>
            <p>
              Team statistics and monthly attendance
              overview
            </p>
          </div>
        </div>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Monthly Team Attendance</h2>
              <p>Current monthly statistics</p>
            </div>

            <span className="admin-panel-period">
              This Month
            </span>
          </div>

          <div className="manager-report-list">
            {[
              ["Present", present],
              ["Absent", absent],
              ["Half Day", half],
              ["Late", late],
            ].map(([label, value]) => (
              <div
                className="manager-report-row"
                key={label}
              >
                <span>{label}</span>

                <div className="manager-report-track">
                  <span
                    style={{
                      width: `${(value / maxValue) * 100}%`,
                    }}
                  />
                </div>

                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  };

  /* =========================================================
     SETTINGS PAGE
  ========================================================= */
  const renderSettings = () => {
    return (
      <>
        <div className="admin-page-heading">
          <div>
            <h1>Settings</h1>
            <p>
              Manager dashboard settings
            </p>
          </div>
        </div>

        <section className="admin-panel">
          <div className="manager-settings-row">
            <div className="admin-stat-icon">
              <Settings size={20} />
            </div>

            <div>
              <h3>Account Settings</h3>
              <p>
                Manage your account preferences and
                dashboard settings
              </p>
            </div>

            <ChevronRight size={18} />
          </div>

          <div className="manager-settings-row">
            <div className="admin-stat-icon">
              <Bell size={20} />
            </div>

            <div>
              <h3>Notifications</h3>
              <p>
                Configure your HRMS notifications
              </p>
            </div>

            <ChevronRight size={18} />
          </div>
        </section>
      </>
    );
  };

  /* =========================================================
     CONTENT ROUTER
  ========================================================= */
  const renderContent = () => {
    if (activeMenu === "dashboard") {
      return renderDashboard();
    }

    if (activeMenu === "team") {
      return renderTeam();
    }

    if (activeMenu === "attendance") {
      return renderAttendance();
    }

    if (activeMenu === "approvals") {
      return renderApprovals();
    }

    if (activeMenu === "profile") {
      return renderProfile();
    }

    if (activeMenu === "reports") {
      return renderReports();
    }

    if (activeMenu === "settings") {
      return renderSettings();
    }

    return renderDashboard();
  };

  /* =========================================================
     MAIN LAYOUT
     SAME STRUCTURE AS ADMIN DASHBOARD
  ========================================================= */
  return (
    <div className="admin-layout">
      <ManagerSidebar
        activePage={activeMenu}
        onNavigate={handleMenuClick}
        onLogout={handleLogout}
      />

      <main className="admin-main">
        <ManagerHeader
          manager={manager}
          pendingCount={
            pendingApprovals?.total || 0
          }
        />

        <div className="admin-dashboard-content">
          {loading && !dashboard ? (
            <div className="admin-loading">
              Loading dashboard...
            </div>
          ) : error && !dashboard ? (
            <div className="admin-form-error">
              <AlertCircle size={18} />
              <span>{error}</span>

              <button
                type="button"
                className="admin-primary-button"
                onClick={fetchDashboard}
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </main>
    </div>
  );
}

export default ManagerDashboard;