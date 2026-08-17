import { Bell, Search } from "lucide-react";

function AdminHeader({ onNavigate }) {
  return (
    <header className="admin-header">
      <div>
        <h1>Admin Dashboard</h1>
        <p>
          Here's what's happening with your organization today.
        </p>
      </div>

      <div className="admin-header-actions">
        <div className="admin-search">
          <Search size={17} />
          <input
            type="text"
            placeholder="Search..."
          />
        </div>

        <button
          type="button"
          className="admin-notification-button"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="notification-dot"></span>
        </button>

        <button
          type="button"
          className="admin-header-user"
          onClick={() => onNavigate?.("profile")}
          title="View Profile"
        >
          <div className="admin-header-avatar">
            A
          </div>

          <div>
            <strong>Administrator</strong>
            <span>Admin</span>
          </div>
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;