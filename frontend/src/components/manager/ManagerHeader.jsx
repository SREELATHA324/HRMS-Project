import { Bell, Search } from "lucide-react";

function ManagerHeader({ manager = {}, pendingCount = 0, onNavigate }) {
  const name = manager?.name || "Manager";

  const initials =
    name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "M";

  return (
    <header className="admin-header">
      {/* Empty left section to maintain same Admin Header layout */}
      <div className="manager-header-spacer"></div>

      <div className="admin-header-actions">
        {/* Same Search UI as Admin */}
        <div className="admin-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search..."
          />
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="admin-notification-button"
          aria-label="Notifications"
          onClick={() => onNavigate?.("notifications")}
        >
          <Bell size={19} />

          {Number(pendingCount) > 0 && (
            <span className="notification-dot"></span>
          )}
        </button>

        {/* Manager Profile */}
        <button
          type="button"
          className="admin-header-user"
          onClick={() => onNavigate?.("profile")}
          title="View Profile"
        >
          <div className="admin-header-avatar">
            {initials}
          </div>

          <div>
            <strong>{name}</strong>

            <span>
              {manager?.employeeCode || "Manager"}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
}

export default ManagerHeader;