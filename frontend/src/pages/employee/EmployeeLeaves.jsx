import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Plus,
  X,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Ban,
} from "lucide-react";


import { api } from "../../services/api";

function EmployeeLeaves({ onNavigate, onLogout }) {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const [showApplyForm, setShowApplyForm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    leave_type_id: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const handleNavigation = (page) => {
    onNavigate?.(page);
  };

  // =========================================================
  // CALCULATE TOTAL DAYS
  // =========================================================

  const totalDays = useMemo(() => {
    if (!formData.start_date || !formData.end_date) {
      return 0;
    }

    const startDate = new Date(
      `${formData.start_date}T00:00:00`
    );

    const endDate = new Date(
      `${formData.end_date}T00:00:00`
    );

    if (endDate < startDate) {
      return 0;
    }

    const difference =
      endDate.getTime() - startDate.getTime();

    return (
      Math.floor(
        difference / (1000 * 60 * 60 * 24)
      ) + 1
    );
  }, [formData.start_date, formData.end_date]);

  // =========================================================
  // LOAD LEAVE DATA
  // =========================================================

  const loadLeaveData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        typesResponse,
        balanceResponse,
        requestsResponse,
      ] = await Promise.all([
        api.get("/leave/types"),
        api.get("/leave/balance"),
        api.get("/leave/requests"),
      ]);

      // -------------------------------------------------------
      // LEAVE TYPES
      // GET /api/leave/types
      // Expected:
      // { success: true, data: [...] }
      // -------------------------------------------------------

      const typesData = Array.isArray(typesResponse)
        ? typesResponse
        : Array.isArray(typesResponse?.data)
        ? typesResponse.data
        : [];

      setLeaveTypes(typesData);

      // -------------------------------------------------------
      // LEAVE BALANCE
      //
      // Backend returns:
      // {
      //   success: true,
      //   data: {
      //     leaveTypes: [...],
      //     totalAvailable: 0,
      //     totalUsed: 0,
      //     year: 2026
      //   }
      // }
      // -------------------------------------------------------

      const balanceData = balanceResponse?.data;

      const balanceRows = Array.isArray(balanceResponse)
        ? balanceResponse
        : Array.isArray(balanceData)
        ? balanceData
        : Array.isArray(balanceData?.leaveTypes)
        ? balanceData.leaveTypes
        : [];

      setLeaveBalance(balanceRows);

      // -------------------------------------------------------
      // LEAVE REQUESTS
      // -------------------------------------------------------

      const requestsData = Array.isArray(requestsResponse)
        ? requestsResponse
        : Array.isArray(requestsResponse?.data)
        ? requestsResponse.data
        : [];

      setLeaveRequests(requestsData);
    } catch (err) {
      console.error("Failed to load leave data:", err);

      setLeaveTypes([]);
      setLeaveBalance([]);
      setLeaveRequests([]);

      setError(
        err.message ||
          "Failed to load leave information. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaveData();
  }, []);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setFormData({
      leave_type_id: "",
      start_date: "",
      end_date: "",
      reason: "",
    });

    setShowApplyForm(false);
    setError("");
  };

  // =========================================================
  // APPLY LEAVE
  // =========================================================

  const handleApplyLeave = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.leave_type_id) {
      setError("Please select a leave type.");
      return;
    }

    if (!formData.start_date) {
      setError("Please select a start date.");
      return;
    }

    if (!formData.end_date) {
      setError("Please select an end date.");
      return;
    }

    if (
      new Date(formData.end_date) <
      new Date(formData.start_date)
    ) {
      setError(
        "End date cannot be earlier than start date."
      );
      return;
    }

    if (totalDays <= 0) {
      setError("Please select valid leave dates.");
      return;
    }

    if (!formData.reason.trim()) {
      setError("Please enter a reason for your leave.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        leave_type_id: Number(formData.leave_type_id),
        start_date: formData.start_date,
        end_date: formData.end_date,
        total_days: totalDays,
        reason: formData.reason.trim(),
      };

      const response = await api.post(
        "/leave/apply",
        payload
      );

      if (response?.success === false) {
        throw new Error(
          response?.message ||
            "Failed to submit leave request."
        );
      }

      setSuccess(
        response?.message ||
          "Leave request submitted successfully."
      );

      setFormData({
        leave_type_id: "",
        start_date: "",
        end_date: "",
        reason: "",
      });

      setShowApplyForm(false);

      await loadLeaveData();
    } catch (err) {
      console.error("Leave application error:", err);

      setError(
        err.message ||
          "Failed to submit leave request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // CANCEL LEAVE
  // =========================================================

  const handleCancelLeave = async (leaveId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this leave request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(leaveId);
      setError("");
      setSuccess("");

      const response = await api.put(
        `/leave/requests/${leaveId}/cancel`,
        {
          remarks: "Cancelled by employee",
        }
      );

      if (response?.success === false) {
        throw new Error(
          response?.message ||
            "Failed to cancel leave request."
        );
      }

      setSuccess(
        response?.message ||
          "Leave request cancelled successfully."
      );

      await loadLeaveData();
    } catch (err) {
      console.error("Cancel leave error:", err);

      setError(
        err.message ||
          "Failed to cancel leave request."
      );
    } finally {
      setCancellingId(null);
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
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
    const normalizedStatus = String(
      status || ""
    ).toLowerCase();

    if (normalizedStatus === "approved") {
      return "leave-status-approved";
    }

    if (normalizedStatus === "rejected") {
      return "leave-status-rejected";
    }

    if (normalizedStatus === "cancelled") {
      return "leave-status-cancelled";
    }

    return "leave-status-pending";
  };

  return (
    <div className="admin-layout">
      
        <div className="admin-dashboard-content employee-leaves-page">
          {/* ================================================
              PAGE HEADER
          ================================================= */}

          <div className="employee-leaves-header">
            <div>
              <h1>Leave Management</h1>
              <p>
                View company leave types, your leave balance,
                and manage your leave requests.
              </p>
            </div>

            <button
              type="button"
              className="employee-apply-leave-button"
              onClick={() => {
                setShowApplyForm(
                  (previous) => !previous
                );

                setError("");
                setSuccess("");
              }}
            >
              {showApplyForm ? (
                <>
                  <X size={18} />
                  Close Form
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Apply Leave
                </>
              )}
            </button>
          </div>

          {/* SUCCESS MESSAGE */}

          {success && (
            <div className="employee-leave-message employee-leave-success">
              <CheckCircle2 size={19} />
              <span>{success}</span>
            </div>
          )}

          {/* ERROR MESSAGE */}

          {error && (
            <div className="employee-leave-message employee-leave-error">
              <AlertCircle size={19} />
              <span>{error}</span>
            </div>
          )}

          {/* ================================================
              LEAVE TYPES & ALLOCATION
          ================================================= */}

          <section className="employee-leave-section">
            <div className="employee-leave-section-header">
              <div>
                <h2>Leave Types & Allocation</h2>
                <p>
                  Company leave types and maximum allocation
                  per year.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="employee-leave-loading">
                <Loader2
                  size={24}
                  className="employee-leave-spinner"
                />
                Loading leave types...
              </div>
            ) : leaveTypes.length === 0 ? (
              <div className="employee-leave-empty">
                No leave types are currently available.
              </div>
            ) : (
              <div className="employee-leave-table-wrapper">
                <table className="employee-leave-table">
                  <thead>
                    <tr>
                      <th>Leave Type</th>
                      <th>Code</th>
                      <th>Description</th>
                      <th>Days Per Year</th>
                      <th>Paid</th>
                      <th>Carry Forward</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leaveTypes.map((type) => (
                      <tr key={type.id}>
                        <td>
                          <div className="employee-leave-type">
                            {type.color && (
                              <span
                                className="employee-leave-color-dot"
                                style={{
                                  backgroundColor: type.color,
                                }}
                              />
                            )}

                            <span>
                              {type.name || "-"}
                            </span>
                          </div>
                        </td>

                        <td>
                          {type.code || "-"}
                        </td>

                        <td className="employee-leave-reason">
                          {type.description || "-"}
                        </td>

                        <td className="employee-leave-available">
                          {type.max_days_per_year ?? 0}
                        </td>

                        <td>
                          {type.is_paid ? "Yes" : "No"}
                        </td>

                        <td>
                          {type.is_carry_forward
                            ? "Yes"
                            : "No"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ================================================
              LEAVE BALANCE
          ================================================= */}

          <section className="employee-leave-section">
            <div className="employee-leave-section-header">
              <div>
                <h2>My Leave Balance</h2>
                <p>
                  Your current leave usage and available
                  balance.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="employee-leave-loading">
                <Loader2
                  size={24}
                  className="employee-leave-spinner"
                />
                Loading leave balance...
              </div>
            ) : leaveBalance.length === 0 ? (
              <div className="employee-leave-empty">
                No leave balance information available.
              </div>
            ) : (
              <div className="employee-leave-table-wrapper">
                <table className="employee-leave-table">
                  <thead>
                    <tr>
                      <th>Leave Type</th>
                      <th>Opening</th>
                      <th>Earned</th>
                      <th>Used</th>
                      <th>Available</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leaveBalance.map((balance) => (
                      <tr
                        key={
                          balance.leave_type_id ||
                          balance.leave_type_name
                        }
                      >
                        <td>
                          <div className="employee-leave-type">
                            {balance.color && (
                              <span
                                className="employee-leave-color-dot"
                                style={{
                                  backgroundColor:
                                    balance.color,
                                }}
                              />
                            )}

                            <span>
                              {balance.leave_type_name || "-"}
                            </span>

                            {balance.leave_type_code && (
                              <small>
                                {balance.leave_type_code}
                              </small>
                            )}
                          </div>
                        </td>

                        <td>
                          {balance.opening_balance ?? 0}
                        </td>

                        <td>
                          {balance.earned_balance ?? 0}
                        </td>

                        <td>
                          {balance.used_balance ?? 0}
                        </td>

                        <td className="employee-leave-available">
                          {balance.closing_balance ?? 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ================================================
              APPLY LEAVE FORM
          ================================================= */}

          {showApplyForm && (
            <section className="employee-apply-leave-card">
              <div className="employee-apply-leave-card-header">
                <div className="employee-leave-form-icon">
                  <CalendarDays size={22} />
                </div>

                <div>
                  <h2>Apply for Leave</h2>
                  <p>
                    Fill in the details below to submit your
                    leave request.
                  </p>
                </div>
              </div>

              <form
                className="employee-apply-leave-form"
                onSubmit={handleApplyLeave}
              >
                <div className="employee-leave-form-grid">
                  <div className="employee-leave-form-group">
                    <label htmlFor="leave_type_id">
                      Leave Type <span>*</span>
                    </label>

                    <select
                      id="leave_type_id"
                      name="leave_type_id"
                      value={formData.leave_type_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select Leave Type
                      </option>

                      {leaveTypes.map((type) => (
                        <option
                          key={type.id}
                          value={type.id}
                        >
                          {type.name}
                          {type.code
                            ? ` (${type.code})`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="employee-leave-form-group">
                    <label>Total Days</label>

                    <input
                      type="number"
                      value={totalDays || ""}
                      placeholder="Auto calculated"
                      readOnly
                    />
                  </div>

                  <div className="employee-leave-form-group">
                    <label htmlFor="start_date">
                      Start Date <span>*</span>
                    </label>

                    <input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="employee-leave-form-group">
                    <label htmlFor="end_date">
                      End Date <span>*</span>
                    </label>

                    <input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={handleChange}
                      min={
                        formData.start_date || undefined
                      }
                      required
                    />
                  </div>

                  <div className="employee-leave-form-group employee-leave-form-full">
                    <label htmlFor="reason">
                      Reason <span>*</span>
                    </label>

                    <textarea
                      id="reason"
                      name="reason"
                      rows="4"
                      value={formData.reason}
                      onChange={handleChange}
                      placeholder="Enter the reason for your leave"
                      required
                    />
                  </div>
                </div>

                <div className="employee-leave-form-actions">
                  <button
                    type="button"
                    className="employee-leave-cancel-button"
                    onClick={resetForm}
                    disabled={submitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="employee-leave-submit-button"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2
                          size={18}
                          className="employee-leave-spinner"
                        />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={17} />
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* ================================================
              MY LEAVE REQUESTS
          ================================================= */}

          <section className="employee-leave-section">
            <div className="employee-leave-section-header">
              <div>
                <h2>My Leave Requests</h2>
                <p>
                  View the status and details of your leave
                  applications.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="employee-leave-loading">
                <Loader2
                  size={24}
                  className="employee-leave-spinner"
                />
                Loading leave requests...
              </div>
            ) : leaveRequests.length === 0 ? (
              <div className="employee-leave-empty">
                You have not submitted any leave requests yet.
              </div>
            ) : (
              <div className="employee-leave-table-wrapper">
                <table className="employee-leave-table employee-leave-requests-table">
                  <thead>
                    <tr>
                      <th>Leave ID</th>
                      <th>Leave Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Days</th>
                      <th>Reason</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leaveRequests.map((request) => (
                      <tr key={request.id}>
                        <td>#{request.id}</td>

                        <td>
                          <div className="employee-leave-type">
                            {request.leave_type_color && (
                              <span
                                className="employee-leave-color-dot"
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

                        <td className="employee-leave-reason">
                          {request.reason || "-"}
                        </td>

                        <td>
                          {formatDate(request.applied_date)}
                        </td>

                        <td>
                          <span
                            className={`employee-leave-status ${getStatusClass(
                              request.status
                            )}`}
                          >
                            {request.status || "Pending"}
                          </span>
                        </td>

                        <td>
                          {String(
                            request.status || ""
                          ).toLowerCase() === "pending" ? (
                            <button
                              type="button"
                              className="employee-leave-cancel-request-button"
                              onClick={() =>
                                handleCancelLeave(request.id)
                              }
                              disabled={
                                cancellingId === request.id
                              }
                            >
                              {cancellingId === request.id ? (
                                <>
                                  <Loader2
                                    size={15}
                                    className="employee-leave-spinner"
                                  />
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <Ban size={15} />
                                  Cancel
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="employee-leave-no-action">
                              -
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
    </div>
  );
}

export default EmployeeLeaves;