import { useEffect, useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  Eye,
  Pencil,
  X,
  Save,
  RefreshCw,
} from "lucide-react";
import { api } from "../../services/api";
import "../../App.css";

function Attendance({ onBack }) {
  const getToday = () => {
    const d = new Date();

    return `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  const [selectedDate, setSelectedDate] =
    useState(getToday());

  const [attendance, setAttendance] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [viewRecord, setViewRecord] =
    useState(null);

  const [editRecord, setEditRecord] =
    useState(null);

  const [editForm, setEditForm] = useState({
    check_in: "",
    check_out: "",
    status: "Present",
    reason: "",
  });

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/attendance/daily?date=${selectedDate}`
      );

      if (response?.success) {
        const rows = Array.isArray(response.data)
          ? response.data
          : response.data
          ? [response.data]
          : [];

        setAttendance(rows);
      } else {
        setAttendance([]);

        setError(
          response?.message ||
            "Failed to load attendance"
        );
      }
    } catch (err) {
      console.error(
        "Attendance API Error:",
        err
      );

      setAttendance([]);

      setError(
        err?.message ||
          "Unable to load attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [selectedDate]);

  const getEmployeeName = (record) => {
    const first =
      record?.firstName ||
      record?.first_name ||
      "";

    const last =
      record?.lastName ||
      record?.last_name ||
      "";

    const fullName =
      `${first} ${last}`.trim();

    if (fullName) {
      return fullName;
    }

    return (
      record?.employee_name ||
      record?.name ||
      record?.full_name ||
      "Unknown Employee"
    );
  };

  const getEmployeeId = (record) => {
    return (
      record?.employeeCode ||
      record?.employee_code ||
      record?.employee_id ||
      record?.emp_id ||
      record?.id ||
      "--"
    );
  };

  const getInitials = (record) => {
    const name =
      getEmployeeName(record);

    if (
      !name ||
      name === "Unknown Employee"
    ) {
      return "E";
    }

    const parts = name
      .split(" ")
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      parts[0][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();
  };

  const formatTime = (value) => {
    if (!value) {
      return "--";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatHours = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "--";
    }

    const hours = Number(value);

    if (Number.isNaN(hours)) {
      return "--";
    }

    const wholeHours =
      Math.floor(hours);

    const minutes = Math.round(
      (hours - wholeHours) * 60
    );

    if (
      wholeHours === 0 &&
      minutes === 0
    ) {
      return "0h";
    }

    return `${wholeHours}h ${minutes}m`;
  };

  const getStatus = (record) => {
    if (!record?.attendance_id) {
      return "Absent";
    }

    if (
      record?.is_late === true ||
      record?.is_late === "true"
    ) {
      return "Late";
    }

    const status = String(
      record?.status || ""
    ).toLowerCase();

    if (status.includes("absent")) {
      return "Absent";
    }

    if (status.includes("late")) {
      return "Late";
    }

    if (status.includes("half")) {
      return "Half Day";
    }

    if (status.includes("present")) {
      return "Present";
    }

    return "Present";
  };

  const departments = useMemo(() => {
    const list = attendance
      .map(
        (record) =>
          record?.department_name
      )
      .filter(Boolean);

    return [
      "All",
      ...new Set(list),
    ];
  }, [attendance]);

  const filteredAttendance =
    useMemo(() => {
      const searchText =
        search.trim().toLowerCase();

      return attendance.filter(
        (record) => {
          const employeeName =
            getEmployeeName(
              record
            ).toLowerCase();

          const employeeId =
            String(
              getEmployeeId(record)
            ).toLowerCase();

          const department =
            record?.department_name ||
            "";

          const status =
            getStatus(record);

          const matchesSearch =
            !searchText ||
            employeeName.includes(
              searchText
            ) ||
            employeeId.includes(
              searchText
            );

          const matchesStatus =
            statusFilter === "All" ||
            status === statusFilter;

          const matchesDepartment =
            departmentFilter === "All" ||
            department ===
              departmentFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesDepartment
          );
        }
      );
    }, [
      attendance,
      search,
      statusFilter,
      departmentFilter,
    ]);

  const totalEmployees =
    attendance.length;

  const presentCount =
    attendance.filter(
      (record) =>
        getStatus(record) ===
        "Present"
    ).length;

  const absentCount =
    attendance.filter(
      (record) =>
        getStatus(record) ===
        "Absent"
    ).length;

  const lateCount =
    attendance.filter(
      (record) =>
        getStatus(record) ===
        "Late"
    ).length;

  const openEdit = (record) => {
    setEditRecord(record);
     const extractTimeOnly = (timestamp) => {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "";
      return date.toTimeString().slice(0, 5);
    };
    setEditForm({
      check_in: extractTimeOnly(record?.check_in),
      check_out: extractTimeOnly(record?.check_out),
      status: getStatus(record),
      reason: "",
    });
  };

  const saveCorrection =
    async () => {
      if (!editRecord) {
        return;
      }

      if (
        !editForm.reason.trim()
      ) {
        alert(
          "Please enter a reason for attendance regularisation."
        );

        return;
      }

      try {
        const payload = {
          attendance_id:
            editRecord.attendance_id ||
            undefined,

          employee_id:
            editRecord.employee_id,

          date: selectedDate,

          requested_check_in:
            editForm.check_in ||
            null,

          requested_check_out:
            editForm.check_out ||
            null,

          status:
            editForm.status,

          reason:
            editForm.reason.trim(),
        };

        const response =
          await api.post(
            "/attendance/correction",
            payload
          );

        if (!response?.success) {
          alert(
            response?.message ||
              "Unable to submit correction"
          );

          return;
        }

        alert(
          "Attendance regularisation submitted successfully."
        );

        setEditRecord(null);

        setEditForm({
          check_in: "",
          check_out: "",
          status: "Present",
          reason: "",
        });

        await loadAttendance();
      } catch (err) {
        console.error(
          "Correction error:",
          err
        );

        alert(
          err?.message ||
            "Unable to submit correction"
        );
      }
    };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDepartmentFilter("All");
    setSelectedDate(getToday());
  };

  return (
    <div className="attendance-page">
      <div className="attendance-container">

        <div className="attendance-top">

          <div>
            {onBack && (
              <button
                type="button"
                className="attendance-back"
                onClick={onBack}
              >
                ← Back
              </button>
            )}

            <h1>
              Attendance
            </h1>

            <p>
              View and manage daily
              employee attendance
            </p>
          </div>

          <button
            type="button"
            className="attendance-refresh"
            onClick={
              loadAttendance
            }
          >
            <RefreshCw
              size={17}
            />

            Refresh
          </button>

        </div>

        <div className="attendance-summary">

          <div className="summary-card total">
            <div className="summary-card-top">
              <span>
                Total Employees
              </span>

              <div className="summary-icon">
                <UsersIcon />
              </div>
            </div>

            <strong>
              {totalEmployees}
            </strong>

            <small>
              Employees for selected date
            </small>
          </div>

          <div className="summary-card present">
            <div className="summary-card-top">
              <span>
                Present
              </span>

              <div className="summary-icon">
                <PresentIcon />
              </div>
            </div>

            <strong>
              {presentCount}
            </strong>

            <small>
              Present employees
            </small>
          </div>

          <div className="summary-card absent">
            <div className="summary-card-top">
              <span>
                Absent
              </span>

              <div className="summary-icon">
                <AbsentIcon />
              </div>
            </div>

            <strong>
              {absentCount}
            </strong>

            <small>
              Absent employees
            </small>
          </div>

          <div className="summary-card late">
            <div className="summary-card-top">
              <span>
                Late
              </span>

              <div className="summary-icon">
                <LateIcon />
              </div>
            </div>

            <strong>
              {lateCount}
            </strong>

            <small>
              Late employees
            </small>
          </div>

        </div>

        <div className="attendance-card">

          <div className="attendance-card-header">

            <div>
              <h2>
                Daily Attendance
              </h2>

              <span>
                Attendance records for{" "}
                {selectedDate}
              </span>
            </div>

            <span className="attendance-record-count">
              {filteredAttendance.length} Records
            </span>

          </div>

          <div className="attendance-filters">

            <div className="attendance-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search employee name or ID"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="attendance-date">
              <CalendarDays
                size={17}
              />

              <input
                type="date"
                value={
                  selectedDate
                }
                onChange={(e) =>
                  setSelectedDate(
                    e.target.value
                  )
                }
              />
            </div>

            <select
              value={
                statusFilter
              }
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >
              <option value="All">
                All Status
              </option>

              <option value="Present">
                Present
              </option>

              <option value="Absent">
                Absent
              </option>

              <option value="Late">
                Late
              </option>

              <option value="Half Day">
                Half Day
              </option>
            </select>

            <select
              value={
                departmentFilter
              }
              onChange={(e) =>
                setDepartmentFilter(
                  e.target.value
                )
              }
            >
              {departments.map(
                (department) => (
                  <option
                    key={
                      department
                    }
                    value={
                      department
                    }
                  >
                    {department ===
                    "All"
                      ? "All Departments"
                      : department}
                  </option>
                )
              )}
            </select>

            <button
              type="button"
              className="clear-button"
              onClick={
                clearFilters
              }
            >
              Clear
            </button>

          </div>

          {error && (
            <div className="attendance-error">
              {error}
            </div>
          )}

          <div className="attendance-table-wrapper">

            <table className="attendance-table">

              <thead>
                <tr>
                  <th>Date</th>
                  <th>EMP ID</th>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Working Hours</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="attendance-empty"
                    >
                      Loading attendance...
                    </td>
                  </tr>
                ) : filteredAttendance.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="attendance-empty"
                    >
                      No employee
                      attendance
                      found
                    </td>
                  </tr>
                ) : (
                  filteredAttendance.map(
                    (record) => {
                      const status =
                        getStatus(
                          record
                        );

                      return (
                        <tr
                          key={`${getEmployeeId(
                            record
                          )}-${selectedDate}`}
                        >
                          <td>
                            {
                              selectedDate
                            }
                          </td>

                          <td>
                            <span className="employee-id">
                              {getEmployeeId(
                                record
                              )}
                            </span>
                          </td>

                          <td>
                            <div className="employee-cell">

                              <div className="employee-avatar">
                                {getInitials(
                                  record
                                )}
                              </div>

                              <span>
                                {getEmployeeName(
                                  record
                                )}
                              </span>

                            </div>
                          </td>

                          <td>
                            {record?.department_name ||
                              "--"}
                          </td>

                          <td>
                            {formatTime(
                              record?.check_in
                            )}
                          </td>

                          <td>
                            {formatTime(
                              record?.check_out
                            )}
                          </td>

                          <td>
                            {formatHours(
                              record?.working_hours
                            )}
                          </td>

                          <td>
                            <span
                              className={`status-badge ${status
                                .toLowerCase()
                                .replace(
                                  " ",
                                  "-"
                                )}`}
                            >
                              {status}
                            </span>
                          </td>

                          <td>
                            <div className="action-buttons">

                              <button
                                type="button"
                                title="View Attendance"
                                onClick={() =>
                                  setViewRecord(
                                    record
                                  )
                                }
                              >
                                <Eye
                                  size={16}
                                />
                              </button>

                              <button
                                type="button"
                                title="Edit Attendance"
                                onClick={() =>
                                  openEdit(
                                    record
                                  )
                                }
                              >
                                <Pencil
                                  size={16}
                                />
                              </button>

                            </div>
                          </td>

                        </tr>
                      );
                    }
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {viewRecord && (
        <div className="modal-overlay">

          <div className="attendance-modal">

            <div className="modal-header">

              <div>
                <h2>
                  Attendance Details
                </h2>

                <p>
                  {getEmployeeName(
                    viewRecord
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setViewRecord(
                    null
                  )
                }
              >
                <X size={19} />
              </button>

            </div>

            <div className="details-grid">

              <div>
                <span>
                  Employee ID
                </span>

                <strong>
                  {getEmployeeId(
                    viewRecord
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Employee Name
                </span>

                <strong>
                  {getEmployeeName(
                    viewRecord
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Department
                </span>

                <strong>
                  {viewRecord?.department_name ||
                    "--"}
                </strong>
              </div>

              <div>
                <span>
                  Date
                </span>

                <strong>
                  {selectedDate}
                </strong>
              </div>

              <div>
                <span>
                  Check-in
                </span>

                <strong>
                  {formatTime(
                    viewRecord?.check_in
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Check-out
                </span>

                <strong>
                  {formatTime(
                    viewRecord?.check_out
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Working Hours
                </span>

                <strong>
                  {formatHours(
                    viewRecord?.working_hours
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong>
                  {getStatus(
                    viewRecord
                  )}
                </strong>
              </div>

            </div>

            <div className="modal-footer">

              <button
                type="button"
                className="cancel-modal"
                onClick={() =>
                  setViewRecord(
                    null
                  )
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

      {editRecord && (
        <div className="modal-overlay">

          <div className="attendance-modal edit-attendance-modal">

            <div className="modal-header">

              <div>
                <h2>
                  Edit Attendance
                </h2>

                <p>
                  Regularise attendance
                  record
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditRecord(
                    null
                  )
                }
              >
                <X size={19} />
              </button>

            </div>

            <div className="edit-form">

              <div className="edit-field">
                <label>
                  Date
                </label>

                <input
                  type="date"
                  value={
                    selectedDate
                  }
                  readOnly
                />
              </div>

              <div className="edit-field">
                <label>
                  Employee ID
                </label>

                <input
                  type="text"
                  value={getEmployeeId(
                    editRecord
                  )}
                  readOnly
                />
              </div>

              <div className="edit-field">
                <label>
                  Employee Name
                </label>

                <input
                  type="text"
                  value={getEmployeeName(
                    editRecord
                  )}
                  readOnly
                />
              </div>

              <div className="edit-field">
                <label>
                  Department
                </label>

                <input
                  type="text"
                  value={
                    editRecord?.department_name ||
                    "--"
                  }
                  readOnly
                />
              </div>

              <div className="edit-field">
                <label>
                  Check-in
                </label>

                <input
                  type="datetime-local"
                  value={
                    editForm.check_in
                  }
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      check_in:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="edit-field">
                <label>
                  Check-out
                </label>

                <input
                  type="datetime-local"
                  value={
                    editForm.check_out
                  }
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      check_out:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="edit-field">
                <label>
                  Status
                </label>

                <select
                  value={
                    editForm.status
                  }
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      status:
                        e.target.value,
                    })
                  }
                >
                  <option value="Present">
                    Present
                  </option>

                  <option value="Absent">
                    Absent
                  </option>

                  <option value="Late">
                    Late
                  </option>

                  <option value="Half Day">
                    Half Day
                  </option>
                </select>
              </div>

              <div className="edit-field edit-field-full">
                <label>
                  Reason
                </label>

                <textarea
                  value={
                    editForm.reason
                  }
                  placeholder="Enter reason for attendance regularisation"
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      reason:
                        e.target.value,
                    })
                  }
                />
              </div>

            </div>

            <div className="modal-footer">

              <button
                type="button"
                className="cancel-modal"
                onClick={() =>
                  setEditRecord(
                    null
                  )
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="save-modal"
                onClick={
                  saveCorrection
                }
              >
                <Save size={16} />
                Save Changes
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

function UsersIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PresentIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function AbsentIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function LateIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export default Attendance;