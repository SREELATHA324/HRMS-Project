function Hero({ onLogin }) {
  return (
    <section className="landing-hero" id="home">
      <div className="hero-container">

        <div className="hero-content">

          <span className="hero-eyebrow">
            HUMAN RESOURCE MANAGEMENT SYSTEM
          </span>

          <h1>
            Simplify HR.
            <span>Empower Your People.</span>
          </h1>

          <p>
            Manage employees, attendance, leave, payroll, expenses
            and HR operations from one centralized platform.
          </p>

          <div className="hero-actions">

            <button
              className="hero-primary-button"
              onClick={onLogin}
            >
              Get Started
            </button>

            <a
              href="#features"
              className="hero-secondary-button"
            >
              Explore Features
              <span>→</span>
            </a>

          </div>

          <div className="hero-trust">
            <span>✓ Centralized HR</span>
            <span>✓ Role-based Access</span>
            <span>✓ Workforce Visibility</span>
          </div>

        </div>

        <div className="hero-dashboard">

          <div className="dashboard-window">

            <div className="dashboard-header">

              <div className="dashboard-title">
                <strong>HRMS Dashboard</strong>
                <span>Workforce Overview</span>
              </div>

              <div className="dashboard-user">
                A
              </div>

            </div>

            <div className="dashboard-welcome">
              <strong>Good morning, Admin</strong>
              <span>
                Here's your organization overview.
              </span>
            </div>

            <div className="dashboard-stat-grid">

              <div className="dashboard-stat">
                <span>Total Employees</span>
                <strong>248</strong>
                <small>Active workforce</small>
              </div>

              <div className="dashboard-stat">
                <span>Present Today</span>
                <strong>231</strong>
                <small>93.1% attendance</small>
              </div>

              <div className="dashboard-stat">
                <span>On Leave</span>
                <strong>17</strong>
                <small>Today</small>
              </div>

            </div>

            <div className="dashboard-main-grid">

              <div className="dashboard-panel attendance-panel">

                <div className="panel-header">
                  <strong>Attendance Overview</strong>
                  <span>This Week</span>
                </div>

                <div className="dashboard-chart">
                  <i style={{ height: "45%" }}></i>
                  <i style={{ height: "63%" }}></i>
                  <i style={{ height: "55%" }}></i>
                  <i style={{ height: "78%" }}></i>
                  <i style={{ height: "69%" }}></i>
                  <i style={{ height: "88%" }}></i>
                  <i style={{ height: "75%" }}></i>
                </div>

                <div className="chart-labels">
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                  <span>S</span>
                </div>

              </div>

              <div className="dashboard-panel requests-panel">

                <div className="panel-header">
                  <strong>Requests</strong>
                  <span>View All</span>
                </div>

                <div className="request-item">

                  <div className="request-icon leave-icon">
                    L
                  </div>

                  <div>
                    <strong>Leave Request</strong>
                    <span>Pending approval</span>
                  </div>

                </div>

                <div className="request-item">

                  <div className="request-icon expense-icon">
                    E
                  </div>

                  <div>
                    <strong>Expense Claim</strong>
                    <span>Approved</span>
                  </div>

                </div>

                <div className="request-item">

                  <div className="request-icon attendance-icon">
                    A
                  </div>

                  <div>
                    <strong>Attendance</strong>
                    <span>Correction requested</span>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;