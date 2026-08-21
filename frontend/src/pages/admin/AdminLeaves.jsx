import { useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { api } from "../../services/api";

function AdminLeaves() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // LOAD LEAVE REQUESTS
  // =========================================================
  const loadLeaveRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/leave/requests");

      if (response?.success) {
        setLeaveRequests(
          Array.isArray(response.data) ? response.data : []
        );
      } else {
        setLeaveRequests([]);
        setError(
          response?.message || "Failed to load leave requests."
        );
      }
    } catch (err) {
      console.error("Load leave requests error:", err);

      setLeaveRequests([]);
      setError(
        err.message || "Failed to load leave requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaveRequests();
  }, []);

  // =========================================================
  // APPROVE LEAVE
  // =========================================================
  const handleApprove = async (leaveId) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this leave request?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(`approve-${leaveId}`);
      setError("");
      setSuccess("");

      const response = await api.put(
        `/leave/requests/${leaveId}/approve`,
        {
          remarks: "Approved by admin",
        }
      );

      if (response?.success === false) {
        throw new Error(
          response?.message || "Failed to approve leave request."
        );
      }

      setSuccess(
        response?.message || "Leave request approved successfully."
      );

      await loadLeaveRequests();
    } catch (err) {
      console.error("Approve leave error:", err);

      setError(
        err.message || "Failed to approve leave request."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // REJECT LEAVE
  // =========================================================
  const handleReject = async (leaveId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this leave request?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(`reject-${leaveId}`);
      setError("");
      setSuccess("");

      const response = await api.put(
        `/leave/requests/${leaveId}/reject`,
        {
          remarks: "Rejected by admin",
        }
      );

      if (response?.success === false) {
        throw new Error(
          response?.message || "Failed to reject leave request."
        );
      }

      setSuccess(
        response?.message || "Leave request rejected successfully."
      );

      await loadLeaveRequests();
    } catch (err) {
      console.error("Reject leave error:", err);

      setError(
        err.message || "Failed to reject leave request."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================
  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // STATUS CLASS
  // =========================================================
  const getStatusClass = (status) => {
    const normalizedStatus = String(status || "").toLowerCase();

    if (normalizedStatus === "approved") {
      return "admin-leave-status-approved";
    }

    if (normalizedStatus === "rejected") {
      return "admin-leave-status-rejected";
    }

    if (normalizedStatus === "cancelled") {
      return "admin-leave-status-cancelled";
    }

    return "admin-leave-status-pending";
  };

  return (
    <div className="admin-dashboard-content admin-leaves-page">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div className="admin-leaves-header">
        <div>
          <h1>Leave Management</h1>
          <p>Review and manage employee leave requests.</p>
        </div>

        <div className="admin-leaves-header-icon">
          <CalendarDays size={24} />
        </div>
      </div>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="admin-leave-message admin-leave-success">
          <CheckCircle2 size={19} />
          <span>{success}</span>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="admin-leave-message admin-leave-error">
          <AlertCircle size={19} />
          <span>{error}</span>
        </div>
      )}

      {/* =====================================================
          LEAVE REQUESTS TABLE
      ====================================================== */}
      <section className="admin-leaves-section">
        <div className="admin-leaves-section-header">
          <div>
            <h2>Leave Requests</h2>
            <p>All employee leave applications.</p>
          </div>
        </div>

        {loading ? (
          <div className="admin-leaves-loading">
            <Loader2
              size={24}
              className="admin-leave-spinner"
            />
            Loading leave requests...
          </div>
        ) : leaveRequests.length === 0 ? (
          <div className="admin-leaves-empty">
            <CalendarDays size={38} />
            <h3>No Leave Requests</h3>
            <p>No employee leave requests are available.</p>
          </div>
        ) : (
          <div className="admin-leaves-table-wrapper">
            <table className="admin-leaves-table">
              <thead>
                <tr>
                  <th>Leave ID</th>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {leaveRequests.map((request) => {
                  const status = String(
                    request.status || "Pending"
                  ).toLowerCase();

                  const employeeName =
                    `${request.employee_first_name || ""} ${
                      request.employee_last_name || ""
                    }`.trim() ||
                    request.employee_name ||
                    "-";

                  return (
                    <tr key={request.id}>
                      <td className="admin-leave-id">
                        #{request.id}
                      </td>

                      <td>
                        <div className="admin-leave-employee">
                          <strong>{employeeName}</strong>

                          {request.employee_code && (
                            <span>{request.employee_code}</span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="admin-leave-type">
                          {request.leave_type_color && (
                            <span
                              className="admin-leave-color-dot"
                              style={{
                                backgroundColor:
                                  request.leave_type_color,
                              }}
                            />
                          )}

                          <span>
                            {request.leave_type_name || "-"}
                          </span>
                        </div>
                      </td>

                      <td>
                        {formatDate(request.start_date)}
                      </td>

                      <td>
                        {formatDate(request.end_date)}
                      </td>

                      <td>
                        {request.total_days ?? "-"}
                      </td>

                      <td className="admin-leave-reason">
                        {request.reason || "-"}
                      </td>

                      <td>
                        {formatDate(request.applied_date)}
                      </td>

                      <td>
                        <span
                          className={`admin-leave-status ${getStatusClass(
                            request.status
                          )}`}
                        >
                          {request.status || "Pending"}
                        </span>
                      </td>

                      <td>
                        {status === "pending" ? (
                          <div className="admin-leave-actions">
                            <button
                              type="button"
                              className="admin-leave-approve-btn"
                              onClick={() =>
                                handleApprove(request.id)
                              }
                              disabled={
                                actionLoading ===
                                `approve-${request.id}`
                              }
                              title="Approve Leave"
                            >
                              {actionLoading ===
                              `approve-${request.id}` ? (
                                <Loader2
                                  size={16}
                                  className="admin-leave-spinner"
                                />
                              ) : (
                                <Check size={17} />
                              )}

                              Approve
                            </button>

                            <button
                              type="button"
                              className="admin-leave-reject-btn"
                              onClick={() =>
                                handleReject(request.id)
                              }
                              disabled={
                                actionLoading ===
                                `reject-${request.id}`
                              }
                              title="Reject Leave"
                            >
                              {actionLoading ===
                              `reject-${request.id}` ? (
                                <Loader2
                                  size={16}
                                  className="admin-leave-spinner"
                                />
                              ) : (
                                <X size={17} />
                              )}

                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="admin-leave-no-action">
                            -
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminLeaves;