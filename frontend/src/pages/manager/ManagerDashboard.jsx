import { useEffect, useState } from "react";
import {
  LayoutDashboard,
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
  Menu,
  X,
  CheckCircle2,
  CalendarCheck,
} from "lucide-react";
import { api } from "../../services/api";
import "./ManagerDashboard.css";

function ManagerDashboard({ onNavigate, onLogout }) {
  const [dashboard, setDashboard] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [error, setError] = useState("");
  const [attendanceError, setAttendanceError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard/manager");
      const data = response?.data || response;

      if (data) {
        setDashboard(data);
      } else {
        setError("Unable to load dashboard data.");
      }
    } catch (err) {
      console.error("Manager dashboard error:", err);

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Unable to load manager dashboard.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      setAttendanceError("");

      const response = await api.get("/attendance/today");
      const data = response?.data || response;

      setAttendance(data || null);
    } catch (err) {
      console.error("Attendance error:", err);

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "";

      setAttendanceError(message);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchAttendance();
  }, []);

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

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setSidebarOpen(false);
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

  const handleCheckIn = async () => {
    try {
      setAttendanceLoading(true);
      setAttendanceError("");

      const response = await api.post(
        "/attendance/check-in"
      );

      const data = response?.data || response;

      setAttendance(data);
      await fetchDashboard();
    } catch (err) {
      console.error("Check-in error:", err);

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Unable to check in.";

      setAttendanceError(message);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setAttendanceLoading(true);
      setAttendanceError("");

      const response = await api.post(
        "/attendance/check-out"
      );

      const data = response?.data || response;

      setAttendance(data);
      await fetchDashboard();
    } catch (err) {
      console.error("Check-out error:", err);

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Unable to check out.";

      setAttendanceError(message);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const renderInitials = (name = "") => {
    const parts = name.trim().split(" ");

    if (!name.trim()) {
      return "M";
    }

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

  const getAttendanceStatus = () => {
    if (!attendance) {
      return "Not Checked In";
    }

    if (attendance?.status) {
      return attendance.status;
    }

    if (
      attendance?.check_in &&
      attendance?.check_out
    ) {
      return "Completed";
    }

    if (attendance?.check_in) {
      return "Working";
    }

    return "Not Checked In";
  };

  const renderAttendanceCard = () => {
    const hasCheckIn = Boolean(
      attendance?.check_in
    );

    const hasCheckOut = Boolean(
      attendance?.check_out
    );

    return (
      <div className="dashboard-card manager-attendance-card">
        <div className="card-header">
          <div>
            <h2>My Attendance</h2>
            <p>
              Manage your attendance for today.
            </p>
          </div>

          <div className="attendance-header-icon">
            <Clock3 size={22} />
          </div>
        </div>

        <div className="my-attendance-body">
          <div className="attendance-status-section">
            <span className="attendance-label">
              TODAY'S STATUS
            </span>

            <div className="attendance-status-row">
              <span
                className={`status-badge ${getStatusClass(
                  getAttendanceStatus()
                )}`}
              >
                {getAttendanceStatus()}
              </span>
            </div>
          </div>

          <div className="attendance-times">
            <div className="attendance-time-box">
              <span>Check In</span>
              <strong>
                {attendance?.check_in || "--:--"}
              </strong>
            </div>

            <div className="attendance-time-box">
              <span>Check Out</span>
              <strong>
                {attendance?.check_out || "--:--"}
              </strong>
            </div>

            <div className="attendance-time-box">
              <span>Working Hours</span>
              <strong>
                {attendance?.working_hours || "0h 0m"}
              </strong>
            </div>
          </div>

          {attendanceError && (
            <div className="attendance-error">
              <AlertCircle size={16} />
              <span>{attendanceError}</span>
            </div>
          )}

          <div className="attendance-actions">
            <button
              className="checkin-button"
              onClick={handleCheckIn}
              disabled={
                attendanceLoading ||
                hasCheckIn
              }
            >
              <CheckCircle2 size={18} />

              {attendanceLoading
                ? "Processing..."
                : hasCheckIn
                ? "Checked In"
                : "Check In"}
            </button>

            <button
              className="checkout-button"
              onClick={handleCheckOut}
              disabled={
                attendanceLoading ||
                !hasCheckIn ||
                hasCheckOut
              }
            >
              <LogOut size={18} />

              {hasCheckOut
                ? "Checked Out"
                : "Check Out"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    return (
      <>
        <div className="page-heading">
          <div>
            <p className="eyebrow">
              MANAGER PORTAL
            </p>

            <h1>Manager Dashboard</h1>

            <p className="page-subtitle">
              Welcome back,{" "}
              {manager?.name || "Manager"}. Here's
              your team overview.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={() => {
              fetchDashboard();
              fetchAttendance();
            }}
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

        {renderAttendanceCard()}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Users size={21} />
            </div>

            <div className="stat-content">
              <span>Total Team Members</span>
              <strong>
                {teamStats?.totalMembers ?? 0}
              </strong>
              <small>
                Team members assigned
              </small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <UserCheck size={21} />
            </div>

            <div className="stat-content">
              <span>Present Today</span>
              <strong>
                {teamStats?.presentToday ?? 0}
              </strong>
              <small>
                Currently present
              </small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <Clock3 size={21} />
            </div>

            <div className="stat-content">
              <span>Late Today</span>
              <strong>
                {teamStats?.lateToday ?? 0}
              </strong>
              <small>
                Late arrivals
              </small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <UserPlus size={21} />
            </div>

            <div className="stat-content">
              <span>New Joiners</span>
              <strong>
                {teamStats?.newJoiners ?? 0}
              </strong>
              <small>
                Recently joined
              </small>
            </div>
          </div>
        </div>

        <div className="main-grid">
          <div className="dashboard-card attendance-card">
            <div className="card-header">
              <div>
                <h2>
                  Today's Team Attendance
                </h2>

                <p>
                  Monitor your team's attendance
                  status.
                </p>
              </div>

              <CalendarCheck size={21} />
            </div>

            <div className="attendance-summary">
              <div className="attendance-item">
                <div className="attendance-dot present"></div>

                <div>
                  <strong>
                    {teamStats?.presentToday ?? 0}
                  </strong>
                  <span>Present</span>
                </div>
              </div>

              <div className="attendance-item">
                <div className="attendance-dot absent"></div>

                <div>
                  <strong>
                    {teamStats?.absentToday ?? 0}
                  </strong>
                  <span>Absent</span>
                </div>
              </div>

              <div className="attendance-item">
                <div className="attendance-dot late"></div>

                <div>
                  <strong>
                    {teamStats?.lateToday ?? 0}
                  </strong>
                  <span>Late</span>
                </div>
              </div>
            </div>

            <div className="attendance-progress">
              <div className="progress-label">
                <span>
                  Team Attendance
                </span>

                <strong>
                  {teamStats?.totalMembers
                    ? Math.round(
                        ((teamStats
                          ?.presentToday ||
                          0) /
                          teamStats.totalMembers) *
                          100
                      )
                    : 0}
                  %
                </strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      teamStats?.totalMembers
                        ? Math.min(
                            100,
                            ((teamStats
                              ?.presentToday ||
                              0) /
                              teamStats.totalMembers) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <button
              className="card-link"
              onClick={() =>
                handleMenuClick("attendance")
              }
            >
              View Team Attendance
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="dashboard-card approvals-card">
            <div className="card-header">
              <div>
                <h2>Pending Approvals</h2>

                <p>
                  Requests waiting for your
                  action.
                </p>
              </div>

              <ClipboardCheck size={21} />
            </div>

            <div className="approval-list">
              <div className="approval-row">
                <div className="approval-icon">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <strong>
                    Attendance Corrections
                  </strong>

                  <span>
                    {pendingApprovals
                      ?.corrections ?? 0}{" "}
                    requests
                  </span>
                </div>

                <ChevronRight size={16} />
              </div>

              <div className="approval-row">
                <div className="approval-icon">
                  <Clock3 size={18} />
                </div>

                <div>
                  <strong>
                    Overtime Requests
                  </strong>

                  <span>
                    {pendingApprovals
                      ?.overtime ?? 0}{" "}
                    requests
                  </span>
                </div>

                <ChevronRight size={16} />
              </div>
            </div>

            <div className="total-approval">
              <span>Total Pending</span>

              <strong>
                {pendingApprovals?.total ?? 0}
              </strong>
            </div>

            <button
              className="card-link"
              onClick={() =>
                handleMenuClick("approvals")
              }
            >
              Review Approvals
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="dashboard-card monthly-card">
          <div className="card-header">
            <div>
              <h2>
                Monthly Attendance Overview
              </h2>

              <p>
                Team attendance summary for
                this month.
              </p>
            </div>

            <BarChart3 size={21} />
          </div>

          <div className="monthly-grid">
            <div className="monthly-stat present-month">
              <span>Present</span>
              <strong>
                {monthlyStats?.present ?? 0}
              </strong>
            </div>

            <div className="monthly-stat absent-month">
              <span>Absent</span>
              <strong>
                {monthlyStats?.absent ?? 0}
              </strong>
            </div>

            <div className="monthly-stat half-month">
              <span>Half Day</span>
              <strong>
                {monthlyStats?.half ?? 0}
              </strong>
            </div>

            <div className="monthly-stat late-month">
              <span>Late</span>
              <strong>
                {monthlyStats?.late ?? 0}
              </strong>
            </div>
          </div>
        </div>

        <div className="dashboard-card team-preview-card">
          <div className="card-header team-header">
            <div>
              <h2>My Team</h2>
              <p>
                Employees reporting to you.
              </p>
            </div>

            <button
              className="outline-button"
              onClick={() =>
                handleMenuClick("team")
              }
            >
              View All
            </button>
          </div>

          <div className="team-table-wrapper">
            <table className="team-table">
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
                      <div className="employee-cell">
                        <div className="employee-avatar">
                          {renderInitials(
                            member?.name
                          )}
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
                      className="empty-cell"
                    >
                      No team members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const renderTeam = () => {
    return (
      <>
        <div className="page-heading">
          <div>
            <p className="eyebrow">
              TEAM MANAGEMENT
            </p>

            <h1>My Team</h1>

            <p className="page-subtitle">
              View and manage your team members.
            </p>
          </div>
        </div>

        <div className="dashboard-card full-card">
          <div className="table-toolbar">
            <div className="search-box">
              <Search size={18} />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search team members..."
              />
            </div>

            <div className="member-count">
              {filteredTeam.length} Members
            </div>
          </div>

          <div className="team-table-wrapper">
            <table className="team-table">
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
                      <div className="employee-cell">
                        <div className="employee-avatar">
                          {renderInitials(
                            member?.name
                          )}
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
                      className="empty-cell"
                    >
                      No employees match your
                      search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const renderAttendance = () => {
    return (
      <>
        <div className="page-heading">
          <div>
            <p className="eyebrow">
              ATTENDANCE
            </p>

            <h1>Team Attendance</h1>

            <p className="page-subtitle">
              Monitor today's team attendance.
            </p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon green">
              <UserCheck size={21} />
            </div>

            <div className="stat-content">
              <span>Present Today</span>
              <strong>
                {teamStats?.presentToday ?? 0}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon red">
              <UserX size={21} />
            </div>

            <div className="stat-content">
              <span>Absent Today</span>
              <strong>
                {teamStats?.absentToday ?? 0}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <Clock3 size={21} />
            </div>

            <div className="stat-content">
              <span>Late Today</span>
              <strong>
                {teamStats?.lateToday ?? 0}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              <Users size={21} />
            </div>

            <div className="stat-content">
              <span>Active Members</span>
              <strong>
                {teamStats?.activeMembers ?? 0}
              </strong>
            </div>
          </div>
        </div>

        <div className="dashboard-card full-card">
          <div className="card-header">
            <div>
              <h2>Attendance Summary</h2>
              <p>
                Current attendance statistics.
              </p>
            </div>

            <CalendarCheck size={21} />
          </div>

          <div className="attendance-large-grid">
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
        </div>
      </>
    );
  };

  const renderApprovals = () => {
    return (
      <>
        <div className="page-heading">
          <div>
            <p className="eyebrow">
              APPROVAL CENTER
            </p>

            <h1>Pending Approvals</h1>

            <p className="page-subtitle">
              Review requests waiting for
              manager action.
            </p>
          </div>
        </div>

        <div className="approval-page-grid">
          <div className="approval-page-card">
            <div className="approval-page-icon">
              <CalendarDays size={23} />
            </div>

            <div>
              <span>
                Attendance Corrections
              </span>

              <strong>
                {pendingApprovals
                  ?.corrections ?? 0}
              </strong>

              <p>
                Attendance correction requests
              </p>
            </div>
          </div>

          <div className="approval-page-card">
            <div className="approval-page-icon">
              <Clock3 size={23} />
            </div>

            <div>
              <span>
                Overtime Requests
              </span>

              <strong>
                {pendingApprovals
                  ?.overtime ?? 0}
              </strong>

              <p>
                Overtime approval requests
              </p>
            </div>
          </div>

          <div className="approval-page-card total">
            <div className="approval-page-icon">
              <CheckCircle2 size={23} />
            </div>

            <div>
              <span>Total Pending</span>

              <strong>
                {pendingApprovals?.total ?? 0}
              </strong>

              <p>
                Total requests requiring
                attention
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderProfile = () => {
    return (
      <>
        <div className="page-heading">
          <div>
            <p className="eyebrow">
              MY PROFILE
            </p>

            <h1>Manager Profile</h1>

            <p className="page-subtitle">
              Your manager account information.
            </p>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-top">
            <div className="large-avatar">
              {renderInitials(manager?.name)}
            </div>

            <div>
              <h2>
                {manager?.name || "Manager"}
              </h2>

              <p>Manager / HR</p>
            </div>
          </div>

          <div className="profile-details">
            <div>
              <span>Full Name</span>

              <strong>
                {manager?.name || "-"}
              </strong>
            </div>

            <div>
              <span>Employee Code</span>

              <strong>
                {manager?.employeeCode || "-"}
              </strong>
            </div>

            <div>
              <span>Manager ID</span>

              <strong>
                {manager?.id || "-"}
              </strong>
            </div>

            <div>
              <span>Email</span>

              <strong>
                {manager?.email || "-"}
              </strong>
            </div>

            <div>
              <span>Department</span>

              <strong>
                {manager?.department || "-"}
              </strong>
            </div>

            <div>
              <span>Designation</span>

              <strong>
                {manager?.designation || "-"}
              </strong>
            </div>
          </div>
        </div>
      </>
    );
  };

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

    const maxValue = Math.max(
      present,
      absent,
      half,
      late,
      1
    );

    return (
      <>
        <div className="page-heading">
          <div>
            <p className="eyebrow">
              REPORTS
            </p>

            <h1>Team Reports</h1>

            <p className="page-subtitle">
              Team statistics and monthly
              attendance overview.
            </p>
          </div>
        </div>

        <div className="dashboard-card full-card">
          <div className="card-header">
            <div>
              <h2>
                Monthly Team Attendance
              </h2>

              <p>
                Current monthly statistics.
              </p>
            </div>

            <BarChart3 size={21} />
          </div>

          <div className="report-bars">
            <div className="report-row">
              <span>Present</span>

              <div className="report-track">
                <div
                  className="report-fill present-fill"
                  style={{
                    width: `${
                      (present / maxValue) *
                      100
                    }%`,
                  }}
                />
              </div>

              <strong>{present}</strong>
            </div>

            <div className="report-row">
              <span>Absent</span>

              <div className="report-track">
                <div
                  className="report-fill absent-fill"
                  style={{
                    width: `${
                      (absent / maxValue) *
                      100
                    }%`,
                  }}
                />
              </div>

              <strong>{absent}</strong>
            </div>

            <div className="report-row">
              <span>Half Day</span>

              <div className="report-track">
                <div
                  className="report-fill half-fill"
                  style={{
                    width: `${
                      (half / maxValue) *
                      100
                    }%`,
                  }}
                />
              </div>

              <strong>{half}</strong>
            </div>

            <div className="report-row">
              <span>Late</span>

              <div className="report-track">
                <div
                  className="report-fill late-fill"
                  style={{
                    width: `${
                      (late / maxValue) *
                      100
                    }%`,
                  }}
                />
              </div>

              <strong>{late}</strong>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderSettings = () => {
    return (
      <>
        <div className="page-heading">
          <div>
            <p className="eyebrow">
              SETTINGS
            </p>

            <h1>Settings</h1>

            <p className="page-subtitle">
              Manager dashboard settings.
            </p>
          </div>
        </div>

        <div className="dashboard-card settings-card">
          <div className="settings-row">
            <div className="settings-icon">
              <Settings size={20} />
            </div>

            <div>
              <h3>Account Settings</h3>

              <p>
                Manage your account preferences
                and dashboard settings.
              </p>
            </div>

            <ChevronRight size={18} />
          </div>

          <div className="settings-row">
            <div className="settings-icon">
              <Bell size={20} />
            </div>

            <div>
              <h3>Notifications</h3>

              <p>
                Configure your HRMS
                notifications.
              </p>
            </div>

            <ChevronRight size={18} />
          </div>
        </div>
      </>
    );
  };

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

  return (
    <div className="manager-layout">
      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      <aside
        className={`manager-sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="brand-logo">
            H
          </div>

          <div>
            <h2>HRMS</h2>
            <span>
              Management Portal
            </span>
          </div>

          <button
            className="mobile-close"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav className="sidebar-nav">
          <button
            className={
              activeMenu === "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              handleMenuClick("dashboard")
            }
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </button>

          <button
            className={
              activeMenu === "profile"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              handleMenuClick("profile")
            }
          >
            <UserCircle size={19} />
            <span>My Profile</span>
          </button>

          <button
            className={
              activeMenu === "team"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              handleMenuClick("team")
            }
          >
            <Users size={19} />
            <span>My Team</span>
          </button>

          <button
            className={
              activeMenu === "attendance"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              handleMenuClick(
                "attendance"
              )
            }
          >
            <CalendarDays size={19} />
            <span>Attendance</span>
          </button>

          <button
            className={
              activeMenu === "approvals"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              handleMenuClick(
                "approvals"
              )
            }
          >
            <ClipboardCheck size={19} />
            <span>Approvals</span>

            {Number(
              pendingApprovals?.total || 0
            ) > 0 && (
              <b className="nav-count">
                {pendingApprovals.total}
              </b>
            )}
          </button>

          <button
            className={
              activeMenu === "reports"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              handleMenuClick("reports")
            }
          >
            <BarChart3 size={19} />
            <span>Reports</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button
            className={
              activeMenu === "settings"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              handleMenuClick("settings")
            }
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <button
            className="nav-item logout-item"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="manager-main">
        <header className="manager-header">
          <button
            className="mobile-menu"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            <Menu size={22} />
          </button>

          <div className="header-spacer" />

          <button className="notification-button">
            <Bell size={20} />

            {Number(
              pendingApprovals?.total || 0
            ) > 0 && (
              <span className="notification-dot" />
            )}
          </button>

          <div className="header-profile">
            <div className="header-avatar">
              {renderInitials(
                manager?.name
              )}
            </div>

            <div className="header-profile-info">
              <strong>
                {manager?.name ||
                  "Manager"}
              </strong>

              <span>
                {manager?.employeeCode ||
                  "Manager"}
              </span>
            </div>
          </div>
        </header>

        <div className="manager-content">
          {loading && !dashboard ? (
            <div className="loading-screen">
              <div className="loader" />
              <p>
                Loading dashboard...
              </p>
            </div>
          ) : error && !dashboard ? (
            <div className="error-card">
              <div className="error-icon">
                <AlertCircle size={25} />
              </div>

              <h2>
                Unable to load dashboard
              </h2>

              <p>{error}</p>

              <button
                className="retry-button"
                onClick={fetchDashboard}
              >
                <RefreshCw size={17} />
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