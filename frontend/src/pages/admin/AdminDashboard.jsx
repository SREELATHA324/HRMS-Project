import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Building2,
  Pencil,
  UserPlus,
  UserCog,
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import StatCard from "../../components/admin/StatCard";
import Profile from "../profile/Profile";
import { api } from "../../services/api";

function AdminDashboard({ onNavigate, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");

  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    departments: 0,
    recentEmployees: [],
    recentActivities: [],
    departmentStats: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard/admin");

      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError(response.message || "Failed to load dashboard");
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      setError(error.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (page) => {
    if (page === "attendance" || page === "dashboard"|| page === "profile") {
      setActivePage(page);
      return;
    }

    if (onNavigate) {
      onNavigate(page);
    }
  };

  const getActivityIcon = (type) => {
    if (type === "new_employee") {
      return <UserPlus size={16} />;
    }

    if (type === "status_change") {
      return <UserCog size={16} />;
    }

    if (type === "employee_update") {
      return <Pencil size={16} />;
    }

    return <Building2 size={16} />;
  };

  const getActivityColor = (type) => {
    if (type === "new_employee") {
      return "employee";
    }

    if (type === "status_change") {
      return "leave";
    }

    if (type === "employee_update") {
      return "department";
    }

    return "department";
  };

  const getActivityTitle = (type) => {
    if (type === "new_employee") {
      return "New employee added";
    }

    if (type === "status_change") {
      return "Status changed";
    }

    if (type === "employee_update") {
      return "Employee updated";
    }

    return "Activity";
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar
          onNavigate={handleNavigation}
          onLogout={onLogout}
          activePage={activePage}
        />

        <main className="admin-main">
          <AdminHeader onNavigate={handleNavigation} />

          <div className="admin-dashboard-content">
            <div className="admin-loading">
              Loading dashboard...
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar
        onNavigate={handleNavigation}
        onLogout={onLogout}
        activePage={activePage}
      />

      <main className="admin-main">
        <AdminHeader onNavigate={handleNavigation} />

        {activePage === "attendance" ? (
          <div className="admin-dashboard-content">
            <Attendance />
          </div>
        ) : activePage === "profile" ? (
          <div className="admin-dashboard-content">
            <Profile />
          </div>
        ) : (
          <div className="admin-dashboard-content">
            {error && (
              <div className="admin-form-error">
                {error}
              </div>
            )}

            <section className="admin-stats-grid">
              <StatCard
                title="Total Employees"
                value={dashboardData.totalEmployees}
                description="Employees in organization"
                icon={<Users size={20} />}
              />

              <StatCard
                title="Active Employees"
                value={dashboardData.activeEmployees}
                description="Currently active"
                icon={<UserCheck size={20} />}
              />

              <StatCard
                title="Inactive Employees"
                value={dashboardData.inactiveEmployees}
                description="Inactive employees"
                icon={<UserX size={20} />}
              />

              <StatCard
                title="Departments"
                value={dashboardData.departments}
                description="Active departments"
                icon={<Building2 size={20} />}
              />
            </section>

            <section className="admin-dashboard-grid">
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <div>
                    <h2>Attendance Overview</h2>
                    <p>Today's workforce attendance</p>
                  </div>

                  <span className="admin-panel-period">
                    Today
                  </span>
                </div>

                <div className="attendance-summary">
                  <div className="attendance-item">
                    <span className="attendance-dot present"></span>

                    <div>
                      <strong>221</strong>
                      <span>Present</span>
                    </div>
                  </div>

                  <div className="attendance-item">
                    <span className="attendance-dot absent"></span>

                    <div>
                      <strong>12</strong>
                      <span>Absent</span>
                    </div>
                  </div>

                  <div className="attendance-item">
                    <span className="attendance-dot late"></span>

                    <div>
                      <strong>8</strong>
                      <span>Late</span>
                    </div>
                  </div>
                </div>

                <div className="attendance-chart">
                  <div style={{ height: "55%" }}></div>
                  <div style={{ height: "72%" }}></div>
                  <div style={{ height: "62%" }}></div>
                  <div style={{ height: "82%" }}></div>
                  <div style={{ height: "68%" }}></div>
                  <div style={{ height: "91%" }}></div>
                  <div style={{ height: "76%" }}></div>
                </div>

                <div className="attendance-labels">
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                  <span>S</span>
                </div>
              </div>

              <div className="admin-panel">
                <div className="admin-panel-header">
                  <div>
                    <h2>Leave Overview</h2>
                    <p>Current leave requests</p>
                  </div>

                  <span className="admin-panel-period">
                    This Month
                  </span>
                </div>

                <div className="leave-summary">
                  <div className="leave-item">
                    <span>Pending</span>
                    <strong>12</strong>
                  </div>

                  <div className="leave-item">
                    <span>Approved</span>
                    <strong>35</strong>
                  </div>

                  <div className="leave-item">
                    <span>Rejected</span>
                    <strong>4</strong>
                  </div>
                </div>

                <div className="leave-progress">
                  <div className="leave-progress-row">
                    <span>Annual Leave</span>
                    <strong>18</strong>
                  </div>

                  <div className="leave-progress-bar">
                    <span style={{ width: "72%" }}></span>
                  </div>

                  <div className="leave-progress-row">
                    <span>Sick Leave</span>
                    <strong>12</strong>
                  </div>

                  <div className="leave-progress-bar">
                    <span style={{ width: "48%" }}></span>
                  </div>

                  <div className="leave-progress-row">
                    <span>Casual Leave</span>
                    <strong>9</strong>
                  </div>

                  <div className="leave-progress-bar">
                    <span style={{ width: "36%" }}></span>
                  </div>
                </div>
              </div>
            </section>

            <section className="admin-dashboard-grid">
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <div>
                    <h2>Department Statistics</h2>
                    <p>Employees by department</p>
                  </div>
                </div>

                <div className="department-list">
                  {dashboardData.departmentStats &&
                  dashboardData.departmentStats.length > 0 ? (
                    dashboardData.departmentStats.map(
                      (dept, index) => (
                        <div
                          className="department-row"
                          key={index}
                        >
                          <span>{dept.name}</span>

                          <div className="department-bar">
                            <span
                              style={{
                                width: `${Math.min(
                                  (dept.count /
                                    dashboardData.totalEmployees) *
                                    100,
                                  100
                                )}%`,
                              }}
                            ></span>
                          </div>

                          <strong>{dept.count}</strong>
                        </div>
                      )
                    )
                  ) : (
                    <div className="admin-empty-state">
                      No department data
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-panel">
                <div className="admin-panel-header">
                  <div>
                    <h2>Payroll Summary</h2>
                    <p>Current payroll status</p>
                  </div>

                  <span className="admin-panel-period">
                    This Month
                  </span>
                </div>

                <div className="payroll-total">
                  <span>Monthly Payroll</span>
                  <strong>₹18.45L</strong>
                </div>

                <div className="payroll-stats">
                  <div>
                    <span>Processed</span>
                    <strong>231</strong>
                    <small>Employees</small>
                  </div>

                  <div>
                    <span>Pending</span>
                    <strong>17</strong>
                    <small>Employees</small>
                  </div>
                </div>
              </div>
            </section>

            <section className="admin-dashboard-grid">
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <div>
                    <h2>Expense Summary</h2>
                    <p>Organization expenses</p>
                  </div>
                </div>

                <div className="expense-summary">
                  <div>
                    <span>Submitted</span>
                    <strong>₹2.45L</strong>
                  </div>

                  <div>
                    <span>Approved</span>
                    <strong>₹1.92L</strong>
                  </div>

                  <div>
                    <span>Pending</span>
                    <strong>₹53K</strong>
                  </div>
                </div>
              </div>

              <div className="admin-panel">
                <div className="admin-panel-header">
                  <div>
                    <h2>Workforce Overview</h2>
                    <p>Employee distribution</p>
                  </div>
                </div>

                <div className="workforce-grid">
                  <div>
                    <strong>201</strong>
                    <span>Full Time</span>
                  </div>

                  <div>
                    <strong>32</strong>
                    <span>Part Time</span>
                  </div>

                  <div>
                    <strong>15</strong>
                    <span>Contract</span>
                  </div>

                  <div>
                    <strong>4</strong>
                    <span>Locations</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="admin-panel recent-activities-panel">
              <div className="admin-panel-header">
                <div>
                  <h2>Recent Activities</h2>
                  <p>
                    Latest activity across your organization
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-panel-link"
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate("activities");
                    }
                  }}
                >
                  View All
                </button>
              </div>

              <div className="recent-activities-list">
                {dashboardData.recentActivities &&
                dashboardData.recentActivities.length > 0 ? (
                  dashboardData.recentActivities.map(
                    (activity, index) => (
                      <div
                        className="recent-activity-item"
                        key={index}
                      >
                        <div
                          className={`recent-activity-icon ${getActivityColor(
                            activity.type
                          )}`}
                        >
                          {getActivityIcon(activity.type)}
                        </div>

                        <div className="recent-activity-content">
                          <strong>
                            {getActivityTitle(activity.type)}
                          </strong>

                          <span>
                            {activity.description}
                          </span>

                          <small>
                            {new Date(
                              activity.activity_date
                            ).toLocaleString()}
                          </small>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="admin-empty-state">
                    No recent activities
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;