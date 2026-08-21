import { useEffect, useMemo, useState } from "react";
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
  XCircle,
  CheckCircle2,
  CalendarCheck,
  Plus,
  Send,
  Loader2,
  Ban,
  ArrowLeft,
} from "lucide-react";
import EmployeeLeaves from "../employee/EmployeeLeaves";
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
const [teamAttendance, setTeamAttendance] = useState([]);
const [teamAttendanceLoading, setTeamAttendanceLoading] = useState(false);
const [teamAttendanceError, setTeamAttendanceError] = useState("");
const [attendanceHistory, setAttendanceHistory] = useState([]);
const [attendanceHistoryLoading, setAttendanceHistoryLoading] = useState(false);
const [attendanceHistoryError, setAttendanceHistoryError] = useState("");
const [attendanceSearch, setAttendanceSearch] = useState("");
const [attendanceDate, setAttendanceDate] = useState(
  new Date().toISOString().split("T")[0]
);
const [attendanceStatus, setAttendanceStatus] = useState("");
const [attendanceDepartment, setAttendanceDepartment] = useState("");
const [leaveTypes, setLeaveTypes] = useState([]);
const [leaveBalance, setLeaveBalance] = useState([]);
const [managerLeaves, setManagerLeaves] = useState([]);

const [leavesLoading, setLeavesLoading] = useState(false);
const [leavesError, setLeavesError] = useState("");
const [leavesSuccess, setLeavesSuccess] = useState("");

const [showApplyLeaveForm, setShowApplyLeaveForm] =
  useState(false);

const [leaveSubmitting, setLeaveSubmitting] =
  useState(false);

const [cancellingLeaveId, setCancellingLeaveId] =
  useState(null);

const [leaveFormData, setLeaveFormData] = useState({
  leave_type_id: "",
  start_date: "",
  end_date: "",
  reason: "",
});

/* =========================================================
   LEAVE APPROVALS
========================================================= */

const [leaveApprovals, setLeaveApprovals] = useState([]);
const [approvalsLoading, setLeaveApprovalsLoading] = useState(false);
const [approvalsError, setLeaveApprovalsError] = useState("");
const [approvalActionLoading, setLeaveApprovalActionLoading] = useState(null);
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
  const fetchAttendanceHistory = async () => {
  try {
    setAttendanceHistoryLoading(true);
    setAttendanceHistoryError("");

    const response = await api.get("/attendance/history");

    const historyData =
      response?.data?.attendance ||
      response?.data?.history ||
      response?.data ||
      [];

    setAttendanceHistory(
      Array.isArray(historyData) ? historyData : []
    );
  } catch (error) {
    console.error("Get attendance history error:", error);

    setAttendanceHistory([]);
    setAttendanceHistoryError(
      error?.response?.data?.message ||
      "Unable to load attendance history."
    );
  } finally {
    setAttendanceHistoryLoading(false);
  }
};
useEffect(() => {
  if (activeMenu === "myAttendance") {
    fetchAttendance();
    fetchAttendanceHistory();
  }
}, [activeMenu]);

  useEffect(() => {
    fetchDashboard();
    fetchAttendance();
    fetchAttendanceHistory();
  }, []);
  useEffect(() => {
  if (activeMenu === "attendance") {
    fetchTeamAttendance();
  }
}, [
  activeMenu,
  attendanceDate,
  attendanceStatus,
  attendanceDepartment
]);
useEffect(() => {
  if (activeMenu === "myLeaves") {
    fetchManagerLeaves();
  }
}, [activeMenu]);


useEffect(() => {
  if (activeMenu === "approvals") {
    fetchLeaveApprovals();
  }
}, [activeMenu]);
const managerLeaveTotalDays = useMemo(() => {
  const { start_date, end_date } = leaveFormData;

  if (!start_date || !end_date) {
    return 0;
  }

  const start = new Date(
    `${start_date}T00:00:00`
  );

  const end = new Date(
    `${end_date}T00:00:00`
  );

  if (end < start) {
    return 0;
  }

  const difference =
    end.getTime() - start.getTime();

  return (
    Math.floor(
      difference / (1000 * 60 * 60 * 24)
    ) + 1
  );
}, [
  leaveFormData.start_date,
  leaveFormData.end_date,
]);

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
   FETCH MANAGER LEAVE DATA
========================================================= */

