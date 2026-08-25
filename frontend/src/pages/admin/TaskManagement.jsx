import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  AlertCircle,
  ClipboardList,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

import {api} from "../../services/api";

function TaskManagement({ onNavigate }) {
  /* =========================================================
     STATES
  ========================================================= */

  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState("");

  const [taskSearch, setTaskSearch] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [taskPriority, setTaskPriority] = useState("");

  /* =========================================================
     FETCH TASKS
  ========================================================= */

  const fetchTasks = async () => {
    try {
      setTasksLoading(true);
      setTasksError("");

      const response = await api.get("/tasks");

      console.log("Admin tasks response:", response);

      if (response?.success) {
        const data = response?.data;

        setTasks(
          Array.isArray(data)
            ? data
            : Array.isArray(data?.tasks)
            ? data.tasks
            : []
        );
      } else {
        setTasks([]);

        setTasksError(
          response?.message || "Unable to load tasks."
        );
      }
    } catch (error) {
      console.error("Fetch tasks error:", error);

      setTasks([]);

      setTasksError(
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          error?.message ||
          "Unable to load tasks."
      );
    } finally {
      setTasksLoading(false);
    }
  };

  /* =========================================================
     LOAD TASKS
  ========================================================= */

  useEffect(() => {
    fetchTasks();
  }, []);

  /* =========================================================
     FILTER TASKS
  ========================================================= */

  const filteredTasks = tasks.filter((task) => {
    const searchValue = taskSearch.toLowerCase().trim();

    const taskTitle = String(
      task.title || ""
    ).toLowerCase();

    const assignedEmployee = String(
      task.employee_name ||
        task.employeeName ||
        task.assigned_to_name ||
        task.assignedToName ||
        ""
    ).toLowerCase();

    const matchesSearch =
      taskTitle.includes(searchValue) ||
      assignedEmployee.includes(searchValue);

    const matchesStatus =
      !taskStatus ||
      String(task.status || "").toLowerCase() ===
        taskStatus.toLowerCase();

    const matchesPriority =
      !taskPriority ||
      String(task.priority || "").toLowerCase() ===
        taskPriority.toLowerCase();

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  /* =========================================================
     STATUS FORMATTER
  ========================================================= */

  const formatStatus = (value) => {
    return String(value || "pending")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  /* =========================================================
     DATE FORMATTER
  ========================================================= */

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return date;
    }
  };

  /* =========================================================
     DELETE TASK
     FRONTEND PLACEHOLDER
  ========================================================= */

  const handleDeleteTask = (task) => {
    console.log("Delete task:", task);

    alert(
      `Delete functionality will be connected to backend.\n\nTask: ${task.title}`
    );
  };

  /* =========================================================
     EDIT TASK
     FRONTEND PLACEHOLDER
  ========================================================= */

  const handleEditTask = (task) => {
    console.log("Edit task:", task);

    // We will create this page next
    onNavigate?.("editTask", task);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="task-management-page">
      {/* =====================================================
          PAGE HEADING
      ===================================================== */}

      <div className="admin-page-heading">
        <div>
          <h1>Task Management</h1>

          <p>
            Create, assign, and monitor tasks across
            employees.
          </p>
        </div>

        <div className="task-header-actions">
          <button
            type="button"
            className="admin-panel-link"
            onClick={fetchTasks}
            disabled={tasksLoading}
          >
            <RefreshCw
              size={17}
              className={
                tasksLoading ? "spin" : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            className="task-create-button"
            onClick={() =>
              onNavigate?.("createTask")
            }
          >
            <Plus size={18} />
            Create Task
          </button>
        </div>
      </div>

      {/* =====================================================
          TASK LIST PANEL
      ===================================================== */}

      <section className="admin-panel">
        {/* ===================================================
            TOOLBAR
        =================================================== */}

        <div className="task-toolbar">
          {/* SEARCH */}

          <div className="admin-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search task or employee..."
              value={taskSearch}
              onChange={(e) =>
                setTaskSearch(e.target.value)
              }
            />
          </div>

          {/* FILTERS */}

          <div className="task-management-filters">
            <select
              value={taskStatus}
              onChange={(e) =>
                setTaskStatus(e.target.value)
              }
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

            <select
              value={taskPriority}
              onChange={(e) =>
                setTaskPriority(e.target.value)
              }
            >
              <option value="">
                All Priority
              </option>

              <option value="low">
                Low
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="high">
                High
              </option>
            </select>
          </div>
        </div>

        {/* ===================================================
            ERROR
        =================================================== */}

        {tasksError && (
          <div className="manager-attendance-error">
            <AlertCircle size={17} />

            <span>
              {tasksError}
            </span>
          </div>
        )}

        {/* ===================================================
            TASK TABLE
        =================================================== */}

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Assigned To</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasksLoading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="admin-empty-state"
                  >
                    Loading tasks...
                  </td>
                </tr>
              ) : filteredTasks.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="admin-empty-state"
                  >
                    <div className="task-empty-state">
                      <ClipboardList size={34} />

                      <span>
                        No tasks found.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const assignedEmployee =
                    `${task.employee_first_name || ""} ${
                      task.employee_last_name || ""
                    }`.trim() ||
                    task.employee_name ||
                    task.employeeName ||
                    task.assigned_to_name ||
                    task.assignedToName ||
                    "Unknown";

                  return (
                    <tr key={task.id}>
                      {/* TASK */}

                      <td>
                        <div className="task-title-cell">
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

                      {/* ASSIGNED TO */}

                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-user-avatar">
                            {assignedEmployee
                              .split(" ")
                              .map((word) =>
                                word.charAt(0)
                              )
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <span>
                            {assignedEmployee}
                          </span>
                        </div>
                      </td>

                      {/* PRIORITY */}

                      <td>
                        <span
                          className={`task-priority-badge task-priority-${String(
                            task.priority || "medium"
                          ).toLowerCase()}`}
                        >
                          {formatStatus(
                            task.priority || "medium"
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
                          className={`task-status-badge task-status-${String(
                            task.status || "pending"
                          ).toLowerCase()}`}
                        >
                          {formatStatus(
                            task.status || "pending"
                          )}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="task-action-buttons">
                          <button
                            type="button"
                            className="task-edit-button"
                            title="Edit Task"
                            onClick={() =>
                              handleEditTask(task)
                            }
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            className="task-delete-button"
                            title="Delete Task"
                            onClick={() =>
                              handleDeleteTask(task)
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default TaskManagement;