import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  CalendarDays,
  Wallet,
  Receipt,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    page: "dashboard",
  },
  {
    label: "Employees",
    icon: Users,
    page: "employees",
  },
  {
    label: "Departments",
    icon: Building2,
    page: "departments",
  },
  {
    label: "Attendance",
    icon: CalendarCheck,
    page: "attendance",
  },
  {
    label: "Leave",
    icon: CalendarDays,
    page: "leave",
  },
  {
    label: "Payroll",
    icon: Wallet,
    page: "payroll",
  },
  {
    label: "Expenses",
    icon: Receipt,
    page: "expenses",
  },
  {
    label: "Documents",
    icon: FileText,
    page: "documents",
  },
  {
    label: "Reports",
    icon: BarChart3,
    page: "reports",
  },
  {
    label: "Settings",
    icon: Settings,
    page: "settings",
  },
];

function AdminSidebar({
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
          <span>Admin Portal</span>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        <p className="admin-nav-title">MAIN MENU</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              type="button"
              key={item.label}
              className={`admin-nav-item ${
                activePage === item.page ? "active" : ""
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

export default AdminSidebar;