const fetchManagerLeaves = async () => {
  try {
    setLeavesLoading(true);
    setLeavesError("");

    const [
      typesResponse,
      balanceResponse,
      requestsResponse,
    ] = await Promise.all([
      api.get("/leave/types"),
      api.get("/leave/balance"),

      // IMPORTANT:
      // ONLY LOGGED-IN MANAGER'S LEAVES
      api.get("/leave/requests?scope=mine"),
    ]);

    const typesData = Array.isArray(typesResponse)
      ? typesResponse
      : Array.isArray(typesResponse?.data)
      ? typesResponse.data
      : [];

    setLeaveTypes(typesData);

    const balanceData = balanceResponse?.data;

    const balanceRows = Array.isArray(balanceResponse)
      ? balanceResponse
      : Array.isArray(balanceData)
      ? balanceData
      : Array.isArray(balanceData?.leaveTypes)
      ? balanceData.leaveTypes
      : [];

    setLeaveBalance(balanceRows);

    const requestsData = Array.isArray(requestsResponse)
      ? requestsResponse
      : Array.isArray(requestsResponse?.data)
      ? requestsResponse.data
      : [];

    setManagerLeaves(requestsData);

  } catch (err) {
    console.error(
      "Manager leaves error:",
      err
    );

    setLeaveTypes([]);
    setLeaveBalance([]);
    setManagerLeaves([]);

    setLeavesError(
      err?.response?.data?.message ||
        err?.message ||
        "Unable to load your leave information."
    );
  } finally {
    setLeavesLoading(false);
  }
};
const handleManagerLeaveChange = (event) => {
  const { name, value } = event.target;

  setLeaveFormData((previous) => ({
    ...previous,
    [name]: value,
  }));

  setLeavesError("");
  setLeavesSuccess("");
};
const openManagerApplyLeave = () => {
  setShowApplyLeaveForm(true);
  setLeavesError("");
  setLeavesSuccess("");
};
const closeManagerApplyLeave = () => {
  setShowApplyLeaveForm(false);

  setLeaveFormData({
    leave_type_id: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  setLeavesError("");
};
const handleManagerApplyLeave = async (event) => {
  event.preventDefault();

  setLeavesError("");
  setLeavesSuccess("");

  if (!leaveFormData.leave_type_id) {
    setLeavesError("Please select a leave type.");
    return;
  }

  if (!leaveFormData.start_date) {
    setLeavesError("Please select a start date.");
    return;
  }

  if (!leaveFormData.end_date) {
    setLeavesError("Please select an end date.");
    return;
  }

  if (
    new Date(leaveFormData.end_date) <
    new Date(leaveFormData.start_date)
  ) {
    setLeavesError(
      "End date cannot be earlier than start date."
    );
    return;
  }

  if (managerLeaveTotalDays <= 0) {
    setLeavesError(
      "Please select valid leave dates."
    );
    return;
  }

  if (!leaveFormData.reason.trim()) {
    setLeavesError(
      "Please enter a reason for your leave."
    );
    return;
  }

  try {
    setLeaveSubmitting(true);

    const response = await api.post(
      "/leave/apply",
      {
        leave_type_id: Number(
          leaveFormData.leave_type_id
        ),
        start_date: leaveFormData.start_date,
        end_date: leaveFormData.end_date,
        total_days: managerLeaveTotalDays,
        reason: leaveFormData.reason.trim(),
      }
    );

    if (response?.success === false) {
      throw new Error(
        response?.message ||
          "Unable to submit leave request."
      );
    }

    setLeavesSuccess(
      response?.message ||
        "Leave request submitted successfully."
    );

    setShowApplyLeaveForm(false);

    setLeaveFormData({
      leave_type_id: "",
      start_date: "",
      end_date: "",
      reason: "",
    });

    await fetchManagerLeaves();

  } catch (err) {
    console.error(
      "Manager apply leave error:",
      err
    );

    setLeavesError(
      err?.response?.data?.message ||
        err?.message ||
        "Unable to submit leave request."
    );
  } finally {
    setLeaveSubmitting(false);
  }
};
const handleManagerCancelLeave = async (leaveId) => {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this leave request?"
  );

  if (!confirmed) {
    return;
  }

  try {
    setCancellingLeaveId(leaveId);
    setLeavesError("");
    setLeavesSuccess("");

    const response = await api.put(
      `/leave/requests/${leaveId}/cancel`,
      {
        remarks: "Cancelled by manager",
      }
    );

    if (response?.success === false) {
      throw new Error(
        response?.message ||
          "Unable to cancel leave request."
      );
    }

    setLeavesSuccess(
      response?.message ||
        "Leave request cancelled successfully."
    );

    await fetchManagerLeaves();

  } catch (err) {
    console.error(
      "Manager cancel leave error:",
      err
    );

    setLeavesError(
      err?.response?.data?.message ||
        err?.message ||
        "Unable to cancel leave request."
    );
  } finally {
    setCancellingLeaveId(null);
  }
};

/* =========================================================
   HANDLE APPLY LEAVE FORM
========================================================= */

const handleLeaveFormChange = (e) => {
  const { name, value } = e.target;

  setLeaveForm((previous) => ({
    ...previous,
    [name]: value,
  }));
};


/* =========================================================
   APPLY LEAVE
========================================================= */

const handleApplyLeave = async (e) => {
  e.preventDefault();

  if (
    !leaveForm.leaveTypeId ||
    !leaveForm.startDate ||
    !leaveForm.endDate ||
    !leaveForm.reason.trim()
  ) {
    setLeavesError("Please fill in all leave fields.");
    return;
  }

  if (
    new Date(leaveForm.endDate) <
    new Date(leaveForm.startDate)
  ) {
    setLeavesError(
      "End date cannot be earlier than the start date."
    );
    return;
  }

  try {
    setLeaveSubmitting(true);
    setLeavesError("");

    const response = await api.post(
      "/leave/apply",
      {
        leaveTypeId: leaveForm.leaveTypeId,
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        reason: leaveForm.reason.trim(),
      }
    );

    if (response?.success) {
      setLeaveForm({
        leaveTypeId: "",
        startDate: "",
        endDate: "",
        reason: "",
      });

      setShowApplyLeaveForm(false);

      await fetchManagerLeaves();
    } else {
      setLeavesError(
        response?.message || "Unable to apply for leave."
      );
    }
  } catch (error) {
    console.error("Apply leave error:", error);

    setLeavesError(
      error?.response?.data?.message ||
        "Unable to apply for leave."
    );
  } finally {
    setLeaveSubmitting(false);
  }
};


/* =========================================================
   CANCEL LEAVE
========================================================= */

const handleCancelLeave = async (leaveId) => {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this leave request?"
  );

  if (!confirmed) return;

  try {
    const response = await api.put(
      `/leave/requests/${leaveId}/cancel`
    );

    if (response?.success) {
      await fetchManagerLeaves();
    } else {
      setLeavesError(
        response?.message ||
          "Unable to cancel leave request."
      );
    }
  } catch (error) {
    console.error("Cancel leave error:", error);

    setLeavesError(
      error?.response?.data?.message ||
        "Unable to cancel leave request."
    );
  }
};


