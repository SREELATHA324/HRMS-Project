import {
  Users,
  UserCheck,
  UserX,
  Building2,
  CalendarDays,

} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import StatCard from "../../components/admin/StatCard";
const recentActivities = [
  {
    id: 1,
    type: "employee",
    title: "New employee added",
    description: "Rahul Kumar was added to the organization",
    time: "10 minutes ago",
  },
  {
    id: 2,
    type: "leave",
    title: "Leave request approved",
    description: "Priya Sharma's leave request was approved",
    time: "32 minutes ago",
  },
  {
    id: 3,
    type: "employee",
    title: "Employee deactivated",
    description: "EMP018 was marked as inactive",
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "department",
    title: "Department updated",
    description: "IT department information was updated",
    time: "2 hours ago",
  },
];
function AdminDashboard({ onNavigate, onLogout }) {
  return (
    <div className="admin-layout">

      <AdminSidebar
        onNavigate={onNavigate}
        onLogout={onLogout}
        activePage="dashboard"
      />


      <main className="admin-main">

        <AdminHeader />

        <div className="admin-dashboard-content">

          {/* Statistics */}

          <section className="admin-stats-grid">

            <StatCard
              title="Total Employees"
              value="248"
              description="Employees in organization"
              trend="+5 this month"
              icon={<Users size={20} />}
            />

            <StatCard
              title="Active Employees"
              value="231"
              description="Currently active"
              trend="+3.2%"
              icon={<UserCheck size={20} />}
            />

            <StatCard
              title="Inactive Employees"
              value="17"
              description="Inactive employees"
              icon={<UserX size={20} />}
            />

            <StatCard
              title="Departments"
              value="8"
              description="Active departments"
              icon={<Building2 size={20} />}
            />

          </section>


          {/* Attendance + Leave */}

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


          {/* Department + Payroll */}

          <section className="admin-dashboard-grid">

            <div className="admin-panel">

              <div className="admin-panel-header">
                <div>
                  <h2>Department Statistics</h2>
                  <p>Employees by department</p>
                </div>
              </div>

              <div className="department-list">

                <div className="department-row">
                  <span>IT</span>
                  <div className="department-bar">
                    <span style={{ width: "85%" }}></span>
                  </div>
                  <strong>82</strong>
                </div>

                <div className="department-row">
                  <span>HR</span>
                  <div className="department-bar">
                    <span style={{ width: "52%" }}></span>
                  </div>
                  <strong>42</strong>
                </div>

                <div className="department-row">
                  <span>Finance</span>
                  <div className="department-bar">
                    <span style={{ width: "38%" }}></span>
                  </div>
                  <strong>31</strong>
                </div>

                <div className="department-row">
                  <span>Sales</span>
                  <div className="department-bar">
                    <span style={{ width: "59%" }}></span>
                  </div>
                  <strong>57</strong>
                </div>

                <div className="department-row">
                  <span>Operations</span>
                  <div className="department-bar">
                    <span style={{ width: "44%" }}></span>
                  </div>
                  <strong>36</strong>
                </div>

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


          {/* Expense + Workforce */}

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
          {/* Recent Activities */}

<section className="admin-panel recent-activities-panel">

  <div className="admin-panel-header">
    <div>
      <h2>Recent Activities</h2>
      <p>Latest activity across your organization</p>
    </div>

    <button
      type="button"
      className="admin-panel-link"
    >
      View All
    </button>
  </div>

  <div className="recent-activities-list">

    {recentActivities.map((activity) => (
      <div
        className="recent-activity-item"
        key={activity.id}
      >

        <div
          className={`recent-activity-icon ${activity.type}`}
        >
          {activity.type === "employee" && (
            <Users size={16} />
          )}

          {activity.type === "leave" && (
            <CalendarDays size={16} />
          )}

          {activity.type === "department" && (
            <Building2 size={16} />
          )}
        </div>

        <div className="recent-activity-content">
          <strong>{activity.title}</strong>

          <span>{activity.description}</span>

          <small>{activity.time}</small>
        </div>

      </div>
    ))}

  </div>

</section>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;