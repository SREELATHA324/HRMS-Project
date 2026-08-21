import {
  LayoutDashboard,
  UserCircle,
  Users,
  CalendarDays,
  ClipboardCheck,
  BarChart3,
  Settings,
  LogOut,
  CalendarCheck,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    page: "dashboard",
  },
  {
    label: "My Profile",
    icon: UserCircle,
    page: "profile",
  },
  {
    label: "My Team",
    icon: Users,
    page: "team",
  },
  {
    id:"myAttendance",
    label: "My Attendance",
    icon: CalendarCheck,
    page: "myAttendance",
  },
  {
    label: "Team Attendance",
    icon: Users,
    page: "attendance",
  },
  {
    label: "My Leaves",
    icon: CalendarDays,
    page: "myLeaves",
  },
  {
    label: "Leave Approvals",
    icon: ClipboardCheck,
    page: "leaveApprovals",
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

function ManagerSidebar({
  onNavigate,
  onLogout,
  activePage = "dashboard",
}) {
  return (
    <aside className="admin-sidebar">
      {/* BRAND */}
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-logo">H</div>

        <div>
          <strong>HRMS</strong>
          <span>Management Portal</span>
        </div>
      </div>

      {/* MAIN MENU */}
      <nav className="admin-sidebar-nav">
        <p className="admin-nav-title">MAIN MENU</p>

        {menuItems
          .filter((item) => item.page !== "settings")
          .map((item) => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                key={item.page}
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

      {/* FOOTER */}
      <div className="admin-sidebar-footer">
        <button
          type="button"
          className={`admin-nav-item ${
            activePage === "settings" ? "active" : ""
          }`}
          onClick={() => onNavigate?.("settings")}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>

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

export default ManagerSidebar;