/* =========================================================
   FETCH LEAVE APPROVALS
========================================================= */

const fetchLeaveApprovals = async () => {
  try {
    setLeaveApprovalsLoading(true);
    setLeaveApprovalsError("");

    const response = await api.get(
      "/leave/requests?scope=team"
    );

    console.log("Leave approvals response:", response);

    if (response?.success) {
      const data = response?.data;

      setLeaveApprovals(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.requests)
          ? data.requests
          : []
      );
    } else {
      setLeaveApprovals([]);
      setLeaveApprovalsError(
        response?.message || "Unable to load leave approvals."
      );
    }
  } catch (error) {
    console.error("Leave approvals error:", error);

    setLeaveApprovals([]);

    setLeaveApprovalsError(
      error?.response?.data?.message ||
      error?.response?.data?.detail ||
      error?.message ||
      "Unable to load leave approvals."
    );
  } finally {
    setLeaveApprovalsLoading(false);
  }
};

/* =========================================================
   APPROVE LEAVE
========================================================= */

const handleApproveLeave = async (leaveId) => {
  try {
    const response = await api.put(
      `/leave/requests/${leaveId}/approve`,
      {
        remarks: ""
      }
    );

    if (response?.success) {
      await fetchLeaveApprovals();
    } else {
      alert(response?.message || "Unable to approve leave.");
    }
  } catch (error) {
    console.error("Approve leave error:", error);

    alert(
      error?.response?.data?.message ||
      "Unable to approve leave."
    );
  }
};

/* =========================================================
   REJECT LEAVE
========================================================= */

const handleRejectLeave = async (leaveId) => {
  const remarks = window.prompt(
    "Enter rejection reason:"
  );

  if (remarks === null) return;

  try {
    const response = await api.put(
      `/leave/requests/${leaveId}/reject`,
      {
        remarks
      }
    );

    if (response?.success) {
      await fetchLeaveApprovals();
    } else {
      alert(response?.message || "Unable to reject leave.");
    }
  } catch (error) {
    console.error("Reject leave error:", error);

    alert(
      error?.response?.data?.message ||
      "Unable to reject leave."
    );
  }
};
const getLeaveStatusClass = (status) => {
  const value = String(status || "")
    .toLowerCase();

  if (value === "approved") {
    return "leave-status-approved";
  }

  if (value === "rejected") {
    return "leave-status-rejected";
  }

  if (value === "cancelled") {
    return "leave-status-cancelled";
  }

  return "leave-status-pending";
};

/* =========================================================
   DATE FORMATTER
========================================================= */

const formatLeaveDate = (dateValue) => {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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
const renderMyAttendance = () => {
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <h1>My Attendance</h1>
          <p>View your daily attendance and attendance history.</p>
        </div>

        <button
          type="button"
          className="admin-panel-link"
          onClick={() => {
            fetchAttendance();
            fetchAttendanceHistory();
          }}
          disabled={
            attendanceLoading || attendanceHistoryLoading
          }
        >
          <RefreshCw
            size={17}
            className={
              attendanceLoading || attendanceHistoryLoading
                ? "spin"
                : ""
            }
          />
          Refresh
        </button>
      </div>

      {/* TODAY'S ATTENDANCE */}
      {renderAttendanceCard()}

      {/* ATTENDANCE HISTORY */}
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Attendance History</h2>
            <p>Your previous attendance records.</p>
          </div>
        </div>

        {attendanceHistoryError && (
          <div className="attendance-error-message">
            {attendanceHistoryError}
          </div>
        )}

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {attendanceHistoryLoading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="admin-empty-state"
                  >
                    Loading attendance history...
                  </td>
                </tr>
              ) : attendanceHistory.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="admin-empty-state"
                  >
                    No attendance history found.
                  </td>
                </tr>
              ) : (
                attendanceHistory.map((record, index) => {
                  const date =
                    record.date ||
                    record.attendance_date ||
                    record.attendanceDate ||
                    "-";

                  const checkIn =
                    record.check_in ||
                    record.checkIn;

                  const checkOut =
                    record.check_out ||
                    record.checkOut;

                  const workingHours =
                    record.working_hours ||
                    record.workingHours ||
                    0;

                  const status =
                    record.status || "Absent";

                  return (
                    <tr
                      key={
                        record.id ||
                        record.attendance_id ||
                        `${date}-${index}`
                      }
                    >
                      <td>{date}</td>

                      <td>
                        {checkIn
                          ? formatTime(checkIn)
                          : "--:--"}
                      </td>

                      <td>
                        {checkOut
                          ? formatTime(checkOut)
                          : "--:--"}
                      </td>

                      <td>
                        {formatWorkingHours(workingHours)}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
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
  const fetchTeamAttendance = async () => {
  try {
    setTeamAttendanceLoading(true);
    setTeamAttendanceError("");

    const params = new URLSearchParams();

    if (attendanceDate) {
      params.append("date", attendanceDate);
    }

    if (attendanceStatus) {
      params.append("status", attendanceStatus);
    }

    if (attendanceDepartment) {
      params.append("department", attendanceDepartment);
    }

    const queryString = params.toString();

    const response = await api.get(
      `/attendance/reports/daily${
        queryString ? `?${queryString}` : ""
      }`
    );

    if (response?.success) {
      const data = response?.data;

      setTeamAttendance(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.attendance)
          ? data.attendance
          : Array.isArray(data?.records)
          ? data.records
          : []
      );
    } else {
      setTeamAttendance([]);
      setTeamAttendanceError(
        response?.message || "Unable to load team attendance."
      );
    }
  } catch (error) {
    console.error("Team attendance error:", error);

    setTeamAttendance([]);

    setTeamAttendanceError(
      error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Unable to load team attendance."
    );
  } finally {
    setTeamAttendanceLoading(false);
  }
};
  /* =========================================================
     ATTENDANCE PAGE
  ========================================================= */
  const renderAttendance = () => {
  const filteredAttendance = teamAttendance.filter((record) => {
    const searchValue = attendanceSearch.toLowerCase();

    const employeeName = String(
      record.employee_name ||
        record.employeeName ||
        record.name ||
        ""
    ).toLowerCase();

    const employeeId = String(
      record.employee_code ||
        record.employeeCode ||
        record.employee_id ||
        record.employeeId ||
        ""
    ).toLowerCase();

    return (
      employeeName.includes(searchValue) ||
      employeeId.includes(searchValue)
    );
  });

  return (
    <>
      <div className="admin-page-heading">
        <div>
          <h1>Team Attendance</h1>
          <p>Monitor attendance of employees reporting to you.</p>
        </div>

        <button
          type="button"
          className="admin-panel-link"
          onClick={fetchTeamAttendance}
          disabled={teamAttendanceLoading}
        >
          <RefreshCw
            size={17}
            className={teamAttendanceLoading ? "spin" : ""}
          />
          Refresh
        </button>
      </div>

      <section className="admin-panel">
        <div className="admin-table-toolbar">
          {/* SEARCH */}
          <div className="admin-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search employee name or ID..."
              value={attendanceSearch}
              onChange={(e) =>
                setAttendanceSearch(e.target.value)
              }
            />
          </div>

          {/* FILTERS */}
          <div className="manager-attendance-filters">
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) =>
                setAttendanceDate(e.target.value)
              }
            />

            <select
              value={attendanceStatus}
              onChange={(e) =>
                setAttendanceStatus(e.target.value)
              }
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half-day">Half Day</option>
            </select>

            <select
              value={attendanceDepartment}
              onChange={(e) =>
                setAttendanceDepartment(e.target.value)
              }
            >
              <option value="">All Departments</option>

              <option value="Engineering">
                Engineering
              </option>

              <option value="HR">HR</option>

              <option value="Sales">Sales</option>

              <option value="Finance">Finance</option>
            </select>
          </div>
        </div>

        {teamAttendanceError && (
          <div className="manager-attendance-error">
            <AlertCircle size={17} />
            <span>{teamAttendanceError}</span>
          </div>
        )}

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {teamAttendanceLoading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="admin-empty-state"
                  >
                    Loading team attendance...
                  </td>
                </tr>
              ) : filteredAttendance.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="admin-empty-state"
                  >
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((record, index) => {
                  const employeeName =
                    record.employee_name ||
                    record.employeeName ||
                    record.name ||
                    "Unknown";

                  const employeeId =
                    record.employee_id ||
                    record.employeeId ||
                    record.employee_code ||
                    record.employeeCode ||
                    "-";

                  const date =
                    record.date ||
                    record.attendance_date ||
                    attendanceDate ||
                    "-";

                  const checkIn =
                    record.check_in ||
                    record.checkIn ||
                    null;

                  const checkOut =
                    record.check_out ||
                    record.checkOut ||
                    null;

                  const workingHours =
                    record.working_hours ||
                    record.workingHours ||
                    0;

                  const status =
                    record.status || "Absent";

                  return (
                    <tr
                      key={
                        record.id ||
                        record.attendance_id ||
                        `${employeeId}-${index}`
                      }
                    >
                      <td>{date}</td>

                      <td>{employeeId}</td>

                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-user-avatar">
                            {renderInitials(employeeName)}
                          </div>

                          <span>{employeeName}</span>
                        </div>
                      </td>

                      <td>
                        {checkIn
                          ? formatTime(checkIn)
                          : "--:--"}
                      </td>

                      <td>
                        {checkOut
                          ? formatTime(checkOut)
                          : "--:--"}
                      </td>

                      <td>
                        {formatWorkingHours(
                          workingHours
                        )}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};
/* =========================================================
   LEAVE APPROVALS
========================================================= */

const renderLeaveApprovals = () => {
  return (
    <div className="admin-dashboard-content admin-leaves-page">
      {/* HEADER */}
      <div className="admin-leaves-header">
        <div>
          <h1>Leave Approvals</h1>
          <p>Review and manage leave requests from your team.</p>
        </div>

        <button
          type="button"
          className="admin-leaves-refresh-btn"
          onClick={fetchLeaveApprovals}
          disabled={approvalsLoading}
        >
          <RefreshCw
            size={17}
            className={approvalsLoading ? "spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {approvalsError && (
        <div className="admin-leave-message admin-leave-error">
          <AlertCircle size={18} />
          <span>{approvalsError}</span>
        </div>
      )}

      {/* LEAVE REQUESTS */}
      <section className="admin-leaves-section">
        <div className="admin-leaves-section-header">
          <div>
            <h2>Leave Requests</h2>
            <p>Leave applications submitted by your team members.</p>
          </div>
        </div>

        {approvalsLoading ? (
          <div className="admin-leaves-loading">
            <RefreshCw size={20} className="spin" />
            <span>Loading leave requests...</span>
          </div>
        ) : leaveApprovals.length === 0 ? (
          <div className="admin-leaves-empty">
            <CalendarDays size={38} />
            <h3>No Leave Requests</h3>
            <p>No leave requests from your team were found.</p>
          </div>
        ) : (
          <div className="admin-leaves-table-wrapper">
            <table className="admin-leaves-table">
              <thead>
                <tr>
                  <th>Leave ID</th>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>No. of Days</th>
                  <th>Reason</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {leaveApprovals.map((leave) => {
                  const leaveId =
                    leave.id ||
                    leave.leave_id ||
                    leave.leaveId;

                  const status = String(
                    leave.status || "pending"
                  );

                  const normalizedStatus =
                    status.toLowerCase();

                  const isPending =
                    normalizedStatus === "pending";

                  const employeeName =
  `${leave.employee_first_name || ""} ${
    leave.employee_last_name || ""
  }`.trim() ||
  leave.employee_name ||
  "-";

                  const employeeCode =
                    leave.employee_code ||
                    leave.employeeCode ||
                    leave.employee_id ||
                    leave.employee?.employee_id ||
                    "";

                  const leaveType =
                    leave.leave_type_name ||
                    leave.leaveTypeName ||
                    leave.leave_type ||
                    leave.leaveType ||
                    leave.leave_type?.name ||
                    "—";

                  const startDate =
                    leave.start_date ||
                    leave.startDate;

                  const endDate =
                    leave.end_date ||
                    leave.endDate;

                  const numberOfDays =
                    leave.number_of_days ||
                    leave.total_days ||
                    leave.no_of_days ||
                    leave.days ||
                    "—";

                  const appliedDate =
                    leave.applied_date ||
                    leave.appliedAt ||
                    leave.created_at ||
                    leave.createdAt;

                  return (
                    <tr key={leaveId}>
                      {/* LEAVE ID */}
                      <td className="admin-leave-id">
                        #{leaveId}
                      </td>

                      {/* EMPLOYEE */}
                      <td>
                        <div className="admin-leave-employee">
                          <div className="admin-leave-employee-avatar">
                            {renderInitials(employeeName)}
                          </div>

                          <div>
                            <strong>{employeeName}</strong>

                            {employeeCode && (
                              <span>{employeeCode}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* LEAVE TYPE */}
                      <td className="admin-leave-type">
                        {leaveType}
                      </td>

                      {/* START DATE */}
                      <td>
                        {formatLeaveDate(startDate)}
                      </td>

                      {/* END DATE */}
                      <td>
                        {formatLeaveDate(endDate)}
                      </td>

                      {/* NUMBER OF DAYS */}
                      <td>{numberOfDays}</td>

                      {/* REASON */}
                      <td className="admin-leave-reason">
                        {leave.reason || "—"}
                      </td>

                      {/* APPLIED DATE */}
                      <td>
                        {formatLeaveDate(appliedDate)}
                      </td>

                      {/* STATUS */}
                      <td>
                        <span
                          className={`admin-leave-status ${normalizedStatus}`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td>
                        {isPending ? (
                          <div className="admin-leave-actions">
                            <button
                              type="button"
                              className="admin-leave-approve-btn"
                              onClick={() =>
                                handleApproveLeave(leaveId)
                              }
                              disabled={
                                approvalActionLoading !== null
                              }
                            >
                              <CheckCircle2 size={16} />

                              {approvalActionLoading ===
                              `approve-${leaveId}`
                                ? "Approving..."
                                : "Approve"}
                            </button>

                            <button
                              type="button"
                              className="admin-leave-reject-btn"
                              onClick={() =>
                                handleRejectLeave(leaveId)
                              }
                              disabled={
                                approvalActionLoading !== null
                              }
                            >
                              <XCircle size={16} />

                              {approvalActionLoading ===
                              `reject-${leaveId}`
                                ? "Rejecting..."
                                : "Reject"}
                            </button>
                          </div>
                        ) : (
                          <span className="admin-leave-action-complete">
                            {normalizedStatus === "approved"
                              ? "Approved"
                              : normalizedStatus === "rejected"
                              ? "Rejected"
                              : "No Action"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
const renderMyLeaves = () => {
  return (
    <>
      {showApplyLeaveForm ? (
        <>
          <div className="page-heading">
            <div>
              <p className="eyebrow">
                LEAVE MANAGEMENT
              </p>

              <h1>Apply Leave</h1>

              <p className="page-subtitle">
                Submit your leave request.
              </p>
            </div>

            <button
              type="button"
              className="employee-leave-back-button"
              onClick={closeManagerApplyLeave}
              disabled={leaveSubmitting}
            >
              <ArrowLeft size={18} />
              Back to My Leaves
            </button>
          </div>

          {leavesError && (
            <div className="employee-leave-message employee-leave-error">
              <AlertCircle size={19} />
              <span>{leavesError}</span>
            </div>
          )}

          <section className="employee-apply-leave-card">
            <div className="employee-apply-leave-card-header">
              <div className="employee-leave-form-icon">
                <CalendarDays size={22} />
              </div>

              <div>
                <h2>Leave Request Details</h2>
                <p>
                  Fill in the required details.
                </p>
              </div>
            </div>

            <form
              className="employee-apply-leave-form"
              onSubmit={handleManagerApplyLeave}
            >
              <div className="employee-leave-form-grid">

                <div className="employee-leave-form-group">
                  <label>
                    Leave Type <span>*</span>
                  </label>

                  <select
                    name="leave_type_id"
                    value={
                      leaveFormData.leave_type_id
                    }
                    onChange={
                      handleManagerLeaveChange
                    }
                    required
                  >
                    <option value="">
                      Select Leave Type
                    </option>

                    {leaveTypes.map((type) => (
                      <option
                        key={type.id}
                        value={type.id}
                      >
                        {type.name}
                        {type.code
                          ? ` (${type.code})`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="employee-leave-form-group">
                  <label>Total Days</label>

                  <input
                    type="number"
                    value={
                      managerLeaveTotalDays || ""
                    }
                    placeholder="Auto calculated"
                    readOnly
                  />
                </div>

                <div className="employee-leave-form-group">
                  <label>
                    Start Date <span>*</span>
                  </label>

                  <input
                    type="date"
                    name="start_date"
                    value={
                      leaveFormData.start_date
                    }
                    onChange={
                      handleManagerLeaveChange
                    }
                    required
                  />
                </div>

                <div className="employee-leave-form-group">
                  <label>
                    End Date <span>*</span>
                  </label>

                  <input
                    type="date"
                    name="end_date"
                    value={
                      leaveFormData.end_date
                    }
                    onChange={
                      handleManagerLeaveChange
                    }
                    min={
                      leaveFormData.start_date ||
                      undefined
                    }
                    required
                  />
                </div>

                <div className="employee-leave-form-group employee-leave-form-full">
                  <label>
                    Reason <span>*</span>
                  </label>

                  <textarea
                    name="reason"
                    rows="5"
                    value={leaveFormData.reason}
                    onChange={
                      handleManagerLeaveChange
                    }
                    placeholder="Enter the reason for your leave"
                    required
                  />
                </div>
              </div>

              <div className="employee-leave-form-actions">
                <button
                  type="button"
                  className="employee-leave-cancel-button"
                  onClick={closeManagerApplyLeave}
                  disabled={leaveSubmitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="employee-leave-submit-button"
                  disabled={leaveSubmitting}
                >
                  {leaveSubmitting ? (
                    <>
                      <Loader2
                        size={18}
                        className="employee-leave-spinner"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </>
      ) : (
        <>
          <div className="page-heading">
            <div>
              <p className="eyebrow">
                LEAVE MANAGEMENT
              </p>

              <h1>My Leaves</h1>

              <p className="page-subtitle">
                View your leave balance and manage
                your leave requests.
              </p>
            </div>

            <div className="manager-leave-header-actions">
              <button
                type="button"
                className="admin-panel-link"
                onClick={fetchManagerLeaves}
                disabled={leavesLoading}
              >
                <RefreshCw
                  size={17}
                  className={
                    leavesLoading ? "spin" : ""
                  }
                />
                Refresh
              </button>

              <button
                type="button"
                className="employee-apply-leave-button"
                onClick={openManagerApplyLeave}
              >
                <Plus size={18} />
                Apply Leave
              </button>
            </div>
          </div>

          {leavesSuccess && (
            <div className="employee-leave-message employee-leave-success">
              <CheckCircle2 size={19} />
              <span>{leavesSuccess}</span>

              <button
                type="button"
                onClick={() =>
                  setLeavesSuccess("")
                }
              >
                <X size={17} />
              </button>
            </div>
          )}

          {leavesError && (
            <div className="employee-leave-message employee-leave-error">
              <AlertCircle size={19} />
              <span>{leavesError}</span>

              <button
                type="button"
                onClick={() =>
                  setLeavesError("")
                }
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* MY LEAVE BALANCE */}

          <section className="dashboard-card full-card employee-leave-section">
            <div className="card-header">
              <div>
                <h2>My Leave Balance</h2>

                <p>
                  Your available leave balance.
                </p>
              </div>
            </div>

            {leavesLoading ? (
              <div className="employee-leave-loading">
                <Loader2
                  size={24}
                  className="employee-leave-spinner"
                />
                Loading leave balance...
              </div>
            ) : leaveBalance.length === 0 ? (
              <div className="employee-leave-empty">
                No leave balance information available.
              </div>
            ) : (
              <div className="employee-leave-table-wrapper">
                <table className="employee-leave-table">
                  <thead>
                    <tr>
                      <th>Leave Type</th>
                      <th>Opening</th>
                      <th>Earned</th>
                      <th>Used</th>
                      <th>Available</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leaveBalance.map((balance) => (
                      <tr
                        key={
                          balance.leave_type_id ||
                          balance.leave_type_name
                        }
                      >
                        <td>
                          {balance.leave_type_name ||
                            "-"}
                        </td>

                        <td>
                          {balance.opening_balance ?? 0}
                        </td>

                        <td>
                          {balance.earned_balance ?? 0}
                        </td>

                        <td>
                          {balance.used_balance ?? 0}
                        </td>

                        <td className="employee-leave-available">
                          {balance.closing_balance ?? 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* MY LEAVE REQUESTS */}

          <section className="dashboard-card full-card employee-leave-section">
            <div className="card-header">
              <div>
                <h2>My Leave Requests</h2>

                <p>
                  Your submitted leave applications.
                </p>
              </div>
            </div>

            {leavesLoading ? (
              <div className="employee-leave-loading">
                <Loader2
                  size={24}
                  className="employee-leave-spinner"
                />
                Loading leave requests...
              </div>
            ) : managerLeaves.length === 0 ? (
              <div className="employee-leave-empty">
                You have not submitted any leave
                requests yet.
              </div>
            ) : (
              <div className="employee-leave-table-wrapper">
                <table className="employee-leave-table employee-leave-requests-table">
                  <thead>
                    <tr>
                      <th>Leave ID</th>
                      <th>Leave Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Days</th>
                      <th>Reason</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {managerLeaves.map((request) => (
                      <tr key={request.id}>
                        <td>#{request.id}</td>

                        <td>
                          {request.leave_type_name ||
                            "-"}
                        </td>

                        <td>
                          {formatLeaveDate(
                            request.start_date
                          )}
                        </td>

                        <td>
                          {formatLeaveDate(
                            request.end_date
                          )}
                        </td>

                        <td>
                          {request.total_days ?? "-"}
                        </td>

                        <td className="employee-leave-reason">
                          {request.reason || "-"}
                        </td>

                        <td>
                          {formatLeaveDate(
                            request.applied_date
                          )}
                        </td>

                        <td>
                          <span
                            className={`employee-leave-status ${getLeaveStatusClass(
                              request.status
                            )}`}
                          >
                            {request.status ||
                              "Pending"}
                          </span>
                        </td>

                        <td>
                          {String(
                            request.status || ""
                          ).toLowerCase() ===
                          "pending" ? (
                            <button
                              type="button"
                              className="employee-leave-cancel-request-button"
                              onClick={() =>
                                handleManagerCancelLeave(
                                  request.id
                                )
                              }
                              disabled={
                                cancellingLeaveId ===
                                request.id
                              }
                            >
                              {cancellingLeaveId ===
                              request.id ? (
                                <>
                                  <Loader2
                                    size={15}
                                    className="employee-leave-spinner"
                                  />
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <Ban size={15} />
                                  Cancel
                                </>
                              )}
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
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
    if (activeMenu === "myAttendance") {
    return renderMyAttendance();
  }

    if (activeMenu === "attendance") {
      return renderAttendance();
    }
    if (activeMenu === "myLeaves") {
      return renderMyLeaves();
    }
    if (activeMenu === "leaveApprovals") {
      return renderLeaveApprovals();
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