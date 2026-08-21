import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  CircleCheck,
  CircleX,
  AlertCircle,
  FilePenLine,
  ChevronDown,
  Loader2,
} from "lucide-react";
import EmployeeHeader from "../../components/employee/EmployeeHeader";
import EmployeeSidebar from "../../components/employee/EmployeeSidebar";
import StatCard from "../../components/admin/StatCard";
import { api } from "../../services/api";

function EmployeeAttendance({ onNavigate, onLogout }) {
  const getCurrentMonthValue = () => {
    const now = new Date();

    return `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
  };

  const [selectedMonth, setSelectedMonth] = useState(
    getCurrentMonthValue()
  );

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({
    presentDays: 0,
    absentDays: 0,
    halfDays: 0,
    lateArrivals: 0,
    totalWorkingHours: 0,
    attendancePercentage: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const selectedMonthDetails = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number);

    return {
      month,
      year,
      label: new Date(year, month - 1, 1).toLocaleDateString(
        "en-IN",
        {
          month: "long",
          year: "numeric",
        }
      ),
    };
  }, [selectedMonth]);

  const formatWorkingHours = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "0h 00m";
    }

    const hours = Number(value);

    if (Number.isNaN(hours)) {
      return value;
    }

    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    return `${wholeHours}h ${String(minutes).padStart(
      2,
      "0"
    )}m`;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "--";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "--";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateTimeValue) => {
    if (!dateTimeValue) return "--:--";
    const date = new Date(dateTimeValue);
    if (Number.isNaN(date.getTime())) return "--:--";
    
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata"
    });
  };

  const getMonthDateRange = (year, month) => {
    const firstDay = new Date(year, month - 1, 1);

    const lastDay = new Date(year, month, 0);

    const formatApiDate = (date) => {
      const localYear = date.getFullYear();
      const localMonth = String(
        date.getMonth() + 1
      ).padStart(2, "0");
      const localDay = String(date.getDate()).padStart(
        2,
        "0"
      );

      return `${localYear}-${localMonth}-${localDay}`;
    };

    return {
      fromDate: formatApiDate(firstDay),
      toDate: formatApiDate(lastDay),
    };
  };

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      setError("");

      const { month, year } = selectedMonthDetails;

      const { fromDate, toDate } = getMonthDateRange(
        year,
        month
      );

      const [monthlyResponse, historyResponse] =
        await Promise.all([
          api.get(
            `/attendance/monthly?month=${month}&year=${year}`
          ),
          api.get(
            `/attendance/history?fromDate=${fromDate}&toDate=${toDate}`
          ),
        ]);

      /*
        MONTHLY RESPONSE:
        {
          success: true,
          data: {
            presentDays,
            absentDays,
            halfDays,
            totalWorkingHours,
            lateArrivals,
            attendancePercentage
          }
        }
      */

      const monthlyData =
        monthlyResponse?.data || monthlyResponse || {};

      setMonthlyStats({
        presentDays: Number(monthlyData.presentDays || 0),
        absentDays: Number(monthlyData.absentDays || 0),
        halfDays: Number(monthlyData.halfDays || 0),
        lateArrivals: Number(monthlyData.lateArrivals || 0),
        totalWorkingHours: Number(monthlyData.totalWorkingHours || 0),
        attendancePercentage: Number(monthlyData.attendancePercentage || 0),
      });

      /*
        HISTORY RESPONSE:
        {
          success: true,
          data: [...]
        }
      */

      const historyData =
        historyResponse?.data || historyResponse || [];

      setAttendanceRecords(
        Array.isArray(historyData) ? historyData : []
      );
    } catch (err) {
      console.error("Failed to load attendance:", err);

      setError(
        err.message ||
          "Failed to load attendance information."
      );

      setAttendanceRecords([]);

      setMonthlyStats({
        presentDays: 0,
        absentDays: 0,
        halfDays: 0,
        lateArrivals: 0,
        totalWorkingHours: 0,
        attendancePercentage: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, [selectedMonth]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Present":
        return "attendance-status-present";

      case "Absent":
        return "attendance-status-absent";

      case "Half-Day":
        return "attendance-status-halfday";

      case "Checked In":
        return "attendance-status-checkedin";

      default:
        return "";
    }
  };

  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );

      const value = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const label = date.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      });

      options.push({
        value,
        label,
      });
    }

    return options;
  };

  const totalWorkingHoursDisplay = formatWorkingHours(monthlyStats.totalWorkingHours);

  return (
    <div className="admin-layout">
      <EmployeeSidebar
        activePage="attendance"
        onNavigate={handleNavigation}
        onLogout={onLogout}
      />
      <main className="admin-main">
        <EmployeeHeader onNavigate={handleNavigation} />
        <div className="employee-attendance-content">
          
          <div className="admin-dashboard-content employee-attendance-page">
            {/* PAGE HEADING */}

        <div className="admin-page-heading attendance-page-heading">
          <div>
            <h1>Attendance</h1>

            <p>
              Track and manage your attendance records.
            </p>
          </div>

          <button
            type="button"
            className="attendance-correction-button"
            onClick={() =>
              handleNavigation("employeeAttendanceCorrection")
            }
          >
            <FilePenLine size={17} />
            Request Correction
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="attendance-error-message">
            <CircleX size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* SUMMARY CARDS */}

        <section className="admin-stats-grid attendance-stats-grid">
          <StatCard
            title="Present Days"
            value={
              loading ? "..." : monthlyStats.presentDays
            }
            description="Days marked present"
            icon={<CircleCheck size={20} />}
          />

          <StatCard
            title="Absent Days"
            value={
              loading ? "..." : monthlyStats.absentDays
            }
            description="Days marked absent"
            icon={<CircleX size={20} />}
          />

          <StatCard
            title="Half Days"
            value={
              loading ? "..." : monthlyStats.halfDays
            }
            description="Half-day attendance"
            icon={<AlertCircle size={20} />}
          />

          <StatCard
            title="Late Days"
            value={
              loading ? "..." : monthlyStats.lateArrivals
            }
            description="Late check-ins"
            icon={<Clock3 size={20} />}
          />
        </section>

        {/* ATTENDANCE HISTORY */}

        <section className="admin-panel employee-attendance-panel">
          <div className="employee-attendance-panel-header">
            <div>
              <h2>Attendance History</h2>

              <p>
                View your daily attendance records.
              </p>
            </div>

            <div className="attendance-month-select-wrapper">
              <CalendarDays size={17} />

              <select
                value={selectedMonth}
                onChange={(event) =>
                  setSelectedMonth(event.target.value)
                }
                className="attendance-month-select"
              >
                {getMonthOptions().map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="attendance-select-arrow"
              />
            </div>
          </div>

          <div className="attendance-working-summary">
            <div>
              <span>Total Working Hours</span>

              <strong>
                {loading
                  ? "Loading..."
                  : totalWorkingHoursDisplay}
              </strong>
            </div>

            <p>
              {loading
                ? "Loading monthly attendance overview..."
                : `Monthly attendance overview for ${selectedMonthDetails.label}. Attendance: ${monthlyStats.attendancePercentage}%`}
            </p>
          </div>

          {/* TABLE */}

          <div className="employee-attendance-table-wrapper">
            <table className="employee-attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Working Hours</th>
                  <th>Status</th>
                  <th>Late</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="attendance-table-message"
                    >
                      <Loader2
                        size={20}
                        className="attendance-spinner"
                      />
                      Loading attendance records...
                    </td>
                  </tr>
                ) : attendanceRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="attendance-table-message"
                    >
                      No attendance records found for{" "}
                      {selectedMonthDetails.label}.
                    </td>
                  </tr>
                ) : (
                  attendanceRecords.map((record, index) => (
                    <tr
                      key={
                        record.id ||
                        `${record.attendance_date}-${index}`
                      }
                    >
                      <td className="attendance-date-cell">
                        {formatDate(record.attendance_date)}
                      </td>

                      <td>
                        {formatTime(record.check_in)}
                      </td>

                      <td>
                        {formatTime(record.check_out)}
                      </td>

                      <td>
                        {formatWorkingHours(
                          record.working_hours
                        )}
                      </td>

                      <td>
                        <span
                          className={`attendance-status-badge ${getStatusClass(
                            record.status
                          )}`}
                        >
                          {record.status || "--"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            record.is_late
                              ? "attendance-late-yes"
                              : "attendance-late-no"
                          }
                        >
                          {record.is_late ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      </div>
      </main>
    </div>
  );
}

export default EmployeeAttendance;