import {
  LayoutDashboard,
  User,
  CalendarCheck,
  CalendarDays,
  Wallet,
  ReceiptText,
  FileText,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    page: "employeeDashboard",
    id: "dashboard",
  },
  {
    label: "My Profile",
    icon: User,
    page: "employeeProfile",
    id: "profile",
  },
  {
    label: "Attendance",
    icon: CalendarCheck,
    page: "employeeAttendance",
    id: "attendance",
  },
  {
    label: "Leaves",
    icon: CalendarDays,
    page: "employeeLeaves",
    id: "leaves",
  },
  {
    label: "Payroll",
    icon: Wallet,
    page: "employeePayroll",
    id: "payroll",
  },
  {
    label: "Expenses",
    icon: ReceiptText,
    page: "employeeExpenses",
    id: "expenses",
  },
  {
    label: "Documents",
    icon: FileText,
    page: "employeeDocuments",
    id: "documents",
  },
  {
    label: "Notifications",
    icon: Bell,
    page: "employeeNotifications",
    id: "notifications",
  },
  {
    label: "Settings",
    icon: Settings,
    page: "employeeSettings",
    id: "settings",
  },
];

function EmployeeSidebar({
  onNavigate,
  onLogout,
  activePage = "dashboard",
}) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-logo">H</div>

        <div>
          <strong>HRMS</strong>
          <span>Employee Portal</span>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        <p className="admin-nav-title">MAIN MENU</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              type="button"
              key={item.id}
              className={`admin-nav-item ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => onNavigate?.(item.page)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <button
          type="button"
          className="admin-logout-button"
          onClick={onLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default EmployeeSidebar;