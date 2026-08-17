import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock3,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./Attendance.css";

const attendanceData = [
  {
    id: 1,
    employeeId: "EMP001",
    name: "Sreelatha Pachcha",
    department: "Engineering",
    checkIn: "09:15 AM",
    checkOut: "06:20 PM",
    workingHours: "9h 05m",
    status: "Present",
  },
  {
    id: 2,
    employeeId: "EMP002",
    name: "Rahul Kumar",
    department: "Engineering",
    checkIn: "09:30 AM",
    checkOut: "06:10 PM",
    workingHours: "8h 40m",
    status: "Present",
  },
  {
    id: 3,
    employeeId: "EMP003",
    name: "Poojitha",
    department: "HR",
    checkIn: "10:05 AM",
    checkOut: "06:00 PM",
    workingHours: "7h 55m",
    status: "Late",
  },
  {
    id: 4,
    employeeId: "EMP004",
    name: "Anjali Reddy",
    department: "Finance",
    checkIn: "-",
    checkOut: "-",
    workingHours: "-",
    status: "Absent",
  },
  {
    id: 5,
    employeeId: "EMP005",
    name: "Kiran Kumar",
    department: "Marketing",
    checkIn: "09:10 AM",
    checkOut: "06:15 PM",
    workingHours: "9h 05m",
    status: "Present",
  },
  {
    id: 6,
    employeeId: "EMP006",
    name: "Sneha",
    department: "Engineering",
    checkIn: "09:20 AM",
    checkOut: "06:05 PM",
    workingHours: "8h 45m",
    status: "Present",
  },
  {
    id: 7,
    employeeId: "EMP007",
    name: "Vamsi Krishna",
    department: "Sales",
    checkIn: "10:20 AM",
    checkOut: "06:00 PM",
    workingHours: "7h 40m",
    status: "Late",
  },
  {
    id: 8,
    employeeId: "EMP008",
    name: "Harsha",
    department: "Engineering",
    checkIn: "-",
    checkOut: "-",
    workingHours: "-",
    status: "Absent",
  },
  {
    id: 9,
    employeeId: "EMP009",
    name: "Divya",
    department: "HR",
    checkIn: "09:05 AM",
    checkOut: "06:10 PM",
    workingHours: "9h 05m",
    status: "Present",
  },
  {
    id: 10,
    employeeId: "EMP010",
    name: "Arjun",
    department: "Finance",
    checkIn: "09:25 AM",
    checkOut: "06:00 PM",
    workingHours: "8h 35m",
    status: "Present",
  },
  {
    id: 11,
    employeeId: "EMP011",
    name: "Meghana",
    department: "Engineering",
    checkIn: "10:10 AM",
    checkOut: "06:00 PM",
    workingHours: "7h 50m",
    status: "Late",
  },
  {
    id: 12,
    employeeId: "EMP012",
    name: "Rakesh",
    department: "Sales",
    checkIn: "09:12 AM",
    checkOut: "06:08 PM",
    workingHours: "8h 56m",
    status: "Present",
  },
  {
    id: 13,
    employeeId: "EMP013",
    name: "Swathi",
    department: "Marketing",
    checkIn: "09:18 AM",
    checkOut: "06:05 PM",
    workingHours: "8h 47m",
    status: "Present",
  },
];

function Attendance() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [department, setDepartment] = useState("All");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [page, setPage] = useState(1);

  const rowsPerPage = 8;

  const departments = [
    "All",
    ...new Set(
      attendanceData.map((item) => item.department)
    ),
  ];

  const filteredAttendance = useMemo(() => {
    return attendanceData.filter((item) => {
      const searchMatch =
        item.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.employeeId
          .toLowerCase()
          .includes(search.toLowerCase());

      const statusMatch =
        status === "All" || item.status === status;

      const departmentMatch =
        department === "All" ||
        item.department === department;

      return (
        searchMatch &&
        statusMatch &&
        departmentMatch
      );
    });
  }, [search, status, department]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredAttendance.length / rowsPerPage
    )
  );

  const startIndex = (page - 1) * rowsPerPage;

  const currentRows = filteredAttendance.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const presentCount = attendanceData.filter(
    (item) => item.status === "Present"
  ).length;

  const absentCount = attendanceData.filter(
    (item) => item.status === "Absent"
  ).length;

  const lateCount = attendanceData.filter(
    (item) => item.status === "Late"
  ).length;

  const getStatusClass = (value) => {
    if (value === "Present") {
      return "attendance-present";
    }

    if (value === "Absent") {
      return "attendance-absent";
    }

    if (value === "Late") {
      return "attendance-late";
    }

    return "";
  };

  const resetPage = () => {
    setPage(1);
  };

  return (
    <div className="attendance-page">
      <div className="attendance-heading">
        <div>
          <h1>Attendance</h1>
          <p>
            Manage and monitor employee attendance.
          </p>
        </div>

        <div className="attendance-date">
          <CalendarDays size={18} />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="attendance-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <Users size={22} />
          </div>

          <div>
            <p>Total Employees</p>
            <h2>{attendanceData.length}</h2>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon present-icon">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <p>Present</p>
            <h2>{presentCount}</h2>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon absent-icon">
            <XCircle size={22} />
          </div>

          <div>
            <p>Absent</p>
            <h2>{absentCount}</h2>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon late-icon">
            <Clock3 size={22} />
          </div>

          <div>
            <p>Late</p>
            <h2>{lateCount}</h2>
          </div>
        </div>
      </div>

      <div className="attendance-container">
        <div className="attendance-toolbar">
          <div className="attendance-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
            />
          </div>

          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              resetPage();
            }}
          >
            <option value="All">
              All Departments
            </option>

            {departments
              .filter((item) => item !== "All")
              .map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              resetPage();
            }}
          >
            <option value="All">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>
        </div>

        <div className="attendance-table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>DEPARTMENT</th>
                <th>CHECK IN</th>
                <th>CHECK OUT</th>
                <th>WORKING HOURS</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="employee-cell">
                        <div className="employee-avatar">
                          {employee.name.charAt(0)}
                        </div>

                        <div>
                          <strong>
                            {employee.name}
                          </strong>

                          <span>
                            {employee.employeeId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>{employee.department}</td>

                    <td
                      className={
                        employee.status === "Late"
                          ? "late-time"
                          : ""
                      }
                    >
                      {employee.checkIn}
                    </td>

                    <td>{employee.checkOut}</td>

                    <td>{employee.workingHours}</td>

                    <td>
                      <span
                        className={`attendance-status ${getStatusClass(
                          employee.status
                        )}`}
                      >
                        <span className="status-dot"></span>
                        {employee.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="empty-attendance"
                  >
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="attendance-pagination">
          <span>
            Showing{" "}
            {filteredAttendance.length === 0
              ? 0
              : startIndex + 1}{" "}
            to{" "}
            {Math.min(
              startIndex + rowsPerPage,
              filteredAttendance.length
            )}{" "}
            of {filteredAttendance.length} employees
          </span>

          <div className="pagination-controls">
            <button
              disabled={page === 1}
              onClick={() =>
                setPage((current) => current - 1)
              }
            >
              <ChevronLeft size={17} />
            </button>

            <span className="page-number">
              {page}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() =>
                setPage((current) => current + 1)
              }
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;