import { Bell } from "lucide-react";

function EmployeeHeader({ onNavigate, employee }) {
  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const employeeName =
    employee?.firstName ||
    storedUser.full_name ||
    storedUser.name ||
    "Employee";

  const employeeRole =
    employee?.role ||
    storedUser.role ||
    "Employee";

  return (
    <header className="admin-header">
      <div>
        <h1>Employee Dashboard</h1>
        <p>Here's your personal work overview for today.</p>
      </div>

      <div className="admin-header-actions">
        <button
          type="button"
          className="admin-notification-button"
          onClick={() =>
            onNavigate?.("employeeNotifications")
          }
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="notification-dot"></span>
        </button>

        <button
          type="button"
          className="admin-header-user"
          onClick={() =>
            onNavigate?.("employeeProfile")
          }
        >
          <div className="admin-header-avatar">
            {employeeName.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{employeeName}</strong>
            <span>{employeeRole}</span>
          </div>
        </button>
      </div>
    </header>
  );
}

export default EmployeeHeader;