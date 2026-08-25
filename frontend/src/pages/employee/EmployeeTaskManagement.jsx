import { useEffect, useState } from "react";
import {
  ClipboardList,
  CircleCheck,
  Clock3,
  AlertCircle,
  Search,
  RefreshCw,
  Loader2,
} from "lucide-react";

import EmployeeHeader from "../../components/employee/EmployeeHeader";
import EmployeeSidebar from "../../components/employee/EmployeeSidebar";
import StatCard from "../../components/admin/StatCard";
import { api } from "../../services/api";

function EmployeeTaskManagement({ onNavigate, onLogout }) {
  /* =========================================================
     STATES
  ========================================================= */

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [taskSearch, setTaskSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  /* =========================================================
     FETCH TASKS
  ========================================================= */

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tasks");

      console.log("Employee tasks response:", response);

      const responseData = response?.data || response || {};

      if (response?.success === false) {
        throw new Error(
          response?.message || "Failed to load tasks."
        );
      }

      const taskData = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.tasks)
        ? responseData.tasks
        : [];

      setTasks(taskData);
    } catch (err) {
      console.error("Failed to load tasks:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load task information."
      );

      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     LOAD TASKS
  ========================================================= */

  useEffect(() => {
    loadTasks();
  }, []);

  /* =========================================================
     UPDATE TASK STATUS
  ========================================================= */

  const handleStatusChange = async (
    taskId,
    newStatus
  ) => {
    try {
      setUpdatingTaskId(taskId);
      setError("");

      const response = await api.put(
        `/tasks/${taskId}/status`,
        {
          status: newStatus,
        }
      );

      if (response?.success === false) {
        throw new Error(
          response?.message ||
            "Failed to update task status."
        );
      }

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: newStatus,
              }
            : task
        )
      );
    } catch (err) {
      console.error(
        "Failed to update task status:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update task status."
      );

      await loadTasks();
    } finally {
      setUpdatingTaskId(null);
    }
  };

  /* =========================================================
     FILTER TASKS
  ========================================================= */

  const filteredTasks = tasks.filter((task) => {
    const searchValue = taskSearch
      .toLowerCase()
      .trim();

    const title = String(
      task.title || ""
    ).toLowerCase();

    const description = String(
      task.description || ""
    ).toLowerCase();

    const matchesSearch =
      title.includes(searchValue) ||
      description.includes(searchValue);

    const matchesStatus =
      !selectedStatus ||
      String(task.status || "").toLowerCase() ===
        selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  /* =========================================================
     TASK COUNTS
  ========================================================= */

  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) =>
      String(task.status || "").toLowerCase() ===
      "pending"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) =>
      String(task.status || "").toLowerCase() ===
      "in_progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) =>
      String(task.status || "").toLowerCase() ===
      "completed"
  ).length;

  /* =========================================================
     HELPERS
  ========================================================= */

  const formatDate = (dateValue) => {
    if (!dateValue) return "--";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "--";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatStatus = (status) => {
    return String(status || "pending")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const getStatusClass = (status) => {
    const value = String(status || "")
      .toLowerCase();

    if (value === "completed") {
      return "task-status-completed";
    }

    if (value === "in_progress") {
      return "task-status-in-progress";
    }

    return "task-status-pending";
  };

  const getPriorityClass = (priority) => {
    const value = String(priority || "medium")
      .toLowerCase();

    if (value === "high") {
      return "task-priority-high";
    }

    if (value === "low") {
      return "task-priority-low";
    }

    return "task-priority-medium";
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="admin-layout">
      <EmployeeSidebar
        activePage="tasks"
        onNavigate={handleNavigation}
        onLogout={onLogout}
      />

      <main className="admin-main">
        <EmployeeHeader
          onNavigate={handleNavigation}
        />

        <div className="employee-task-content">
          <div className="admin-dashboard-content employee-task-page">

            {/* PAGE HEADING */}

            <div className="admin-page-heading task-page-heading">
              <div>
                <h1>My Tasks</h1>

                <p>
                  View and update tasks assigned to you.
                </p>
              </div>

              <button
                type="button"
                className="task-refresh-button"
                onClick={loadTasks}
                disabled={loading}
              >
                {loading ? (
                  <Loader2
                    size={17}
                    className="attendance-spinner"
                  />
                ) : (
                  <RefreshCw size={17} />
                )}

                Refresh
              </button>
            </div>

            {/* ERROR */}

            {error && (
              <div className="attendance-error-message">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* SUMMARY CARDS */}

            <section className="admin-stats-grid employee-task-stats-grid">
              <StatCard
                title="Total Tasks"
                value={loading ? "..." : totalTasks}
                description="Tasks assigned to you"
                icon={<ClipboardList size={20} />}
              />

              <StatCard
                title="Pending"
                value={loading ? "..." : pendingTasks}
                description="Tasks not started"
                icon={<AlertCircle size={20} />}
              />

              <StatCard
                title="In Progress"
                value={
                  loading ? "..." : inProgressTasks
                }
                description="Tasks currently in progress"
                icon={<Clock3 size={20} />}
              />

              <StatCard
                title="Completed"
                value={
                  loading ? "..." : completedTasks
                }
                description="Tasks completed successfully"
                icon={<CircleCheck size={20} />}
              />
            </section>

            {/* TASK LIST */}

            <section className="admin-panel employee-task-panel">

              <div className="employee-task-panel-header">
                <div>
                  <h2>Task List</h2>

                  <p>
                    Manage the progress of your assigned
                    tasks.
                  </p>
                </div>

                </div>

              {/* SEARCH AND FILTER */}

              <div className="employee-task-toolbar">
                <div className="employee-task-search">
                  <Search size={17} />

                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={taskSearch}
                    onChange={(event) =>
                      setTaskSearch(event.target.value)
                    }
                  />
                </div>

                <select
                  value={selectedStatus}
                  onChange={(event) =>
                    setSelectedStatus(
                      event.target.value
                    )
                  }
                  className="employee-task-filter"
                >
                  <option value="">
                    All Status
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                  <option value="in_progress">
                    In Progress
                  </option>

                  <option value="completed">
                    Completed
                  </option>
                </select>
              </div>

              {/* TABLE */}

              <div className="employee-task-table-wrapper">
                <table className="employee-task-table">
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Priority</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Update Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="employee-task-table-message"
                        >
                          <Loader2
                            size={20}
                            className="attendance-spinner"
                          />

                          Loading tasks...
                        </td>
                      </tr>
                    ) : filteredTasks.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="employee-task-table-message"
                        >
                          No tasks found.
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map(
                        (task, index) => (
                          <tr
                            key={
                              task.id ||
                              `${task.title}-${index}`
                            }
                          >
                            {/* TASK */}

                            <td>
                              <div className="employee-task-title-cell">
                                <strong>
                                  {task.title ||
                                    "Untitled Task"}
                                </strong>

                                {task.description && (
                                  <span>
                                    {task.description}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* PRIORITY */}

                            <td>
                              <span
                                className={`task-priority-badge ${getPriorityClass(
                                  task.priority
                                )}`}
                              >
                                {String(
                                  task.priority ||
                                    "medium"
                                ).replace(
                                  /\b\w/g,
                                  (char) =>
                                    char.toUpperCase()
                                )}
                              </span>
                            </td>

                            {/* DUE DATE */}

                            <td>
                              {formatDate(
                                task.due_date
                              )}
                            </td>

                            {/* STATUS */}

                            <td>
                              <span
                                className={`task-status-badge ${getStatusClass(
                                  task.status
                                )}`}
                              >
                                {formatStatus(
                                  task.status
                                )}
                              </span>
                            </td>

                            {/* UPDATE STATUS */}

                            <td>
                              <select
                                className="employee-task-status-select"
                                value={
                                  task.status ||
                                  "pending"
                                }
                                disabled={
                                  updatingTaskId ===
                                  task.id
                                }
                                onChange={(event) =>
                                  handleStatusChange(
                                    task.id,
                                    event.target.value
                                  )
                                }
                              >
                                <option value="pending">
                                  Pending
                                </option>

                                <option value="in_progress">
                                  In Progress
                                </option>

                                <option value="completed">
                                  Completed
                                </option>
                              </select>
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EmployeeTaskManagement;