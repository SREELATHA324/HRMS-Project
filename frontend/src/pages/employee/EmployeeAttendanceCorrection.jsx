import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  FilePenLine,
  Send,
  Loader2,
  CircleAlert,
  CircleCheck,
} from "lucide-react";

import EmployeeSidebar from "../../components/employee/EmployeeSidebar";
import EmployeeHeader from "../../components/employee/EmployeeHeader";
import { api } from "../../services/api";

function EmployeeAttendanceCorrection({ onNavigate, onLogout }) {
  const [formData, setFormData] = useState({
    date: "",
    requested_check_in: "",
    requested_check_out: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleNavigation = (page) => {
    onNavigate?.(page);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.date) {
      setError("Please select the attendance date.");
      return;
    }

    if (
      !formData.requested_check_in &&
      !formData.requested_check_out
    ) {
      setError(
        "Please provide at least a corrected check-in or check-out time."
      );
      return;
    }

    if (!formData.reason.trim()) {
      setError("Please enter the reason for the correction.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        date: formData.date,
        requested_check_in:
          formData.requested_check_in || null,
        requested_check_out:
          formData.requested_check_out || null,
        reason: formData.reason.trim(),
      };

      const response = await api.post(
        "/attendance/corrections",
        payload
      );

      console.log("Correction request response:", response);

      setSuccess(
        response?.message ||
          "Correction request submitted successfully."
      );

      setFormData({
        date: "",
        requested_check_in: "",
        requested_check_out: "",
        reason: "",
      });
    } catch (err) {
      console.error("Correction request error:", err);

      setError(
        err.message ||
          "Failed to submit correction request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <EmployeeSidebar
        activePage="attendance"
        onNavigate={handleNavigation}
        onLogout={onLogout}
      />

      <main className="admin-main">
        <EmployeeHeader onNavigate={handleNavigation} />

        <div className="admin-dashboard-content employee-attendance-correction-page">
          {/* Page Header */}
          <div className="attendance-correction-page-header">
            <button
              type="button"
              className="attendance-back-button"
              onClick={() =>
                handleNavigation("employeeAttendance")
              }
            >
              <ArrowLeft size={17} />
              Back to Attendance
            </button>

            <h1>Request Attendance Correction</h1>

            <p>
              Submit a correction request if your attendance
              check-in or check-out time is incorrect.
            </p>
          </div>

          {/* Centered Form */}
          <section className="attendance-correction-card">
            <div className="attendance-correction-card-header">
              <div className="attendance-correction-icon">
                <FilePenLine size={22} />
              </div>

              <div>
                <h2>Correction Details</h2>

                <p>
                  Enter the correct attendance details and explain
                  why the correction is required.
                </p>
              </div>
            </div>

            {error && (
              <div className="attendance-form-error">
                <CircleAlert size={18} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="attendance-form-success">
                <CircleCheck size={18} />
                <span>{success}</span>
              </div>
            )}

            <form
              className="attendance-correction-form"
              onSubmit={handleSubmit}
            >
              <div className="attendance-form-grid">
                {/* Attendance Date */}
                <div className="attendance-form-group">
                  <label htmlFor="date">
                    Attendance Date <span>*</span>
                  </label>

                  <div className="attendance-input-wrapper">
                    <CalendarDays size={18} />

                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      max={
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
                      required
                    />
                  </div>
                </div>

                {/* Correct Check In */}
                <div className="attendance-form-group">
                  <label htmlFor="requested_check_in">
                    Correct Check-In Time
                  </label>

                  <div className="attendance-input-wrapper">
                    <Clock3 size={18} />

                    <input
                      id="requested_check_in"
                      name="requested_check_in"
                      type="time"
                      value={formData.requested_check_in}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Correct Check Out */}
                <div className="attendance-form-group">
                  <label htmlFor="requested_check_out">
                    Correct Check-Out Time
                  </label>

                  <div className="attendance-input-wrapper">
                    <Clock3 size={18} />

                    <input
                      id="requested_check_out"
                      name="requested_check_out"
                      type="time"
                      value={formData.requested_check_out}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Reason */}
                <div className="attendance-form-group attendance-form-full">
                  <label htmlFor="reason">
                    Reason for Correction <span>*</span>
                  </label>

                  <textarea
                    id="reason"
                    name="reason"
                    rows="5"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Example: I forgot to check out because of a network issue."
                    required
                  />
                </div>
              </div>

              <div className="attendance-correction-actions">
                <button
                  type="button"
                  className="attendance-cancel-button"
                  onClick={() =>
                    handleNavigation("employeeAttendance")
                  }
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="attendance-submit-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="attendance-spinner"
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
        </div>
      </main>
    </div>
  );
}

export default EmployeeAttendanceCorrection;